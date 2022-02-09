const fs = require('fs');
const log4js = require('log4js');
const log = log4js.getLogger('Recipe urls generator');
log.level = 'debug';

const { APIFY_SCRAPER_INPUT_PATH, JSON_RECIPES_PATH, URL_BASE, FILE_ENCODING } = require('./constants');

function getRecipeIds(jsonRecipesPath) {
    const recipes = JSON.parse(fs.readFileSync(jsonRecipesPath, FILE_ENCODING));
    const recipeIds = recipes.map((recipe) => recipe.id);

    return recipeIds;
}

function createUrlsFromRecipeIds(recipeIds) {
    const urls = recipeIds.map((id) => `${URL_BASE}/${id}`);

    return urls;
}

function createApifyScraperInput(recipeUrls) {
    const startUrls = recipeUrls.map((recipeUrl) => ({ url: recipeUrl }));
    const input = { startUrls };

    return input;
}

function main() {
    log.info(`Preparing recipe details start urls...`);
    
    const recipeIds = getRecipeIds(JSON_RECIPES_PATH);
    const recipeUrls = createUrlsFromRecipeIds(recipeIds);
    const scraperInput = createApifyScraperInput(recipeUrls);

    log.info(`Extracted ${recipeIds.length} recipe ids.`);
    log.info(`Recipe url format: ${recipeUrls[0]}`);

    fs.writeFileSync(APIFY_SCRAPER_INPUT_PATH, JSON.stringify(scraperInput, null, 2));
}

main();