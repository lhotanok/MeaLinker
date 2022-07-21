import { Container } from '@mui/material';
import KeepAlive from 'react-activation';
import { useLocation } from 'react-router-dom';
import useSnackbar from '../../shared/hooks/use-snackbar';
import RecipesPage from './RecipesPage';

/**
 * Wrapper component used to set `cacheKey` property of `KeepAlive` komponent properly.
 * @returns
 */
export default function RecipesWrapper() {
  const location = useLocation();

  const { snackbar, setNewSnackbarText: setSnackbar } = useSnackbar();

  const { search } = location;
  const cacheKey = `recipes-${search}`;

  return (
    <Container>
      {snackbar}
      <KeepAlive cacheKey={cacheKey} id={cacheKey}>
        <RecipesPage setSnackbar={setSnackbar} />
      </KeepAlive>
    </Container>
  );
}
