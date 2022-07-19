const fs = require('fs');
const Apify = require('apify');
const log4js = require('log4js');
const log = log4js.getLogger('Wikidata ingredients linker');
log.level = 'debug';

const {
  WIKIDATA_INGREDIENTS_QUERY,
  WIKIDATA_SPARQL_QUERY_PREFIX,
  INGREDIENTS_GROUP_SIZE,
  INGREDIENT_CONTEXT,
} = require('./constants');
const { FILE_ENCODING } = require('../../constants');
const { buildIngredientsFetchRequests } = require('../sparql-request-builder');

function readFileFromCurrentDir(filePath) {
  return fs.readFileSync(`${__dirname}/${filePath}`, FILE_ENCODING);
}

async function fetchIngredients(fetchRequests) {
  const fetchUrls = fetchRequests.map((req) => ({ url: req }));

  const proxyConfiguration = await Apify.createProxyConfiguration();
  const requestList = await Apify.openRequestList(null, fetchUrls);

  let iriMap = {};

  const crawler = new Apify.BasicCrawler({
    requestList,
    maxConcurrency: 10,
    handleRequestFunction: async ({ request, session }) => {
      const { body } = await Apify.utils.requestAsBrowser({
        url: request.url,
        proxyUrl: proxyConfiguration.newUrl(session.id),
      });

      const json = JSON.parse(body);
      const { results: { bindings } } = json;

      if (bindings.length === 0) {
        throw new Error(`Fetched 0 bindings: ${JSON.stringify(json)}`);
      }

      log.info(`Fetched ${bindings.length} bindings`);

      addBindingsToIriMap(bindings, iriMap);
    },
  });

  log.info('Fetching ingredients from Wikidata sparql endpoint...');
  await crawler.run();
  log.info(`Fetched ${Object.keys(iriMap).length} entities`);

  return buildJsonldEntities(iriMap);
}

function addBindingsToIriMap(bindings, iriMap) {
  bindings.forEach(({ subject, predicate, object }) => {
    if (!iriMap[subject.value]) {
      iriMap[subject.value] = {};
    }

    if (iriMap[subject.value][predicate.value]) {
      // Found more values for the same property

      const mergedArray = Array.isArray(iriMap[subject.value][predicate.value])
        ? [...iriMap[subject.value][predicate.value], object]
        : [iriMap[subject.value][predicate.value], object];

      const uniqueValues = [];
      const filteredArray = mergedArray.filter((item) => {
        if (!uniqueValues.includes(item.value)) {
          uniqueValues.push(item.value);
          return true;
        }

        return false;
      });

      iriMap[subject.value][predicate.value] =
        filteredArray.length > 1 ? filteredArray : filteredArray[0];
    } else {
      iriMap[subject.value][predicate.value] = object;
    }
  });
}

function buildEntityJsonld(context, entityContent) {
  const filteredContext = {};
  const prettifiedEntity = {};

  Object.entries(context).forEach(([propertyName, propertyValue]) => {
    const propertyIri = propertyValue['@id'];

    const entityValues = Array.isArray(entityContent[propertyIri])
      ? entityContent[propertyIri] || []
      : [entityContent[propertyIri]];

    const filteredValues = entityValues.filter((value) => value);

    if (filteredValues.length > 0) {
      // For each entity, include only relevant context fields
      filteredContext[propertyName] = propertyValue;

      // Arrays of length === 1 will be normalized to plain objects
      prettifiedEntity[propertyName] = [];

      filteredValues.forEach((entityValue) => {
        if (entityValue.type === 'uri') {
          prettifiedEntity[propertyName].push(entityValue.value);
        } else if (entityValue.type === 'literal') {
          prettifiedEntity[propertyName].push({
            '@value': entityValue.value,
            '@language': entityValue['xml:lang'],
          });
        }
      });

      // Normalize arrays of length === 1 to plain objects
      prettifiedEntity[propertyName] =
        prettifiedEntity[propertyName].length > 1
          ? prettifiedEntity[propertyName]
          : prettifiedEntity[propertyName][0];
    }
  });

  return {
    '@context': filteredContext,
    ...prettifiedEntity,
  };
}

function buildJsonldEntities(iriMap) {
  const entities = [];

  log.info('Building jsonld entities...');

  Object.entries(iriMap).forEach(([entityIri, entityContent]) => {
    const valuesWithContext = buildEntityJsonld(INGREDIENT_CONTEXT, entityContent);

    const jsonldEntity = {
      '@id': entityIri,
      ...valuesWithContext,
    };

    entities.push(jsonldEntity);
  });

  log.info(`Built ${entities.length} jsonld entities`);

  return entities;
}

async function fetchWikidataIngredients(ingredientLinks) {
  const sparqlQuery = readFileFromCurrentDir(WIKIDATA_INGREDIENTS_QUERY);

  const fetchRequests = buildIngredientsFetchRequests(
    ingredientLinks,
    sparqlQuery,
    WIKIDATA_SPARQL_QUERY_PREFIX,
    INGREDIENTS_GROUP_SIZE,
  );

  const ingredients = await fetchIngredients(fetchRequests);

  return ingredients;
}

module.exports = {
  fetchWikidataIngredients,
};
