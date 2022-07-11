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
  parseFilters,
  prepareRecipes,
} from '../../shared/tools/request-parser';
import SearchHeader from '../components/Search/SearchHeader';
import RecipesPagination from '../components/Search/RecipesPagination';
import { Snackbar, Alert } from '@mui/material';
import { Facets } from '../types/Facets';
import {
  buildItemsAddedSnackbar,
  buildItemsRemovedSnackbar,
} from '../../shared/tools/snackbar-builder';
import SearchedFilters from '../components/Search/SearchedFilters';

export default function Recipes() {
  const navigate = useNavigate();
  const location = useLocation();

  const { pathname, search } = location;

  const queryParams = new URLSearchParams(decodeURI(search));
  const filters = parseFilters(queryParams);
  const page = Number(queryParams.get(QUERY_PARAM_NAMES.PAGE)) || 1;

  const [paginatedRecipes, setPaginatedRecipes] = useState<SimpleRecipe[]>([]);
  const [totalCount, setTotalCount] = useState<number | null>(null);
  const [facets, setFacets] = useState<Facets>({
    ingredientFacets: [],
    tagFacets: [],
    cuisineFacets: [],
  });

  const [addSnackbarOpen, setAddSnackbarOpen] = useState(false);
  const [addSnackbarText, setAddSnackbarText] = useState<{
    text: string;
    severity: 'success' | 'info';
  } | null>(null);
  const [newSnackbarText, setNewSnackbarText] = useState<{
    text: string;
    severity: 'success' | 'info';
  } | null>(null);

  const { sendRequest: fetchRecipes, error } = useHttp();

  useEffect(
    () => {
      document.title = `Recipe Search | ${totalCount} recipes`;
    },
    [totalCount],
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

  const searchHandler = (
    originalFilters: string[],
    searchFilters: string[],
    filterName: 'ingredients' | 'tags' | 'cuisines',
  ) => {
    if (searchFilters.length > 0) {
      const mergedFilters = mergeSearchFilters(originalFilters, searchFilters);
      const addedFilters = mergedFilters.filter(
        (filter) => !originalFilters.includes(filter),
      );

      if (addedFilters.length > 0) {
        // Some filter(s) changed, recipe results need to be updated
        setTotalCount(null);

        const snackbarText = buildItemsAddedSnackbar(addedFilters, filterName);
        setNewSnackbarText({ text: snackbarText, severity: 'success' });

        navigate(
          buildUrl(pathname, queryParams, {
            [filterName]: mergedFilters,
          }),
        );
      }
    }
  };

  const removeHandler = (
    originalFilters: string[],
    removedFilters: string[],
    filterName: 'ingredients' | 'tags' | 'cuisines',
  ) => {
    const filteredLabels = originalFilters.filter(
      (filter) => !removedFilters.includes(filter),
    );

    if (filteredLabels.length === originalFilters.length) {
      return;
    }

    setTotalCount(null);

    const snackbarText = buildItemsRemovedSnackbar(
      originalFilters,
      removedFilters,
      filteredLabels,
      filterName,
    );

    setNewSnackbarText({ text: snackbarText, severity: 'info' });

    navigate(
      buildUrl(pathname, queryParams, {
        [filterName]: filteredLabels,
      }),
    );
  };

  const filterHandlers = {
    ingredients: {
      search: (labels: string[]) =>
        searchHandler(filters.ingredients, labels, 'ingredients'),
      remove: (removed: string[]) =>
        removeHandler(filters.ingredients, removed, 'ingredients'),
    },
    tags: {
      search: (labels: string[]) => searchHandler(filters.tags, labels, 'tags'),
      remove: (removed: string[]) => removeHandler(filters.tags, removed, 'tags'),
    },
    cuisines: {
      search: (labels: string[]) => searchHandler(filters.cuisines, labels, 'cuisines'),
      remove: (removed: string[]) => removeHandler(filters.cuisines, removed, 'cuisines'),
    },
  };

  const removeAllFiltersHandler = () => {
    setTotalCount(null);
    navigate(buildUrl(pathname, queryParams, null));
  };

  const handleSnackbarClose = (
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
            onSearch={filterHandlers.ingredients.search}
            onRemove={filterHandlers.ingredients.remove}
          />
          <SearchHeader recipesCount={totalCount} error={error} />
          <SearchedFilters
            filters={filters}
            onTagRemove={(name) => filterHandlers.tags.remove([name])}
            onCuisineRemove={(name) => filterHandlers.cuisines.remove([name])}
            onIngredientRemove={(name) => filterHandlers.ingredients.remove([name])}
            onRemoveAll={removeAllFiltersHandler}
          />
          <Snackbar
            key={addSnackbarText ? addSnackbarText.text : ''}
            open={addSnackbarOpen}
            onClose={handleSnackbarClose}
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

const mergeSearchFilters = (
  originalFilters: string[],
  newFilters: string[],
): string[] => {
  const mergedFilters: string[] = [...originalFilters];

  newFilters.forEach((ingredientLabel) => {
    if (!mergedFilters.includes(ingredientLabel)) {
      mergedFilters.push(ingredientLabel);
    }
  });

  return mergedFilters;
};
