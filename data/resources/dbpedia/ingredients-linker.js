const fs = require('fs');
const Apify = require('apify');
const log4js = require('log4js');
const log = log4js.getLogger('RDF dataset linker');
log.level = 'debug';

const {
  INGREDIENTS_SECTION_REGEX,
  DBPEDIA_INGREDIENTS_QUERY,
  DBPEDIA_SPARQL_QUERY_PREFIX,
  DBPEDIA_JSONLD_QUERY_PARAM,
  INGREDIENTS_GROUP_SIZE,
  CONTEXT_KEY_DATATYPE_REGEX,
  DBPEDIA_INGREDIENT_TYPE,
} = require('./constants');
const { FILE_ENCODING } = require('../../constants');

function readFileFromCurrentDir(filePath) {
  return fs.readFileSync(`${__dirname}/${filePath}`, FILE_ENCODING);
}

function createIngredientGroups(resources) {
  const groups = [];

  let groupNumber = 0;

  while (groupNumber * INGREDIENTS_GROUP_SIZE < resources.length) {
    const startIndex = groupNumber * INGREDIENTS_GROUP_SIZE;
    const endIndex = startIndex + INGREDIENTS_GROUP_SIZE;

    const group = resources.slice(startIndex, endIndex);
    groups.push(group);

    groupNumber++;
  }

  return groups;
}

function buildDbpediaIngredientsFetchRequests(resources) {
  const fetchRequests = [];

  const ingredientGroups = createIngredientGroups(resources);
  log.info(`Created ${ingredientGroups.length} ingredient groups`);

  const sparqlQuery = readFileFromCurrentDir(DBPEDIA_INGREDIENTS_QUERY);

  for (const group of ingredientGroups) {
    const joinedIngredients = group.join(' ');

    const injectedIngredientsQuery = sparqlQuery.replace(
      INGREDIENTS_SECTION_REGEX,
      joinedIngredients,
    );
    const encodedQuery = encodeURIComponent(injectedIngredientsQuery);
    const fetchRequest = `${DBPEDIA_SPARQL_QUERY_PREFIX}${encodedQuery}&${DBPEDIA_JSONLD_QUERY_PARAM}`;

    fetchRequests.push(fetchRequest);
  }

  log.info(`Created ${fetchRequests.length} fetch requests`);
  return fetchRequests;
}

async function fetchDbpediaIngredients(fetchRequests) {
  const ingredients = [];

  log.info('Fetching ingredients from DBpedia sparql endpoint...');

  const reqFnc = async (request) => {
    const { body } = await Apify.utils.requestAsBrowser({ url: request });
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
  };

  await Promise.all(fetchRequests.map((request) => reqFnc(request))).then(() =>
    log.info(`Fetched ${ingredients.length} DBpedia ingredients in total`),
  );

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

async function fetchDBpediaIngredients(ingredientIris) {
  const fetchRequests = buildDbpediaIngredientsFetchRequests(ingredientIris);
  const ingredients = await fetchDbpediaIngredients(fetchRequests);

  return ingredients;
}

module.exports = {
  fetchDBpediaIngredients,
};
