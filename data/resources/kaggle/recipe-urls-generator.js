var fs = require('fs');

function getRecipeIds(jsonRecipesPath) {
    const recipes = JSON.parse(fs.readFileSync(jsonRecipesPath, 'utf8'));
    const recipeIds = recipes.map((recipe) => recipe.id);

    return recipeIds;
}

function createUrlsFromRecipeIds(recipeIds) {
    const URL_BASE = `https://www.food.com/recipe`;
    const urls = recipeIds.map((id) => `${URL_BASE}/${id}`);

    return urls;
}

function createApifyScraperInput(recipeUrls) {
    const startUrls = recipeUrls.map((recipeUrl) => ({ url: recipeUrl }));
    const input = { startUrls };

    return input;
}

function main() {
    const JSON_RECIPES_PATH = './recipes/RAW_recipes.json';
    const APIFY_SCRAPER_INPUT_PATH = './food-com-scraper/apify_storage/key_value_stores/default/INPUT.json';

    const recipeIds = getRecipeIds(JSON_RECIPES_PATH);
    const recipeUrls = createUrlsFromRecipeIds(recipeIds);
    const scraperInput = createApifyScraperInput(recipeUrls);

    console.log(`Extracted ${recipeIds.length} recipe ids.`);
    console.log(`Recipe url format: ${recipeUrls[0]}`);

    fs.writeFileSync(APIFY_SCRAPER_INPUT_PATH, JSON.stringify(scraperInput, null, 2));
}

main();