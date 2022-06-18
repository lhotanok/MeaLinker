import * as React from 'react';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import RecipeCard from './RecipeCard/RecipeCard';
import { SimpleRecipe } from '../types/SimpleRecipesResponse';

type RecipesGridProps = {
  recipes: SimpleRecipe[];
};

export default function RecipesGrid({ recipes }: RecipesGridProps) {
  return (
    <React.Fragment>
      <Container>
        <Grid container spacing={4}>
          {recipes.map((recipe) => (
            <Grid item key={recipe.id} xs={12} md={4}>
              <RecipeCard {...recipe} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </React.Fragment>
  );
}
