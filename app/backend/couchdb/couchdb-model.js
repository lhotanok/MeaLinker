const log4js = require('log4js');

const { DATABASE_NAME, PORT, USERNAME, PASSWORD } = require('./config');
const nano = require('nano')(
  `http://${USERNAME}:${PASSWORD}@localhost:${PORT}`,
);

const log = log4js.getLogger('CouchDbModel');
log.level = 'debug';

/**
 * Provides static methods for fetching recipes and ingredients
 * json documents from CouchDB.
 */
class CouchDbModel {
  static database = nano.use(DATABASE_NAME);

  static async getRecipeById(recipeId) {
    const recipe = await this.database.get(recipeId);
    return recipe;
  }

  static async getIngredientById(ingredientId) {
    const ingredient = await this.database.get(ingredientId);
    return ingredient;
  }
}

module.exports = CouchDbModel;
