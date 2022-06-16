import { Route, Navigate, Routes } from 'react-router-dom';
import Recipes from './recipes/pages/Recipes';
import { createTheme, ThemeProvider } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import Header from './shared/components/Header';
import Footer from './shared/components/Footer';
import IngredientDetail from './ingredients/pages/IngredientDetail';
import RecipeDetail from './recipes/pages/RecipeDetail';

const theme = createTheme({
  palette: {
    primary: {
      main: '#dc1a22',
    },
    secondary: {
      main: '#548664',
    },
  },
});

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Header />
      <main>
        <Routes>
          <Route path='/recipes' element={<Recipes />} />
          <Route path='/recipes/:recipeId' element={<RecipeDetail />} />
          <Route
            path='/ingredients/:ingredientId'
            element={<IngredientDetail />}
          />
          <Route path='/' element={<Navigate to='/recipes' />} />
        </Routes>
      </main>
      <Footer />
    </ThemeProvider>
  );
}
