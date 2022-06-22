import { useState, useEffect, Fragment } from 'react';
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
import SearchedIngredients from '../components/Search/SearchedIngredients';
import RecipesPagination from '../components/Search/RecipesPagination';
import { Snackbar, Alert } from '@mui/material';

export default function Recipes() {
  const navigate = useNavigate();
  const location = useLocation();

  const { pathname, search } = location;

  const queryParams = new URLSearchParams(decodeURI(search));
  const ingredients = parseIngredients(queryParams);
  const page = Number(queryParams.get(QUERY_PARAM_NAMES.PAGE)) || 1;

  const [paginatedRecipes, setPaginatedRecipes] = useState<SimpleRecipe[]>([]);
  const [totalCount, setTotalCount] = useState<number | null>(null);
  const [addSnackbarOpen, setAddSnackbarOpen] = useState(false);
  const [addSnackbarText, setAddSnackbarText] = useState('');
  const [newSnackbarText, setNewSnackbarText] = useState('');

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

  useEffect(
    () => {
      if (newSnackbarText && !addSnackbarOpen) {
        // Set a new snack when we don't have an active one
        setAddSnackbarText(newSnackbarText);
        setAddSnackbarOpen(true);
        setNewSnackbarText('');
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
        (ingr) => !ingredients.map(({ label }) => label).includes(ingr.label),
      );

      if (addedIngredients.length > 0) {
        setTotalCount(null);

        const snackbarText =
          addedIngredients.length === 1
            ? `${addedIngredients[0].label} added`
            : `${addedIngredients.length} ingredients added`;

        setNewSnackbarText(snackbarText);

        navigate(
          buildUrl(pathname, queryParams, {
            ingredients: mergedIngredients,
          }),
        );
      }
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

  const handleAddSnackbarClose = (
    _event?: React.SyntheticEvent | Event,
    reason?: string,
  ) => {
    if (reason === 'clickaway') {
      return;
    }

    setAddSnackbarOpen(false);
    setAddSnackbarText('');
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
          <SearchIngredientBar onSearch={searchByIngredientsHandler} />
          <SearchHeader recipesCount={totalCount} />
          <SearchedIngredients
            ingredients={ingredients}
            onRemove={searchIngredientRemoveHandler}
            onRemoveAll={searchIngredientsRemoveAllHandler}
          />
          <Snackbar
            key={addSnackbarText}
            open={addSnackbarOpen}
            onClose={handleAddSnackbarClose}
            autoHideDuration={4000}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          >
            <Alert severity='success'>{addSnackbarText}</Alert>
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
