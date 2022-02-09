const fs = require('fs');
const csv = require('csvtojson');

const { RAW_RECIPES_CSV_PATH, RECIPES_TO_CONVERT, RAW_RECIPES_JSON_PATH, JSON_PRETTY_PRINT } = require('./constants');

async function loadJsonFromCsv(csvFilePath) {
    const json = await csv().fromFile(`${__dirname}/${csvFilePath}`);
    return json;
}

function writeFileFromCurrentDir(filePath, content) {
    return fs.writeFileSync(`${__dirname}/${filePath}`, content);
}

function getFilteredRecipes(recipes, count) {
    console.log(`Shuffling converted recipes...`);

    const shuffledRecipes = recipes
        .map(value => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value)

    console.log(`Recipes shuffled`);

    return shuffledRecipes.slice(0, count);
}

async function main() {
    console.log(`Reading recipes from ${RAW_RECIPES_CSV_PATH}...`);
    const recipes = await loadJsonFromCsv(RAW_RECIPES_CSV_PATH);
    const convertedRecipesCount = Object.keys(recipes).length;
    console.log(`Converted ${convertedRecipesCount} recipes from ${RAW_RECIPES_CSV_PATH}`);

    const recipesCount = Math.min(RECIPES_TO_CONVERT, convertedRecipesCount);
    const recipesToSave = getFilteredRecipes(recipes, recipesCount);
    const stringifiedRecipes = JSON_PRETTY_PRINT ? JSON.stringify(recipesToSave, null, 2) : JSON.stringify(recipesToSave);

    console.log(`Writing ${recipesCount} converted recipes to ${RAW_RECIPES_JSON_PATH}...`);
    writeFileFromCurrentDir(RAW_RECIPES_JSON_PATH, stringifiedRecipes);
    console.log(`Recipes converted and saved successfully`);
}

(async () => {
    await main();
})();