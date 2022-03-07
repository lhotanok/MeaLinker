const solr = require('solr-client');
const log4js = require('log4js');

const { HOST, PORT, SECURE, CORES } = require('./config');
const { RECIPES, INGREDIENTS } = CORES;

const log = log4js.getLogger('SolrModel');
log.level = 'debug';

/**
 * Provides static methods for fetching recipes and ingredients
 * json documents from Solr.
 */
class SolrModel {
  static recipesClient = this._initializeClient(RECIPES);
  static ingredientsClient = this._initializeClient(INGREDIENTS);

  static async getAllRecipes() {
    const recipes = await this._fetchAllDocuments(this.recipesClient);
    return recipes;
  }

  static async getAllIngredients() {
    const ingredients = await this._fetchAllDocuments(this.ingredientsClient);
    return ingredients;
  }

  static async getRecipeById(recipeId) {
    const recipe = await this._fetchDocumentById(this.recipesClient, recipeId);
    return recipe;
  }

  static async getIngredientById(ingredientId) {
    const ingredient = await this._fetchDocumentById(
      this.ingredientsClient,
      ingredientId,
    );
    return ingredient;
  }

  static _initializeClient(core) {
    return solr.createClient({
      host: HOST,
      port: PORT,
      core,
      secure: SECURE,
    });
  }

  static async _fetchAllDocuments(client) {
    const { response: { numFound } } = await client.searchAll();
    const query = client.query().q('*').rows(numFound);
    const allDocuments = await client.search(query);

    log.info(
      `Fetched ${allDocuments.response.docs.length} documents from Solr`,
    );

    return allDocuments;
  }

  static async _fetchDocumentById(client, documentId) {
    const query = client.query().q(documentId).df('id');
    const document = await client.search(query);
    return document;
  }
}

module.exports = SolrModel;
