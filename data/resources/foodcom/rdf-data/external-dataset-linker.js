const fs = require('fs');
const log4js = require('log4js');
const log = log4js.getLogger('Food.com RDF dataset linker');
log.level = 'debug';

const {
  FOOD_DBPEDIA_INGREDIENTS_PATH,
  DBPEDIA_INGREDIENTS_PATH,
  FILE_ENCODING,
} = require('./constants');
const { fetchDBpediaIngredients } = require('../../dbpedia/ingredients-linker');

function readFileFromCurrentDir(filePath) {
  return fs.readFileSync(`${__dirname}/${filePath}`, FILE_ENCODING);
}

function writeFileFromCurrentDir(filePath, content) {
  return fs.writeFileSync(`${__dirname}/${filePath}`, content);
}

function getDbpediaIngredientIris() {
  const ingredientIris = [];

  const ingredientLinks = readFileFromCurrentDir(FOOD_DBPEDIA_INGREDIENTS_PATH).split(
    '\n',
  );

  ingredientLinks.forEach((link) => {
    const triple = link.split(' ');
    if (triple.length >= 3) {
      const dbpediaIri = triple[2];
      ingredientIris.push(dbpediaIri);
    }
  });

  log.info(`Found ${ingredientIris.length} ingredient IRIs`);
  return ingredientIris;
}

async function main() {
  const ingredientIris = getDbpediaIngredientIris();
  const ingredients = await fetchDBpediaIngredients(ingredientIris);

  writeFileFromCurrentDir(DBPEDIA_INGREDIENTS_PATH, JSON.stringify(ingredients, null, 2));
}

(async () => {
  await main();
})();
