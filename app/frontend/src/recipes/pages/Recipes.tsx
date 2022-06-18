import { Fragment, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import SearchIngredients from '../../ingredients/components/SearchIngredients';
import SearchIngredientBar from '../../ingredients/components/SearchIngredientBar';
import RecipesGrid from '../components/RecipesGrid';
import useHttp from '../../shared/hooks/use-http';
import { SimpleRecipe, SimpleRecipesResponse } from '../types/SimpleRecipesResponse';
import { SearchedIngredient } from '../types/SearchedIngredient';
import { PAGINATION_RESULTS_COUNT, QUERY_PARAM_NAMES } from '../constants';
import { buildUrl, parseIngredients } from '../../shared/tools/request-parser';
import SearchHeader from '../components/SearchHeader';
import RecipesPagination from '../components/RecipesPagination';

export default function Recipes() {
  const navigate = useNavigate();
  const location = useLocation();

  const { pathname, search } = location;

  const queryParams = new URLSearchParams(decodeURI(search));
  const ingredients = parseIngredients(queryParams);

  const [paginatedRecipes, setPaginatedRecipes] = useState<SimpleRecipe[]>([]);
  const [fetchedRecipes, setFetchedRecipes] = useState<SimpleRecipesResponse | null>(
    null,
  );
  const [page, setPage] = useState<number>(1);

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
      const searchParams = new URLSearchParams(decodeURI(search));
      const currentPage = Number(searchParams.get(QUERY_PARAM_NAMES.PAGE)) || 1;

      const offset = (currentPage - 1) * PAGINATION_RESULTS_COUNT;

      const requestConfig = {
        url: `http://localhost:5000/api/recipes${search}`,
      };

      const fetchedRecipesHandler = (recipesResponse: SimpleRecipesResponse) => {
        setFetchedRecipes(recipesResponse);
        setPaginatedRecipes(prepareRecipes(recipesResponse, offset));
      };

      setFetchedRecipes(null);
      setPage(currentPage);
      fetchRecipes(requestConfig, fetchedRecipesHandler);
    },
    [fetchRecipes, search],
  );

  const searchByIngredientsHandler = (searchIngredientLabels: string[]) => {
    const mergedIngredients = mergeSearchIngredients(ingredients, searchIngredientLabels);

    navigate(
      buildUrl(pathname, queryParams, {
        ingredients: mergedIngredients,
      }),
    );
  };

  const searchIngredientRemoveHandler = (removedIngredient: SearchedIngredient) => {
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
    navigate(
      buildUrl(pathname, queryParams, {
        ingredients: [],
        page: 1,
      }),
    );
  };

  const recipesCount: number | null = fetchedRecipes ? fetchedRecipes.docs.length : null;

  return (
    <Fragment>
      <Box
        sx={{
          bgcolor: 'background.paper',
          pt: 4,
          pb: 6,
        }}
      >
        <Container>
          <SearchIngredientBar onSearch={searchByIngredientsHandler} />
          <SearchHeader
            recipesCount={recipesCount}
            ingredientsCount={ingredients.length}
          />
          <SearchIngredients
            ingredients={ingredients}
            onRemove={searchIngredientRemoveHandler}
            onRemoveAll={searchIngredientsRemoveAllHandler}
          />
        </Container>
      </Box>
      <RecipesGrid recipes={paginatedRecipes} />
      {recipesCount && (
        <RecipesPagination
          page={page}
          maxPages={Math.ceil((recipesCount || 0) / PAGINATION_RESULTS_COUNT)}
          queryParams={queryParams}
        />
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
      const date = new Intl.DateTimeFormat('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }).format(new Date(recipeDoc.date)); // example date format: June 5, 2022

      const { id } = recipeDoc;
      const recipeHighlighting = highlighting[id];
      const ingredients =
        recipeHighlighting && recipeHighlighting.ingredients
          ? recipeHighlighting.ingredients
          : recipeDoc.ingredients;

      const searchedRecipe: SimpleRecipe = {
        ...recipeDoc,
        ingredients,
        date,
      };

      return searchedRecipe;
    });

  return searchedRecipes;
};
