import { unescape } from 'html-escaper';
import { decode } from 'html-entities';

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import * as fs from 'fs';
import pkg from 'log4js';
import { PASSWORD, PORT, USERNAME } from './config.mjs';

const { getLogger } = pkg;
const log = getLogger('CouchDB manager');
log.level = 'debug';

import {
  FOOD_COM_RECIPES_PATH,
  FOOD_COM_INGREDIENTS_PATH,
  RECIPES_DATABASE_NAME,
  INGREDIENTS_DATABASE_NAME,
} from './constants.mjs';

import nanoRoot from 'nano';
import { FILE_ENCODING } from '../constants.js';

const nano = nanoRoot(`http://${USERNAME}:${PASSWORD}@localhost:${PORT}`);

function readFileFromCurrentDir(filePath) {
  return fs.readFileSync(`${__dirname}/${filePath}`, FILE_ENCODING);
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

function loadJsonFromFile(filePath) {
  const fileContent = readFileFromCurrentDir(filePath);

  // double decoding is used to ensure the best results

  // might be redundant, not powerfull enough by itself
  const escapedContent = unescape(fileContent);

  const json = JSON.parse(escapedContent);

  // decodes all strings from json object recursively
  const decodedJson = decodeJsonStrings(json);

  return decodedJson;
}

async function createDatabase(dbName) {
  log.info(`Creating ${dbName} database...`);

  try {
    const response = await nano.db.create(dbName);
    log.info(response);
  } catch (e) {
    console.error(e);
  }
}

async function destroyDatabase(dbName) {
  log.info(`Destroying ${dbName} database...`);

  try {
    const response = await nano.db.destroy(dbName);
    log.info(response);
  } catch (e) {
    console.error(e);
  }
}

async function tryInsertItem(mealinkerDb, identifier, item) {
  try {
    const itemToInsert = { _id: identifier, ...item };
    delete itemToInsert.identifier; // avoid redundancy with _id

    await mealinkerDb.insert(itemToInsert);
  } catch (e) {
    console.error(e);
  }
}

async function insertRecipes(mealinkerDb, recipes) {
  log.info(`Inserting ${recipes.length} recipes into recipes database...`);

  for (const recipe of recipes) {
    const { jsonld: { identifier } } = recipe;
    await tryInsertItem(mealinkerDb, identifier, recipe);
  }
}

async function insertIngredients(mealinkerDb, ingredients) {
  log.info(
    `Inserting ${ingredients.length} ingredients into ${mealinkerDb.config
      .db} database...`,
  );

  for (const ingredient of ingredients) {
    const { identifier } = ingredient;
    await tryInsertItem(mealinkerDb, identifier, ingredient);
  }
}

async function main() {
  const recipeDb = nano.use(RECIPES_DATABASE_NAME);
  const ingredientsDb = nano.use(INGREDIENTS_DATABASE_NAME);

  /**
   * Destroying the old DB and creating a new one is easier than updating the old DB.
   * This approach is suitable for reasonably small datasets whereas updating
   * the old DB would be preferred for large datasets.
   */
  await destroyDatabase(RECIPES_DATABASE_NAME);
  await destroyDatabase(INGREDIENTS_DATABASE_NAME);

  await createDatabase(RECIPES_DATABASE_NAME);
  await createDatabase(INGREDIENTS_DATABASE_NAME);

  const recipes = loadJsonFromFile(FOOD_COM_RECIPES_PATH);
  const ingredients = loadJsonFromFile(FOOD_COM_INGREDIENTS_PATH);

  insertRecipes(recipeDb, recipes);
  insertIngredients(ingredientsDb, ingredients);
}

(async () => {
  await main();
})();
