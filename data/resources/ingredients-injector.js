const fs = require('fs');
const { unescape } = require('html-escaper');
const { decode } = require('html-entities');
const JSONStream = require('JSONStream');
const log4js = require('log4js');
const log = log4js.getLogger('Extended ingredients injector');
log.level = 'debug';

const {
  FILE_ENCODING,
  EXTENDED_INGREDIENT_PATHS,
  RECIPE_PATHS,
  EXTENDED_FINAL_RECIPES_PATH,
  EXTENDED_FINAL_INGREDIENTS_PATH,
  DEFAULT_ALLRECIPES_IMAGE,
} = require('./constants');

function readFileFromCurrentDir(filePath) {
  return fs.readFileSync(`${__dirname}/${filePath}`, FILE_ENCODING);
}

function loadJsonFromFile(filePath) {
  const unescapedContent = unescape(readFileFromCurrentDir(filePath));
  return JSON.parse(unescapedContent);
}

function writeJsonStream(records, resultPath) {
  log.info(`Writing ${records.length} items from JSON array to ${resultPath}`);

  const transformStream = JSONStream.stringify();
  const outputStream = fs.createWriteStream(`${__dirname}/${resultPath}`);

  transformStream.pipe(outputStream);
  records.forEach(transformStream.write);
  transformStream.end();

  outputStream.on('finish', () => {
    log.info(`Stored the result to ${resultPath}`);
  });
}

function loadExtendedDocs(paths, docType) {
  const extendedDocs = [];

  log.info(`Reading extended ${docType} from ${paths}...`);
  paths.forEach((path) => {
    const ingredients = loadJsonFromFile(path);
    log.info(`Loaded ${ingredients.length} ${docType} from ${path}`);
    extendedDocs.push(...ingredients);
  });

  log.info(`Decoding html entities in ${docType} JSON...`);
  return decodeJsonStrings(extendedDocs);
}

function buildSimpleIngredients(extendedIngredients) {
  return extendedIngredients.map(
    ({ identifier, name, jsonld: { label, thumbnail, image } }) => {
      let bestThumbnail = thumbnail;

      if (image) {
        bestThumbnail = Array.isArray(image) ? image[0] : image;
      }

      return {
        identifier,
        name: name.toLowerCase(),
        label,
        thumbnail: bestThumbnail,
      };
    },
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
      const text = recipeIngredient.text || recipeIngredient.searchValue;

      if (!text) {
        log.info(`Found ingredient without text, ignoring the injection.`, {
          recipeIngredient,
        });
        continue;
      }

      let longestMatch = { name: '' };
      const lowercaseRecipeIngr = text.toLowerCase();

      simpleIngredients.forEach((simpleIngredient) => {
        if (
          lowercaseRecipeIngr.includes(simpleIngredient.name) &&
          longestMatch.name.length < simpleIngredient.name.length
        ) {
          if (
            (lowercaseRecipeIngr.includes('teaspoon') &&
              simpleIngredient.name === 'tea') ||
            (lowercaseRecipeIngr.includes('peel') && simpleIngredient.name === 'eel')
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

function decodeJsonStrings(json) {
  if (typeof json === 'string') {
    return decode(json);
  } else if (Array.isArray(json)) {
    return json.map((item) => decodeJsonStrings(item));
  } else if (!json || typeof json !== 'object') {
    return json;
  }

  const decodedObj = {};

  Object.entries(json).forEach(([key, value]) => {
    if (typeof value === 'object' || typeof value === 'string') {
      decodedObj[key] = decodeJsonStrings(value);
    } else {
      decodedObj[key] = value;
    }
  });

  return decodedObj;
}

function main() {
  const extendedIngredients = loadExtendedDocs(EXTENDED_INGREDIENT_PATHS, 'ingredients');
  const extendedRecipes = loadExtendedDocs(RECIPE_PATHS, 'recipes').filter(
    (recipe) => recipe.jsonld.image !== DEFAULT_ALLRECIPES_IMAGE,
  );

  log.info(
    `Loaded ${extendedIngredients.length} ingredients and ${extendedRecipes.length} recipes with images in total`,
  );

  injectBestMatchIngredients(extendedIngredients, extendedRecipes);

  writeJsonStream(extendedRecipes, EXTENDED_FINAL_RECIPES_PATH);
  writeJsonStream(extendedIngredients, EXTENDED_FINAL_INGREDIENTS_PATH);

  log.info(
    `Saved the results to ${EXTENDED_FINAL_RECIPES_PATH} and ${EXTENDED_FINAL_INGREDIENTS_PATH}`,
  );
}

main();
