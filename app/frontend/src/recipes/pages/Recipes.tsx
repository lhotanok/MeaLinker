import { Fragment, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import SearchIngredients from '../../ingredients/components/SearchIngredients';
import SearchIngredientBar from '../../ingredients/components/SearchIngredientBar';
import RecipesGrid from '../components/RecipesGrid';
import useHttp from '../../shared/hooks/use-http';
import { SimpleRecipe } from '../types/SimpleRecipe';
import { SearchedRecipe } from '../types/SearchedRecipe';
import { SearchedIngredient } from '../types/SearchedIngredient';

// const DUMMY_RECIPE = {
//   id: '027754f4-4280-51f0-ab17-4e035721da31',
//   searchedIngredients: [],
//   name: 'Slow Cooked Bacon Cheese Potatoes',
//   description: `Honestly don't know how I came be this recipe other than I printed it out because I thought it looked good and it gave the alternative of cooking in the oven.`,
//   date: 'February 27, 2014',
//   rating: 4.5,
//   totalMinutes: 620,
//   image:
//     'https://img.sndimg.com/food/image/upload/q_92,fl_progressive,w_1200,c_scale/v1/img/recipes/51/37/69/QjAmeeCQKGquX87Uf9zM_0S9A2936.jpg',
//   ingredients: [
//     '200 g bacon (diced)',
//     '2 medium onions (thinly sliced)',
//     '4 medium potatoes (thinly sliced)',
//     '225 g cheddar cheese (thinly sliced)',
//     'salt (to taste)',
//     'pepper (to taste)',
//     'butter (use your discretion)',
//     'spring onion (green onions) (optional)',
//   ],
// };

export default function Recipes() {
  const navigate = useNavigate();
  const location = useLocation();

  const { pathname, search } = location;

  const queryParams = new URLSearchParams(decodeURI(search));
  const ingredients = getIngredients(queryParams);

  // { ...DUMMY_RECIPE, searchedIngredients: ingredients }
  const [recipes, setRecipes] = useState<SearchedRecipe[]>([]);

  const { sendRequest: fetchRecipes } = useHttp();

  useEffect(
    () => {
      if (search) {
        const requestConfig = {
          url: `http://localhost:5000/api/recipes?${search}`,
        };

        const searchedIngredients = getIngredients(
          new URLSearchParams(decodeURI(search)),
        );

        const fetchedRecipesHandler = (recipes: SimpleRecipe[]) => {
          console.log(`First recipe: ${JSON.stringify(recipes[0], null, 2)}`);
          setRecipes(prepareRecipes(recipes, searchedIngredients));
        };

        fetchRecipes(requestConfig, fetchedRecipesHandler);
      }
    },
    [fetchRecipes, search],
  );

  const searchByIngredientsHandler = (searchIngredientLabels: string[]) => {
    const mergedIngredients = mergeSearchIngredients(
      ingredients,
      searchIngredientLabels,
    );

    navigate(buildCurrentUrl(pathname, queryParams, mergedIngredients));
  };

  const searchIngredientRemoveHandler = (
    removedIngredient: SearchedIngredient,
  ) => {
    const filteredIngredients = ingredients.filter(
      (ingredient) => ingredient.label !== removedIngredient.label,
    );

    navigate(buildCurrentUrl(pathname, queryParams, filteredIngredients));
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

const getIngredients = (queryParams: URLSearchParams) => {
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

  return uniqueIngredients as SearchedIngredient[];
};

const buildCurrentUrl = (
  pathname: string,
  queryParams: URLSearchParams,
  ingredients: SearchedIngredient[],
) => {
  const updatedQueryParams = queryParams;

  const encodedIngredients = encodeIngredientsToQueryParam(ingredients);
  updatedQueryParams.set('ingredients', encodedIngredients);

  return `${pathname}?${updatedQueryParams.toString()}`;
};

const encodeIngredientsToQueryParam = (ingredients: SearchedIngredient[]) => {
  const ingredientLabels = ingredients.map((ingredient) => ingredient.label);
  const joinedIngredients = ingredientLabels.join(';');
  const encodedIngredients = encodeURIComponent(joinedIngredients);

  return encodedIngredients;
};

const mergeSearchIngredients = (
  originalIngredients: SearchedIngredient[],
  newIngredientLabels: string[],
) => {
  const ingredientLabels = originalIngredients.map(
    (original) => original.label,
  );

  newIngredientLabels.forEach((ingredientLabel) => {
    if (!ingredientLabels.includes(ingredientLabel)) {
      ingredientLabels.push(ingredientLabel);
    }
  });

  const mergedIngredients = ingredientLabels.map((label, index) => {
    return {
      key: index,
      label,
    };
  });

  return mergedIngredients as SearchedIngredient[];
};

const prepareRecipes = (
  recipeDocs: SimpleRecipe[],
  searchedIngredients: SearchedIngredient[],
) => {
  const searchedRecipes = recipeDocs.map((recipeDoc) => {
    const date = new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }).format(new Date(recipeDoc.date));

    return {
      ...recipeDoc,
      date,
      searchedIngredients,
    };
  }) as SearchedRecipe[];

  return searchedRecipes;
};
