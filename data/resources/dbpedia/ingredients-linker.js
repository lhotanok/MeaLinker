const fs = require('fs');
const Apify = require('apify');
const log4js = require('log4js');
const log = log4js.getLogger('DBpedia ingredients linker');
log.level = 'debug';

const {
  DBPEDIA_INGREDIENTS_QUERY,
  DBPEDIA_SPARQL_QUERY_PREFIX,
  INGREDIENTS_GROUP_SIZE,
  CONTEXT_KEY_DATATYPE_REGEX,
  DBPEDIA_INGREDIENT_TYPE,
} = require('./constants');
const { FILE_ENCODING } = require('../../constants');
const { buildIngredientsFetchRequests } = require('../sparql-request-builder');

function readFileFromCurrentDir(filePath) {
  return fs.readFileSync(`${__dirname}/${filePath}`, FILE_ENCODING);
}

async function fetchIngredients(fetchRequests) {
  const ingredients = [];

  const fetchUrls = fetchRequests.map((req) => ({ url: req }));

  const proxyConfiguration = await Apify.createProxyConfiguration();
  const requestList = await Apify.openRequestList(null, fetchUrls);

  const crawler = new Apify.BasicCrawler({
    requestList,
    maxConcurrency: 10,
    handleRequestFunction: async ({ request, session }) => {
      const { body } = await Apify.utils.requestAsBrowser({
        url: request.url,
        proxyUrl: proxyConfiguration.newUrl(session.id),
      });

      const jsonld = JSON.parse(body);
      const jsonldIngredients = jsonld['@graph'];
      log.info(`Fetched ${jsonldIngredients.length} ingredients`);

      if (jsonldIngredients) {
        const commonContext = jsonld['@context'];

        const mergedIngredients = jsonldIngredients.map((ingredient) =>
          mergeIngredientWithContext(ingredient, commonContext),
        );

        ingredients.push(...mergedIngredients);
      }
    },
  });

  log.info('Fetching ingredients from DBpedia sparql endpoint...');
  await crawler.run();
  log.info(`Fetched ${ingredients.length} ingredients`);

  return ingredients;
}

function renameContextKeys(object) {
  const normalizedObject = {};

  Object.keys(object).forEach((key) => {
    let normalizedKey = key.replace(CONTEXT_KEY_DATATYPE_REGEX, '');
    if (!normalizedKey) {
      normalizedKey = key;
    }

    normalizedObject[normalizedKey] = object[key];
  });

  return normalizedObject;
}

function mergeIngredientWithContext(ingredient, commonContext) {
  const currentContext = {};

  Object.keys(commonContext).forEach((key) => {
    if (ingredient[key]) {
      currentContext[key] = commonContext[key];
    }
  });

  const normalizedContext = renameContextKeys(currentContext);
  const normalizedIngredient = renameContextKeys(ingredient);

  return {
    '@context': normalizedContext,
    '@type': DBPEDIA_INGREDIENT_TYPE,
    ...normalizedIngredient,
  };
}

async function fetchDBpediaIngredients(ingredientLinks) {
  const sparqlQuery = readFileFromCurrentDir(DBPEDIA_INGREDIENTS_QUERY);

  const fetchRequests = buildIngredientsFetchRequests(
    ingredientLinks,
    sparqlQuery,
    DBPEDIA_SPARQL_QUERY_PREFIX,
    INGREDIENTS_GROUP_SIZE,
  );

  const ingredients = await fetchIngredients(fetchRequests);

  return ingredients;
}

module.exports = {
  fetchDBpediaIngredients,
};
