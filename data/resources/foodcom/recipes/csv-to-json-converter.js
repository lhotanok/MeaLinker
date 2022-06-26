const fs = require('fs');
const csv = require('csvtojson');
const log4js = require('log4js');
const log = log4js.getLogger('Recipes format converter');
log.level = 'debug';

const { RAW_RECIPES_CSV_PATH, RECIPES_TO_CONVERT, RAW_RECIPES_JSON_PATH, JSON_PRETTY_PRINT } = require('./constants');

async function loadJsonFromCsv(csvFilePath) {
    const json = await csv().fromFile(`${__dirname}/${csvFilePath}`);
    return json;
}

function writeFileFromCurrentDir(filePath, content) {
    return fs.writeFileSync(`${__dirname}/${filePath}`, content);
}

function getFilteredRecipes(recipes, count) {
    log.info(`Shuffling converted recipes...`);

    const shuffledRecipes = recipes
        .map(value => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value)

    log.info(`Recipes shuffled`);

    return shuffledRecipes.slice(0, count);
}

async function main() {
    log.info(`Reading recipes from ${RAW_RECIPES_CSV_PATH}...`);
    const recipes = await loadJsonFromCsv(RAW_RECIPES_CSV_PATH);
    const convertedRecipesCount = Object.keys(recipes).length;
    log.info(`Converted ${convertedRecipesCount} recipes from ${RAW_RECIPES_CSV_PATH}`);

    const recipesCount = Math.min(RECIPES_TO_CONVERT, convertedRecipesCount);
    const recipesToSave = getFilteredRecipes(recipes, recipesCount);
    const stringifiedRecipes = JSON_PRETTY_PRINT ? JSON.stringify(recipesToSave, null, 2) : JSON.stringify(recipesToSave);

    log.info(`Writing ${recipesCount} converted recipes to ${RAW_RECIPES_JSON_PATH}...`);
    writeFileFromCurrentDir(RAW_RECIPES_JSON_PATH, stringifiedRecipes);
    log.info(`Recipes converted and saved successfully`);
}

(async () => {
    await main();
})();