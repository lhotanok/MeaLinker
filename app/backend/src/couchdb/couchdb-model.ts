import log4js from 'log4js';

import { DATABASE_NAME, PORT, USERNAME, PASSWORD } from './config';
import NanoDbFactory, { NanoDb } from './nano-db-factory';
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
  private database: NanoDb;

  constructor() {
    this.database = NanoDbFactory.getDatabase();
  }

  async getRecipeById(recipeId: string) {
    const recipe = await this.database.get(recipeId);
    return recipe;
  }

  async getIngredientById(ingredientId: string) {
    const ingredient = await this.database.get(ingredientId);
    return ingredient;
  }
}

export default CouchDbModel;
