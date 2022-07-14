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

async function fetchRecipesFromDb() {
  const recipes = [];

  const recipesDatabase = nano.use(RECIPES_DB_NAME);

  log.info(`Fetching CouchDB collection: ${RECIPES_DB_NAME} ...`);
  const recipeDocuments = await recipesDatabase.list({ include_docs: true });

  recipeDocuments.rows.forEach(({ doc }) => recipes.push(filterRecipeIndexedFields(doc)));

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
      if (tag.toLowerCase().startsWith(specific.toLowerCase())) {
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

function filterRecipeIndexedFields(recipe) {
  const { _id, jsonld, structured } = recipe;

  const {
    name,
    image,
    description,
    recipeCategory,
    datePublished,
    recipeIngredient: ingredients,
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

  const noCookTags = cookMinutes ? [] : [WITHOUT_COOKING_TAG];

  const categories = Array.isArray(recipeCategory) ? recipeCategory : [recipeCategory];
  const mergedTags = [
    ...tags.filter((tag) => tag !== NO_COOK_TAG),
    ...categories,
    ...noCookTags,
  ].filter((tag) => tag);

  const cuisines = extractSpecificTags(mergedTags, CUISINES);
  const diets = extractSpecificTags(mergedTags, DIETS);
  const mealTypes = extractSpecificTags(mergedTags, MEAL_TYPES);

  const timeTags = buildTimeTags(totalMinutes);

  const specificTags = [...cuisines, ...diets, ...mealTypes, ...timeTags];
  const filteredTags = mergedTags.filter(
    (tag) => !specificTags.includes(tag) && !tag.startsWith('<'),
  );

  const filteredRecipe = {
    id: _id,
    name,
    image,
    description,
    stepsCount,
    rating: rating.value,
    reviewsCount: rating.reviews,
    tags: filteredTags,
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

async function injectSearchIngredientsToRecipes(ingredients, recipes) {
  const recipesMap = {};
  recipes.forEach((recipe) => (recipesMap[recipe.id] = recipe));

  const { HOST, PORT, SECURE } = SOLR;

  const client = solr.createClient({
    host: HOST,
    port: PORT,
    core: SOLR.CORES.RECIPES,
    secure: SECURE,
  });

  log.info(
    `Fetching all recipes to match them with search ingredients. Processing ${ingredients.length} recipe search queries...`,
  );

  for (const ingredient of ingredients) {
    const label = ingredient.label['@value'];
    const query = client.query().q(`ingredients: "${label}"`).qop('AND').rows(500000);
    const searchResponse = await client.search(query);
    const { docs } = searchResponse.response;

    docs.forEach((doc) => {
      if (!recipesMap[doc.id]._ingredientsFacet) {
        recipesMap[doc.id]._ingredientsFacet = [];
      }

      recipesMap[doc.id]._ingredientsFacet.push(label);
    });
  }

  return Object.values(recipesMap);
}

async function main() {
  const recipes = await fetchRecipesFromDb();
  const searchIngredients = loadJsonFromFile(FOOD_COM_SEARCH_INGREDIENTS_PATH);

  log.info(
    `Extracted ${recipes.length} recipes from CouchDB,
    ${searchIngredients.length} search ingredients from ${FOOD_COM_SEARCH_INGREDIENTS_PATH}`,
  );

  const { CORES: { RECIPES } } = SOLR;

  await pushDocumentsToSolr(recipes, RECIPES);

  const extendedRecipes = await injectSearchIngredientsToRecipes(
    searchIngredients,
    recipes,
  );
  await pushDocumentsToSolr(extendedRecipes, RECIPES);
}

(async () => {
  await main();
})();
