const express = require('express');
const CouchDbModel = require('../couchdb/couchdb-model');
const SolrModel = require('../solr/solr-model');

const router = express.Router();

router.get('/ingredients', async (req, res) => {
  const ingredients = await SolrModel.getAllIngredients();
  res.status(200).json(ingredients);
});

router.get('/ingredients/:ingredientId', async (req, res) => {
  const { params: { ingredientId } } = req;

  const ingredient = await CouchDbModel.getIngredientById(ingredientId);
  res.status(200).json(ingredient);
});

module.exports = router;
