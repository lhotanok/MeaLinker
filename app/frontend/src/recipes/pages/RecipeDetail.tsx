import { useState, useEffect, Fragment } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import LoadingProgress from '../../shared/components/LoadingProgress';
import useHttp from '../../shared/hooks/use-http';
import Container from '@mui/material/Container';
import { FullRecipe } from '../types/FullRecipe';
import { Box, Button, Card, CardContent, Divider, Grid, Typography } from '@mui/material';
import ZoomableImage from '../../shared/components/ZoomableImage';
import { convertToReadableDate } from '../../shared/tools/value-prettifier';
import RecipeHeader from '../components/Detail/RecipeHeader';
import IngredientsCard from '../components/Detail/IngredientsCard/IngredientsCard';
import NutritionCard from '../components/Detail/NutritionCard/NutritionCard';
import DirectionsCard from '../components/Detail/DirectionsCard';

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
      window.scrollTo(0, 0);
      const requestConfig = {
        url: `http://localhost:5000/api/recipes/${recipeId}`,
      };

      const fetchedRecipeHandler = (recipe: FullRecipe) => {
        console.log(JSON.stringify(recipe, null, 2));
        document.title = `Recipe | ${recipe.jsonld.name}`;
        setRecipe(recipe);
      };

      fetchRecipe(requestConfig, fetchedRecipeHandler);
    },
    [recipeId, fetchRecipe],
  );

  let headlineText = recipe.jsonld.name ? recipe.jsonld.name : '';
  if (error) headlineText = 'Recipe could not be loaded';
  if (isLoading) headlineText = ''; // 'Loading recipe...';

  const viewSourceButton = (
    <Button size='large' href={recipe.jsonld.url}>
      View Source
    </Button>
  );

  const directions = (recipe.jsonld.recipeInstructions || [])
    .map((instruction) => instruction.text);

  return (
    <Fragment>
      <Helmet>
        <script className='recipe-jsonld' type='application/ld+json'>
          {JSON.stringify(recipe.jsonld)}
        </script>
      </Helmet>
      <Container maxWidth='xl'>
        <Grid container padding={3} pt={6} spacing={6}>
          {isLoading && <LoadingProgress />}
          <Grid item key='left-column' xs>
            <Card raised>
              <CardContent>
                <RecipeHeader
                  headline={headlineText}
                  description={recipe.jsonld.description}
                  rating={recipe.structured.rating}
                />
                <Divider variant='middle' />
                <Box pt={3}>
                  <ZoomableImage
                    src={recipe.jsonld.image}
                    alt={recipe.jsonld.name}
                    actionButton={viewSourceButton}
                  />
                </Box>
                <Typography pt={1} color='text.secondary'>
                  {`Published: ${convertToReadableDate(recipe.jsonld.datePublished)}`}
                </Typography>
              </CardContent>
            </Card>
            <IngredientsCard
              ingredients={recipe.structured.ingredients}
              servings={recipe.structured.servings}
            />
          </Grid>
          <Grid item key='right-column' xs>
            <NutritionCard nutrition={recipe.structured.nutritionInfo || {}} />
            <DirectionsCard directions={directions} />
          </Grid>
        </Grid>
      </Container>
    </Fragment>
  );
}
