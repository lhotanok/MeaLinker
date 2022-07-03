export type QueryFacets = {
  _ingredientsFacet: string[];
};

export type FacetItem = {
  name: string;
  count: number;
};

export type Facets = {
  ingredientFacets: FacetItem[];
};
