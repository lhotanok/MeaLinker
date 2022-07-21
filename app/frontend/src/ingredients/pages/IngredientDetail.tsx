import { Fragment } from 'react';
import KeepAlive from 'react-activation';
import { useParams } from 'react-router-dom';
import TopScroll from '../../shared/components/TopScroll';
import IngredientDetailPage from './IngredientDetailPage';

/**
 * Wrapper component used to set `cacheKey` property of `KeepAlive` komponent properly.
 * @returns
 */
export default function RecipesWrapper() {
  const params = useParams();

  const { ingredientId } = params;

  return (
    <Fragment>
      <TopScroll />
      <KeepAlive cacheKey={`ingredient-${ingredientId}`}>
        <IngredientDetailPage />
      </KeepAlive>
    </Fragment>
  );
}
