import { PAGINATION_RESULTS_COUNT, QUERY_PARAM_NAMES } from '../../recipes/constants';
import { Filters } from '../../recipes/types/Filters';
import {
  SimpleRecipesResponse,
  SimpleRecipe,
} from '../../recipes/types/SimpleRecipesResponse';
import { QueryParameters } from '../types/QueryParameters';

export const parseFilters = (queryParams: URLSearchParams): Filters => {
  const filters: Filters = {
    ingredients: splitParamValue(queryParams.get(QUERY_PARAM_NAMES.INGREDIENTS)),
    tags: splitParamValue(queryParams.get(QUERY_PARAM_NAMES.TAGS)),
    cuisine: queryParams.get(QUERY_PARAM_NAMES.CUISINE) || '',
  };

  return filters;
};

const splitParamValue = (paramValue: string | null, delimiter = ';'): string[] => {
  return paramValue ? paramValue.split(delimiter) : [];
};

const setOrDelete = (
  queryParams: URLSearchParams,
  paramKey: string,
  paramValue: string,
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

  const { ingredients, tags, cuisine, page = 1 } = updatedParamValues;
  const queryParams = currentQueryParams;

  if (ingredients) {
    const encoded = encodeArrayToQueryParam(ingredients);
    setOrDelete(queryParams, QUERY_PARAM_NAMES.INGREDIENTS, encoded);
  }

  if (tags) {
    const encoded = encodeArrayToQueryParam(tags);
    setOrDelete(queryParams, QUERY_PARAM_NAMES.TAGS, encoded);
  }

  if (cuisine) {
    const encoded = encodeURI(cuisine);
    setOrDelete(queryParams, QUERY_PARAM_NAMES.CUISINE, encoded);
  }

  setOrDelete(queryParams, QUERY_PARAM_NAMES.PAGE, page !== 1 ? page.toString() : '');

  return `${pathname}?${queryParams.toString()}`;
};

export const encodeArrayToQueryParam = (array: string[]): string =>
  encodeURI(array.join(';'));

export const buildRecipeSearchUrl = (locationSearch: string): string => {
  const searchParams = new URLSearchParams(decodeURI(locationSearch));
  const page = Number(searchParams.get(QUERY_PARAM_NAMES.PAGE)) || 1;

  const offset = (page - 1) * PAGINATION_RESULTS_COUNT;

  const apiSearchParams = new URLSearchParams({
    ingredients: searchParams.get(QUERY_PARAM_NAMES.INGREDIENTS) || '',
    rows: PAGINATION_RESULTS_COUNT.toString(),
    offset: offset.toString(),
  });

  return `http://localhost:5000/api/recipes?${apiSearchParams.toString()}`;
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
