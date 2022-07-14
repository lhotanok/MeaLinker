import { FacetItem, Facets } from '../../recipes/types/Facets';
import {
  FilterHandler,
  FilterHandlers,
  FilterName,
  Filters,
} from '../../recipes/types/Filters';

export type FilterChangeHandler = (
  originalFilters: string[],
  searchFilters: string[],
  filterName: FilterName,
) => void;

export const getFilterHandlers = (
  filters: Filters,
  facets: Facets,
  searchHandler: FilterChangeHandler,
  removeHandler: FilterChangeHandler,
): FilterHandlers => {
  const { ingredients: ings, tags, cuisine, diets, mealTypes: meals, time } = filters;
  const {
    ingredientFacets: ingFacets,
    tagFacets,
    cuisineFacets,
    dietFacets,
    mealTypeFacets: mealFacets,
    timeFacets,
  } = facets;
  const handlers: [FilterChangeHandler, FilterChangeHandler] = [
    searchHandler,
    removeHandler,
  ];

  const filterHandlers: FilterHandlers = {
    ingredients: buildMultipleFilterHandler(ings, ingFacets, 'ingredients', ...handlers),
    tags: buildMultipleFilterHandler(tags, tagFacets, 'tags', ...handlers),
    cuisine: buildSingleFilterHandler(cuisine, cuisineFacets, 'cuisine', ...handlers),
    diets: buildMultipleFilterHandler(diets, dietFacets, 'diets', ...handlers),
    mealTypes: buildMultipleFilterHandler(meals, mealFacets, 'mealTypes', ...handlers),
    time: buildMultipleFilterHandler(time, timeFacets, 'time', ...handlers),
  };

  return filterHandlers;
};

const buildMultipleFilterHandler = (
  filters: string[],
  facets: FacetItem[],
  filterName: FilterName,
  searchHandler: FilterChangeHandler,
  removeHandler: FilterChangeHandler,
): FilterHandler => {
  return {
    value: filters,
    facets,
    onSearch: (labels: string[]) => searchHandler(filters, labels, filterName),
    onRemove: (removed: string[]) => removeHandler(filters, removed, filterName),
  };
};

const buildSingleFilterHandler = (
  filter: string,
  facets: FacetItem[],
  filterName: FilterName,
  searchHandler: FilterChangeHandler,
  removeHandler: FilterChangeHandler,
): FilterHandler => {
  // filter is '' by default if not set
  const pluralizedFilter = filter ? [filter] : [];

  return {
    value: filter,
    facets,
    onSearch: (labels: string[]) => searchHandler(pluralizedFilter, labels, filterName),
    onRemove: (removed: string[]) => removeHandler(pluralizedFilter, removed, filterName),
  };
};
