const fs = require('fs');
const uuid = require('uuid');
const csv = require("csvtojson");

const {
    GENERATED_DATASET_PATH,
    TOKENIZED_RECIPES_PATH,
    EXTENDED_RECIPES_PATH,
    UNIQUE_INGR_WITH_IDS_PATH,
    INGR_MAP_PATH,
    FILE_ENCODING
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
        const { id, name } = normalizedIngredients[i];

        let identifier = uuid.v5(ingredient.text, NAMESPACE_UUID);

        try {
            identifier = uuid.v5(name || id, NAMESPACE_UUID);
        } catch (e) {
            console.warn(`Ingredient uuid identifier had to be generated from raw text (id, name, text):`, id, name, ingredient.text);
        }

        mergedIngredients.push({
            identifier,
            foodComId: id,
            name,
            ...ingredient
        });
    }

    return mergedIngredients;
}

function mergeIngredientIdsWithNames(ingredientIds, ingrIdsWithNames) {
    const ingrIds = ingredientIds || [];

    const mergedIngredients = ingrIds.map((id) => {
        return { id, name: ingrIdsWithNames[id] };
    })

    return mergedIngredients;
}

function getUniqueIngredients(mappedIngredients) {
    const uniqueIngredients = {};

    mappedIngredients.forEach((ingredient) => {
        const { id, replaced } = ingredient;
        uniqueIngredients[id] = replaced;
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

    fs.writeFileSync(UNIQUE_INGR_WITH_IDS_PATH, JSON.stringify(uniqueIngredients));
    
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

    fs.writeFileSync(EXTENDED_RECIPES_PATH, JSON.stringify(extendedRecipes));
}

(async () => {
    await main();
})();