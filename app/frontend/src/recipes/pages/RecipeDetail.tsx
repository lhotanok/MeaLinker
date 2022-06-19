import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import LoadingProgress from '../../shared/components/LoadingProgress';
import useHttp from '../../shared/hooks/use-http';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { FullRecipe } from '../types/FullRecipe';
import { Grid } from '@mui/material';
import ZoomableImage from '../../shared/components/ZoomableImage';

export default function RecipeDetail() {
  const [recipe, setRecipe] = useState<FullRecipe>({
    jsonld: {},
    structured: {},
  } as FullRecipe);

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
        document.title = recipe.jsonld.name;
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
    <Container>
      <Box pt={3} pl={2}>
        <Grid container>
          <Grid item key='headline' xs={12}>
            <Typography component='h1' variant='h4' color='text.primary' gutterBottom>
              {headlineText}
            </Typography>
          </Grid>
          {isLoading && <LoadingProgress />}
          <Grid item key={'banner'} xs={8}>
            <ZoomableImage src={recipe.jsonld.image} alt={recipe.jsonld.name} />
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}
