import got from 'got';
import pkg from 'log4js';
import { SOLR_RECIPES_SCHEMA, SOLR_INGREDIENTS_SCHEMA } from './config.js';

import { FIELD_TYPES } from './constants.js';

const { getLogger } = pkg;
const log = getLogger('Solr document fields manager');
log.level = 'debug';

function createAddField({
    name,
    type = FIELD_TYPES.TEXT,
    indexed = true,
    multiValued = false,
}) {
    return {
        name,
        type,
        stored: true,
        indexed,
        multiValued,
    };
}

async function postAddFields(addFields, schemaUrl) {
    log.info(`Posting new Add Fields to if any...`, { schemaUrl });

    const fieldNames = Object.keys(addFields);

    for (const name of fieldNames) {
        try {
            const result = await got
                .post(schemaUrl, {
                    json: {
                        'add-field': createAddField({
                            name,
                            ...addFields[name],
                        }),
                    },
                })
                .json();

            log.info(
                `${name} Add Field response: ${JSON.stringify(
                    result,
                    null,
                    2,
                )}`,
            );
        } catch (e) {
            // field has already been added
        }
    }

    log.info(`Add Fields posted`, { schemaUrl });
}

async function postRecipesAddFields() {
    const { INT, FLOAT, STRING } = FIELD_TYPES;

    const addFields = {
        name: {},
        description: {},
        recipeCategory: {},
        ingredients: { multiValued: true },
        tags: { multiValued: true },
        rating: { type: FLOAT },
        stepsCount: { type: INT },
        cookMinutes: { type: INT },
        prepMinutes: { type: INT },
        totalMinutes: { type: INT },
        image: { type: STRING },
        date: { type: STRING },
        calories: { type: INT },
        saturatedFat: { type: FLOAT },
        cholesterol: { type: FLOAT },
        sodium: { type: FLOAT },
        carbohydrate: { type: FLOAT },
        fiber: { type: FLOAT },
        sugar: { type: FLOAT },
        protein: { type: FLOAT },
    };

    await postAddFields(addFields, SOLR_RECIPES_SCHEMA);
}

async function postIngredientsAddFields() {
    const { STRING } = FIELD_TYPES;

    const addFields = {
        label: {},
        thumbnail: { type: STRING, indexed: false },
    };

    await postAddFields(addFields, SOLR_INGREDIENTS_SCHEMA);
}

async function main() {
    await postRecipesAddFields();
    await postIngredientsAddFields();
}

(async () => {
    await main();
})();
