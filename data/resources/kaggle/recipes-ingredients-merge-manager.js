const fs = require('fs');
const uuid = require('uuid');
const csv = require("csvtojson");

const {
    GENERATED_DATASET_PATH,
    TOKENIZED_RECIPES_PATH,
    EXTENDED_RECIPES_PATH,
    UNIQUE_INGR_WITH_IDS_PATH,
    INGR_MAP_PATH,
    FILE_ENCODING,
    INGR_UUID_MAP_PATH
} = require('./constants');

const { NAMESPACE_UUID } = require('./constants');

function loadJsonFromFile(filePath) {
    return JSON.parse(fs.readFileSync(filePath, FILE_ENCODING));
}

async function loadJsonFromCsv(csvFilePath) {
    const json = await csv().fromFile(csvFilePath);
    return json;
}

function filterRecipeIdsWithIngredientIds(tokenizedRecipes) {
    const recipes = {};

    tokenizedRecipes.forEach((recipe) => {
        const { id, ingredient_ids } = recipe;
        recipes[id] = JSON.parse(ingredient_ids);
    })

    return recipes;
}

function mergeRawIngrWithNormalizedIngr(ingredients, normalizedIngredients) {
    const mergedIngredients = [];

    if (ingredients.length !== normalizedIngredients.length) {
        return ingredients;
    }

    for (let i = 0; i < ingredients.length; i++) {
        const ingredient = ingredients[i];
        const { id, identifier, name } = normalizedIngredients[i];

        mergedIngredients.push({
            identifier,
            foodComId: id,
            name,
            ...ingredient
        });
    }

    return mergedIngredients;
}

function mergeIngredientIdsWithNames(ingredientIds, uniqueIngredients) {
    const ingrIds = ingredientIds || [];

    const mergedIngredients = ingrIds.map((id) => {
        const uniqueIngredient = uniqueIngredients[id];
        const { identifier, name } = uniqueIngredient;

        return { id, identifier, name };
    })

    return mergedIngredients;
}

function getUniqueIngredients(mappedIngredients) {
    const uniqueIngredients = {};

    mappedIngredients.forEach((ingredient) => {
        const { id, name } = ingredient;
        const identifier = uuid.v5(name || id, NAMESPACE_UUID);

        uniqueIngredients[id] = {
            identifier,
            name,
        };
    })

    return uniqueIngredients;
}

async function main() {
    const extendedRecipes = [];

    const generatedRecipes = loadJsonFromFile(GENERATED_DATASET_PATH);
    const tokenizedRecipes = await loadJsonFromCsv(TOKENIZED_RECIPES_PATH);
    const mappedIngredients = await loadJsonFromCsv(INGR_MAP_PATH);

    const uniqueIngredients = getUniqueIngredients(mappedIngredients);
    const recipeIdsWithIngrIds = filterRecipeIdsWithIngredientIds(tokenizedRecipes);

    fs.writeFileSync(UNIQUE_INGR_WITH_IDS_PATH, JSON.stringify(uniqueIngredients, null, 2));
    
    generatedRecipes.forEach((recipe) => {
        const { structured } = recipe;
        const { foodComId, ingredients } = structured;

        const ingredientIds = recipeIdsWithIngrIds[foodComId];

        const mergedIngredients = mergeIngredientIdsWithNames(ingredientIds, uniqueIngredients);
        const extendedIngredients = mergeRawIngrWithNormalizedIngr(ingredients, mergedIngredients);

        const extendedRecipe = recipe;
        extendedRecipe.structured.ingredients = extendedIngredients;
        extendedRecipes.push(extendedRecipe);
    });

    console.log(`${extendedRecipes.length} recipes merged with extended ingredients info`);

    fs.writeFileSync(EXTENDED_RECIPES_PATH, JSON.stringify(extendedRecipes));
}

(async () => {
    await main();
})();