exports.RDF_PREFIXES = {
  INGREDIENT_PREFIX: `http://example.org/ingredients#`,
  RDFS_PREFIX: 'http://www.w3.org/2000/01/rdf-schema#',
};

exports.EXTENDED_INGREDIENT_PATHS = ['foodcom/ingredients/extended_ingredients.json'];

exports.RECIPE_PATHS = [
  'foodcom/recipes/extended_recipes.json',
  'allrecipes/allrecipes-scraper/apify_storage/key_value_stores/default/RECIPES.json',
];

exports.EXTENDED_FINAL_RECIPES_PATH = 'extended_recipes.json';
exports.EXTENDED_FINAL_INGREDIENTS_PATH = 'extended_ingredients.json';
