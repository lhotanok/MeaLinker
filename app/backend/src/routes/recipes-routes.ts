import express from 'express';
import { DEFAULT_PAGINATION_RESULTS_COUNT } from '../constants';
import CouchDbRecipesModel from '../couchdb/couchdb-recipes-model';
import SolrRecipesModel from '../solr/solr-recipes-model';

const router = express.Router();

router.get('/', async (req, res) => {
  const recipesModel = new SolrRecipesModel();

  const { ingredients: encodedIngredients = '', rows: requestedRows = '' } = req.query;

  const ingredientsText = decodeURI(encodedIngredients.toString());
  const ingredients = ingredientsText.split(';');
  console.log(`Extracted ingredients from ${req.url} request: ${ingredients}`);

  //const rows = Number(requestedRows.toString()) || DEFAULT_PAGINATION_RESULTS_COUNT;

  const recipes = await recipesModel.getRecipesByIngredients(ingredients);

  // const recipes = await recipesModel.getAllRecipes();
  res.status(200).json(recipes);
});

router.get('/:recipeId', async (req, res) => {
  const { params: { recipeId } } = req;

  const couchdbModel = new CouchDbRecipesModel();
  const recipe = await couchdbModel.getRecipeById(recipeId);
  res.status(200).json(recipe);
});

export default router;
