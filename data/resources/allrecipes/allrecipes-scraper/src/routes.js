const Apify = require('apify');
const uuid = require('uuid');
const cheerio = require('cheerio');

const {
    NAMESPACE_UUID,
    JSON_LD_SELECTOR,
    INGREDIENT_SELECTOR,
    INGR_AMOUNT_ATTRIBUTE,
    INGR_UNIT_ATTRIBUTE,
    INGR_TEXT_ATTRIBUTE,
    SEARCH_INGREDIENT_ATTRIBUTE,
    INGR_CATEGORY_ATTRIBUTE,
} = require('./constants');
const { getStructuredRecipeInfo } = require('./parser');

const { utils: { log } } = Apify;

/**
 *
 * @param {Apify.CheerioHandlePageInputs} context
 * @param {any[]} recipes
 */
exports.handleDetail = async (context, recipes) => {
    const { request: { url } } = context;

    let recipeJsonLd = null;

    const $ = cheerio.load(context.$.html(), {
        decodeEntities: false,
    });

    $(JSON_LD_SELECTOR).toArray().forEach((el) => {
        const jsonldText = el.children[0].data.normalize();
        const jsonldArray = JSON.parse(jsonldText);

        jsonldArray.forEach((item) => {
            if (item['@type'] === 'Recipe') {
                recipeJsonLd = item;
                recipeJsonLd.review = item.review[0] || []; // store 1 review only
                delete recipeJsonLd.video; // exclude video at this point
            }
        });
    });

    if (!recipeJsonLd) {
        return;
    }

    const identifier = uuid.v5(recipeJsonLd.name, NAMESPACE_UUID);

    const recipe = {
        jsonld: {
            ...recipeJsonLd,
            url,
            identifier,
            image: recipeJsonLd.image.url || null,
        },
        structured: {
            ...getStructuredRecipeInfo(recipeJsonLd),
            ingredients: getIngredients(context.$),
        },
    };

    recipes.push(recipe);

    log.info(`Saved ${recipes.length} recipes in jsonld format into dataset`);
};

const getIngredients = ($) => {
    const ingredients = $(INGREDIENT_SELECTOR).map((_i, el) => {
        const amount = Number($(el).attr(INGR_AMOUNT_ATTRIBUTE)) || null;
        const unit = $(el).attr(INGR_UNIT_ATTRIBUTE) || null;
        const text = $(el).attr(INGR_TEXT_ATTRIBUTE) || null;
        const searchValue = $(el).attr(SEARCH_INGREDIENT_ATTRIBUTE).trim() || null;
        const category = $(el).attr(INGR_CATEGORY_ATTRIBUTE) || null;

        return { amount, unit, text, searchValue, category };
    }).toArray();

    return ingredients;
};
