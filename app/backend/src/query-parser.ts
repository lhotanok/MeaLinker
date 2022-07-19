import { MAX_RESULTS_COUNT } from './constants';

export const parseSearchParameters = (
  parameters: SearchQueryParameters,
): SearchParameters => {
  const { ingredients, tags, cuisine, diets, mealTypes, time, rows, offset } = parameters;

  const searchParameters: SearchParameters = {
    ingredients: parseArrayParam(ingredients),
    tags: parseArrayParam(tags),
    cuisine: decodeURI(cuisine),
    diets: parseArrayParam(diets),
    mealTypes: parseArrayParam(mealTypes),
    time: decodeURI(time),
    rows: Math.min(Number(rows), MAX_RESULTS_COUNT),
    offset: Number(offset),
  };

  return searchParameters;
};

const parseArrayParam = (encodedParam: string): string[] => {
  const decodedParam = decodeURI(encodedParam);
  const paramArray = decodedParam.split(';').filter((param) => param);

  return paramArray;
};
