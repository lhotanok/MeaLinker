const fs = require('fs');
const { FILE_ENCODING } = require('../../constants');

const {
  FOOD_DBPEDIA_INGREDIENTS_PATH,
  DBPEDIA_INGREDIENTS_PATH,
  NON_DIGIT_REGEX,
  IRI_DEREFERENCE_REGEX,
  UNIQUE_INGR_WITH_IDS_PATH,
  EXTENDED_INGREDIENTS_PATH,
  MIN_INGREDIENT_NAME_LENGTH,
  CATEGORY_PREFIX_REGEX,
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

    if (name.length >= MIN_INGREDIENT_NAME_LENGTH) {
      mergedIngredients[identifier] = {
        identifier,
        foodComId,
        name,
        jsonld,
      };
    }
  });

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
  const irisWithIds = getDbpediaIrisMappedToIngredientIds();

  const dbpediaIngredients = readJsonFromFile(DBPEDIA_INGREDIENTS_PATH);
  const uniqueIngredients = readJsonFromFile(UNIQUE_INGR_WITH_IDS_PATH);

  console.log(
    `Loaded ${dbpediaIngredients.length} dbpedia ingredients and ${Object.keys(
      uniqueIngredients,
    ).length} unique ingredients`,
  );

  const mergedIngredients = mergeIngredientsWithJsonlds(
    irisWithIds,
    dbpediaIngredients,
    uniqueIngredients,
  );

  const structuredIngredients = mergeIngredientsWithStructuredInfo(mergedIngredients);

  console.log(`Created ${structuredIngredients.length} merged ingredients`);

  writeFileFromCurrentDir(
    EXTENDED_INGREDIENTS_PATH,
    JSON.stringify(structuredIngredients, null, 2),
  );
}

main();
