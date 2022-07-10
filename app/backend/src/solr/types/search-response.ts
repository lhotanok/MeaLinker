import { SearchResponse } from 'solr-client/dist/lib/solr';
import { Facets, QueryFacets } from './facets';

export interface ExtendedSearchResponse<SolrDocument>
  extends SearchResponse<SolrDocument> {
  facet_counts: {
    facet_queries: any;
    facet_fields: QueryFacets;
  };
  highlighting?: Highlighting;
}

export type Highlighting = {
  ingredients?: string[];
};

export type SolrResponse<SolrDocument> = {
  docs: SolrDocument[];
  totalCount: number;
  highlighting?: Highlighting;
  facets?: Facets;
};
