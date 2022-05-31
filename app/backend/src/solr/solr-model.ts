import { Client } from 'solr-client';
import log4js from 'log4js';

import SolrClientFactory from './solr-client-factory';
import { Recipe } from './recipe';
import { DEFAULT_RESULTS_COUNT } from './config';

const log = log4js.getLogger('SolrModel');
log.level = 'debug';

/**
 * Provides methods for fetching json documents from Solr.
 */
class SolrModel {
  private client: Client;

  constructor(core: string) {
    this.client = SolrClientFactory.getClient(core);
  }

  protected async fetchAllDocuments<T>(): Promise<T[]> {
    const query = this.client.query().q('*').rows(DEFAULT_RESULTS_COUNT);
    const searchResponse = await this.client.search<T>(query);
    return searchResponse.response.docs;
  }

  protected async fetchDocumentById<T>(documentId: string): Promise<T> {
    const query = this.client.query().q(documentId).df('id');
    const searchResponse = await this.client.search<T>(query);
    return searchResponse.response.docs[0];
  }
}

export default SolrModel;
