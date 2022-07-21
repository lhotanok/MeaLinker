exports.RDF_PREFIXES = {
  INGREDIENT_PREFIX: `http://example.org/ingredients#`,
  RDFS_PREFIX: 'http://www.w3.org/2000/01/rdf-schema#',
};

exports.EXTENDED_INGREDIENT_PATHS = [
  'foodcom/ingredients/extended_ingredients.json',
  'allrecipes/ingredients/extended_ingredients.json',
];

exports.RECIPE_PATHS = [
  'foodcom/recipes/extended_recipes.json',
  'allrecipes/allrecipes-scraper/apify_storage/key_value_stores/default/RECIPES.json',
];

exports.EXTENDED_FINAL_RECIPES_PATH = 'extended_recipes.json';
exports.EXTENDED_FINAL_INGREDIENTS_PATH = 'extended_ingredients.json';

exports.DEFAULT_ALLRECIPES_IMAGE = 'https://www.allrecipes.com/img/misc/og-default.png';

exports.INGREDIENTS_SECTION_REGEX = /##INGREDIENTS##(.)*##INGREDIENTS##/gs;
exports.INGREDIENT_IRI_PREFIX = /http:\/\/example\.org\/ingredients#/g;
exports.IRI_DEREFERENCE_REGEX = /[<>]/g;

const SAME_AS_PROP = 'http://www.w3.org/2002/07/owl#sameAs';
exports.SAME_AS_CONTEXT = {
  sameAs: {
    '@id': SAME_AS_PROP,
  },
};
