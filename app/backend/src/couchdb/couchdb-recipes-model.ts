import log4js from 'log4js';
import { RECIPES_DATABASE_NAME } from './config';

import NanoDbFactory, { RecipeNanoDb } from './nano-db-factory';
import { FullRecipe } from './types/FullRecipe';

const log = log4js.getLogger('CouchDbModel');
log.level = 'debug';

/**
 * Provides methods for fetching recipes and ingredients
 * json documents from CouchDB.
 */
class CouchDbRecipesModel {
  private database: RecipeNanoDb;

  constructor() {
    this.database = NanoDbFactory.getDatabase<FullRecipe>(RECIPES_DATABASE_NAME);
  }

  async getRecipeById(recipeId: string) {
    const recipe = await this.database.get(recipeId);
    log.info(`Fetched recipe from id ${recipeId}: ${recipe.jsonld.name}`);
    return recipe;
  }
}

export default CouchDbRecipesModel;
