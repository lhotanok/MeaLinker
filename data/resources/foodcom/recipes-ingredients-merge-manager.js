const fs = require('fs');
const uuid = require('uuid');
const csv = require('csvtojson');
const log4js = require('log4js');
const log = log4js.getLogger('Recipes-ingredients manager');
log.level = 'debug';

const {
  GENERATED_DATASET_PATH,
  TOKENIZED_RECIPES_PATH,
  EXTENDED_RECIPES_PATH,
  UNIQUE_INGR_WITH_IDS_PATH,
  INGR_MAP_PATH,
  FILE_ENCODING,
  JSON_RECIPES_PATH,
  SEARCH_INGREDIENT_TRUNCATE_REGEX,
  SEARCH_INGREDIENT_MAX_WORDS,
  SEARCH_INGREDIENTS_PATH,
  SEARCH_INGREDIENT_EXCLUDE_REGEX,
} = require('./constants');

const { NAMESPACE_UUID } = require('./constants');

function readFileFromCurrentDir(filePath) {
  return fs.readFileSync(`${__dirname}/${filePath}`, FILE_ENCODING);
}

function writeFileFromCurrentDir(filePath, content) {
  return fs.writeFileSync(`${__dirname}/${filePath}`, content);
}

function loadJsonFromFile(filePath) {
  return JSON.parse(readFileFromCurrentDir(filePath));
}

async function loadJsonFromCsv(csvFilePath) {
  const json = await csv().fromFile(`${__dirname}/${csvFilePath}`);
  return json;
}

function filterRecipeIdsWithIngredientIds(tokenizedRecipes) {
  const recipes = {};

  tokenizedRecipes.forEach((recipe) => {
    const { id, ingredient_ids } = recipe;
    recipes[id] = JSON.parse(ingredient_ids);
  });

  return recipes;
}

function mergeRawIngrWithNormalizedIngr(ingredients, normalizedIngredients) {
  const mergedIngredients = [];

  if (ingredients.length !== normalizedIngredients.length) {
    return ingredients;
  }

  for (let i = 0; i < ingredients.length; i++) {
    const ingredient = ingredients[i];
    const { id, identifier, name } = normalizedIngredients[i];

    mergedIngredients.push({
      identifier,
      foodComId: id,
      name,
      ...ingredient,
    });
  }

  return mergedIngredients;
}

function mergeIngredientIdsWithNames(ingredientIds, uniqueIngredients) {
  const ingrIds = ingredientIds || [];

  const mergedIngredients = ingrIds.map((id) => {
    const uniqueIngredient = uniqueIngredients[id];
    const { identifier, name } = uniqueIngredient;

    return { id, identifier, name };
  });

  return mergedIngredients;
}

function getUniqueIngredients(mappedIngredients) {
  const uniqueIngredients = {};

  mappedIngredients.forEach((ingredient) => {
    const { id, replaced } = ingredient;
    const name = replaced;
    const identifier = uuid.v5(name || id, NAMESPACE_UUID);

    uniqueIngredients[id] = {
      identifier,
      name,
    };
  });

  return uniqueIngredients;
}

function buildSearchIngredients(uniqueIngredients) {
  const searchIngredients = {};

  Object.entries(uniqueIngredients).forEach(([{ identifier, name }]) => {
    // Filter ingredients suitable for searching

    if ((!name.match(/[,.]/) && name[0].match(/[a-z]/gi)) || name === '7-up') {
      const truncatedName = name
        .replace(SEARCH_INGREDIENT_TRUNCATE_REGEX, '')
        .replaceAll('chily', 'chili')
        .trim();

      const words = truncatedName.split(' ');

      if (words.length <= SEARCH_INGREDIENT_MAX_WORDS) {
        if (!truncatedName.match(SEARCH_INGREDIENT_EXCLUDE_REGEX)) {
          if (!truncatedName.includes('condensed') || !truncatedName.includes('soup')) {
            const firstCapitalLetter = truncatedName[0].toUpperCase();

            const label = {
              '@value': firstCapitalLetter + truncatedName.slice(1),
              '@language': 'en',
            };

            searchIngredients[label['@value'].replaceAll(' ', '-')] = {
              identifier,
              label,
            };
          }
        }
      }
    }
  });

  return Object.values(searchIngredients);
}

async function main() {
  const generatedRecipes = loadJsonFromFile(GENERATED_DATASET_PATH);
  const rawRecipes = loadJsonFromFile(JSON_RECIPES_PATH);
  const tokenizedRecipes = await loadJsonFromCsv(TOKENIZED_RECIPES_PATH);
  const mappedIngredients = await loadJsonFromCsv(INGR_MAP_PATH);

  const uniqueIngredients = getUniqueIngredients(mappedIngredients);
  const searchIngredients = buildSearchIngredients(uniqueIngredients);

  writeFileFromCurrentDir(
    UNIQUE_INGR_WITH_IDS_PATH,
    JSON.stringify(uniqueIngredients, null, 2),
  );

  writeFileFromCurrentDir(SEARCH_INGREDIENTS_PATH, JSON.stringify(searchIngredients));

  const recipeIdsWithIngrIds = filterRecipeIdsWithIngredientIds(tokenizedRecipes);

  const rawRecipesIdMap = {};
  rawRecipes.forEach((recipe) => (rawRecipesIdMap[recipe.id] = recipe));

  const extendedRecipes = generatedRecipes.map((recipe) => {
    const { structured, jsonld } = recipe;
    const { foodComId, ingredients } = structured;

    const ingredientIds = recipeIdsWithIngrIds[foodComId];

    const mergedIngredients = mergeIngredientIdsWithNames(
      ingredientIds,
      uniqueIngredients,
    );
    const extendedIngredients = mergeRawIngrWithNormalizedIngr(
      ingredients,
      mergedIngredients,
    );

    const author = {
      id: rawRecipesIdMap[foodComId].contributor_id,
      name: jsonld.author,
      url: `https://www.food.com/user/${rawRecipesIdMap[foodComId].contributor_id}`,
    };

    const extendedRecipe = recipe;

    extendedRecipe.structured.ingredients = extendedIngredients;
    extendedRecipe.structured.stepsCount = jsonld.recipeInstructions.length;
    extendedRecipe.structured.author = author;

    return extendedRecipe;
  });

  console.log(`${extendedRecipes.length} recipes merged with extended ingredients info`);

  writeFileFromCurrentDir(EXTENDED_RECIPES_PATH, JSON.stringify(extendedRecipes));
}

(async () => {
  await main();
})();
