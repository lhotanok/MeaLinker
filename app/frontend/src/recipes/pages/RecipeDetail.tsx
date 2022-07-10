import { useState, useEffect, Fragment } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import LinearLoadingProgress from '../../shared/components/LinearLoadingProgress';
import useHttp from '../../shared/hooks/use-http';
import Container from '@mui/material/Container';
import { FullRecipe } from '../types/FullRecipe';
import { Box, Button, Card, CardContent, Grid, Typography } from '@mui/material';
import ZoomableImage from '../../shared/components/ZoomableImage';
import { convertToReadableDate } from '../../shared/tools/value-prettifier';
import RecipeHeader from '../components/Detail/RecipeHeader';
import IngredientsCard from '../components/Detail/IngredientsCard/IngredientsCard';
import NutritionCard from '../components/Detail/NutritionCard/NutritionCard';
import DirectionsCard from '../components/Detail/DirectionsCard';
import PrepTimeBox from '../components/Detail/PrepTimeSection/PrepTimeBox';
import PrepTimeDivider from '../components/Detail/PrepTimeSection/PrepTimeDivider';

export default function RecipeDetail() {
  const [recipe, setRecipe] = useState<FullRecipe>({
    jsonld: {},
    structured: {},
  } as FullRecipe);

  const params = useParams();
  const { recipeId } = params;

  const { isLoading, error, sendRequest: fetchRecipes } = useHttp();

  useEffect(
    () => {
      window.scrollTo(0, 0);
      const recipeRequestConfig = {
        url: `http://localhost:5000/api/recipes/${recipeId}`,
      };

      const fetchedRecipeHandler = (recipe: FullRecipe) => {
        document.title = `Recipe | ${recipe.jsonld.name}`;
        setRecipe(recipe);
      };

      fetchRecipes(recipeRequestConfig, fetchedRecipeHandler);
    },
    [recipeId, fetchRecipes],
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
          {isLoading && <LinearLoadingProgress />}
          <Grid item key='left-column' lg={7} md={7} sm={12}>
            <Card raised>
              <CardContent>
                <RecipeHeader
                  headline={headlineText}
                  description={recipe.jsonld.description}
                  rating={recipe.structured.rating}
                  author={recipe.structured.author}
                />
                <PrepTimeDivider totalTime={(recipe.structured.time || {}).total} />
                <PrepTimeBox time={recipe.structured.time || {}} />
                <Box pt={5}>
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
            <DirectionsCard directions={directions} />
          </Grid>
          <Grid item key='right-column' xs>
            <NutritionCard nutrition={recipe.structured.nutritionInfo || {}} />
            <IngredientsCard
              ingredients={recipe.structured.ingredients}
              servings={recipe.jsonld.recipeYield}
            />
          </Grid>
        </Grid>
      </Container>
    </Fragment>
  );
}
