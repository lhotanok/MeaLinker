const fs = require('fs');

const { PORT, USERNAME, PASSWORD } = require('./config');
const { DATABASE_NAME, FILE_ENCODING, RECIPES_PATH, INGREDIENTS_PATH } = require('./constants');

const nano = require('nano')(`http://${USERNAME}:${PASSWORD}@localhost:${PORT}`);

async function createDatabase(dbName) {
    console.log(`Creating ${dbName} database...`);

    try {
        const response = await nano.db.create(dbName);
        console.log(response);
    } catch (e) {
        console.error(e);
    }
}

async function destroyDatabase(dbName) {
    console.log(`Destroying ${dbName} database...`);

    try {
        const response = await nano.db.destroy(dbName);
        console.log(response);
    } catch (e) {
        console.error(e);
    }
}

function readFileFromCurrentDir(filePath) {
    return fs.readFileSync(`${__dirname}/${filePath}`, FILE_ENCODING);
}

function loadJsonFromFile(filePath) {
    return JSON.parse(readFileFromCurrentDir(filePath));
}

async function tryInsertItem(mealinkerDb, item, identifier) {
    try {
        const itemToInsert = { _id: identifier, ...item };
        delete itemToInsert.identifier; // avoid redundancy with _id

        await mealinkerDb.insert(itemToInsert);
    } catch (e) {
        console.error(e);
    }
}

async function insertRecipes(mealinkerDb) {
    const recipes = loadJsonFromFile(RECIPES_PATH);

    console.log(`Inserting ${recipes.length} recipes into ${DATABASE_NAME} database...`);

    for (const recipe of recipes) {
        const { jsonld: { identifier } } = recipe;
        await tryInsertItem(mealinkerDb, recipe, identifier);
    }
}

async function insertIngredients(mealinkerDb) {
    const ingredients = loadJsonFromFile(INGREDIENTS_PATH);

    console.log(`Inserting ${ingredients.length} ingredients into ${DATABASE_NAME} database...`);

    for (const ingredient of ingredients) {
        const { identifier } = ingredient;
        await tryInsertItem(mealinkerDb, ingredient, identifier);
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