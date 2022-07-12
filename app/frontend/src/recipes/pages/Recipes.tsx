import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import SearchIngredientBar from '../components/Search/Filters/SearchIngredientBar';
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
import { Facets } from '../types/Facets';
import {
  buildItemsAddedSnackbar,
  buildItemsRemovedSnackbar,
} from '../../shared/tools/snackbar-builder';
import SearchedFilters from '../components/Search/Filters/SearchedFilters';
import SecondaryFilters from '../components/Search/Filters/SecondaryFilters';
import useSnackbar from '../../shared/hooks/use-snackbar';

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

  const { sendRequest: fetchRecipes, error } = useHttp();
  const { snackbar, setNewSnackbarText: setSnackbar } = useSnackbar();

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

  const searchHandler = (
    originalFilters: string[],
    searchFilters: string[],
    filterName: 'ingredients' | 'tags' | 'cuisines',
  ) => {
    if (searchFilters.length > 0) {
      const mergedFilters = mergeSearchFilters(originalFilters, searchFilters);
      const lowercaseOriginal = originalFilters.map((filter) => filter.toLowerCase());
      const addedFilters = mergedFilters.filter((filter) => {
        const included = lowercaseOriginal.includes(filter.toLowerCase());
        if (included) {
          setSnackbar({ text: `${filter} was already added`, severity: 'error' });
        }
        return !included;
      });

      if (addedFilters.length > 0) {
        // Some filter(s) changed, recipe results need to be updated
        setTotalCount(null);

        const snackbarText = buildItemsAddedSnackbar(addedFilters, filterName);
        setSnackbar({ text: snackbarText, severity: 'success' });

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

    setSnackbar({
      text: buildItemsRemovedSnackbar(
        originalFilters,
        removedFilters,
        filteredLabels,
        filterName,
      ),
      severity: 'error',
    });

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
    setSnackbar({ text: 'Cleared all filters', severity: 'error' });
    navigate(buildUrl(pathname, queryParams, null));
  };

  return (
    <Container>
      {snackbar}
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
            searchedItems={filters.ingredients}
            onSearch={filterHandlers.ingredients.search}
            onRemove={filterHandlers.ingredients.remove}
          />
          <Box
            sx={{
              bgcolor: 'background.paper',
              pt: 4,
            }}
          >
            <SecondaryFilters />
          </Box>
          <SearchHeader recipesCount={totalCount} error={error} />
          <SearchedFilters
            filters={filters}
            onTagRemove={(name) => filterHandlers.tags.remove([name])}
            onCuisineRemove={(name) => filterHandlers.cuisines.remove([name])}
            onIngredientRemove={(name) => filterHandlers.ingredients.remove([name])}
            onRemoveAll={removeAllFiltersHandler}
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
