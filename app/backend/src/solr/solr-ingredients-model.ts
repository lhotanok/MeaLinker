import log4js from 'log4js';

import { CORES } from './config';
import { Ingredient } from './ingredient';
import SolrModel from './solr-model';
const { INGREDIENTS } = CORES;

const log = log4js.getLogger('SolrIngredientsModel');
log.level = 'debug';

/**
 * Provides methods for fetching recipes json documents from Solr.
 */
class SolrIngredientsModel extends SolrModel {
  constructor() {
    super(INGREDIENTS);
  }

  public async getAllIngredients() {
    const ingredients = await this.fetchAllDocuments<Ingredient>();
    log.info(`Fetched ${ingredients.length} ingredients`);
    return ingredients;
  }

  public async getIngredientById(ingredientId: string) {
    const ingredient = await this.fetchDocumentById(ingredientId);
    return ingredient;
  }
}

export default SolrIngredientsModel;
