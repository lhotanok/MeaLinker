import log4js from 'log4js';
import nano from 'nano';
import { INGREDIENTS_DATABASE_NAME } from './config';

import NanoDbFactory, { IngredientNanoDb } from './nano-db-factory';
import { FullIngredient } from './types/full-ingredient';

const log = log4js.getLogger('CouchDbModel');
log.level = 'debug';

/**
 * Provides methods for fetching recipes and ingredients
 * json documents from CouchDB.
 */
class CouchDbIngredientsModel {
  private database: IngredientNanoDb;

  constructor() {
    this.database = NanoDbFactory.getDatabase<FullIngredient>(INGREDIENTS_DATABASE_NAME);
  }

  async getIngredientById(
    ingredientId: string,
  ): Promise<nano.DocumentGetResponse & FullIngredient> {
    const ingredient = await this.database.get(ingredientId);
    return ingredient;
  }

  async getAllIngredients(): Promise<nano.DocumentListResponse<FullIngredient>> {
    const ingredients = await this.database.list();
    return ingredients;
  }
}

export default CouchDbIngredientsModel;
