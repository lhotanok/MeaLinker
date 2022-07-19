const log4js = require('log4js');
const { INGREDIENTS_SECTION_REGEX } = require('./constants');
const log = log4js.getLogger('SPARQL request builder');
log.level = 'debug';

function createIngredientGroups(resources, groupSize) {
  const groups = [];

  let groupNumber = 0;

  while (groupNumber * groupSize < resources.length) {
    const startIndex = groupNumber * groupSize;
    const endIndex = startIndex + groupSize;

    const group = resources.slice(startIndex, endIndex);
    groups.push(group);

    groupNumber++;
  }

  return groups;
}

function getIngredientIris(ingredientLinks) {
  const ingredientIris = [];

  ingredientLinks.forEach((link) => {
    const triple = link.split(' ');
    if (triple.length >= 3) {
      const dbpediaIri = triple[2];
      ingredientIris.push(dbpediaIri);
    }
  });

  log.info(`Found ${ingredientIris.length} ingredient IRIs`);
  return ingredientIris;
}

function buildIngredientsFetchRequests(
  ingredientLinks,
  sparqlQuery,
  requestQueryPrefix,
  groupSize,
) {
  const fetchRequests = [];

  const resources = getIngredientIris(ingredientLinks);

  const ingredientGroups = createIngredientGroups(resources, groupSize);
  log.info(`Created ${ingredientGroups.length} ingredient groups`);

  for (const group of ingredientGroups) {
    const joinedIngredients = group.join(' ');

    const injectedIngredientsQuery = sparqlQuery.replace(
      INGREDIENTS_SECTION_REGEX,
      joinedIngredients,
    );

    const encodedQuery = encodeURIComponent(injectedIngredientsQuery);
    const fetchRequest = `${requestQueryPrefix}${encodedQuery}`;

    fetchRequests.push(fetchRequest);
  }

  log.info(`Created ${fetchRequests.length} fetch requests`);
  return fetchRequests;
}

module.exports = {
  buildIngredientsFetchRequests,
};
