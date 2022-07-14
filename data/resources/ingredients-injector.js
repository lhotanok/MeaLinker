const fs = require('fs');
const log4js = require('log4js');
const log = log4js.getLogger('Extended ingredients injector');
log.level = 'debug';

const {
  FILE_ENCODING,
  EXTENDED_INGREDIENT_PATHS,
  RECIPE_PATHS,
  EXTENDED_FINAL_RECIPES_PATH,
  EXTENDED_FINAL_INGREDIENTS_PATH,
} = require('./constants');

function readFileFromCurrentDir(filePath) {
  return fs.readFileSync(`${__dirname}/${filePath}`, FILE_ENCODING);
}

function writeFileFromCurrentDir(filePath, content) {
  return fs.writeFileSync(`${__dirname}/${filePath}`, content);
}

function loadJsonFromFile(filePath) {
  return JSON.parse(readFileFromCurrentDir(filePath));
}

function loadExtendedDocs(paths, docType) {
  const extendedDocs = [];

  log.info(`Reading extended ${docType} from ${paths}...`);
  paths.forEach((path) => {
    const ingredients = loadJsonFromFile(path);
    log.info(`Loaded ${ingredients.length} ${docType} from ${path}`);
    extendedDocs.push(...ingredients);
  });

  return extendedDocs;
}

function buildSimpleIngredients(extendedIngredients) {
  return extendedIngredients.map(
    ({ identifier, name, jsonld: { label, thumbnail } }) => ({
      identifier,
      name: name.toLowerCase(),
      label,
      thumbnail,
    }),
  );
}

function injectBestMatchIngredients(extendedIngredients, recipes) {
  const simpleIngredients = buildSimpleIngredients(extendedIngredients);

  log.info(
    `Using brute force to find best ingredient matches for ${recipes.length} recipes...`,
  );
  recipes.forEach((recipe) => {
    const { structured: { ingredients } } = recipe;

    for (const recipeIngredient of ingredients) {
      let longestMatch = { name: '' };
      const lowercaseRecipeIngr = recipeIngredient.text.toLowerCase();

      simpleIngredients.forEach((simpleIngredient) => {
        if (
          lowercaseRecipeIngr.includes(simpleIngredient.name) &&
          longestMatch.name.length < simpleIngredient.name.length
        ) {
          if (
            lowercaseRecipeIngr.includes('teaspoon') &&
            simpleIngredient.name === 'tea'
          ) {
            return;
          }

          longestMatch = { ...simpleIngredient };
        }
      });

      if (longestMatch.identifier) {
        recipeIngredient.name = longestMatch.name;
        recipeIngredient.identifier = longestMatch.identifier;
        recipeIngredient.label = longestMatch.label;
        recipeIngredient.thumbnail = longestMatch.thumbnail;
      }
    }
  });
}

function stringifyArray(array) {
  return '[' + array.map((el) => JSON.stringify(el)).join(',\n') + ']';
}

function main() {
  const extendedIngredients = loadExtendedDocs(EXTENDED_INGREDIENT_PATHS, 'ingredients');
  const extendedRecipes = loadExtendedDocs(RECIPE_PATHS, 'recipes');

  log.info(
    `Loaded ${extendedIngredients.length} ingredients and ${extendedRecipes.length} recipes in total`,
  );

  injectBestMatchIngredients(extendedIngredients, extendedRecipes);

  writeFileFromCurrentDir(EXTENDED_FINAL_RECIPES_PATH, stringifyArray(extendedRecipes));

  writeFileFromCurrentDir(
    EXTENDED_FINAL_INGREDIENTS_PATH,
    JSON.stringify(extendedIngredients, null, 2),
  );

  log.info(
    `Saved the results to ${EXTENDED_FINAL_RECIPES_PATH} and ${EXTENDED_FINAL_INGREDIENTS_PATH}`,
  );
}

main();
