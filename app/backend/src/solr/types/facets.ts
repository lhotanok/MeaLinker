export type QueryFacets = {
  _ingredientsFacet: string[];
  _tagsFacet: string[];
  _cuisinesFacet: string[];
  _dietsFacet: string[];
  _mealTypesFacet: string[];
};

export type FacetItem = {
  name: string;
  count: number;
};

export type Facets = {
  ingredientFacets: FacetItem[];
  tagFacets: FacetItem[];
  cuisineFacets: FacetItem[];
  dietFacets: FacetItem[];
  mealTypeFacets: FacetItem[];
};
