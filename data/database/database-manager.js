const fs = require('fs');
const log4js = require('log4js');
const log = log4js.getLogger('CouchDB manager');
log.level = 'debug';

const { PORT, USERNAME, PASSWORD } = require('./config');
const {
  FILE_ENCODING,
  FOOD_COM_RECIPES_PATH,
  FOOD_COM_INGREDIENTS_PATH,
  RECIPES_DATABASE_NAME,
  INGREDIENTS_DATABASE_NAME,
} = require('./constants');

const nano = require('nano')(`http://${USERNAME}:${PASSWORD}@localhost:${PORT}`);

function readFileFromCurrentDir(filePath) {
  return fs.readFileSync(`${__dirname}/${filePath}`, FILE_ENCODING);
}

function loadJsonFromFile(filePath) {
  return JSON.parse(readFileFromCurrentDir(filePath));
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

async function insertRecipes(mealinkerDb) {
  const recipes = loadJsonFromFile(FOOD_COM_RECIPES_PATH);

  log.info(`Inserting ${recipes.length} recipes into recipes database...`);

  for (const recipe of recipes) {
    const { jsonld: { identifier } } = recipe;
    await tryInsertItem(mealinkerDb, identifier, recipe);
  }
}

async function insertIngredients(mealinkerDb) {
  const ingredients = loadJsonFromFile(FOOD_COM_INGREDIENTS_PATH);

  log.info(`Inserting ${ingredients.length} ingredients into ingredients database...`);

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
  await createDatabase(RECIPES_DATABASE_NAME);

  await destroyDatabase(INGREDIENTS_DATABASE_NAME);
  await createDatabase(INGREDIENTS_DATABASE_NAME);

  insertRecipes(recipeDb);
  insertIngredients(ingredientsDb);
}

(async () => {
  await main();
})();
