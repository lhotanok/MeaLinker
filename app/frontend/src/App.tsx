import { Route, Navigate, Routes } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Recipes from './recipes/pages/Recipes';
import { createTheme, ThemeProvider } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import Header from './shared/components/Header';
import Footer from './shared/components/Footer';
import IngredientDetail from './ingredients/pages/IngredientDetail';
import RecipeDetail from './recipes/pages/RecipeDetail';
import KeepAlive, { AliveScope } from 'react-activation';

import { PRIMARY_COLOR, SECONDARY_COLOR } from './shared/constants';
import TopScroll from './shared/components/TopScroll';
import { Fragment } from 'react';

const theme = createTheme({
  palette: {
    primary: {
      main: PRIMARY_COLOR,
    },
    secondary: {
      main: SECONDARY_COLOR,
    },
  },
});

export default function App() {
  return (
    <HelmetProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Header />
        <main>
          <AliveScope>
            <Routes>
              <Route
                path='/recipes'
                element={
                  <KeepAlive cacheKey='Recipes' saveScrollPosition='screen'>
                    <Recipes />
                  </KeepAlive>
                }
              />
              <Route
                path='/recipes/:recipeId'
                element={
                  <Fragment>
                    <TopScroll />
                    <KeepAlive cacheKey='Recipe'>
                      <RecipeDetail />
                    </KeepAlive>
                  </Fragment>
                }
              />
              <Route
                path='/ingredients/:ingredientId'
                element={
                  <KeepAlive cacheKey='Ingredient'>
                    <IngredientDetail />
                  </KeepAlive>
                }
              />
              <Route path='/' element={<Navigate to='/recipes' />} />
            </Routes>
          </AliveScope>
        </main>
        <Footer />
      </ThemeProvider>
    </HelmetProvider>
  );
}
