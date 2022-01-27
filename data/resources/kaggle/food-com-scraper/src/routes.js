const Apify = require('apify');
const cheerio = require('cheerio');
const uuid = require('uuid');

const { normalizeObject, getStructuredRecipeInfo } = require('./parser');

const { utils: { log } } = Apify;

exports.handleDetail = async (context, recipes) => {
    const { request: { url } } = context;

    const identifier = uuid.v1();

    const JSON_LD_SELECTOR = 'script[type="application/ld+json"]';

    const $ = cheerio.load(context.$.html(), {
        decodeEntities: false,
    });

    const jsonldText = $(JSON_LD_SELECTOR)[0].children[0].data.normalize();
    const recipeJsonLd = JSON.parse(jsonldText);

    const normalizedJsonld = normalizeObject(recipeJsonLd);

    const recipe = {
        jsonld: {
            ...normalizedJsonld,
            url,
            identifier,
        },
        structured: getStructuredRecipeInfo(normalizedJsonld),
    };

    recipes.push(recipe);

    log.info(`Saved ${recipes.length} recipes in jsonld format into dataset`);
    log.info(`jsonld: ${JSON.stringify(recipe, null, 2)}`);
};
