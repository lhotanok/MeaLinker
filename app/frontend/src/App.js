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
        <Switch>
          <Route exact path='/recipes' component={Recipes} />
          <Route exact path='/recipes/:recipeId' component={RecipeDetail} />
          <Route
            exact
            path='/ingredients/:ingredientId'
            component={IngredientDetail}
          />
          <Redirect to='/recipes' />
        </Switch>
      </main>
      <Footer />
    </ThemeProvider>
  );
}
