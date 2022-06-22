const fs = require('fs');

const {
  FILE_ENCODING,
  FOOD_DBPEDIA_INGREDIENTS_PATH,
  DBPEDIA_INGREDIENTS_PATH,
  NON_DIGIT_REGEX,
  IRI_DEREFERENCE_REGEX,
  UNIQUE_INGR_WITH_IDS_PATH,
  EXTENDED_INGREDIENTS_PATH,
  EXTENDED_RECIPES_PATH,
  SEARCH_INGREDIENT_TRUNCATE_REGEX,
  SEARCH_INGREDIENT_MAX_WORDS,
  SEARCH_INGREDIENTS_PATH,
  SEARCH_INGREDIENT_EXCLUDE_REGEX,
} = require('./constants');

function readFile(filePath) {
  return fs.readFileSync(`${__dirname}/${filePath}`, FILE_ENCODING);
}

function writeFileFromCurrentDir(filePath, content) {
  console.log(`Saved the result to: ${filePath}`);

  return fs.writeFileSync(`${__dirname}/${filePath}`, content);
}

function readJsonFromFile(filePath) {
  return JSON.parse(readFile(filePath));
}

function getDbpediaIrisMappedToIngredientIds() {
  const ingredients = {};

  const foodDbpediaLinks = readFile(FOOD_DBPEDIA_INGREDIENTS_PATH).split('\n');

  foodDbpediaLinks.forEach((link) => {
    const triple = link.split(' ');
    if (triple.length >= 3) {
      const foodIri = triple[0];
      const dbpediaIri = triple[2];

      const ingredientId = foodIri.replace(NON_DIGIT_REGEX, '');
      const dereferencedIri = dbpediaIri.replace(IRI_DEREFERENCE_REGEX, '');

      ingredients[dereferencedIri] = ingredientId;
    }
  });

  return ingredients;
}

function mergeIngredientsWithJsonlds(irisWithIds, jsonlds, uniqueIngredients) {
  const mergedIngredients = {};

  jsonlds.forEach((jsonld) => {
    const iri = jsonld['@id'];
    const foodComId = irisWithIds[iri];
    const ingredient = uniqueIngredients[foodComId];
    const { identifier, name } = ingredient;

    mergedIngredients[identifier] = {
      identifier,
      foodComId,
      name,
      jsonld,
    };
  });

  return mergedIngredients;
}

function buildSearchIngredients(irisWithIds, jsonlds, uniqueIngredients) {
  const foodcomIdToJsonldMapping = {};

  jsonlds.forEach((jsonld) => {
    const iri = jsonld['@id'];
    const foodComId = irisWithIds[iri];
    foodcomIdToJsonldMapping[foodComId] = jsonld;
  });

  const searchIngredients = {};

  Object.entries(uniqueIngredients).forEach(([foodComId, { identifier, name }]) => {
    // Filter ingredients suitable for searching

    if ((!name.match(/[,.]/) && name[0].match(/[a-z]/gi)) || name === '7-up') {
      const truncatedName = name
        .replace(SEARCH_INGREDIENT_TRUNCATE_REGEX, '')
        .replaceAll('chily', 'chili')
        .trim();

      const words = truncatedName.split(' ');

      if (words.length <= SEARCH_INGREDIENT_MAX_WORDS) {
        if (!truncatedName.match(SEARCH_INGREDIENT_EXCLUDE_REGEX)) {
          if (!truncatedName.includes('condensed') || !truncatedName.includes('soup')) {
            const firstCapitalLetter = truncatedName[0].toUpperCase();
            const jsonld = foodcomIdToJsonldMapping[foodComId] || {};

            const label = jsonld.label
              ? jsonld.label
              : {
                  '@value': firstCapitalLetter + truncatedName.slice(1),
                  '@language': 'en',
                };

            searchIngredients[label['@value'].replaceAll(' ', '-')] = {
              identifier,
              label,
              thumbnail: jsonld.thumbnail,
            };
          }
        }
      }
    }
  });

  return searchIngredients;
}

function extendRecipesByIngredientThumbnails(recipes, jsonldIngredients) {
  const extendedRecipes = recipes.map((recipe) => {
    const { structured: { ingredients } } = recipe;

    const extendedIngredients = ingredients.map((ingredient) => {
      const { identifier } = ingredient;
      if (identifier && jsonldIngredients[identifier]) {
        const jsonldIngredient = jsonldIngredients[identifier];
        const { jsonld: { thumbnail, label } } = jsonldIngredient;

        return thumbnail ? { ...ingredient, thumbnail, label } : ingredient;
      }

      return ingredient;
    });

    const extendedRecipe = recipe;
    extendedRecipe.structured.ingredients = extendedIngredients;

    return extendedRecipe;
  });

  return extendedRecipes;
}

function main() {
  const irisWithIds = getDbpediaIrisMappedToIngredientIds();

  const dbpediaIngredients = readJsonFromFile(DBPEDIA_INGREDIENTS_PATH);
  const extendedRecipes = readJsonFromFile(EXTENDED_RECIPES_PATH);

  const uniqueIngredients = readJsonFromFile(UNIQUE_INGR_WITH_IDS_PATH);

  const mergedIngredients = mergeIngredientsWithJsonlds(
    irisWithIds,
    dbpediaIngredients,
    uniqueIngredients,
  );

  const searchIngredients = buildSearchIngredients(
    irisWithIds,
    dbpediaIngredients,
    uniqueIngredients,
  );

  const mergedRecipes = extendRecipesByIngredientThumbnails(
    extendedRecipes,
    mergedIngredients,
  );

  writeFileFromCurrentDir(
    EXTENDED_INGREDIENTS_PATH,
    JSON.stringify(Object.values(mergedIngredients), null, 2),
  );

  writeFileFromCurrentDir(
    SEARCH_INGREDIENTS_PATH,
    JSON.stringify(Object.values(searchIngredients), null, 2),
  );

  writeFileFromCurrentDir(EXTENDED_RECIPES_PATH, JSON.stringify(mergedRecipes));
}

main();
