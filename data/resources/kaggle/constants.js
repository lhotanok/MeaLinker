exports.URL_BASE = `https://www.food.com/recipe`;

exports.JSON_RECIPES_PATH = './recipes/RAW_recipes.json'; // subset of the original csv source from: https://www.kaggle.com/shuyangli94/food-com-recipes-and-user-interactions?select=RAW_recipes.csv
exports.TOKENIZED_RECIPES_PATH = './recipes/PP_recipes.csv'; // download from: https://www.kaggle.com/shuyangli94/food-com-recipes-and-user-interactions?select=PP_recipes.csv
exports.APIFY_SCRAPER_INPUT_PATH = './food-com-scraper/apify_storage/key_value_stores/default/INPUT.json';
exports.GENERATED_DATASET_PATH = './recipes/RECIPES.json'; // can be replaced directly by generated dataset: './food-com-recipes/apify_storage/key_value_stores/RECIPES.json'
exports.EXTENDED_RECIPES_PATH = './recipes/extended_recipes.json' // generated recipes extended by ingredient ids and normalized names extracted from Kaggle dataset
exports.INGR_MAP_PATH = './ingredients/ingr_map.csv' // ingredient ids with normalized name and raw text
exports.UNIQUE_INGR_WITH_IDS_PATH = './ingredients/unique_ingr_map.json' // unique ingredient ids with normalized names
exports.RDF_INGREDIENTS_PATH = './rdf-data/ingredients.ttl';

exports.FILE_ENCODING = 'utf8';

exports.NAMESPACE_UUID = '6ad552f0-7f96-11ec-82d2-0d4c9c611065';

exports.RDF_PREFIXES = {
    INGREDIENT_PREFIX: `http://example.org/ingredients#`,
    RDFS_PREFIX: 'http://www.w3.org/2000/01/rdf-schema#',
}
