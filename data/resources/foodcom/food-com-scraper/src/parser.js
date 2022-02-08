const ISODuration = require('iso8601-duration');

const { AMOUNT_UNIT, QUOTE, AMOUNT_REGEX } = require('./constants');

const { parse } = ISODuration;

const getStructuredRecipeInfo = (recipe) => {
    const recipeInfo = {
        time: getStructuredPrepTime(recipe),
        servings: parseServings(recipe),
        tags: getStructuredTags(recipe),
        rating: getStructuredRating(recipe),
        nutritionInfo: getStructuredNutritionInfo(recipe),
        ingredients: getStructuredIngredients(recipe),
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
            normalizedValue = normalizeText(value);
        } else if (Array.isArray(value)) {
            normalizedValue = value.map((val) => normalizeObject(val));
        } else if (value !== null && typeof value === 'object') {
            normalizedValue = normalizeObject(value);
        }

        normalizedObject[key] = normalizedValue;
    });

    return normalizedObject;
};

const normalizeText = (text) => {
    const normalized = text.normalize();
    const quotesEscaped = normalized.replaceAll(QUOTE.ESCAPE, QUOTE.CHAR).trim();

    return quotesEscaped.replace(/[ \t]+/g, ' ');
};

const getParsedDuration = (duration) => {
    if (!duration) return null;

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
    const cooking = cookTime ? getParsedDuration(cookTime) : null;
    const preparation = prepTime ? getParsedDuration(prepTime) : null;
    const total = totalTime ? getParsedDuration(totalTime) : null;

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

const getStructuredRating = ({ aggregateRating }) => {
    const { ratingValue, reviewCount } = aggregateRating;

    const rating = {
        value: parseFloat(ratingValue),
        reviews: parseInt(reviewCount, 10),
    };

    return rating;
};

const parseServings = ({ recipeYield }) => {
    return parseQuantity(recipeYield);
};

const parseQuantity = (ingredient) => {
    const amountMatches = ingredient.match(AMOUNT_REGEX);

    if (!amountMatches || !amountMatches.length || !amountMatches[0]) {
        return null;
    }

    return amountMatches[0].replaceAll(' -', '-').trim();
};

const parseIngredientText = (ingredient) => {
    return ingredient.replace(AMOUNT_REGEX, '').trim();
};

const getStructuredIngredients = ({ recipeIngredient }) => {
    const structuredIngredients = recipeIngredient.map((ingredient) => {
        const amount = parseQuantity(ingredient);
        const text = parseIngredientText(ingredient);

        return { amount, text };
    });

    return structuredIngredients;
};

module.exports = {
    normalizeObject,
    getStructuredRecipeInfo,
};
