import { Fragment, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import SearchIngredientBar from '../components/Search/SearchIngredientBar';
import RecipesGrid from '../components/Search/RecipesGrid';
import useHttp from '../../shared/hooks/use-http';
import { SimpleRecipe, SimpleRecipesResponse } from '../types/SimpleRecipesResponse';
import { SearchedIngredient } from '../types/SearchedIngredient';
import { PAGINATION_RESULTS_COUNT, QUERY_PARAM_NAMES } from '../constants';
import {
  buildRecipeSearchUrl,
  buildUrl,
  parseIngredients,
} from '../../shared/tools/request-parser';
import SearchHeader from '../components/Search/SearchHeader';
import SearchIngredients from '../components/Search/SearchedIngredients';
import RecipesPagination from '../components/Search/RecipesPagination';

export default function Recipes() {
  const navigate = useNavigate();
  const location = useLocation();

  const { pathname, search } = location;

  const queryParams = new URLSearchParams(decodeURI(search));
  const ingredients = parseIngredients(queryParams);
  const page = Number(queryParams.get(QUERY_PARAM_NAMES.PAGE)) || 1;

  const [paginatedRecipes, setPaginatedRecipes] = useState<SimpleRecipe[]>([]);
  const [totalCount, setTotalCount] = useState<number | null>(null);

  const { sendRequest: fetchRecipes } = useHttp();

  useEffect(
    () => {
      document.title = `Recipe Search${ingredients.length > 0
        ? ` |${ingredients.map((ingr) => ` ${ingr.label}`)}`
        : ''}`;
    },
    [ingredients],
  );

  useEffect(
    () => {
      const fetchedRecipesHandler = (recipesResponse: SimpleRecipesResponse) => {
        setTotalCount(recipesResponse.totalCount);
        setPaginatedRecipes(prepareRecipes(recipesResponse));
      };

      const requestConfig = {
        url: buildRecipeSearchUrl(search),
      };

      fetchRecipes(requestConfig, fetchedRecipesHandler);
    },
    [fetchRecipes, search],
  );

  const searchByIngredientsHandler = (searchIngredientLabels: string[]) => {
    if (searchIngredientLabels.length > 0) {
      setTotalCount(null);
      const mergedIngredients = mergeSearchIngredients(
        ingredients,
        searchIngredientLabels,
      );

      navigate(
        buildUrl(pathname, queryParams, {
          ingredients: mergedIngredients,
        }),
      );
    }
  };

  const searchIngredientRemoveHandler = (removedIngredient: SearchedIngredient) => {
    setTotalCount(null);

    const filteredIngredients = ingredients.filter(
      (ingredient) => ingredient.label !== removedIngredient.label,
    );

    navigate(
      buildUrl(pathname, queryParams, {
        ingredients: filteredIngredients,
      }),
    );
  };

  const searchIngredientsRemoveAllHandler = () => {
    setTotalCount(null);

    navigate(
      buildUrl(pathname, queryParams, {
        ingredients: [],
        page: 1,
      }),
    );
  };

  return (
    <Fragment>
      <Box
        sx={{
          bgcolor: 'background.paper',
          pt: 4,
          pb: 6,
        }}
      >
        <Container maxWidth='md'>
          <SearchIngredientBar onSearch={searchByIngredientsHandler} />
          <SearchHeader recipesCount={totalCount} ingredientsCount={ingredients.length} />
          <SearchIngredients
            ingredients={ingredients}
            onRemove={searchIngredientRemoveHandler}
            onRemoveAll={searchIngredientsRemoveAllHandler}
          />
        </Container>
      </Box>
      <RecipesGrid recipes={paginatedRecipes} />
      {totalCount ? (
        <RecipesPagination
          page={page}
          maxPages={Math.ceil((totalCount || 0) / PAGINATION_RESULTS_COUNT)}
          queryParams={queryParams}
        />
      ) : (
        ''
      )}
    </Fragment>
  );
}

const mergeSearchIngredients = (
  originalIngredients: SearchedIngredient[],
  newIngredientLabels: string[],
): SearchedIngredient[] => {
  const ingredientLabels = originalIngredients.map((original) => original.label);

  newIngredientLabels.forEach((ingredientLabel) => {
    if (!ingredientLabels.includes(ingredientLabel)) {
      ingredientLabels.push(ingredientLabel);
    }
  });

  const mergedIngredients = ingredientLabels.map((label, index) => {
    return {
      key: index,
      label,
    };
  });

  return mergedIngredients as SearchedIngredient[];
};

const prepareRecipes = (
  recipeResponse: SimpleRecipesResponse,
  offset: number = 0,
): SimpleRecipe[] => {
  const { docs, highlighting = {} } = recipeResponse;

  const searchedRecipes = docs
    .slice(offset, offset + PAGINATION_RESULTS_COUNT)
    .map((recipeDoc) => {
      const { id } = recipeDoc;
      const recipeHighlighting = highlighting[id];
      const ingredients =
        recipeHighlighting && recipeHighlighting.ingredients
          ? recipeHighlighting.ingredients
          : recipeDoc.ingredients;

      const searchedRecipe: SimpleRecipe = {
        ...recipeDoc,
        ingredients,
      };

      return searchedRecipe;
    });

  return searchedRecipes;
};
