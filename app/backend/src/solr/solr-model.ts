import { Client, Query } from 'solr-client';
import log4js from 'log4js';

import SolrClientFactory from './solr-client-factory';
import { DEFAULT_MAX_RESULTS_COUNT } from './config';

const log = log4js.getLogger('SolrModel');
log.level = 'debug';

/**
 * Provides methods for fetching json documents from Solr.
 */
class SolrModel {
  protected client: Client;

  constructor(core: string) {
    this.client = SolrClientFactory.getClient(core);
  }

  protected async fetchAllDocuments<T>(): Promise<T[]> {
    const query = this.client.query().q('*').rows(DEFAULT_MAX_RESULTS_COUNT);
    return this.fetchDocumentsByQuery<T>(query);
  }

  protected async fetchDocumentById<T>(documentId: string): Promise<T> {
    const query = this.client.query().q(documentId).df('id');
    const documents = await this.fetchDocumentsByQuery<T>(query);
    return documents[0];
  }

  protected async fetchDocumentsByQuery<T>(query: Query): Promise<T[]> {
    const searchResponse = await this.client.search<T>(query);
    return searchResponse.response.docs;
  }
}

export default SolrModel;
