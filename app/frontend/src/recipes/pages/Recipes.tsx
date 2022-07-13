import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
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
import InputFilters from '../components/Search/Filters/InputFilters';
import useSnackbar from '../../shared/hooks/use-snackbar';
import { FilterHandlers, Filters } from '../types/Filters';

export default function Recipes() {
  const navigate = useNavigate();
  const location = useLocation();

  const { pathname, search } = location;

  const queryParams = new URLSearchParams(decodeURI(search));
  const filters: Filters = parseFilters(queryParams);
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
    filterName: 'ingredients' | 'tags' | 'cuisine',
  ) => {
    console.log(
      `Search handler, original: ${JSON.stringify(
        originalFilters,
      )}, search: ${JSON.stringify(searchFilters)}`,
    );
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
    filterName: 'ingredients' | 'tags' | 'cuisine',
  ) => {
    console.log(
      `Remove handler, original: ${JSON.stringify(
        originalFilters,
      )}, removedFilters: ${JSON.stringify(removedFilters)}`,
    );
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

  const filterHandlers: FilterHandlers = {
    ingredients: {
      value: filters.ingredients,
      facets: facets.ingredientFacets,
      onSearch: (labels: string[]) =>
        searchHandler(filters.ingredients, labels, 'ingredients'),
      onRemove: (removed: string[]) =>
        removeHandler(filters.ingredients, removed, 'ingredients'),
    },
    tags: {
      value: filters.tags,
      facets: facets.tagFacets,
      onSearch: (labels: string[]) => searchHandler(filters.tags, labels, 'tags'),
      onRemove: (removed: string[]) => removeHandler(filters.tags, removed, 'tags'),
    },
    cuisine: {
      value: filters.cuisine || '',
      facets: facets.cuisineFacets,
      onSearch: (labels: string[]) => searchHandler([filters.cuisine], labels, 'cuisine'),
      onRemove: (removed: string[]) =>
        removeHandler([filters.cuisine], removed, 'cuisine'),
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
          <InputFilters filterHandlers={filterHandlers} recipesCount={totalCount} />
          <SearchHeader recipesCount={totalCount} error={error} />
          <SearchedFilters
            filters={filters}
            onTagRemove={(name) => filterHandlers.tags.onRemove([name])}
            onCuisineRemove={(name) => filterHandlers.cuisine.onRemove([name])}
            onIngredientRemove={(name) => filterHandlers.ingredients.onRemove([name])}
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
