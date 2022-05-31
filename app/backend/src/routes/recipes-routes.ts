import express from 'express';
import CouchDbModel from '../couchdb/couchdb-model';
import SolrRecipesModel from '../solr/solr-recipes-model';

const router = express.Router();

router.get('/', async (req, res) => {
  const recipesModel = new SolrRecipesModel();
  const recipes = await recipesModel.getAllRecipes();
  res.status(200).json(recipes);
});

router.get('/:recipeId', async (req, res) => {
  const { params: { recipeId } } = req;

  const couchdbModel = new CouchDbModel();
  const recipe = await couchdbModel.getRecipeById(recipeId);
  res.status(200).json(recipe);
});

export default router;
