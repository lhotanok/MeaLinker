import { useState, useEffect, useRef, Dispatch, Fragment } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import RecipesGrid from '../components/Search/RecipesGrid';
import useHttp from '../../shared/hooks/use-http';
import { SimpleRecipe, SimpleRecipesResponse } from '../types/SimpleRecipesResponse';
import {
  INITIAL_FACETS,
  PAGINATION_RESULTS_COUNT,
  QUERY_PARAM_NAMES,
} from '../constants';
import {
  buildRecipesSearchUrl,
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
import { FilterName, Filters } from '../types/Filters';
import { getFilterHandlers } from '../../shared/tools/filter-handler-builder';

type RecipesPageProps = {
  setSnackbar: Dispatch<
    React.SetStateAction<{
      text: string;
      severity: 'success' | 'info' | 'error';
    } | null>
  >;
};

const RecipesPage: React.FC<RecipesPageProps> = ({ setSnackbar }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const { pathname, search } = location;

  const queryParams = new URLSearchParams(decodeURI(search));
  const filters: Filters = parseFilters(queryParams);
  const page = Number(queryParams.get(QUERY_PARAM_NAMES.PAGE)) || 1;

  const [totalCount, setTotalCount] = useState<number | null>(null);
  const [paginatedRecipes, setPaginatedRecipes] = useState<SimpleRecipe[]>([]);
  const [facets, setFacets] = useState<Facets>(INITIAL_FACETS);

  const { sendRequest: fetchRecipes, error } = useHttp();

  const headerRef = useRef<HTMLDivElement>(null);

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
        url: buildRecipesSearchUrl(new URLSearchParams(decodeURI(search))),
      };

      fetchRecipes(requestConfig, fetchedRecipesHandler);
    },
    [fetchRecipes, search, setTotalCount],
  );

  const searchHandler = (
    originalFilters: string[],
    searchFilters: string[],
    filterName: FilterName,
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

        navigate(
          buildUrl(pathname, queryParams, {
            [filterName]: searchFilters,
          }),
        );

        const snackbarText = buildItemsAddedSnackbar(addedFilters, filterName);
        setSnackbar({ text: snackbarText, severity: 'success' });
      }
    }
  };

  const removeHandler = (
    originalFilters: string[],
    removedFilters: string[],
    filterName: FilterName,
  ) => {
    const filteredLabels = originalFilters.filter(
      (filter) => !removedFilters.includes(filter),
    );

    if (filteredLabels.length === originalFilters.length) {
      return;
    }

    navigate(
      buildUrl(pathname, queryParams, {
        [filterName]: filteredLabels,
      }),
    );

    setSnackbar({
      text: buildItemsRemovedSnackbar(
        originalFilters,
        removedFilters,
        filteredLabels,
        filterName,
      ),
      severity: 'error',
    });
  };

  const filterHandlers = getFilterHandlers(filters, facets, searchHandler, removeHandler);

  const removeAllFiltersHandler = () => {
    setSnackbar({ text: 'Cleared all filters', severity: 'error' });
    navigate(buildUrl(pathname, queryParams, null));
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
          <InputFilters filterHandlers={filterHandlers} recipesCount={totalCount} />
          <span ref={headerRef}>
            <SearchHeader recipesCount={totalCount} error={error} />
          </span>
          <SearchedFilters
            filters={filters}
            filterHandlers={filterHandlers}
            onRemoveAll={removeAllFiltersHandler}
          />
        </Container>
      </Box>
      <RecipesGrid recipes={paginatedRecipes} />
      {totalCount ? (
        <RecipesPagination
          queryParams={queryParams}
          page={page}
          maxPages={Math.ceil((totalCount || 0) / PAGINATION_RESULTS_COUNT)}
          onScroll={() => headerRef.current && headerRef.current.scrollIntoView()}
        />
      ) : (
        ''
      )}
    </Fragment>
  );
};

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

export default RecipesPage;
