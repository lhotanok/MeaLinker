const fs = require('fs');
const log4js = require('log4js');
const solr = require('solr-client');
const { COUCHDB: { DB_NAME, USERNAME, PASSWORD, PORT }, SOLR } = require('./config');
const { RECIPE_JSONLD_TYPE, INGREDIENT_JSONLD_TYPE, RECIPES_PATH, INGREDIENTS_PATH } = require('./constants');
const nano = require('nano')(`http://${USERNAME}:${PASSWORD}@localhost:${PORT}`);

const log = log4js.getLogger('Solr documents manager');
log.level = 'debug';

function writeFileFromCurrentDir(filePath, content) {
    return fs.writeFileSync(`${__dirname}/${filePath}`, content);
}

async function fillWithDatabaseDocuments(recipes, ingredients) {
    const database = nano.use(DB_NAME);

    const documents = await database.list({include_docs: true})
    documents.rows.forEach(({ doc }) => {
        const { jsonld } = doc;

        if (jsonld['@type'] === RECIPE_JSONLD_TYPE) {
            recipes.push(filterRecipeIndexedFields(doc));
        } else if (jsonld['@type'] === INGREDIENT_JSONLD_TYPE) {
            ingredients.push(filterIngredientIndexedFields(doc));
        }
    });
}

function getFilteredIngredients(ingredients) {
    return ingredients.map(({ name, text }) => name || text );
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

function filterRecipeIndexedFields(recipe) {
    const { _id, jsonld, structured } = recipe;

    const { name, recipeCategory } = jsonld;
    const { tags, rating, stepsCount, ingredients, time, nutritionInfo } = structured;
    const { calories, fat, saturatedFat, cholesterol, sodium, carbohydrate, fiber, sugar, protein } = nutritionInfo;

    const filteredRecipe = {
        id: _id,
        name,
        recipeCategory,
        stepsCount,
        rating: rating.value,
        tags,
        ingredients: getFilteredIngredients(ingredients),
        cookMinutes: getDurationInMinutes(time.cooking),
        prepMinutes: getDurationInMinutes(time.preparation),
        totalMinutes: getDurationInMinutes(time.total),
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
    const { _id, jsonld } = ingredient;
    const { label, thumbnail } = jsonld;

    const filteredIngredient = {
        id: _id,
        label: label['@value'],
        thumbnail,
    }

    return filteredIngredient;
}

async function pushDocumentsToSolr(documents, core) {
    const { HOST, PORT, SECURE } = SOLR;

    const client = solr.createClient({
        host: HOST,
        port: PORT,
        core,
        secure: SECURE,
    });

    const addResponse = await client.add(documents);
    log.info(`Add documents response: ${JSON.stringify(addResponse, null, 2)}`);

    const commitResponse = await client.commit();
    log.info(`Commit response: ${JSON.stringify(commitResponse, null, 2)}`);
}

async function main() {
    const recipes = [];
    const ingredients = [];

    await fillWithDatabaseDocuments(recipes, ingredients);

    log.info(`Extracted ${recipes.length} recipes and ${ingredients.length} ingredients from ${DB_NAME} DB`);

    writeFileFromCurrentDir(RECIPES_PATH, JSON.stringify(recipes, null, 2));
    writeFileFromCurrentDir(INGREDIENTS_PATH, JSON.stringify(ingredients, null, 2));

    log.info(`Saved recipes and ingredients prepared for Solr into documents directory`);

    const { CORES: { RECIPES, INGREDIENTS } } = SOLR;

    await pushDocumentsToSolr(recipes, RECIPES);
    await pushDocumentsToSolr(ingredients, INGREDIENTS);
}

(async () => {
    await main();
})();