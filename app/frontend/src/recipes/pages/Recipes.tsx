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
import { PAGINATION_RESULTS_COUNT } from '../constants';

export default function Recipes() {
  const navigate = useNavigate();
  const location = useLocation();

  const { pathname, search } = location;

  const queryParams = new URLSearchParams(decodeURI(search));
  const ingredients = getIngredients(queryParams);

  const [recipes, setRecipes] = useState<SearchedRecipe[]>([]);
  const [recipesCount, setRecipesCount] = useState<number>(0);

  const { sendRequest: fetchRecipes } = useHttp();

  useEffect(
    () => {
      const searchParams = new URLSearchParams(decodeURI(search));

      if (searchParams.get('ingredients')) {
        searchParams.set('rows', PAGINATION_RESULTS_COUNT.toString());

        const requestConfig = {
          url: `http://localhost:5000/api/recipes${search}`,
        };

        const searchedIngredients = getIngredients(searchParams);

        const fetchedRecipesHandler = (recipes: SimpleRecipe[]) => {
          console.log(`First recipe: ${JSON.stringify(recipes[0], null, 2)}`);
          setRecipesCount(recipes.length);
          setRecipes(prepareRecipes(recipes, searchedIngredients));
        };

        fetchRecipes(requestConfig, fetchedRecipesHandler);
      }
    },
    [fetchRecipes, search],
  );

  const searchByIngredientsHandler = (searchIngredientLabels: string[]) => {
    const mergedIngredients = mergeSearchIngredients(ingredients, searchIngredientLabels);

    navigate(buildCurrentUrl(pathname, queryParams, mergedIngredients));
  };

  const searchIngredientRemoveHandler = (removedIngredient: SearchedIngredient) => {
    const filteredIngredients = ingredients.filter(
      (ingredient) => ingredient.label !== removedIngredient.label,
    );

    navigate(buildCurrentUrl(pathname, queryParams, filteredIngredients));
  };

  let searchingHeader = `Found ${recipesCount} recipe${recipes.length === 1 ? '' : 's'}`;
  if (ingredients.length > 0 && recipesCount === 0) {
    searchingHeader = 'Searching recipes...';
  } else if (ingredients.length === 0) {
    searchingHeader = 'Add some ingredients';
  }

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
            {searchingHeader}
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
    `Ingredients extracted from query params: ${JSON.stringify(uniqueIngredients)}`,
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
  const encodedIngredients = encodeURI(joinedIngredients);

  return encodedIngredients;
};

const mergeSearchIngredients = (
  originalIngredients: SearchedIngredient[],
  newIngredientLabels: string[],
) => {
  const ingredientLabels = originalIngredients.map((original) => original.label);

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
  offset: number = 0,
) => {
  const searchedRecipes = recipeDocs
    .slice(offset, PAGINATION_RESULTS_COUNT)
    .map((recipeDoc) => {
      const date = new Intl.DateTimeFormat('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }).format(new Date(recipeDoc.date)); // example date format: June 5, 2022

      return {
        ...recipeDoc,
        date,
        searchedIngredients,
      };
    }) as SearchedRecipe[];

  return searchedRecipes;
};
