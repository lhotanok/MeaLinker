const Apify = require('apify');
const cheerio = require('cheerio');
const uuid = require('uuid');

const { NAMESPACE_UUID, JSON_LD_SELECTOR } = require('./constants');
const { normalizeObject, getStructuredRecipeInfo } = require('./parser');

const { utils: { log } } = Apify;

/**
 *
 * @param {Apify.CheerioHandlePageInputs} context
 * @param {any[]} recipes
 */
exports.handleDetail = async (context, recipes) => {
    const { request: { url } } = context;

    const $ = cheerio.load(context.$.html(), {
        decodeEntities: false,
    });

    const jsonldText = $(JSON_LD_SELECTOR)[0].children[0].data.normalize();
    const recipeJsonLd = JSON.parse(jsonldText);

    const normalizedJsonld = normalizeObject(recipeJsonLd);

    const identifier = uuid.v5(normalizedJsonld.name, NAMESPACE_UUID);

    const recipe = {
        jsonld: {
            ...normalizedJsonld,
            url,
            identifier,
        },
        structured: {
            foodComId: getRecipeId(url),
            ...getStructuredRecipeInfo(normalizedJsonld),
        },
    };

    recipes.push(recipe);

    log.info(`Saved ${recipes.length} recipes in jsonld format into dataset`);
    // log.info(`jsonld: ${JSON.stringify(recipe, null, 2)}`);
};

const getRecipeId = (url) => {
    const urlSplits = url.split('/');
    return urlSplits[urlSplits.length - 1];
};
