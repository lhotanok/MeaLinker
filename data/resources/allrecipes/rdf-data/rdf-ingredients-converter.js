const fs = require('fs');

const { UNIQUE_INGR_WITH_IDS_PATH, RDF_INGREDIENTS_PATH } = require('./constants');

const { FILE_ENCODING } = require('../../../constants');
const { serializeIngredientsToRdf } = require('../../rdf-serializer');

function readFileFromCurrentDir(filePath) {
  return fs.readFileSync(`${__dirname}/${filePath}`, FILE_ENCODING);
}

function loadJsonFromFile(filePath) {
  return JSON.parse(readFileFromCurrentDir(filePath));
}

function main() {
  const ingredients = loadJsonFromFile(UNIQUE_INGR_WITH_IDS_PATH);

  serializeIngredientsToRdf(ingredients, RDF_INGREDIENTS_PATH);
}

main();
