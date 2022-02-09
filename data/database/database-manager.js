const fs = require('fs');
const log4js = require('log4js');
const log = log4js.getLogger('CouchDB manager');
log.level = 'debug';

const { PORT, USERNAME, PASSWORD } = require('./config');
const { DATABASE_NAME, FILE_ENCODING, FOOD_COM_RECIPES_PATH, FOOD_COM_INGREDIENTS_PATH } = require('./constants');

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

    log.info(`Inserting ${recipes.length} recipes into ${DATABASE_NAME} database...`);

    for (const recipe of recipes) {
        const { jsonld: { identifier } } = recipe;
        await tryInsertItem(mealinkerDb, identifier, recipe);
    }
}

async function insertIngredients(mealinkerDb) {
    const ingredients = loadJsonFromFile(FOOD_COM_INGREDIENTS_PATH);

    log.info(`Inserting ${ingredients.length} ingredients into ${DATABASE_NAME} database...`);

    for (const ingredient of ingredients) {
        const { identifier } = ingredient;
        await tryInsertItem(mealinkerDb, identifier, ingredient);
    }
}

async function main () {
    /**
     * Destroying the old DB and creating a new one is easier than updating the old DB.
     * This approach is suitable for reasonably small datasets whereas updating
     * the old DB would be preferred for large datasets.
     */
    await destroyDatabase(DATABASE_NAME);
    await createDatabase(DATABASE_NAME);

    const mealinkerDb = nano.use(DATABASE_NAME);

    insertRecipes(mealinkerDb);
    insertIngredients(mealinkerDb);
}

(async () => {
    await main();
})();