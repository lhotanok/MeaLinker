import { PAGINATION_RESULTS_COUNT, QUERY_PARAM_NAMES } from '../../recipes/constants';
import { SearchedIngredient } from '../../recipes/types/SearchedIngredient';

export const parseIngredients = (queryParams: URLSearchParams): SearchedIngredient[] => {
  const joinedIngredients = queryParams.get(QUERY_PARAM_NAMES.INGREDIENTS);
  const ingredients = joinedIngredients ? joinedIngredients.split(';') : [];

  const uniqueIngredients = ingredients.map((ingredient, index) => {
    return {
      key: index,
      label: ingredient,
    };
  });

  return uniqueIngredients as SearchedIngredient[];
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
  updatedParamValues: { ingredients: SearchedIngredient[]; page?: number },
): string => {
  const { ingredients, page = 1 } = updatedParamValues;
  const queryParams = currentQueryParams;

  const encodedIngredients = encodeIngredientsToQueryParam(ingredients);

  setOrDelete(queryParams, QUERY_PARAM_NAMES.INGREDIENTS, encodedIngredients);
  setOrDelete(queryParams, QUERY_PARAM_NAMES.PAGE, page !== 1 ? page.toString() : '');

  return `${pathname}?${queryParams.toString()}`;
};

export const encodeIngredientsToQueryParam = (
  ingredients: SearchedIngredient[],
): string => {
  const ingredientLabels = ingredients.map((ingredient) => ingredient.label);
  const joinedIngredients = ingredientLabels.join(';');
  const encodedIngredients = encodeURI(joinedIngredients);

  return encodedIngredients;
};

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
