exports.GENERATED_DATASET_PATH =
  'allrecipes-scraper/apify_storage/key_value_stores/default/RECIPES.json';

exports.UNIQUE_INGREDIENTS_PATH = 'ingredients/unique_ingr_map.json'; // unique ingredients extracted from the dataset
exports.EXTENDED_INGREDIENTS_PATH = 'ingredients/extended_ingredients.json'; // unique ingredients extended by external datasets info
exports.JSONLD_INGRS_PATH = 'rdf-data/jsonld-ingredients.json';

exports.MIN_INGREDIENT_NAME_LENGTH = 2;

exports.CATEGORY_PREFIX_REGEX = /^http(s)?:\/\/dbpedia.org\/resource\/Category:/gi;
