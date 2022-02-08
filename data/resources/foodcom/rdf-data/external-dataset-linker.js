const fs = require('fs');
const Apify = require('apify')

const { FILE_ENCODING } = require('../constants');
const {
    FOOD_DBPEDIA_INGREDIENTS_PATH,
    INGREDIENTS_SECTION_REGEX,
    DBPEDIA_INGREDIENTS_QUERY,
    DBPEDIA_SPARQL_QUERY_PREFIX,
    DBPEDIA_JSONLD_QUERY_PARAM,
    INGREDIENTS_GROUP_SIZE,
    DBPEDIA_INGREDIENTS_PATH,
    CONTEXT_KEY_DATATYPE_REGEX,
    DBPEDIA_INGREDIENT_TYPE
} = require('./constants');

function readFileFromCurrentDir(filePath) {
    return fs.readFileSync(`${__dirname}/${filePath}`, FILE_ENCODING);
}

function writeFileFromCurrentDir(filePath, content) {
    return fs.writeFileSync(`${__dirname}/${filePath}`, content);
}

function getDbpediaIngredientIris() {
    const ingredientIris = [];

    const ingredientLinks = readFileFromCurrentDir(FOOD_DBPEDIA_INGREDIENTS_PATH).split('\n');

    ingredientLinks.forEach((link) => {
        const triple = link.split(' ');
        if (triple.length >= 3) {
            const dbpediaIri = triple[2];
            ingredientIris.push(dbpediaIri);
        }
    })

    console.log(`Found ${ingredientIris.length} ingredient IRIs`);
    return ingredientIris;
}

function createIngredientGroups(resources) {
    const groups = [];

    let groupNumber = 0;

    while (groupNumber * INGREDIENTS_GROUP_SIZE < resources.length) {
        const startIndex = groupNumber * INGREDIENTS_GROUP_SIZE;
        const endIndex = startIndex + INGREDIENTS_GROUP_SIZE;

        const group = resources.slice(startIndex, endIndex);
        groups.push(group);

        groupNumber++;
    }

    return groups;
}

function buildDbpediaIngredientsFetchRequests(resources) {
    const fetchRequests = [];

    const ingredientGroups = createIngredientGroups(resources);
    console.log(`Created ${ingredientGroups.length} ingredient groups`);

    const sparqlQuery = readFileFromCurrentDir(DBPEDIA_INGREDIENTS_QUERY);

    for (const group of ingredientGroups) {
        const joinedIngredients = group.join(' ');

        const injectedIngredientsQuery = sparqlQuery.replace(INGREDIENTS_SECTION_REGEX, joinedIngredients);
        const encodedQuery = encodeURIComponent(injectedIngredientsQuery);
        const fetchRequest = `${DBPEDIA_SPARQL_QUERY_PREFIX}${encodedQuery}&${DBPEDIA_JSONLD_QUERY_PARAM}`;

        fetchRequests.push(fetchRequest);
    }

    console.log(`Created ${fetchRequests.length} fetch requests`);
    return fetchRequests;
}

async function fetchDbpediaIngredients(fetchRequests) {
    const ingredients = [];

    console.log('Fetching ingredients from DBpedia sparql endpoint...');

    for (const request of fetchRequests) {
        const { body } = await Apify.utils.requestAsBrowser({ url: request });
        const jsonld = JSON.parse(body);

        const jsonldIngredients = jsonld['@graph'];
        console.log(`Fetched ${jsonldIngredients.length} ingredients`);

        if (jsonldIngredients) {
            const commonContext = jsonld['@context'];

            const mergedIngredients = jsonldIngredients.map((ingredient) => mergeIngredientWithContext(ingredient, commonContext));
            ingredients.push(...mergedIngredients);
        } 
    }

    console.log(`Fetched ${ingredients.length} DBpedia ingredients in total`);

    return ingredients;
}

function renameContextKeys(object) {
    const normalizedObject = {};

    Object.keys(object).forEach((key) => {
        let normalizedKey = key.replace(CONTEXT_KEY_DATATYPE_REGEX, '');
        if (!normalizedKey) {
            normalizedKey = key;
        }
        
        normalizedObject[normalizedKey] = object[key];
    });

    return normalizedObject;
}

function mergeIngredientWithContext(ingredient, commonContext) {
    const currentContext = {};

    Object.keys(commonContext).forEach((key) => {
        if (ingredient[key]) {
            currentContext[key] = commonContext[key];
        }
    })

    const normalizedContext = renameContextKeys(currentContext);
    const normalizedIngredient = renameContextKeys(ingredient);

    return {
        '@context': normalizedContext,
        '@type': DBPEDIA_INGREDIENT_TYPE,
        ...normalizedIngredient,
    }
}

async function main() {
    const ingredientIris = getDbpediaIngredientIris();
    
    const fetchRequests = buildDbpediaIngredientsFetchRequests(ingredientIris);
    const ingredients = await fetchDbpediaIngredients(fetchRequests);

    writeFileFromCurrentDir(DBPEDIA_INGREDIENTS_PATH, JSON.stringify(ingredients, null, 2))
}

(async () => {
    await main();
})();