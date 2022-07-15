import express from 'express';
import { DEFAULT_PAGINATION_RESULTS_COUNT, MAX_RESULTS_COUNT } from '../constants';
import CouchDbRecipesModel from '../couchdb/couchdb-recipes-model';
import { parseSearchParameters } from '../query-parser';
import SolrRecipesModel from '../solr/solr-recipes-model';
import { Recipe } from '../solr/types/recipe';
import { SolrResponse } from '../solr/types/search-response';

const router = express.Router();

router.get('/', async (req, res) => {
  const {
    ingredients = '',
    tags = '',
    cuisine = '',
    diets = '',
    time = '',
    mealTypes = '',
    rows = `${DEFAULT_PAGINATION_RESULTS_COUNT}`,
    offset = '0',
  } = req.query;

  const searchQueryParams = {
    ingredients,
    tags,
    cuisine,
    diets,
    time,
    mealTypes,
    rows,
    offset,
  } as SearchQueryParameters;

  const searchParameters = parseSearchParameters(searchQueryParams);

  const recipesModel = new SolrRecipesModel();

  try {
    const recipes: SolrResponse<Recipe> =
      !ingredients && !tags && !cuisine && !diets && !mealTypes && !time
        ? await recipesModel.getAllRecipes(searchParameters.rows, searchParameters.offset)
        : await recipesModel.getRecipesByFilters(searchParameters);

    res.status(200).json(recipes);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get('/:recipeId', async (req, res) => {
  const { params: { recipeId } } = req;

  const couchdbModel = new CouchDbRecipesModel();
  const recipe = await couchdbModel.getRecipeById(recipeId);
  res.status(200).json(recipe);
});

export default router;
