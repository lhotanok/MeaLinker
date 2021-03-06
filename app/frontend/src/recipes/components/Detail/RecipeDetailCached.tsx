import { useState, useEffect, Fragment } from 'react';
import { useParams } from 'react-router-dom';
import LinearLoadingProgress from '../../../shared/components/LinearLoadingProgress';
import useHttp from '../../../shared/hooks/use-http';
import Container from '@mui/material/Container';
import { FullRecipe } from '../../types/FullRecipe';
import { Box, Button, Card, CardContent, Grid, Tooltip, Typography } from '@mui/material';
import ZoomableImage from '../../../shared/components/ZoomableImage';
import { convertToReadableDate } from '../../../shared/tools/value-prettifier';
import RecipeHeader from './RecipeHeader';
import IngredientsCard from './IngredientsCard/IngredientsCard';
import NutritionCard from './NutritionCard/NutritionCard';
import DirectionsCard from './DirectionsCard';
import PrepTimeBox from './PrepTimeSection/PrepTimeBox';
import PrepTimeDivider from './PrepTimeSection/PrepTimeDivider';
import JsonldHelmet from '../../../shared/components/JsonldHelmet';
import FlexBox from '../../../shared/components/FlexBox';
import RecipeBreadcrumbs from './RecipeBreadcrumbs';
import TagGrid from './TagGrid';

export default function RecipeDetailCached() {
  const [recipe, setRecipe] = useState<FullRecipe>({
    jsonld: {},
    structured: {},
  } as FullRecipe);

  const params = useParams();

  const { recipeId } = params;

  const { isLoading, error, sendRequest: fetchRecipes } = useHttp();

  useEffect(
    () => {
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
  if (isLoading) headlineText = '';

  const viewSourceButton = (
    <Tooltip title={recipe.jsonld.url || ''} placement='left'>
      <Button size='medium' href={recipe.jsonld.url}>
        View Source
      </Button>
    </Tooltip>
  );

  return (
    <Fragment>
      {error && (
        <FlexBox>
          <Typography variant='h4' pt={5}>
            {headlineText}
          </Typography>
        </FlexBox>
      )}
      {!error && (
        <Fragment>
          <JsonldHelmet
            jsonld={JSON.stringify({ ...recipe.jsonld, identifier: undefined })}
            typeLabel='recipe'
          />
          <Container maxWidth='xl'>
            <Box padding={3} pt={3}>
              <RecipeBreadcrumbs recipeName={recipe.jsonld.name} />
              <TagGrid
                tags={recipe.structured.tags}
                category={recipe.jsonld.recipeCategory}
              />
            </Box>
            <Grid container padding={3} pt={2} spacing={6}>
              {isLoading && <LinearLoadingProgress />}
              <Grid item key='left-column' lg={7} md={7} sm={12}>
                <Card>
                  <CardContent>
                    <RecipeHeader
                      headline={headlineText}
                      description={recipe.jsonld.description}
                      rating={recipe.structured.rating}
                      author={recipe.structured.author || recipe.jsonld.author}
                    />
                    <PrepTimeDivider totalTime={(recipe.structured.time || {}).total} />
                    <PrepTimeBox time={recipe.structured.time || {}} />
                    <ZoomableImage
                      src={recipe.jsonld.image}
                      alt={recipe.jsonld.name}
                      actionButton={viewSourceButton}
                    />
                    <Typography pt={1} color='text.secondary'>
                      {`Published: ${convertToReadableDate(recipe.jsonld.datePublished)}`}
                    </Typography>
                  </CardContent>
                </Card>
                <DirectionsCard directions={recipe.jsonld.recipeInstructions || []} />
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
      )}
    </Fragment>
  );
}
