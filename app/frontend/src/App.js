import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from 'react-router-dom';
import Recipes from './recipes/pages/Recipes';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Header from './shared/Header';
import Footer from './shared/Footer';
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
        <Router>
          <Switch>
            <Route path='/recipes' exact>
              <Recipes />
            </Route>
            <Route path='/recipes/:recipeId' exact>
              <RecipeDetail />
            </Route>
            <Route path='/ingredients/:ingredientId' exact>
              <IngredientDetail />
            </Route>
            <Redirect to='/' />
          </Switch>
        </Router>
      </main>
      <Footer />
    </ThemeProvider>
  );
}
