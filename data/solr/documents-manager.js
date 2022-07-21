const fs = require('fs');
const log4js = require('log4js');
const solr = require('solr-client');
const { FILE_ENCODING } = require('../constants');
const {
  COUCHDB: { RECIPES_DB_NAME, USERNAME, PASSWORD, PORT },
  SOLR,
} = require('./config');
const {
  FOOD_COM_SEARCH_INGREDIENTS_PATH,
  CUISINES,
  DIETS,
  MEAL_TYPES,
  NO_COOK_TAG,
  WITHOUT_COOKING_TAG,
  SAFE_DB_ROWS_LIMIT,
  REPLACE_TAG_BACK_PART,
  REPLACE_TAG_FRONT_PART,
} = require('./constants');
const nano = require('nano')(`http://${USERNAME}:${PASSWORD}@localhost:${PORT}`);

const log = log4js.getLogger('Solr documents manager');
log.level = 'debug';

function readFileFromCurrentDir(filePath) {
  return fs.readFileSync(`${__dirname}/${filePath}`, FILE_ENCODING);
}

function loadJsonFromFile(filePath) {
  const fileContent = readFileFromCurrentDir(filePath);
  return JSON.parse(fileContent);
}

async function fetchRecipesFromDb(searchIngredients) {
  const recipes = [];

  const recipesDatabase = nano.use(RECIPES_DB_NAME);

  log.info(`Fetching CouchDB collection: ${RECIPES_DB_NAME} ...`);
  let offset = 0;
  let totalRows = -1;
  while (totalRows === -1 || offset < totalRows) {
    const recipeDocuments = await recipesDatabase.list({
      include_docs: true,
      skip: offset,
      limit: SAFE_DB_ROWS_LIMIT,
    });
    totalRows = recipeDocuments.total_rows;

    recipeDocuments.rows.forEach(({ doc }) =>
      recipes.push(filterRecipeIndexedFields(doc, searchIngredients)),
    );
    offset += SAFE_DB_ROWS_LIMIT;
    log.info(`Current recipes length: ${recipes.length}, total rows: ${totalRows}`);
  }

  return recipes;
}

function getDurationInMinutes(duration) {
  if (!duration) return null;

  const { minutes, hours, days, weeks } = duration;

  let minutesDuration = minutes || 0;

  if (hours) {
    minutesDuration += hours * 60;
  }

  if (days) {
    minutesDuration += days * 24 * 60;
  }

  if (weeks) {
    minutesDuration += weeks * 7 * 24 * 60;
  }

  return minutesDuration;
}

function getParsedDate(datePublished) {
  const DATE_REGEX = /\d{4}-\d{2}-\d{2}/gi;
  const dateMatches = DATE_REGEX.exec(datePublished);

  return dateMatches ? dateMatches[0] : '';
}

function extractSpecificTags(tags, specificTags) {
  const specifics = specificTags.filter((specific) => {
    for (const tag of tags) {
      if (tag.toLowerCase().includes(specific.toLowerCase())) {
        return true;
      }
    }
    return false;
  });

  return specifics;
}

function buildTimeTags(totalMinutes) {
  const timeBounds = [
    { minutes: 15 },
    { minutes: 30 },
    { minutes: 45 },
    { minutes: 60 },
    { minutes: 90, text: '1.5 Hours' },
    { minutes: 120, text: '2 Hours' },
    { minutes: 180, text: '3 Hours' },
    { minutes: 240, text: '4 Hours' },
    { minutes: 360, text: '6 Hours' },
  ];

  const timeTags = timeBounds
    .filter(({ minutes }) => totalMinutes < minutes)
    .map(({ minutes, text }) => {
      return `< ${text ? text : `${minutes} Mins`}`;
    });

  return timeTags;
}

function mergeTags(tags, recipeCategory, cookMinutes) {
  const noCookTags = cookMinutes ? [] : [WITHOUT_COOKING_TAG];

  const categories = Array.isArray(recipeCategory) ? recipeCategory : [recipeCategory];
  const mergedTags = [
    ...tags.filter((tag) => tag !== NO_COOK_TAG),
    ...categories,
    ...noCookTags,
  ]
    .filter((tag) => tag)
    .map((tag) =>
      tag
        .replace(REPLACE_TAG_BACK_PART, '')
        .replace(REPLACE_TAG_FRONT_PART, '')
        .replace(/dairy-free/gi, 'Dairy Free')
        .replace(/gluten-free/gi, 'Gluten Free')
        .replace(/^dessert$/gi, 'Desserts')
        .replace(/^drinks$/gi, 'Beverages'),
    );

  return mergedTags;
}

function filterTags(mergedTags, specificTags) {
  const filteredTags = Array.from(
    new Set(mergedTags.filter((tag) => !specificTags.includes(tag.toLowerCase()))),
  );

  return filteredTags;
}

