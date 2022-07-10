export type FacetItem = {
  name: string;
  count: number;
};

export type Facets = {
  ingredientFacets: FacetItem[];
  tagFacets: FacetItem[];
  cuisineFacets: FacetItem[];
};