const express = require('express');
const bodyParser = require('body-parser');

const recipesRoutes = require('./routes/recipes-routes');
const ingredientsRoutes = require('./routes/ingredients-routes');

const app = express();

app.use(recipesRoutes);
app.use(ingredientsRoutes);

app.listen(5000);
