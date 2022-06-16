import log4js from 'log4js';

import { CORES, DEFAULT_MAX_RESULTS_COUNT } from './config';
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

  public async getAllRecipes(): Promise<Recipe[]> {
    const recipes = await this.fetchAllDocuments<Recipe>();
    log.info(`Fetched ${recipes.length} recipes`);
    return recipes;
  }

  public async getRecipesByIngredients(
    ingredients: string[],
    rows = DEFAULT_MAX_RESULTS_COUNT,
  ): Promise<Recipe[]> {
    if (ingredients.length === 0) {
      return [];
    }

    const ingredientFilters = ingredients.map((ingredient) => ({
      field: 'ingredients',
      value: ingredient,
    }));
    const query = this.client.query().q({ '*': '*' }).fq(ingredientFilters).rows(rows);

    const recipes = await this.fetchDocumentsByQuery<Recipe>(query);

    log.info(`Fetched ${recipes.length} recipes for ingredients: ${ingredients}`);
    return recipes;
  }

  public async getRecipeById(recipeId: string): Promise<Recipe> {
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
