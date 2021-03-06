exports.RECIPE_JSONLD_TYPE = 'Recipe';
exports.INGREDIENT_JSONLD_TYPE = 'http://dbpedia.org/ontology/ingredient';

exports.FIELD_TYPES = {
  TEXT: 'text_en',
  INT: 'pint',
  FLOAT: 'pfloat',
  STRING: 'string',
};

exports.SAFE_DB_ROWS_LIMIT = 30000;

exports.FOOD_COM_SEARCH_INGREDIENTS_PATH =
  '../resources/foodcom/ingredients/search_ingredients.json';

exports.CUISINES = [
  'European',
  'Italian',
  'Asian',
  'Mexican',
  'Greek',
  'French',
  'Australian',
  'Canadian',
  'Chinese',
  'African',
  'Southwestern U.S.',
  'Southwest Asia',
  'Thai',
  'German',
  'Japanese',
  'Spanish',
  'Caribbean',
  'Moroccan',
  'Vietnamese',
  'Portuguese',
  'Russian',
  'Indian',
  'Ethiopian',
  'Brazilian',
  'Hungarian',
  'Scandinavian',
  'New Zealand',
  'Scottish',
  'English',
  'Irish',
  'South African',
  'Egyptian',
  'Malaysian',
  'Norwegian',
  'Swedish',
  'Chilean',
  'Czech',
  'Filipino',
  'Indonesian',
  'Swiss',
  'Turkish',
  'Austrian',
  'Danish',
  'Dutch',
  'Hawaiian',
  'Lebanese',
  'Native American',
  'Nepalese',
  'Polish',
  'Polynesian',
  'Puerto Rican',
  'South American',
  'Szechuan',
  'Cambodian',
  'Costa Rican',
  'Korean',
  'Palestinian',
  'Belgian',
  'Cantonese',
  'Colombian',
  'Georgian',
  'Icelandic',
  'Nigerian',
  'Pennsylvania Dutch',
  'Cajun',
  'Welsh',
  'Cuban',
  'Peruvian',
  'Iraqi',
  'Pakistani',
  'Venezuelan',
  'Ecuadorean',
  'Guatemalan',
  'Hunan',
  'Honduran',
  'Sudanese',
  'Mongolian',
  'Somalian',
  'Finnish',
];

exports.DIETS = [
  'Low Cholesterol',
  'Low Protein',
  'Vegan',
  'Vegetarian',
  'Very Low Carbs',
  'High Protein',
  'Egg Free',
  'Lactose Free',
  'Kosher',
  'High Fiber',
  'Dairy Free',
  'Gluten Free',
];

exports.MEAL_TYPES = [
  'Dessert',
  'Lunch/Snacks',
  'Brunch',
  'Breakfast',
  'Beverages',
  'Savory',
  'Salad Dressings',
  'One Dish Meal',
  'Main Dishes',
  'Side Dishes',
  'Appetizers',
  'Cocktails',
  'Casseroles',
  'Relishes',
  'Dips',
  'Sauces and Condiments',
];

exports.NO_COOK_TAG = 'No Cook';
exports.WITHOUT_COOKING_TAG = 'Without Cooking';

exports.REPLACE_TAG_BACK_PART = / (recipes|foods)$/gi;
exports.REPLACE_TAG_FRONT_PART = /^allrecipes allstars/gi;
