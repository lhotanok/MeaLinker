const fs = require('fs');
const log4js = require('log4js');
const log = log4js.getLogger('Allrecipes RDF dataset linker');
log.level = 'debug';

const {
  DBPEDIA_LINKS_PATH,
  DBPEDIA_INGREDIENTS_PATH,
  WIKIDATA_LINKS_PATH,
  WIKIDATA_INGREDIENTS_PATH,
  JSONLD_INGRS_PATH,
  MERGED_MAP_PATH,
} = require('./constants');
const { FILE_ENCODING } = require('../../../constants');

const { fetchIngredientsFromExternalDatasets } = require('../../external-dataset-linker');

function readFileFromCurrentDir(filePath) {
  return fs.readFileSync(`${__dirname}/${filePath}`, FILE_ENCODING);
}

function writeFileFromCurrentDir(filePath, content) {
  return fs.writeFileSync(`${__dirname}/${filePath}`, content);
}

function parseLinks(ntriplesFilePath) {
  return readFileFromCurrentDir(ntriplesFilePath).split('\n');
}

async function main() {
  const dbpediaIngredientsLinks = parseLinks(DBPEDIA_LINKS_PATH);
  const wikidataIngredientsLinks = parseLinks(WIKIDATA_LINKS_PATH);

  const {
    dbpediaIngredients,
    wikidataIngredients,
    mergedMap,
    mergedJsonlds,
  } = await fetchIngredientsFromExternalDatasets(
    dbpediaIngredientsLinks,
    wikidataIngredientsLinks,
  );

  writeFileFromCurrentDir(
    DBPEDIA_INGREDIENTS_PATH,
    JSON.stringify(dbpediaIngredients, null, 2),
  );

  writeFileFromCurrentDir(
    WIKIDATA_INGREDIENTS_PATH,
    JSON.stringify(wikidataIngredients, null, 2),
  );

  writeFileFromCurrentDir(MERGED_MAP_PATH, JSON.stringify(mergedMap, null, 2));
  writeFileFromCurrentDir(JSONLD_INGRS_PATH, JSON.stringify(mergedJsonlds, null, 2));

  log.info(
    `Saved results to: ${[
      DBPEDIA_INGREDIENTS_PATH,
      WIKIDATA_INGREDIENTS_PATH,
      MERGED_MAP_PATH,
      JSONLD_INGRS_PATH,
    ].join(', ')}`,
  );
}

(async () => {
  await main();
})();
