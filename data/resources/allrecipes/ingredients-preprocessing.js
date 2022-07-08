const fs = require('fs');
const uuid = require('uuid');

const { FILE_ENCODING, NAMESPACE_UUID } = require('../../constants');
const { GENERATED_DATASET_PATH, UNIQUE_INGREDIENTS_PATH } = require('./constants');

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

function buildUniqueIngredients(generatedRecipes) {
  const uniqueIngredients = {};

  generatedRecipes.forEach((recipe) => {
    const { structured: { ingredients } } = recipe;
    ingredients.forEach(({ text, searchValue }) => {
      if (!text) {
        return; // uncommon ingredient format
      }

      const name = searchValue && searchValue.length <= text.length ? searchValue : text;
      const identifier = uuid.v5(name.toLowerCase(), NAMESPACE_UUID);

      uniqueIngredients[identifier] = { name };
    });
  });

  console.log(`Found ${Object.keys(uniqueIngredients).length} unique ingredients`);

  return uniqueIngredients;
}

function main() {
  const generatedRecipes = readJsonFromFile(GENERATED_DATASET_PATH);
  const uniqueIngredients = buildUniqueIngredients(generatedRecipes);

  writeFileFromCurrentDir(
    UNIQUE_INGREDIENTS_PATH,
    JSON.stringify(uniqueIngredients),
    null,
    2,
  );
}

main();
