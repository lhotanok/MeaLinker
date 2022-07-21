const {
  IRI_DEREFERENCE_REGEX,
  SAME_AS_CONTEXT,
  INGREDIENT_IRI_PREFIX,
} = require('./constants');
const { DBPEDIA_INGREDIENT_TYPE } = require('./dbpedia/constants');
const { fetchDBpediaIngredients } = require('./dbpedia/ingredients-linker');
const { fetchWikidataIngredients } = require('./wikidata/ingredients-linker');

function mapIdsToIris(links) {
  const idToIriMap = {};

  links.forEach((link) => {
    const triple = link.split(' ');
    if (triple.length >= 3) {
      const ingredientIri = triple[0];
      const dbpediaIri = triple[2];

      const ingredientId = ingredientIri
        .replace(INGREDIENT_IRI_PREFIX, '')
        .replace(IRI_DEREFERENCE_REGEX, '');

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

  const foodDbpediaMap = mapIdsToIris(dbpediaIngredientsLinks);
  const foodWikidataMap = mapIdsToIris(wikidataIngredientsLinks);

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

function getDbpediaWikidataEntities(dbpediaMap, wikidataMap, jsonlds) {
  let wikidataEntity = wikidataMap[jsonlds[0]] || null;
  let dbpediaEntity = dbpediaMap[jsonlds[1]] || null;

  // Handle faulty labels such as Beere label of Berry, matched for Beer incorrectly
  if (dbpediaEntity) {
    if (
      !wikidataEntity ||
      !wikidataEntity.label ||
      wikidataEntity.label['@value'].length > dbpediaEntity.label['@value'].length
    ) {
      wikidataEntity = null;
    }
  }

  const mergedContext = {
    ...((dbpediaEntity || {})['@context'] || {}),
    ...((wikidataEntity || {})['@context'] || {}),
  };

  return {
    dbpediaEntity,
    wikidataEntity,
    mergedContext,
  };
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
      const { wikidataEntity, dbpediaEntity, mergedContext } = getDbpediaWikidataEntities(
        dbpediaMap,
        wikidataMap,
        jsonlds,
      );

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

async function fetchIngredientsFromExternalDatasets(
  dbpediaIngredientsLinks,
  wikidataIngredientsLinks,
) {
  const dbpediaIngredients = await fetchDBpediaIngredients(dbpediaIngredientsLinks);
  const wikidataIngredients = await fetchWikidataIngredients(wikidataIngredientsLinks);

  const mergedMap = mergeExternalDatasetEntitites(
    dbpediaIngredientsLinks,
    wikidataIngredientsLinks,
  );

  const mergedJsonlds = mergeJsonlds(mergedMap, dbpediaIngredients, wikidataIngredients);

  return {
    dbpediaIngredients,
    wikidataIngredients,
    mergedMap,
    mergedJsonlds,
  };
}

module.exports = {
  fetchIngredientsFromExternalDatasets,
};
