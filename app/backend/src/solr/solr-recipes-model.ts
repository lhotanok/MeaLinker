import log4js from 'log4js';
import { Query } from 'solr-client';
import { MAX_SEARCH_INGREDIENTS_LIMIT } from '../constants';

import { CORES, FACET_FIELDS } from './config';
import SolrModel from './solr-model';
import { FacetItem, Facets, QueryFacets } from './types/facets';
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
    log.info('Fetching all recipes...');

    const query = this.buildQuery('*:*', offset, rows, sortOptions);

    const solrResponse = await this.prepareSolrResponse(query);
    log.info(
      `Found ${solrResponse.totalCount} recipes. Fetched recipes ${offset}-${offset +
        rows}.`,
    );

    return solrResponse;
  }

  public async getRecipesByFilters(
    searchParameters: SearchParameters,
    sortOptions: Record<string, any> | undefined = {
      rating: 'desc',
      reviewsCount: 'desc',
    },
  ): Promise<SolrResponse<Recipe>> {
    log.info('Fetching recipes by filters...', { filters: searchParameters });

    const {
      ingredients,
      tags,
      cuisine,
      diets,
      mealTypes,
      rows,
      offset,
    } = searchParameters;

    const filters: Record<string, string[]> = {
      ingredients,
      tags,
      cuisine: [cuisine].filter((cuisine) => cuisine),
      diets,
      mealTypes,
    };

    const qStringValues: string[] = [];

    Object.entries(filters).forEach(([filterName, filterValue]) => {
      if (filterValue.length > 0) {
        qStringValues.push(this.buildPhraseQuery(filterValue, filterName));
      }
    });

    const qString = qStringValues.join('\n');

    const query = this.buildQuery(qString, offset, rows, sortOptions).hl({
      fl: 'ingredients',
      preserveMulti: true,
    });

    const solrResponse = await this.prepareSolrResponse(query);

    log.info(
      `Found ${solrResponse.totalCount} recipes for filters: ${JSON.stringify(
        filters,
      )}. Fetched recipes ${offset}-${offset + rows}.`,
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

  private buildQuery(
    q: string,
    offset: number,
    rows: number,
    sortOptions: Record<string, any>,
  ): Query {
    const query = this.client
      .query()
      .q(q)
      .qop('AND')
      .facet({
        pivot: {
          fields: Object.values(FACET_FIELDS),
        },
        field: Object.values(FACET_FIELDS),
        limit: MAX_SEARCH_INGREDIENTS_LIMIT,
        mincount: 1,
      })
      .start(offset)
      .rows(rows)
      .sort(sortOptions);

    return query;
  }

  private buildPhraseQuery(requiredValues: string[], fieldName: string): string {
    let searchQuery = '';

    requiredValues.forEach((value) => {
      searchQuery += `\n${fieldName}: "${value}"`;
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

  private buildFacets(facetFields: QueryFacets): Facets {
    return {
      ingredientFacets: this.buildFacetItems(facetFields._ingredientsFacet),
      tagFacets: this.buildFacetItems(facetFields._tagsFacet),
      cuisineFacets: this.buildFacetItems(facetFields._cuisinesFacet),
      dietFacets: this.buildFacetItems(facetFields._dietsFacet),
      mealTypeFacets: this.buildFacetItems(facetFields._mealTypesFacet),
    };
  }

  private async prepareSolrResponse(query: Query): Promise<SolrResponse<Recipe>> {
    const searchResponse = await this.fetchHighlightedDocumentsByQuery<Recipe>(query);

    const solrResponse: SolrResponse<Recipe> = {
      docs: searchResponse.response.docs,
      totalCount: searchResponse.response.numFound,
      highlighting: searchResponse.highlighting,
      facets: this.buildFacets(searchResponse.facet_counts.facet_fields),
    };

    return solrResponse;
  }
}

export default SolrRecipesModel;
