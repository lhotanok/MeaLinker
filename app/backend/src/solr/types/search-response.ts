import { SearchResponse } from 'solr-client/dist/lib/solr';

export interface ExtendedSearchResponse<SolrDocument>
  extends SearchResponse<SolrDocument> {
  highlighting?: Highlighting;
}

export type Highlighting = {
  ingredients?: string[];
};

export type SolrResponse<SolrDocument> = {
  docs: SolrDocument[];
  totalCount: number;
  highlighting?: Highlighting;
};
