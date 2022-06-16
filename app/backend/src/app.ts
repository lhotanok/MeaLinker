import express from 'express';
import bodyParser from 'body-parser';

import recipesRoutes from './routes/recipes-routes';
import ingredientsRoutes from './routes/ingredients-routes';

const app = express();

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  // Request headers that should be allowed
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-Requested-With,content-type',
  );

  // Set to true if cookies should be used in the requests sent
  // to the API (with sessions)
  // res.setHeader('Access-Control-Allow-Credentials', true);

  next();
});

app.use('/api/recipes', recipesRoutes);
app.use('/api/ingredients', ingredientsRoutes);

app.listen(5000);
