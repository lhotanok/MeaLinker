import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from 'react-router-dom';
import Ingredients from './ingredients/pages/Ingredients';
import Recipes from './recipes/pages/Recipes';

export default function App() {
  return (
    <Router>
      <Switch>
        <Route path='/' exact>
          <Recipes />
        </Route>
        <Route path='/ingredients' exact>
          <Ingredients />
        </Route>
        <Redirect to='/' />
      </Switch>
    </Router>
  );
}
