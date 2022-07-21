const fs = require('fs');
const { FILE_ENCODING } = require('../../constants');

const {
  UNIQUE_INGREDIENTS_PATH,
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

  Object.entries(jsonldIngredients).forEach(([ingredientId, jsonld]) => {
    const ingredient = uniqueIngredients[ingredientId];

    if (!ingredient) {
      console.log(`Ingredient id ${ingredientId} was not found in unique ingredients`);
      return;
    }

    const { identifier = ingredientId, name } = ingredient;

    if (name.length >= MIN_INGREDIENT_NAME_LENGTH) {
      mergedIngredients[identifier] = {
        identifier,
        name,
        jsonld,
      };

      if (ingredientId !== identifier) {
        mergedIngredients[identifier].foodComId = ingredientId;
      }
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
  const uniqueIngredients = readJsonFromFile(UNIQUE_INGREDIENTS_PATH);

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
    `Created ${structuredIngredients.length} ingredients with structured info and jsonlds.
    Saving to ${EXTENDED_INGREDIENTS_PATH}`,
  );

  writeFileFromCurrentDir(
    EXTENDED_INGREDIENTS_PATH,
    JSON.stringify(structuredIngredients, null, 2),
  );
}

main();
