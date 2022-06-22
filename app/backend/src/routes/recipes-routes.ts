import express from 'express';
import { DEFAULT_PAGINATION_RESULTS_COUNT, MAX_RESULTS_COUNT } from '../constants';
import CouchDbRecipesModel from '../couchdb/couchdb-recipes-model';
import SolrRecipesModel from '../solr/solr-recipes-model';
import { Recipe } from '../solr/types/recipe';
import { SolrResponse } from '../solr/types/search-response';

const router = express.Router();

router.get('/', async (req, res) => {
  const recipesModel = new SolrRecipesModel();

  const {
    ingredients: encodedIngredients = '',
    rows: requestedRows = `${DEFAULT_PAGINATION_RESULTS_COUNT}`,
    offset: requestedOffset = '0',
  } = req.query;

  const ingredientsText = decodeURI(encodedIngredients.toString());
  const ingredients = ingredientsText.split(';').filter((ingredient) => ingredient);

  const rows = Math.min(Number(requestedRows), MAX_RESULTS_COUNT);
  const offset = Number(requestedOffset);

  const recipes: SolrResponse<Recipe> =
    ingredients.length > 0
      ? await recipesModel.getRecipesByIngredients(ingredients, rows, offset)
      : await recipesModel.getAllRecipes(rows, offset);

  res.status(200).json(recipes);
});

router.get('/:recipeId', async (req, res) => {
  const { params: { recipeId } } = req;

  const couchdbModel = new CouchDbRecipesModel();
  const recipe = await couchdbModel.getRecipeById(recipeId);
  res.status(200).json(recipe);
});

export default router;
