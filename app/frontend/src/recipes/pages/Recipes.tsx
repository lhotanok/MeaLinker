import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import SearchIngredientBar from '../components/Search/SearchIngredientBar';
import RecipesGrid from '../components/Search/RecipesGrid';
import useHttp from '../../shared/hooks/use-http';
import { SimpleRecipe, SimpleRecipesResponse } from '../types/SimpleRecipesResponse';
import { PAGINATION_RESULTS_COUNT, QUERY_PARAM_NAMES } from '../constants';
import {
  buildRecipeSearchUrl,
  buildUrl,
  parseIngredients,
} from '../../shared/tools/request-parser';
import SearchHeader from '../components/Search/SearchHeader';
import SearchedIngredients from '../components/Search/SearchedIngredients';
import RecipesPagination from '../components/Search/RecipesPagination';
import { Snackbar, Alert } from '@mui/material';
import { Facets } from '../types/Facets';

export default function Recipes() {
  const navigate = useNavigate();
  const location = useLocation();

  const { pathname, search } = location;

  const queryParams = new URLSearchParams(decodeURI(search));
  const ingredients = parseIngredients(queryParams);
  const page = Number(queryParams.get(QUERY_PARAM_NAMES.PAGE)) || 1;

  const [paginatedRecipes, setPaginatedRecipes] = useState<SimpleRecipe[]>([]);
  const [totalCount, setTotalCount] = useState<number | null>(null);
  const [facets, setFacets] = useState<Facets>({ ingredientFacets: [] });

  const [addSnackbarOpen, setAddSnackbarOpen] = useState(false);
  const [addSnackbarText, setAddSnackbarText] = useState<{
    text: string;
    severity: 'success' | 'info';
  } | null>(null);
  const [newSnackbarText, setNewSnackbarText] = useState<{
    text: string;
    severity: 'success' | 'info';
  } | null>(null);

  const { sendRequest: fetchRecipes } = useHttp();

  useEffect(
    () => {
      document.title = `Recipe Search${ingredients.length > 0
        ? ` |${ingredients.join(' ')}`
        : ''}`;
    },
    [ingredients],
  );

  useEffect(
    () => {
      const fetchedRecipesHandler = (recipesResponse: SimpleRecipesResponse) => {
        setTotalCount(recipesResponse.totalCount);
        setFacets(recipesResponse.facets);
        setPaginatedRecipes(prepareRecipes(recipesResponse));
      };

      const requestConfig = {
        url: buildRecipeSearchUrl(search),
      };

      fetchRecipes(requestConfig, fetchedRecipesHandler);
    },
    [fetchRecipes, search],
  );

  useEffect(
    () => {
      if (newSnackbarText && !addSnackbarOpen) {
        // Set a new snack when we don't have an active one
        setAddSnackbarText({ ...newSnackbarText });
        setAddSnackbarOpen(true);
        setNewSnackbarText(null);
      } else if (addSnackbarOpen && newSnackbarText) {
        // Close an active snack when a new one is added
        setAddSnackbarOpen(false);
      }
    },
    [addSnackbarOpen, addSnackbarText, newSnackbarText],
  );

  const searchByIngredientsHandler = (searchIngredientLabels: string[]) => {
    if (searchIngredientLabels.length > 0) {
      const mergedIngredients = mergeSearchIngredients(
        ingredients,
        searchIngredientLabels,
      );

      const addedIngredients = mergedIngredients.filter(
        (ingr) => !ingredients.includes(ingr),
      );

      if (addedIngredients.length > 0) {
        setTotalCount(null);

        const snackbarText =
          addedIngredients.length === 1
            ? `${addedIngredients[0]} added`
            : `${addedIngredients.length} ingredients added`;

        setNewSnackbarText({ text: snackbarText, severity: 'success' });

        navigate(
          buildUrl(pathname, queryParams, {
            ingredients: mergedIngredients,
          }),
        );
      }
    }
  };

  const searchIngredientRemoveHandler = (removedIngredients: string[]) => {
    const filteredIngredients = ingredients.filter(
      (ingredient) => !removedIngredients.includes(ingredient),
    );

    if (filteredIngredients.length === ingredients.length) {
      return;
    }

    setTotalCount(null);

    let snackbarText = `${removedIngredients.length === 1
      ? removedIngredients[0]
      : `${removedIngredients.length} ingredients`} removed`;

    if (filteredIngredients.length === 0) {
      snackbarText =
        ingredients.length === 1
          ? `${ingredients[0]} removed`
          : `${ingredients.length === 2
              ? 'Both'
              : `All ${ingredients.length}`} ingredients removed`;
    }

    setNewSnackbarText({
      text: snackbarText,
      severity: 'info',
    });

    navigate(
      buildUrl(pathname, queryParams, {
        ingredients: filteredIngredients,
        page: 1,
      }),
    );
  };

  const handleAddSnackbarClose = (
    _event?: React.SyntheticEvent | Event,
    reason?: string,
  ) => {
    if (reason === 'clickaway') {
      return;
    }

    setAddSnackbarOpen(false);
    setAddSnackbarText(null);
  };

  return (
    <Container>
      <Box
        sx={{
          bgcolor: 'background.paper',
          pt: 4,
          pb: 6,
        }}
      >
        <Container maxWidth='md'>
          <SearchIngredientBar
            ingredientFacets={facets.ingredientFacets.filter(
              (facet) => facet.count !== totalCount,
            )}
            onSearch={searchByIngredientsHandler}
            onRemove={searchIngredientRemoveHandler}
          />
          <SearchHeader recipesCount={totalCount} />
          <SearchedIngredients
            ingredients={ingredients}
            onRemove={searchIngredientRemoveHandler}
          />
          <Snackbar
            key={addSnackbarText ? addSnackbarText.text : ''}
            open={addSnackbarOpen}
            onClose={handleAddSnackbarClose}
            autoHideDuration={4000}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          >
            <Alert severity={addSnackbarText ? addSnackbarText.severity : 'info'}>
              {addSnackbarText ? addSnackbarText.text : ''}
            </Alert>
          </Snackbar>
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
    </Container>
  );
}

const mergeSearchIngredients = (
  originalIngredients: string[],
  newIngredients: string[],
): string[] => {
  const mergedIngredients: string[] = [...originalIngredients];

  newIngredients.forEach((ingredientLabel) => {
    if (!mergedIngredients.includes(ingredientLabel)) {
      mergedIngredients.push(ingredientLabel);
    }
  });

  return mergedIngredients;
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
