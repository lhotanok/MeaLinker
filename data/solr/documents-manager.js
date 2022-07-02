const fs = require('fs');
const log4js = require('log4js');
const solr = require('solr-client');
const {
  COUCHDB: { RECIPES_DB_NAME, INGREDIENTS_DB_NAME, USERNAME, PASSWORD, PORT },
  SOLR,
} = require('./config');
const {
  RECIPES_PATH,
  INGREDIENTS_PATH,
  FOOD_COM_DEFAULT_IMAGE_SRC,
} = require('./constants');
const nano = require('nano')(`http://${USERNAME}:${PASSWORD}@localhost:${PORT}`);

const log = log4js.getLogger('Solr documents manager');
log.level = 'debug';

function writeFileFromCurrentDir(filePath, content) {
  return fs.writeFileSync(`${__dirname}/${filePath}`, content);
}

async function fillWithDatabaseDocuments(recipes, ingredients) {
  const recipesDatabase = nano.use(RECIPES_DB_NAME);
  const ingredientsDatabase = nano.use(INGREDIENTS_DB_NAME);

  log.info(`Fetching CouchDB collection: ${RECIPES_DB_NAME} ...`);
  const recipeDocuments = await recipesDatabase.list({ include_docs: true });

  log.info(`Fetching CouchDB collection: ${INGREDIENTS_DB_NAME} ...`);
  const ingredientDocuments = await ingredientsDatabase.list({ include_docs: true });

  recipeDocuments.rows.forEach(({ doc }) => recipes.push(filterRecipeIndexedFields(doc)));
  ingredientDocuments.rows.forEach(({ doc }) =>
    ingredients.push(filterIngredientIndexedFields(doc)),
  );
}

function getFilteredIngredients(ingredients) {
  return ingredients.map(({ amount, text }) =>
    `${amount ? amount + ' ' : ''}${text}`.trim(),
  );
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

function filterRecipeIndexedFields(recipe) {
  const { _id, jsonld, structured } = recipe;

  const { name, image, description, recipeCategory, datePublished } = jsonld;
  const { tags, rating, stepsCount, ingredients, time, nutritionInfo } = structured;
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

  const filteredRecipe = {
    id: _id,
    name,
    image,
    description,
    recipeCategory,
    stepsCount,
    rating: rating.value,
    reviewsCount: rating.reviews,
    tags,
    ingredients: getFilteredIngredients(ingredients),
    cookMinutes: getDurationInMinutes(time.cooking),
    prepMinutes: getDurationInMinutes(time.preparation),
    totalMinutes: getDurationInMinutes(time.total),
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

function filterIngredientIndexedFields(ingredient) {
  const { _id, label, thumbnail } = ingredient;

  const filteredIngredient = {
    id: _id,
    label: label['@value'],
    thumbnail,
  };

  return filteredIngredient;
}

function removeRecipesWithoutImage(recipes) {
  log.info('Removing recipes without image...');

  const imageRecipes = [];
  const nonImageRecipes = [];

  recipes.forEach((recipe) => {
    if (recipe.image && recipe.image !== FOOD_COM_DEFAULT_IMAGE_SRC) {
      imageRecipes.push(recipe);
    } else {
      nonImageRecipes.push(recipe);
    }
  });

  log.info(
    `Found ${imageRecipes.length} recipes with images and ${nonImageRecipes.length} recipes without any image.`,
  );

  return imageRecipes; // .concat(nonImageRecipes);
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

async function buildScoredIngredientsBasedOnUsage(ingredients) {
  const scoredIngredients = [];

  const { HOST, PORT, SECURE } = SOLR;

  const client = solr.createClient({
    host: HOST,
    port: PORT,
    core: SOLR.CORES.RECIPES,
    secure: SECURE,
  });

  log.info(
    `Adding ingredient scores based on their usage. Processing ${ingredients.length} recipe search queries...`,
  );

  for (const ingredient of ingredients) {
    const query = client.query().q(`ingredients: "${ingredient.label}"`).qop('AND');
    const searchResponse = await client.search(query);
    const recipesFound = searchResponse.response.numFound;

    scoredIngredients.push({
      ...ingredient,
      recipesCount: recipesFound,
    });
  }

  return scoredIngredients;
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
    const query = client
      .query()
      .q(`ingredients: "${ingredient.label}"`)
      .qop('AND')
      .rows(500000);
    const searchResponse = await client.search(query);
    const { docs } = searchResponse.response;

    docs.forEach((doc) => {
      if (!recipesMap[doc.id]._ingredientsFacet) {
        recipesMap[doc.id]._ingredientsFacet = [];
      }

      recipesMap[doc.id]._ingredientsFacet.push(ingredient.label);
    });
  }

  return Object.values(recipesMap);
}

function filterIngredients(scoredIngredients) {
  log.info(
    `Performing the following filter operations:
     - removing ingredients that are not used in any recipe from the current collection
     - removing duplicate ingredients`,
  );

  const scoreMapping = {};
  scoredIngredients.forEach((ingredient) => {
    scoreMapping[ingredient.recipesCount] = scoreMapping[ingredient.recipesCount]
      ? [...scoreMapping[ingredient.recipesCount], ingredient]
      : [ingredient];
  });

  const filteredIngredients = scoredIngredients
    .filter((ingredient) => ingredient.recipesCount !== 0)
    .filter((ingredient) => {
      const sameScoreIngredients = scoreMapping[ingredient.recipesCount];

      for (const ingr of sameScoreIngredients) {
        const currentLabelRoot = ingredient.label.slice(0, ingredient.label.length - 1);
        const storedLabelRoot = ingr.label.slice(0, ingr.label.length - 1);
        if (
          currentLabelRoot.replace(/-/g, ' ').startsWith(storedLabelRoot) &&
          ingredient.label !== ingr.label
        ) {
          // There's another ingredient with the same score and shorter name, we'll include only that ingredient
          return false;
        }
      }

      return true;
    });

  log.info(`Filtered: ${filteredIngredients.length} ingredients`);
  return filteredIngredients;
}

async function main() {
  const recipes = [];
  const ingredients = [];

  await fillWithDatabaseDocuments(recipes, ingredients);

  log.info(
    `Extracted ${recipes.length} recipes and ${ingredients.length} ingredients from CouchDB`,
  );

  writeFileFromCurrentDir(RECIPES_PATH, JSON.stringify(recipes, null, 2));
  writeFileFromCurrentDir(INGREDIENTS_PATH, JSON.stringify(ingredients, null, 2));

  log.info(`Saved recipes and ingredients prepared for Solr into documents directory`);

  const { CORES: { RECIPES, INGREDIENTS } } = SOLR;

  const filteredRecipes = removeRecipesWithoutImage(recipes);
  await pushDocumentsToSolr(filteredRecipes, RECIPES);

  const scoredIngredients = await buildScoredIngredientsBasedOnUsage(ingredients);
  const extendedRecipes = await injectSearchIngredientsToRecipes(
    ingredients,
    filteredRecipes,
  );
  await pushDocumentsToSolr(extendedRecipes, RECIPES);

  const filteredIngredients = await filterIngredients(scoredIngredients);
  await pushDocumentsToSolr(filteredIngredients, INGREDIENTS);
}

(async () => {
  await main();
})();
