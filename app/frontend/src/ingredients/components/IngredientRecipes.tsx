import { Fragment } from 'react';
import { useLocation } from 'react-router-dom';
import RecipesGrid from '../../recipes/components/Search/RecipesGrid';
import RecipesPagination from '../../recipes/components/Search/RecipesPagination';
import { PAGINATION_RESULTS_COUNT, QUERY_PARAM_NAMES } from '../../recipes/constants';
import { SimpleRecipe } from '../../recipes/types/SimpleRecipesResponse';

type IngredientRecipesProps = {
  totalCount: number | null;
  paginatedRecipes: SimpleRecipe[];
  scrollHandler: () => void;
};

export default function IngredientRecipes({
  totalCount,
  paginatedRecipes,
  scrollHandler,
}: IngredientRecipesProps) {
  const location = useLocation();

  const queryParams = new URLSearchParams(decodeURI(location.search));
  const page = Number(queryParams.get(QUERY_PARAM_NAMES.PAGE)) || 1;

  return (
    <Fragment>
      <RecipesGrid recipes={paginatedRecipes} />
      {totalCount ? (
        <RecipesPagination
          page={page}
          maxPages={Math.ceil((totalCount || 0) / PAGINATION_RESULTS_COUNT)}
          queryParams={queryParams}
          onScroll={scrollHandler}
        />
      ) : (
        ''
      )}
    </Fragment>
  );
}
