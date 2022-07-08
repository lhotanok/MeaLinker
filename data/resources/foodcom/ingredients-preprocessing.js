const fs = require('fs');
const uuid = require('uuid');
const csv = require('csvtojson');
const log4js = require('log4js');
const log = log4js.getLogger('Recipes-ingredients manager');
log.level = 'debug';

const {
  UNIQUE_INGR_WITH_IDS_PATH,
  INGR_MAP_PATH,
  SEARCH_INGREDIENT_TRUNCATE_REGEX,
  SEARCH_INGREDIENT_MAX_WORDS,
  SEARCH_INGREDIENTS_PATH,
  SEARCH_INGREDIENT_EXCLUDE_REGEX,
} = require('./constants');

const { NAMESPACE_UUID } = require('../../constants');

function writeFileFromCurrentDir(filePath, content) {
  return fs.writeFileSync(`${__dirname}/${filePath}`, content);
}

async function loadJsonFromCsv(csvFilePath) {
  const json = await csv().fromFile(`${__dirname}/${csvFilePath}`);
  return json;
}

function getUniqueIngredients(mappedIngredients) {
  const uniqueIngredients = {};

  mappedIngredients.forEach((ingredient) => {
    const { id, replaced } = ingredient;
    const name = replaced;
    const identifier = uuid.v5(name, NAMESPACE_UUID);

    uniqueIngredients[id] = {
      identifier,
      name,
    };
  });

  return uniqueIngredients;
}

function buildSearchIngredients(uniqueIngredients) {
  const searchIngredients = {};

  // eslint-disable-next-line no-unused-vars
  Object.entries(uniqueIngredients).forEach(([_foodcomId, { identifier, name }]) => {
    // Filter ingredients suitable for searching

    if ((!name.match(/[,.]/) && name[0].match(/[a-z]/gi)) || name === '7-up') {
      const truncatedName = name
        .replace(SEARCH_INGREDIENT_TRUNCATE_REGEX, '')
        .replaceAll('chily', 'chili')
        .trim();

      const words = truncatedName.split(' ');

      if (words.length <= SEARCH_INGREDIENT_MAX_WORDS) {
        if (!truncatedName.match(SEARCH_INGREDIENT_EXCLUDE_REGEX)) {
          if (!truncatedName.includes('condensed') || !truncatedName.includes('soup')) {
            const firstCapitalLetter = truncatedName[0].toUpperCase();

            const label = {
              '@value': firstCapitalLetter + truncatedName.slice(1),
              '@language': 'en',
            };

            searchIngredients[label['@value'].replaceAll(' ', '-')] = {
              identifier,
              label,
            };
          }
        }
      }
    }
  });

  return Object.values(searchIngredients);
}

async function main() {
  const mappedIngredients = await loadJsonFromCsv(INGR_MAP_PATH);

  const uniqueIngredients = getUniqueIngredients(mappedIngredients);
  const searchIngredients = buildSearchIngredients(uniqueIngredients);

  writeFileFromCurrentDir(
    UNIQUE_INGR_WITH_IDS_PATH,
    JSON.stringify(uniqueIngredients, null, 2),
  );

  writeFileFromCurrentDir(SEARCH_INGREDIENTS_PATH, JSON.stringify(searchIngredients));
}

(async () => {
  await main();
})();
