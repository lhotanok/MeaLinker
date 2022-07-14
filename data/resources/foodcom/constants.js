exports.URL_BASE = `https://www.food.com/recipe`;

exports.JSON_RECIPES_PATH = 'recipes/RAW_recipes.json'; // subset of the original csv source from: https://www.kaggle.com/shuyangli94/food-com-recipes-and-user-interactions?select=RAW_recipes.csv
exports.TOKENIZED_RECIPES_PATH = 'recipes/PP_recipes.csv'; // download from: https://www.kaggle.com/shuyangli94/food-com-recipes-and-user-interactions?select=PP_recipes.csv
exports.APIFY_SCRAPER_INPUT_PATH =
  'food-com-scraper/apify_storage/key_value_stores/default/INPUT.json';
exports.GENERATED_DATASET_PATH =
  'food-com-scraper/apify_storage/key_value_stores/default/RECIPES.json';
exports.EXTENDED_RECIPES_PATH = 'recipes/extended_recipes.json'; // generated recipes extended by ingredient ids and normalized names extracted from Kaggle dataset
exports.INGR_MAP_PATH = 'ingredients/ingr_map.csv'; // ingredient ids with normalized name and raw text
exports.UNIQUE_INGR_WITH_IDS_PATH = 'ingredients/unique_ingr_map.json'; // unique ingredient ids with normalized names
exports.EXTENDED_INGREDIENTS_PATH = 'ingredients/extended_ingredients.json'; // unique ingredients extended by external datasets info
exports.SEARCH_INGREDIENTS_PATH = 'ingredients/search_ingredients.json';
exports.FOOD_DBPEDIA_INGREDIENTS_PATH = 'rdf-data/food-dbpedia-same-ingr.nt'; // sameAs links between food.com ingredients and DBpedia ingredients
exports.RDF_INGREDIENTS_PATH = 'rdf-data/ingredients.ttl'; // food.com ingredients with IRIs composed of ingredient ids
exports.DBPEDIA_INGREDIENTS_PATH = 'rdf-data/dbpedia-ingredients.json'; // collections of jsonlds representing DBpedia ingredient entities
exports.RAW_RECIPES_CSV_PATH = 'recipes/RAW_recipes.csv';
exports.RAW_RECIPES_JSON_PATH = 'recipes/RAW_recipes.json';

exports.RECIPES_TO_EXTRACT = 231637;

exports.SEARCH_INGREDIENT_MAX_WORDS = 3;
exports.MIN_INGREDIENT_NAME_LENGTH = 2;

exports.NON_DIGIT_REGEX = /[^0-9]/g;
exports.IRI_DEREFERENCE_REGEX = /[<>]/g;
exports.SEARCH_INGREDIENT_TRUNCATE_REGEX = /^(whole|shredded|self[- ]rising|seedles|natural|seasoned|regular|refrigerated|processed|minute|mild|medium|light|for|large|fresh|cream of|cooked|condensed cream of|chocolate-covered|center[- ]cut|bottled|all[- ]purpose) /gi;
exports.SEARCH_INGREDIENT_EXCLUDE_REGEX = /^(slice|clove|seed|piece|extract|chip|roast|rol|jar|stick|noodle|half-and-half|cake|shortening|rib|liquid|roma|preserves?|meal)$/gi;

exports.FOOD_COM_DEFAULT_IMAGE_SRC =
  'https://img.sndimg.com/food/image/upload/q_92,fl_progressive,w_1200,c_scale/v1/gk-static/fdc-new/img/fdc-shareGraphic.png';
