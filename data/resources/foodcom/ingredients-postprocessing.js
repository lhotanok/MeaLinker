const fs = require('fs');
const { FILE_ENCODING } = require('../../constants');

const {
  UNIQUE_INGR_WITH_IDS_PATH,
  EXTENDED_INGREDIENTS_PATH,
  MIN_INGREDIENT_NAME_LENGTH,
  CATEGORY_PREFIX_REGEX,
  JSONLD_INGRS_PATH,
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

function mergeIngredientsWithJsonlds(jsonldIngredients, uniqueIngredients) {
  const mergedIngredients = {};

  Object.entries(jsonldIngredients).forEach(([foodComId, jsonld]) => {
    const ingredient = uniqueIngredients[foodComId];
    const { identifier, name } = ingredient;

    if (name.length >= MIN_INGREDIENT_NAME_LENGTH) {
      mergedIngredients[identifier] = {
        identifier,
        foodComId,
        name,
        jsonld,
      };
    }
  });

  console.log(`Merged ${Object.keys(mergedIngredients).length} ingredients with jsonlds`);
  return mergedIngredients;
}

function mergeIngredientsWithStructuredInfo(extendedIngredients) {
  const mergedIngredients = {};

  const iriToIdAndLabel = {};
  const categoriesWithIngrs = {};

  Object.values(extendedIngredients).forEach((ingredient) => {
    const id = ingredient.jsonld['@id'];
    iriToIdAndLabel[id] = {
      id: ingredient.identifier,
      name: ingredient.jsonld.label['@value'],
    };
  });

  Object.values(extendedIngredients).forEach((extendedIngredient) => {
    const { identifier, jsonld: { subject = [], ingredient = [] } } = extendedIngredient;

    const subjects = Array.isArray(subject) ? subject : [subject];
    const categories = subjects.map((category) =>
      category.replace(CATEGORY_PREFIX_REGEX, '').replace(/_+/g, ' '),
    );

    categories.forEach((category) => {
      if (!categoriesWithIngrs[category]) {
        categoriesWithIngrs[category] = [];
      }

      categoriesWithIngrs[category].push(extendedIngredient);
    });

    const ingredients = Array.isArray(ingredient) ? ingredient : [ingredient];
    const madeOfIngredients = ingredients
      .map((ingr) => iriToIdAndLabel[ingr])
      .filter((ingr) => ingr);

    mergedIngredients[identifier] = {
      ...extendedIngredient,
      structured: { madeOfIngredients },
    };
  });

  Object.entries(categoriesWithIngrs).forEach(([categoryName, ingredients]) => {
    ingredients.forEach((ingredient) => {
      const { identifier } = ingredient;
      if (!mergedIngredients[identifier].structured.categories) {
        mergedIngredients[identifier].structured.categories = [];
      }

      mergedIngredients[identifier].structured.categories.push({
        name: categoryName,
        ingredients: ingredients
          .map((ingr) => {
            const { identifier: id, jsonld: { label } } = ingr;
            return { id, name: label['@value'] };
          })
          .filter(({ id }) => id !== identifier),
      });
    });
  });

  return Object.values(mergedIngredients);
}

function main() {
  const jsonldIngredients = readJsonFromFile(JSONLD_INGRS_PATH);
  const uniqueIngredients = readJsonFromFile(UNIQUE_INGR_WITH_IDS_PATH);

  console.log(
    `Loaded ${Object.keys(jsonldIngredients).length} jsonld ingredients and ${Object.keys(
      uniqueIngredients,
    ).length} unique ingredients`,
  );

  const mergedIngredients = mergeIngredientsWithJsonlds(
    jsonldIngredients,
    uniqueIngredients,
  );

  const structuredIngredients = mergeIngredientsWithStructuredInfo(mergedIngredients);

  console.log(
    `Created ${structuredIngredients.length} ingredients with structured info and jsonlds`,
  );

  writeFileFromCurrentDir(
    EXTENDED_INGREDIENTS_PATH,
    JSON.stringify(structuredIngredients, null, 2),
  );
}

main();
