import log4js from 'log4js';

import { CORES } from './config';
import SolrModel from './solr-model';
import { Recipe } from './types/recipe';
const { RECIPES } = CORES;

const log = log4js.getLogger('SolrRecipesModel');
log.level = 'debug';

/**
 * Provides methods for fetching recipes json documents from Solr.
 */
class SolrRecipesModel extends SolrModel {
  constructor() {
    super(RECIPES);
  }

  public async getAllRecipes() {
    const recipes = await this.fetchAllDocuments<Recipe>();
    log.info(`Fetched ${recipes.length} recipes`);
    return recipes;
  }

  public async getRecipeById(recipeId: string) {
    const recipe = await this.fetchDocumentById<Recipe>(recipeId);
    log.info(
      `Fetched recipe ${recipe.id}: ${recipe.name} with ingredients: ${JSON.stringify(
        recipe.ingredients,
        null,
        2,
      )}`,
    );
    return recipe;
  }
}

export default SolrRecipesModel;
