import { Fragment } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import SearchIngredients from '../../ingredients/components/SearchIngredients';
import SearchIngredientBar from '../../ingredients/components/SearchIngredientBar';
import RecipesGrid from '../components/RecipesGrid';

const DUMMY_RECIPE = {
  searchedIngredients: [],
  title: 'Slow Cooked Bacon Cheese Potatoes',
  id: '027754f4-4280-51f0-ab17-4e035721da31',
  description: `Honestly don't know how I came be this recipe other than I printed it out because I thought it looked good and it gave the alternative of cooking in the oven.`,
  date: 'February 27, 2014',
  rating: 4.5,
  totalMins: 620,
  image:
    'https://img.sndimg.com/food/image/upload/q_92,fl_progressive,w_1200,c_scale/v1/img/recipes/51/37/69/QjAmeeCQKGquX87Uf9zM_0S9A2936.jpg',
  ingredients: [
    '200 g bacon (diced)',
    '2 medium onions (thinly sliced)',
    '4 medium potatoes (thinly sliced)',
    '225 g cheddar cheese (thinly sliced)',
    'salt (to taste)',
    'pepper (to taste)',
    'butter (use your discretion)',
    'spring onion (green onions) (optional)',
  ],
};

export default function Recipes() {
  const history = useHistory();
  const location = useLocation();

  const { pathname, search } = location;

  const queryParams = new URLSearchParams(decodeURI(search));
  const ingredients = getIngredients(queryParams);

  const recipes = [{ ...DUMMY_RECIPE, searchedIngredients: ingredients }];

  const searchByIngredientsHandler = (searchIngredients) => {
    const mergedIngredients = mergeSearchIngredients(
      ingredients,
      searchIngredients,
    );

    history.push(buildCurrentUrl(pathname, queryParams, mergedIngredients));
  };

  const searchIngredientRemoveHandler = (removedIngredient) => {
    const filteredIngredients = ingredients.filter(
      (ingredient) => ingredient.label !== removedIngredient.label,
    );

    history.push(buildCurrentUrl(pathname, queryParams, filteredIngredients));
  };

  return (
    <Fragment>
      <Box
        sx={{
          bgcolor: 'background.paper',
          pt: 4,
          pb: 6,
        }}
      >
        <Container>
          <SearchIngredientBar onSearch={searchByIngredientsHandler} />
          <Typography
            component='h1'
            variant='h2'
            align='center'
            color='text.primary'
            marginTop='5%'
            gutterBottom
          >
            Found {recipes.length} recipe{recipes.length === 1 ? '' : 's'}
          </Typography>
          <SearchIngredients
            ingredients={ingredients}
            onRemove={searchIngredientRemoveHandler}
          />
        </Container>
      </Box>
      <RecipesGrid recipes={recipes} />
    </Fragment>
  );
}

/** @typedef {{ key: string, label: string}[]} Ingredients */

/**
 *
 * @param {URLSearchParams} queryParams
 */
const getIngredients = (queryParams) => {
  const joinedIngredients = queryParams.get('ingredients');
  const ingredients = joinedIngredients ? joinedIngredients.split(';') : [];

  const uniqueIngredients = ingredients.map((ingredient, index) => {
    return {
      key: index,
      label: ingredient,
    };
  });

  console.log(
    `Ingredients extracted from query params: ${JSON.stringify(
      uniqueIngredients,
    )}`,
  );

  return uniqueIngredients;
};

/**
 *
 * @param {string} pathname
 * @param {URLSearchParams} queryParams
 * @param {Ingredients} ingredients
 * @returns
 */
const buildCurrentUrl = (pathname, queryParams, ingredients) => {
  const updatedQueryParams = queryParams;

  const encodedIngredients = encodeIngredientsToQueryParam(ingredients);
  updatedQueryParams.set('ingredients', encodedIngredients);

  return `${pathname}?${updatedQueryParams.toString()}`;
};

/**
 *
 * @param {Ingredients} ingredients
 * @returns {string}
 */
const encodeIngredientsToQueryParam = (ingredients) => {
  const ingredientLabels = ingredients.map((ingredient) => ingredient.label);
  const joinedIngredients = ingredientLabels.join(';');
  const encodedIngredients = encodeURIComponent(joinedIngredients);

  return encodedIngredients;
};

/**
 *
 * @param {Ingredients} originalIngredients
 * @param {Ingredients} newIngredients
 * @returns {Ingredients}
 */
const mergeSearchIngredients = (originalIngredients, newIngredients) => {
  const ingredientLabels = originalIngredients.map(
    (original) => original.label,
  );

  newIngredients.forEach((ingredient) => {
    if (!ingredientLabels.includes(ingredient)) {
      ingredientLabels.push(ingredient);
    }
  });

  const mergedIngredients = ingredientLabels.map((label, index) => {
    return {
      key: index,
      label,
    };
  });

  return mergedIngredients;
};
