import { Facets } from './types/Facets';

export const PAGINATION_RESULTS_COUNT = 24;
export const MAX_PAGINATION_PAGES = 1000;

export const MAX_DESCRIPTION_CHARS = 220;

export const RENDERING_TIMEOUT = 550;

export const HIGHLIGHTED_ITEM_REGEX = /<em>([^<]*)<\/em>/gi;
export const CONTINUOUS_HIGHLIGHTINGS_REGEX = /<\/em>( )+<em>/gi;
export const ALL_SENTENCES_REGEX = /[^.!?]*[.?!]+[ )]*/gm;

export const QUERY_PARAM_NAMES: Record<string, string> = {
  INGREDIENTS: 'ingredients',
  TAGS: 'tags',
  CUISINE: 'cuisine',
  PAGE: 'page',
  DIETS: 'diets',
  MEAL_TYPES: 'mealTypes',
  TIME: 'time',
};

export const INITIAL_FACETS: Facets = {
  ingredientFacets: [],
  tagFacets: [],
  cuisineFacets: [],
  dietFacets: [],
  mealTypeFacets: [],
  timeFacets: [],
};
