import log4js from 'log4js';

import { CORES } from './config';
import SolrModel from './solr-model';
import { Recipe } from './types/recipe';
import { SolrResponse } from './types/search-response';
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
    rows: number,
    offset: number,
    sortOptions: Record<string, any> | undefined = {
      rating: 'desc',
      reviewsCount: 'desc',
    },
  ): Promise<SolrResponse<Recipe>> {
    const ingredientsQuery = this.buildIngredientsPhraseQuery(ingredients);

    let query = this.client
      .query()
      .q(ingredientsQuery)
      .qop('AND')
      // .mm(ingredients.length)
      .hl({
        fl: 'ingredients',
        preserveMulti: true,
      })
      .start(offset)
      .rows(rows)
      .sort(sortOptions);

    const searchResponse = await this.fetchHighlightedDocumentsByQuery<Recipe>(query);
    const solrResponse: SolrResponse<Recipe> = {
      docs: searchResponse.response.docs,
      totalCount: searchResponse.response.numFound,
      highlighting: searchResponse.highlighting,
    };

    log.info(
      `Found ${solrResponse.totalCount} recipes for ingredients: ${ingredients}. Fetched recipes ${offset}-${offset +
        rows}.`,
    );
    return solrResponse;
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

  private buildIngredientsPhraseQuery(ingredients: string[]): string {
    let searchQuery = '';

    ingredients.forEach((ingredient) => {
      searchQuery += `\ningredients: "${ingredient}"`;
    });

    return searchQuery.trim();
  }
}

export default SolrRecipesModel;
