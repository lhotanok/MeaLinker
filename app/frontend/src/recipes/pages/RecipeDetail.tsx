import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import LoadingProgress from '../../shared/components/LoadingProgress';
import useHttp from '../../shared/hooks/use-http';
import Container from '@mui/material/Container';
import { FullRecipe } from '../types/FullRecipe';
import { Button, Grid } from '@mui/material';
import ZoomableImage from '../../shared/components/ZoomableImage';
import { convertToReadableDate } from '../../shared/tools/value-prettifier';
import RecipeHeader from '../components/Detail/RecipeHeader';
import IngredientsCard from '../components/Detail/IngredientsCard';

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

  return (
    <Container maxWidth='xl'>
      <Grid container padding={3} spacing={8}>
        {isLoading && <LoadingProgress />}
        <Grid item key='left-column' xs={7}>
          <Grid container>
            <RecipeHeader
              headline={headlineText}
              description={recipe.jsonld.description}
              rating={recipe.structured.rating}
            />
            <Grid pt={3} xs={12} item key={'banner'}>
              <ZoomableImage
                src={recipe.jsonld.image}
                alt={recipe.jsonld.name}
                description={`Published: ${convertToReadableDate(
                  recipe.jsonld.datePublished,
                )}`}
                actionButton={viewSourceButton}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item key='right-column' xs={5}>
          <IngredientsCard
            ingredients={recipe.structured.ingredients}
            servings={recipe.structured.servings}
          />
        </Grid>
      </Grid>
    </Container>
  );
}
