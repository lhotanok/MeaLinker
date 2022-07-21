import { useState, useEffect, useRef, Dispatch, Fragment } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import RecipesGrid from './RecipesGrid';
import useHttp from '../../../shared/hooks/use-http';
import { SimpleRecipe, SimpleRecipesResponse } from '../../types/SimpleRecipesResponse';
import {
  INITIAL_FACETS,
  PAGINATION_RESULTS_COUNT,
  QUERY_PARAM_NAMES,
} from '../../constants';
import {
  buildRecipesSearchUrl,
  buildUrl,
  parseFilters,
  prepareFacets,
  prepareRecipes,
} from '../../../shared/tools/request-parser';
import SearchHeader from './SearchHeader';
import RecipesPagination from './RecipesPagination';
import { Facets } from '../../types/Facets';
import {
  buildItemsAddedSnackbar,
  buildItemsRemovedSnackbar,
} from '../../../shared/tools/snackbar-builder';
import SearchedFilters from './Filters/SearchedFilters';
import InputFilters from './Filters/InputFilters';
import { FilterName, Filters } from '../../types/Filters';
import { getFilterHandlers } from '../../../shared/tools/filter-handler-builder';

type RecipesCachedProps = {
  tabs: JSX.Element;
  currentTab: number;
  setSnackbar: Dispatch<
    React.SetStateAction<{
      text: string;
      severity: 'success' | 'info' | 'error';
    } | null>
  >;
};

const RecipesCached: React.FC<RecipesCachedProps> = ({
  setSnackbar,
  tabs,
  currentTab,
}) => {
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
      const currentQueryParams = new URLSearchParams(decodeURI(search));
      const currentFilters: Filters = parseFilters(currentQueryParams);

      const fetchedRecipesHandler = (recipesResponse: SimpleRecipesResponse) => {
        setTotalCount(recipesResponse.totalCount);
        setFacets(prepareFacets(recipesResponse.facets, currentFilters));
        setPaginatedRecipes(prepareRecipes(recipesResponse));
      };

      const requestConfig = {
        url: buildRecipesSearchUrl(currentQueryParams),
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
          <InputFilters
            filterHandlers={filterHandlers}
            recipesCount={totalCount}
            tabs={tabs}
            currentTab={currentTab}
          />
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

export default RecipesCached;
