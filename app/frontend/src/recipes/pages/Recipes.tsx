import KeepAlive from 'react-activation';
import { useLocation } from 'react-router-dom';
import RecipesPage from './RecipesPage';

/**
 * Wrapper component used to set `cacheKey` property of `KeepAlive` komponent properly.
 * @returns
 */
export default function RecipesWrapper() {
  const location = useLocation();

  const { search } = location;

  return (
    <KeepAlive cacheKey={`recipes-${search}`}>
      <RecipesPage />
    </KeepAlive>
  );
}
