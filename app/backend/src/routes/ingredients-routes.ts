import express from 'express';
import CouchDbIngredientsModel from '../couchdb/couchdb-ingredients-model';
import CouchDbModel from '../couchdb/couchdb-recipes-model';
import SolrIngredientsModel from '../solr/solr-ingredients-model';

const router = express.Router();

router.get('/', async (req, res) => {
  const ingredientsModel = new SolrIngredientsModel();
  const ingredients = await ingredientsModel.getAllIngredients();
  res.status(200).json(ingredients);
});

router.get('/:ingredientId', async (req, res) => {
  const { params: { ingredientId } } = req;

  const couchdbModel = new CouchDbIngredientsModel();
  const ingredient = await couchdbModel.getIngredientById(ingredientId);
  res.status(200).json(ingredient);
});

export default router;
