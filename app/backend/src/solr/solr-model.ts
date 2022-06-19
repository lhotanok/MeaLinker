import { Client, Query } from 'solr-client';
import log4js from 'log4js';

import SolrClientFactory from './solr-client-factory';
import { ExtendedSearchResponse } from './types/search-response';
import { DEFAULT_MAX_RESULTS_COUNT } from '../constants';

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

  protected async fetchAllDocuments<SolrDocument>(): Promise<SolrDocument[]> {
    const query = this.client.query().q('*').rows(DEFAULT_MAX_RESULTS_COUNT);
    return this.fetchDocumentsByQuery<SolrDocument>(query);
  }

  protected async fetchDocumentById<SolrDocument>(
    documentId: string,
  ): Promise<SolrDocument> {
    const query = this.client.query().q(documentId).df('id');
    const documents = await this.fetchDocumentsByQuery<SolrDocument>(query);
    return documents[0];
  }

  protected async fetchDocumentsByQuery<SolrDocument>(
    query: Query,
  ): Promise<SolrDocument[]> {
    const searchResponse = await this.client.search<SolrDocument>(query);

    return searchResponse.response.docs;
  }

  protected async fetchHighlightedDocumentsByQuery<SolrDocument>(
    query: Query,
  ): Promise<ExtendedSearchResponse<SolrDocument>> {
    const searchResponse = (await this.client.search<SolrDocument>(
      query,
    )) as ExtendedSearchResponse<SolrDocument>;

    return searchResponse;
  }
}

export default SolrModel;
