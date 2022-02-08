const fs = require('fs');
const Apify = require('apify')

const { FILE_ENCODING } = require('../constants');
const {
    IRI_DEREFERENCE_REGEX,
    FOOD_DBPEDIA_INGREDIENTS_PATH,
    DBPEDIA_RESOURCE_PREFIX,
    INGREDIENTS_SECTION_REGEX,
    DBPEDIA_INGREDIENTS_QUERY,
    DBPEDIA_SPARQL_QUERY_PREFIX,
    DBPEDIA_JSONLD_QUERY_PARAM,
    INGREDIENTS_GROUP_SIZE,
    DBPEDIA_INGREDIENTS_PATH,
    CONTEXT_KEY_DATATYPE_REGEX
} = require('./constants');

function readSameDirFile(filename) {
    const filePath = `${__dirname}/${filename}`
    return fs.readFileSync(filePath, FILE_ENCODING)
}

function getDbpediaIngredientIris() {
    const ingredientIris = [];

    const ingredientLinks = readSameDirFile(FOOD_DBPEDIA_INGREDIENTS_PATH);
    const lines = ingredientLinks.split('\n');

    lines.forEach((line) => {
        const lineSplits = line.split(' ');
        if (lineSplits.length >= 3) {
            const dbpediaIri = lineSplits[2];
            ingredientIris.push(dbpediaIri);
        }
    })

    console.log(`Found ${ingredientIris.length} ingredient IRIs`);
    return ingredientIris;
}

function createPrefixedDbpediaResources(iris, prefix = DBPEDIA_RESOURCE_PREFIX) {
    return iris.map((iri) => {
        const dereferencedIri = iri.replace(IRI_DEREFERENCE_REGEX, '');
        const iriSplits = dereferencedIri.split('/');
        const resourceName = iriSplits[iriSplits.length - 1];

        return `${prefix}${resourceName}`;
    });
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

    const sparqlQuery = readSameDirFile(DBPEDIA_INGREDIENTS_QUERY);

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
        try {
            const { body } = await Apify.utils.requestAsBrowser({ url: request });
            const jsonld = JSON.parse(body);

            if (jsonld['@graph']) {
                ingredients.push(jsonld);
                console.log(`Fetched ${jsonld['@graph'].length} ingredients`);
            } 
        } catch (e) {
            throw new Error(e);
        }
    }

    return ingredients;
}

function buildCommonContext(jsonlds) {
    const context = {};

    jsonlds.forEach((jsonld) => {
        const currentContext = jsonld['@context'];
        Object.keys(currentContext).forEach((key) => {
            if (!context[key]) {
                context[key] = currentContext[key];
            }
        })
    })

    return context;
}

function mergeGraphs(jsonlds) {
    const graph = [];

    jsonlds.forEach((jsonld) => {
        const currentGraph = jsonld['@graph'];
        graph.push(...currentGraph);
    })

    console.log(`Fetched ${graph.length} DBpedia ingredients in total`);

    return graph;
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
        '@type': commonContext.ingredient['@id'],
        ...normalizedIngredient,
    }
}

function mergeIngredients(commonContext, mergedGraph) {
    const mergedIngredients = [];

    mergedGraph.forEach((ingredient) => {
        const mergedIngredient = {
            jsonld: mergeIngredientWithContext(ingredient, commonContext),
        };

        mergedIngredients.push(mergedIngredient);
    });

    return mergedIngredients;
}

async function main() {
    const ingredientIris = getDbpediaIngredientIris();

    // fails for cases such as dbr:Lime_(fruit)
    // const prefixedResources = createPrefixedDbpediaResources(ingredientIris);
    
    const fetchRequests = buildDbpediaIngredientsFetchRequests(ingredientIris);
    const ingredients = await fetchDbpediaIngredients(fetchRequests);
    
    const commonContext = buildCommonContext(ingredients);
    const mergedGraph = mergeGraphs(ingredients);

    const mergedIngredients = mergeIngredients(commonContext, mergedGraph);
    fs.writeFileSync(DBPEDIA_INGREDIENTS_PATH, JSON.stringify(mergedIngredients, null, 2));
}

(async () => {
    await main();
})();