import { PAGINATION_RESULTS_COUNT, QUERY_PARAM_NAMES } from '../../recipes/constants';
import { FacetItem, Facets } from '../../recipes/types/Facets';
import { Filters } from '../../recipes/types/Filters';
import {
  SimpleRecipesResponse,
  SimpleRecipe,
} from '../../recipes/types/SimpleRecipesResponse';
import { QueryParameters } from '../types/QueryParameters';

type FilterParam = {
  value: string | string[] | undefined;
  name: string;
};

export const parseFilters = (queryParams: URLSearchParams): Filters => {
  const filters: Filters = {
    ingredients: splitParamValue(queryParams.get(QUERY_PARAM_NAMES.INGREDIENTS)),
    tags: splitParamValue(queryParams.get(QUERY_PARAM_NAMES.TAGS)),
    cuisine: queryParams.get(QUERY_PARAM_NAMES.CUISINE) || '',
    diets: splitParamValue(queryParams.get(QUERY_PARAM_NAMES.DIETS)),
    mealTypes: splitParamValue(queryParams.get(QUERY_PARAM_NAMES.MEAL_TYPES)),
    time: queryParams.get(QUERY_PARAM_NAMES.TIME) || '',
  };

  return filters;
};

const splitParamValue = (paramValue: string | null, delimiter = ';'): string[] => {
  return paramValue ? paramValue.split(delimiter) : [];
};

const setOrDelete = (
  queryParams: URLSearchParams,
  paramKey: string,
  paramValue?: string,
) => {
  if (paramValue) {
    queryParams.set(paramKey, paramValue);
  } else {
    queryParams.delete(paramKey);
  }
};

export const buildUrl = (
  pathname: string,
  currentQueryParams: URLSearchParams,
  updatedParamValues: QueryParameters | null,
): string => {
  if (!updatedParamValues) {
    return pathname;
  }

  const filterParams = buildFilterParams(updatedParamValues);

  filterParams.forEach((filter) => {
    const encodedParam = getEncodedParam(filter.value);
    if (encodedParam !== undefined) {
      setOrDelete(currentQueryParams, filter.name, encodedParam);
    }
  });

  const { page = 1 } = updatedParamValues;
  setOrDelete(
    currentQueryParams,
    QUERY_PARAM_NAMES.PAGE,
    page !== 1 ? page.toString() : '',
  );

  console.log(`queryparams`, {
    queryparams: currentQueryParams.toString(),
  });

  return `${pathname}?${currentQueryParams.toString()}`;
};

const buildFilterParams = (filtersQueryParameters: QueryParameters): FilterParam[] => {
  const { ingredients, tags, cuisine, diets, mealTypes, time } = filtersQueryParameters;

  const filterParams: FilterParam[] = [
    { value: ingredients, name: QUERY_PARAM_NAMES.INGREDIENTS },
    { value: tags, name: QUERY_PARAM_NAMES.TAGS },
    { value: cuisine, name: QUERY_PARAM_NAMES.CUISINE },
    { value: diets, name: QUERY_PARAM_NAMES.DIETS },
    { value: mealTypes, name: QUERY_PARAM_NAMES.MEAL_TYPES },
    { value: time, name: QUERY_PARAM_NAMES.TIME },
  ];

  return filterParams;
};

const getEncodedParam = (param?: string | string[]): string | undefined => {
  if (param) {
    const encoded = Array.isArray(param)
      ? encodeArrayToQueryParam(param)
      : encodeURI(param);

    return encoded;
  }

  return param;
};

export const encodeArrayToQueryParam = (array: string[]): string =>
  encodeURI(array.join(';'));

export const buildRecipesSearchUrl = (searchParams: URLSearchParams): string => {
  const filterParams: Record<string, string> = {};

  Object.values(QUERY_PARAM_NAMES).forEach((name) => {
    const value = searchParams.get(name);
    if (value) {
      filterParams[name] = value;
    }
  });

  const page = Number(searchParams.get(QUERY_PARAM_NAMES.PAGE)) || 1;
  const offset = (page - 1) * PAGINATION_RESULTS_COUNT;

  const apiSearchParams = new URLSearchParams({
    rows: PAGINATION_RESULTS_COUNT.toString(),
    offset: offset.toString(),
    ...filterParams,
  });

  return `http://localhost:5000/api/recipes?${apiSearchParams.toString()}`;
};

export const buildIngredientSearchUrl = (ingredientId: string): string => {
  return `http://localhost:5000/api/ingredients/${ingredientId}`;
};

export const prepareRecipes = (
  recipeResponse: SimpleRecipesResponse,
  offset: number = 0,
): SimpleRecipe[] => {
  const { docs, highlighting = {} } = recipeResponse;

  const searchedRecipes = docs
    .slice(offset, offset + PAGINATION_RESULTS_COUNT)
    .map((recipeDoc) => {
      const { id } = recipeDoc;
      const recipeHighlighting = highlighting[id];
      const ingredients: string[] = [];

      recipeDoc.ingredients.forEach((ingredient, index) => {
        if (
          recipeHighlighting &&
          recipeHighlighting.ingredients &&
          !ingredient.includes('href') // Solr highlighting truncates <a href> content
        ) {
          ingredients.push(recipeHighlighting.ingredients[index]);
        } else {
          ingredients.push(ingredient);
        }
      });

      const searchedRecipe: SimpleRecipe = {
        ...recipeDoc,
        ingredients,
      };

      return searchedRecipe;
    });

  return searchedRecipes;
};

export const prepareFacets = (facets: Facets, currentFilters: Filters): Facets => {
  const updatedFacets: Record<string, FacetItem[]> = {};

  const currentFilterNames: string[] = [];

  Object.values(currentFilters).forEach((value) => {
    if (Array.isArray(value)) {
      currentFilterNames.push(...value);
    } else if (value) {
      currentFilterNames.push(value);
    }
  });

  Object.entries(facets).forEach(([facetName, facetItems]) => {
    const filteredFacetItems = facetItems.filter(
      (item) =>
        !currentFilterNames.includes(item.name) &&
        item.name !== 'No Cook' &&
        (facetName === 'timeFacets' || !item.name.startsWith('<')),
    );

    updatedFacets[facetName] = filteredFacetItems;
  });

  return updatedFacets as Facets;
};
