import { Fragment } from 'react';
import KeepAlive from 'react-activation';
import { useParams } from 'react-router-dom';
import TopScroll from '../../shared/components/TopScroll';
import RecipeDetailPage from './RecipeDetailPage';

/**
 * Wrapper component used to set `cacheKey` property of `KeepAlive` komponent properly.
 * @returns
 */
export default function RecipesWrapper() {
  const params = useParams();

  const { recipeId } = params;
  const cacheKey = `recipe-${recipeId}`;

  return (
    <Fragment>
      <TopScroll />
      <KeepAlive cacheKey={cacheKey} id={cacheKey}>
        <RecipeDetailPage />
      </KeepAlive>
    </Fragment>
  );
}
