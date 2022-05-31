import express from 'express';
import CouchDbModel from '../couchdb/couchdb-model';
import SolrIngredientsModel from '../solr/solr-ingredients-model';

const router = express.Router();

router.get('/', async (req, res) => {
  const ingredientsModel = new SolrIngredientsModel();
  const ingredients = await ingredientsModel.getAllIngredients();
  res.status(200).json(ingredients);
});

router.get('/:ingredientId', async (req, res) => {
  const { params: { ingredientId } } = req;

  const couchdbModel = new CouchDbModel();
  const ingredient = await couchdbModel.getIngredientById(ingredientId);
  res.status(200).json(ingredient);
});

export default router;
