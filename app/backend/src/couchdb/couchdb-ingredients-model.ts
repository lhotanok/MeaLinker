import log4js from 'log4js';
import { INGREDIENTS_DATABASE_NAME, RECIPES_DATABASE_NAME } from './config';

import NanoDbFactory, { RecipeNanoDb } from './nano-db-factory';
import { FullIngredient } from './types/FullIngredient';
import { FullRecipe } from './types/FullRecipe';

const log = log4js.getLogger('CouchDbModel');
log.level = 'debug';

/**
 * Provides static methods for fetching recipes and ingredients
 * json documents from CouchDB.
 */
class CouchDbIngredientsModel {
  private database: RecipeNanoDb;

  constructor() {
    this.database = NanoDbFactory.getDatabase<FullIngredient>(INGREDIENTS_DATABASE_NAME);
  }

  async getIngredientById(ingredientId: string) {
    const ingredient = await this.database.get(ingredientId);
    return ingredient;
  }
}

export default CouchDbIngredientsModel;
