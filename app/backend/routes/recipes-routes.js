const express = require('express');
const SolrModel = require('../solr/solr-model');

const router = express.Router();

router.get('/', async (req, res) => {
  const recipes = await SolrModel.getAllRecipes();
  res.status(200).json(recipes);
});

router.get('/:recipeId', async (req, res) => {
  const { params: { recipeId } } = req;

  const recipe = await SolrModel.getRecipeById(recipeId);
  res.status(200).json(recipe);
});

module.exports = router;