function filterRecipeIndexedFields(recipe, searchIngredients) {
  const { _id, jsonld, structured } = recipe;

  const {
    name,
    image,
    description,
    recipeCategory,
    datePublished,
    recipeIngredient: ingredients,
    recipeInstructions: steps,
  } = jsonld;
  const { tags, rating, stepsCount, time, nutritionInfo } = structured;
  const {
    calories,
    fat,
    saturatedFat,
    cholesterol,
    sodium,
    carbohydrate,
    fiber,
    sugar,
    protein,
  } = nutritionInfo;

  const totalMinutes = getDurationInMinutes(time.total);
  const cookMinutes = getDurationInMinutes(time.cooking);
  const timeTags = buildTimeTags(totalMinutes);

  const mergedTags = mergeTags(tags, recipeCategory, cookMinutes);

  const cuisines = extractSpecificTags(mergedTags, CUISINES);
  const diets = extractSpecificTags(mergedTags, DIETS);
  const mealTypes = extractSpecificTags(
    mergedTags.map((tag) => tag.replace(/drinks$/gi, 'Beverages')),
    MEAL_TYPES,
  );

  // Excluding specific tags from general tags is controversial.
  // It might make general tags more readable but users often try
  // general tags first for any search query.
  // Plus we need to support all clickable tags from recipe detail.

  const specificTags = [
    ...cuisines,
    ...diets,
    ...mealTypes,
    ...timeTags,
    ...searchIngredients,
  ].map((tag) => tag.toLowerCase());

  const filteredRecipe = {
    id: _id,
    name,
    image,
    description,
    stepsCount: stepsCount || steps.length,
    rating: rating.value,
    reviewsCount: rating.reviews,
    tags: Array.from(new Set(mergedTags)),
    cuisine: cuisines.length > 0 ? cuisines[0] : '',
    diets,
    time: timeTags,
    mealTypes,
    ingredients,
    totalMinutes,
    date: getParsedDate(datePublished),
    calories: calories.value,
    fat: fat.value,
    saturatedFat: saturatedFat.value,
    cholesterol: cholesterol.value,
    sodium: sodium.value,
    carbohydrate: carbohydrate.value,
    fiber: fiber.value,
    sugar: sugar.value,
    protein: protein.value,
    _tagsFacet: filterTags(mergedTags, specificTags),
  };

  return filteredRecipe;
}

async function pushDocumentsToSolr(documents, core) {
  const { HOST, PORT, SECURE } = SOLR;

  const client = solr.createClient({
    host: HOST,
    port: PORT,
    core,
    secure: SECURE,
  });

  log.info(`Deleting all documents...`);
  await client.deleteAll();
  log.info(`All documents deleted.`);

  const addResponse = await client.add(documents);
  log.info(`Add documents response: ${JSON.stringify(addResponse, null, 2)}`);

  const commitResponse = await client.commit();
  log.info(`Commit response: ${JSON.stringify(commitResponse, null, 2)}`);
}

async function injectSearchFacetsToRecipes(
  client,
  labels,
  recipes,
  searchField,
  facetField,
) {
  const recipesMap = {};
  recipes.forEach((recipe) => (recipesMap[recipe.id] = { ...recipe, [facetField]: [] }));

  log.info(
    `Fetching all recipes to match them with search facets.
    Processing ${labels.length} recipe search queries for search field ${searchField} and facetField ${facetField}...`,
  );

  for (const label of labels) {
    const query = client.query().q(`${searchField}: "${label}"`).qop('AND').rows(500000);
    const searchResponse = await client.search(query);
    const { docs } = searchResponse.response;

    await Promise.all(
      docs.map((doc) => {
        recipesMap[doc.id][facetField].push(label);
      }),
    );
  }

  return Object.values(recipesMap);
}

function getUniqueTagFacets(recipes) {
  const allTags = [];

  recipes.forEach((recipe) => {
    const { _tagsFacet } = recipe;
    allTags.push(..._tagsFacet);
  });

  const uniqueTags = Array.from(new Set(allTags));
  log.info(`Found ${uniqueTags.length} unique tags`);

  return uniqueTags;
}

async function main() {
  const searchIngredients = loadJsonFromFile(FOOD_COM_SEARCH_INGREDIENTS_PATH);
  const searchIngredientLabels = searchIngredients.map(
    (ingredient) => ingredient.label['@value'],
  );

  const recipes = await fetchRecipesFromDb(searchIngredientLabels);

  log.info(
    `Extracted ${recipes.length} recipes from CouchDB,
    ${searchIngredients.length} search ingredients from ${FOOD_COM_SEARCH_INGREDIENTS_PATH}`,
  );

  const { CORES: { RECIPES } } = SOLR;

  await pushDocumentsToSolr(recipes, RECIPES);

  const { HOST, PORT, SECURE } = SOLR;

  const client = solr.createClient({
    host: HOST,
    port: PORT,
    core: SOLR.CORES.RECIPES,
    secure: SECURE,
  });

  const recipesExtendedWithIngrs = await injectSearchFacetsToRecipes(
    client,
    searchIngredientLabels,
    recipes,
    'ingredients',
    '_ingredientsFacet',
  );

  const recipesExtendedWithTags = await injectSearchFacetsToRecipes(
    client,
    getUniqueTagFacets(recipes),
    recipesExtendedWithIngrs,
    'tags',
    '_tagsFacet',
  );

  await pushDocumentsToSolr(recipesExtendedWithTags, RECIPES);
}

(async () => {
  await main();
})();
