const fs = require('fs');
const log4js = require('log4js');
const log = log4js.getLogger('Food.com RDF dataset linker');
log.level = 'debug';

const {
  DBPEDIA_LINKS_PATH,
  DBPEDIA_INGREDIENTS_PATH,
  WIKIDATA_LINKS_PATH,
  WIKIDATA_INGREDIENTS_PATH,
  NON_DIGIT_REGEX,
  IRI_DEREFERENCE_REGEX,
  SAME_AS_CONTEXT,
  JSONLD_INGRS_PATH,
} = require('./constants');
const { fetchDBpediaIngredients } = require('../../dbpedia/ingredients-linker');
const { FILE_ENCODING } = require('../../../constants');
const { fetchWikidataIngredients } = require('../../wikidata/ingredients-linker');
const { DBPEDIA_INGREDIENT_TYPE } = require('../../dbpedia/constants');

function readFileFromCurrentDir(filePath) {
  return fs.readFileSync(`${__dirname}/${filePath}`, FILE_ENCODING);
}

function writeFileFromCurrentDir(filePath, content) {
  return fs.writeFileSync(`${__dirname}/${filePath}`, content);
}

function parseLinks(ntriplesFilePath) {
  return readFileFromCurrentDir(ntriplesFilePath).split('\n');
}

function mapFoodComIdsToIris(links) {
  const idToIriMap = {};

  links.forEach((link) => {
    const triple = link.split(' ');
    if (triple.length >= 3) {
      const foodIri = triple[0];
      const dbpediaIri = triple[2];

      const ingredientId = foodIri.replace(NON_DIGIT_REGEX, '');
      const dereferencedIri = dbpediaIri.replace(IRI_DEREFERENCE_REGEX, '');

      idToIriMap[ingredientId] = dereferencedIri;
    }
  });

  return idToIriMap;
}

function mergeExternalDatasetEntitites(
  dbpediaIngredientsLinks,
  wikidataIngredientsLinks,
) {
  const mergedMap = {};

  const foodDbpediaMap = mapFoodComIdsToIris(dbpediaIngredientsLinks);
  const foodWikidataMap = mapFoodComIdsToIris(wikidataIngredientsLinks);

  const insertEntities = (firstDataset, secondDataset) => {
    Object.keys(firstDataset).forEach((key) => {
      mergedMap[key] = [firstDataset[key]];

      if (secondDataset[key]) {
        mergedMap[key].push(secondDataset[key]);
      }
    });
  };

  insertEntities(foodDbpediaMap, foodWikidataMap);
  insertEntities(foodWikidataMap, foodDbpediaMap);

  return mergedMap;
}

function buildDatasetMap(ingredients) {
  const map = {};

  ingredients.forEach((ingredient) => {
    const iri = ingredient['@id'];
    map[iri] = ingredient;
  });

  return map;
}

function mergeJsonlds(mergedMap, dbpediaIngredients, wikidataIngredients) {
  const mergedJsonlds = {};
  const dbpediaMap = buildDatasetMap(dbpediaIngredients);
  const wikidataMap = buildDatasetMap(wikidataIngredients);

  Object.entries(mergedMap).forEach(([foodComId, jsonlds]) => {
    if (jsonlds.length === 1) {
      const entity = jsonlds[0].includes('dbpedia')
        ? dbpediaMap[jsonlds[0]]
        : wikidataMap[jsonlds[0]];

      if (entity) {
        mergedJsonlds[foodComId] = { '@type': DBPEDIA_INGREDIENT_TYPE, ...entity };
      }
    } else {
      let wikidataEntity = wikidataMap[jsonlds[0]] || null;
      let dbpediaEntity = dbpediaMap[jsonlds[1]] || null;

      // Handle faulty labels such as Beere label of Berry, matched for Beer incorrectly
      if (
        !wikidataEntity ||
        !wikidataEntity.label ||
        wikidataEntity.label['@value'].length > dbpediaEntity.label['@value'].length
      ) {
        wikidataEntity = null;
      }

      const mergedContext = {
        ...((dbpediaEntity || {})['@context'] || {}),
        ...((wikidataEntity || {})['@context'] || {}),
      };

      const mergedIngredient = {
        ...wikidataEntity,
        ...dbpediaEntity,
        '@context':
          dbpediaEntity && wikidataEntity
            ? { ...mergedContext, ...SAME_AS_CONTEXT }
            : mergedContext,
      };

      if (dbpediaEntity && wikidataEntity) {
        mergedIngredient.sameAs = jsonlds[0];
      } else if (wikidataEntity) {
        mergedIngredient.sameAs = jsonlds[1];
      }

      mergedJsonlds[foodComId] = mergedIngredient;
    }
  });

  return mergedJsonlds;
}

async function main() {
  const dbpediaIngredientsLinks = parseLinks(DBPEDIA_LINKS_PATH);
  const wikidataIngredientsLinks = parseLinks(WIKIDATA_LINKS_PATH);

  const dbpediaIngredients = await fetchDBpediaIngredients(dbpediaIngredientsLinks);
  const wikidataIngredients = await fetchWikidataIngredients(wikidataIngredientsLinks);

  const mergedMap = mergeExternalDatasetEntitites(
    dbpediaIngredientsLinks,
    wikidataIngredientsLinks,
  );

  // const dbpediaIngredients = JSON.parse(readFileFromCurrentDir(DBPEDIA_INGREDIENTS_PATH));
  // const wikidataIngredients = JSON.parse(
  //   readFileFromCurrentDir(WIKIDATA_INGREDIENTS_PATH),
  // );

  const mergedJsonlds = mergeJsonlds(mergedMap, dbpediaIngredients, wikidataIngredients);

  writeFileFromCurrentDir(
    DBPEDIA_INGREDIENTS_PATH,
    JSON.stringify(dbpediaIngredients, null, 2),
  );

  writeFileFromCurrentDir(
    WIKIDATA_INGREDIENTS_PATH,
    JSON.stringify(wikidataIngredients, null, 2),
  );

  writeFileFromCurrentDir('merged-map.json', JSON.stringify(mergedMap, null, 2));
  writeFileFromCurrentDir(JSONLD_INGRS_PATH, JSON.stringify(mergedJsonlds, null, 2));
}

(async () => {
  await main();
})();
