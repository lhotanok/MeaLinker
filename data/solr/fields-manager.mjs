import got from 'got';
import pkg from 'log4js';
import { SOLR_RECIPES_SCHEMA } from './config.js';

import { FIELD_TYPES } from './constants.js';

const { getLogger } = pkg;
const log = getLogger('Solr document fields manager');
log.level = 'debug';

function createAddField({
  name,
  type = FIELD_TYPES.TEXT,
  indexed = true,
  multiValued = false,
  stored = true,
}) {
  return {
    name,
    type,
    stored,
    indexed,
    multiValued,
  };
}

async function postAddFields(addFields, schemaUrl, fieldCategory = 'add-field') {
  log.info(`Posting new Add Fields if any...`, { schemaUrl });

  const fieldNames = Object.keys(addFields);

  for (const name of fieldNames) {
    try {
      const result = await got
        .post(schemaUrl, {
          json: {
            [fieldCategory]: createAddField({
              name,
              ...addFields[name],
            }),
          },
        })
        .json();

      log.info(`${name} Add Field response: ${JSON.stringify(result, null, 2)}`);
    } catch (e) {
      log.info(`Add Field '${name}' was already added`);
    }
  }

  log.info(`Add Fields posted`, { schemaUrl });
}

async function postCopyFields(copyFields, schemaUrl) {
  log.info(`Posting new Copy Fields if any...`, { schemaUrl });

  const fieldSources = Object.keys(copyFields);

  for (const source of fieldSources) {
    try {
      const result = await got
        .post(schemaUrl, {
          json: {
            'add-copy-field': {
              source,
              dest: copyFields[source],
            },
          },
        })
        .json();

      log.info(`${source} Copy Field response: ${JSON.stringify(result, null, 2)}`);
    } catch (e) {
      log.info(`Copy fields for '${source}' were already added`);
    }
  }

  log.info(`Copy fields posted`, { schemaUrl });
}

async function postRecipesAddFields() {
  const { INT, FLOAT, TEXT, STRING } = FIELD_TYPES;

  const addFields = {
    name: { type: TEXT },
    description: { type: TEXT },
    recipeCategory: { type: TEXT },
    ingredients: { multiValued: true },
    tags: { multiValued: true },
    rating: { type: FLOAT },
    reviewsCount: { type: INT },
    stepsCount: { type: INT },
    cookMinutes: { type: INT },
    prepMinutes: { type: INT },
    totalMinutes: { type: INT },
    image: { type: STRING },
    date: { type: STRING },
    calories: { type: INT },
    fat: { type: FLOAT },
    saturatedFat: { type: FLOAT },
    cholesterol: { type: FLOAT },
    sodium: { type: FLOAT },
    carbohydrate: { type: FLOAT },
    fiber: { type: FLOAT },
    sugar: { type: FLOAT },
    protein: { type: FLOAT },
  };

  const facetFields = {
    _recipeCategoryFacet: { type: STRING, stored: false },
    _ingredientsFacet: { type: STRING, multiValued: true, stored: false },
  };

  const copyFields = {
    recipeCategory: ['_recipeCategoryFacet'],
  };

  await postAddFields(addFields, SOLR_RECIPES_SCHEMA);
  await postAddFields(facetFields, SOLR_RECIPES_SCHEMA);
  await postCopyFields(copyFields, SOLR_RECIPES_SCHEMA);
}

async function main() {
  await postRecipesAddFields();
}

(async () => {
  await main();
})();
