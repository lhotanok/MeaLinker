const ISODuration = require('iso8601-duration');

const { AMOUNT_UNIT } = require('./consts');

const { parse } = ISODuration;

const getStructuredRecipeInfo = (recipe) => {
    const recipeInfo = {
        time: getStructuredPrepTime(recipe),
        tags: getStructuredTags(recipe),
        nutritionInfo: getStructuredNutritionInfo(recipe),
    };

    return recipeInfo;
};

const normalizeObject = (object) => {
    if (typeof object === 'string') {
        return normalizeText(object);
    }

    const normalizedObject = {};

    Object.keys(object).forEach((key) => {
        const value = object[key];
        let normalizedValue = object[key];

        if (typeof value === 'string') {
            // log.info(`Normalizing string...`);
            normalizedValue = normalizeText(value);
        } else if (Array.isArray(value)) {
            // log.info(`Normalizing array...`);
            normalizedValue = value.map((val) => normalizeObject(val));
        } else if (value !== null && typeof value === 'object') {
            // log.info(`Normalizing object...`);
            normalizedValue = normalizeObject(value);
        }

        normalizedObject[key] = normalizedValue;
    });

    return normalizedObject;
};

const normalizeText = (text) => {
    const QUOTE = {
        ESCAPE: '&quot;',
        CHAR: '"',
    };

    const normalized = text.normalize();
    const quotesEscaped = normalized.replaceAll(QUOTE.ESCAPE, QUOTE.CHAR).trim();

    return quotesEscaped.replace(/[ \t]+/g, ' ');
};

const getParsedDuration = (duration) => {
    const parsedDuration = parse(duration);
    const filteredDuration = {};

    Object.keys(parsedDuration).forEach((key) => {
        const value = parsedDuration[key];

        if (value) {
            filteredDuration[key] = value;
        }
    });

    return filteredDuration;
};

const getStructuredPrepTime = ({ cookTime, prepTime, totalTime }) => {
    const cooking = cookTime ? getParsedDuration(cookTime) : cookTime;
    const preparation = prepTime ? getParsedDuration(prepTime) : prepTime;
    const total = totalTime ? getParsedDuration(totalTime) : totalTime;

    const time = { cooking, preparation, total };

    return time;
};

const getStructuredTags = ({ keywords }) => {
    return keywords.split(',');
};

const parseFloatValue = (textValue, unit) => {
    return {
        value: parseFloat(textValue),
        unit,
    };
};

const getStructuredNutritionInfo = ({ nutrition }) => {
    const {
        calories,
        fatContent,
        saturatedFatContent,
        cholesterolContent,
        sodiumContent,
        carbohydrateContent,
        fiberContent,
        sugarContent,
        proteinContent,
    } = nutrition;

    const structuredNutrition = {
        calories: parseFloatValue(calories, null),
        fat: parseFloatValue(fatContent, AMOUNT_UNIT.GRAMS),
        saturatedFat: parseFloatValue(saturatedFatContent, AMOUNT_UNIT.GRAMS),
        cholesterol: parseFloatValue(cholesterolContent, AMOUNT_UNIT.MILLIGRAMS),
        sodium: parseFloatValue(sodiumContent, AMOUNT_UNIT.MILLIGRAMS),
        carbohydrate: parseFloatValue(carbohydrateContent, AMOUNT_UNIT.GRAMS),
        fiber: parseFloatValue(fiberContent, AMOUNT_UNIT.GRAMS),
        sugar: parseFloatValue(sugarContent, AMOUNT_UNIT.GRAMS),
        protein: parseFloatValue(proteinContent, AMOUNT_UNIT.GRAMS),
    };

    return structuredNutrition;
};

module.exports = {
    normalizeObject,
    getStructuredRecipeInfo,
};
