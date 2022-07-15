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
    CATEGORIES_SELECTOR,
    LABELS,
    DETAIL_SELECTOR,
    SERVINGS_SELECTOR,
    SERVINGS_ATTRIBUTE,
    EXPANDED_DETAIL_SELECTOR,
    INGR_AMOUNT_VALUE_ATTRIBUTE,
    REAL_INGR_TEXT_SELECTOR,
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

    const recipeJsonLd = parseRecipeJsonld(context);

    if (!recipeJsonLd) {
        return;
    }

    const identifier = uuid.v5(url, NAMESPACE_UUID);

    const recipe = {
        jsonld: {
            ...recipeJsonLd,
            url,
            identifier,
            image: recipeJsonLd.image.url || null,
        },
        structured: {
            ...getStructuredRecipeInfo(recipeJsonLd),
            servings: getServings(context.$),
            ingredients: getIngredients(context.$),
        },
    };

    if (recipe.structured.nutritionInfo) {
        // save only recipes with nutrition info
        recipes.push(recipe);

        log.info(`Saved ${recipes.length} recipes in jsonld format into dataset`);
    }
};

/**
 *
 * @param {Apify.CheerioHandlePageInputs} context
 */
exports.handleList = async (context) => {
    const { $, request, crawler: { requestQueue } } = context;

    const url = new URL(request.url);
    if (!url.searchParams.get('page')) {
        // we're on the start page (/recipes)
        await enqueueCategories(context);
    } else {
        const isLastPage = $('h1').text().trim()
            .toLowerCase()
            .includes('page not found');

        if (!isLastPage) {
            await enqueueNextPage(requestQueue, url);
            await enqueueRecipeDetails(context);
        }
    }
};

const parseRecipeJsonld = (context) => {
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

    return recipeJsonLd;
};

/**
 *
 * @param {Apify.CheerioHandlePageInputs} context
 */
const enqueueCategories = async (context) => {
    const { $, crawler: { requestQueue } } = context;

    const categoryUrls = $(CATEGORIES_SELECTOR)
        .map((_i, el) => $(el).attr('href'))
        .toArray();

    for (const categoryUrl of categoryUrls) {
        const url = new URL(categoryUrl);
        url.searchParams.set('page', '1');

        await requestQueue.addRequest({
            url: url.toString(),
            userData: {
                label: LABELS.LIST,
            },
        });
    }
};

/**
 *
 * @param {Apify.RequestQueue} requestQueue
 * @param {URL} url
 */
const enqueueNextPage = async (requestQueue, url) => {
    const nextPage = Number(url.searchParams.get('page')) + 1;

    const nextUrl = new URL(url.toString());
    nextUrl.searchParams.set('page', nextPage);

    await requestQueue.addRequest({
        url: nextUrl.toString(),
        userData: {
            label: LABELS.LIST,
        },
    });
};

/**
 *
 * @param {Apify.CheerioHandlePageInputs} context
 */
const enqueueRecipeDetails = async (context) => {
    const { $, crawler: { requestQueue } } = context;

    const detailElements = $(DETAIL_SELECTOR).length > 0
        ? $(DETAIL_SELECTOR)
        : $(EXPANDED_DETAIL_SELECTOR);

    const recipeUrls = $(detailElements)
        .map((_i, el) => $(el).attr('href'))
        .toArray()
        .filter((url) => url.includes('/recipe/'));

    for (const recipeUrl of recipeUrls) {
        const url = new URL(recipeUrl, 'https://www.allrecipes.com').toString();

        await requestQueue.addRequest({
            url,
            userData: {
                label: LABELS.DETAIL,
            },
        }, { forefront: true });
    }
};

const getIngredients = ($) => {
    const ingredients = $(INGREDIENT_SELECTOR).map((_i, el) => {
        const amount = $(el).attr(INGR_AMOUNT_ATTRIBUTE) || null;
        const amountValue = Number($(el).attr(INGR_AMOUNT_VALUE_ATTRIBUTE)) || null;
        const unit = $(el).attr(INGR_UNIT_ATTRIBUTE) || null;
        const category = $(el).attr(INGR_CATEGORY_ATTRIBUTE) || null;

        let text = $(el).attr(INGR_TEXT_ATTRIBUTE).trim() || null;
        let searchValue = $(el).attr(SEARCH_INGREDIENT_ATTRIBUTE).trim() || null;

        const actualText = $(el).parent()
            .find(REAL_INGR_TEXT_SELECTOR)
            .text()
            .trim();

        if (actualText.includes(searchValue)) {
            // attributes are swapped
            [text, searchValue] = [searchValue, text];
        }

        return { amount, amountValue, unit, text, searchValue, category };
    }).toArray();

    return ingredients;
};

const getServings = ($) => {
    const servings = $(SERVINGS_SELECTOR).attr(SERVINGS_ATTRIBUTE) || null;
    return servings;
};
