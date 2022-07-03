import log4js from 'log4js';
import { Query } from 'solr-client';
import { MAX_SEARCH_INGREDIENTS_LIMIT } from '../constants';

import { CORES } from './config';
import SolrModel from './solr-model';
import { FacetItem } from './types/facets';
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

  public async getAllRecipes(
    rows: number,
    offset: number,
    sortOptions: Record<string, any> | undefined = {
      rating: 'desc',
      reviewsCount: 'desc',
    },
  ): Promise<SolrResponse<Recipe>> {
    const query = this.client
      .query()
      .q('*:*')
      .start(offset)
      .rows(rows)
      .sort(sortOptions)
      .facet({
        pivot: {
          fields: ['_ingredientsFacet'],
          mincount: 1,
        },
        field: '_ingredientsFacet',
      });

    const solrResponse = await this.prepareSolrResponse(query);
    log.info(
      `Found ${solrResponse.totalCount} recipes. Fetched recipes ${offset}-${offset +
        rows}.`,
    );

    return solrResponse;
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

    const query = this.client
      .query()
      .q(ingredientsQuery)
      .qop('AND')
      .hl({
        fl: 'ingredients',
        preserveMulti: true,
      })
      .facet({
        pivot: {
          fields: ['_ingredientsFacet'],
        },
        field: '_ingredientsFacet',
        limit: MAX_SEARCH_INGREDIENTS_LIMIT,
        mincount: 1,
      })
      .start(offset)
      .rows(rows)
      .sort(sortOptions);

    const solrResponse = await this.prepareSolrResponse(query);

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

  private buildFacetItems(queryFacets: (string | number)[]): FacetItem[] {
    const facetItems: FacetItem[] = [];

    let currentFacetName: string;

    queryFacets.forEach((facet, index) => {
      if (index % 2 === 0) {
        currentFacetName = facet.toString();
      } else {
        facetItems.push({
          name: currentFacetName,
          count: Number(facet),
        });
      }
    });

    return facetItems;
  }

  private async prepareSolrResponse(query: Query): Promise<SolrResponse<Recipe>> {
    const searchResponse = await this.fetchHighlightedDocumentsByQuery<Recipe>(query);

    const solrResponse: SolrResponse<Recipe> = {
      docs: searchResponse.response.docs,
      totalCount: searchResponse.response.numFound,
      highlighting: searchResponse.highlighting,
      facets: searchResponse.facet_counts
        ? {
            ingredientFacets: this.buildFacetItems(
              searchResponse.facet_counts.facet_fields._ingredientsFacet,
            ),
          }
        : undefined,
    };

    return solrResponse;
  }
}

export default SolrRecipesModel;
