import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from 'react-router-dom';
import Ingredients from './ingredients/pages/Ingredients';
import Recipes from './recipes/pages/Recipes';
import { createTheme, ThemeProvider } from '@mui/material/styles';

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
      <Router>
        <Switch>
          <Route path='/recipes' exact>
            <Recipes />
          </Route>
          <Route path='/ingredients' exact>
            <Ingredients />
          </Route>
          <Redirect to='/' />
        </Switch>
      </Router>
    </ThemeProvider>
  );
}
