import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import LoadingProgress from '../../shared/components/LoadingProgress';
import useHttp from '../../shared/hooks/use-http';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { FullRecipe } from '../types/FullRecipe';

export default function RecipeDetail() {
  const [recipe, setRecipe] = useState<FullRecipe>({} as FullRecipe);

  const params = useParams();
  const { recipeId } = params;

  const { isLoading, error, sendRequest: fetchRecipe } = useHttp();

  useEffect(
    () => {
      const requestConfig = {
        url: `http://localhost:5000/api/recipes/${recipeId}`,
      };

      const fetchedRecipeHandler = (recipe: FullRecipe) => {
        console.log(JSON.stringify(recipe, null, 2));
        setRecipe(recipe);
      };

      fetchRecipe(requestConfig, fetchedRecipeHandler);
    },
    [recipeId, fetchRecipe],
  );

  let headlineText = recipe.jsonld ? recipe.jsonld.name : '';
  if (error) headlineText = 'Recipe could not be loaded';
  if (isLoading) headlineText = ''; // 'Loading recipe...';

  return (
    <Box
      sx={{
        bgcolor: 'background.paper',
        pt: 2,
      }}
    >
      <Container>
        <Typography
          component='h1'
          variant='h4'
          align='center'
          color='text.primary'
          gutterBottom
        >
          {headlineText}
        </Typography>
      </Container>
      {isLoading && <LoadingProgress />}
    </Box>
  );
}
