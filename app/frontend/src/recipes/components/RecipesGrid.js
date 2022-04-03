import * as React from 'react';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import RecipeCard from './RecipeCard/RecipeCard';

export default function RecipesGrid(props) {
  const { recipes } = props;

  return (
    <React.Fragment>
      <Container maxWidth='md'>
        <Grid container spacing={4}>
          {recipes.map((recipe) => (
            <Grid item key={recipe.id} xs={12} sm={6} md={4}>
              <RecipeCard {...recipe} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </React.Fragment>
  );
}
