import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import { SimpleRecipe } from '../../types/SimpleRecipesResponse';
import RecipeCard from './RecipeCard/RecipeCard';

type RecipesGridProps = {
  recipes: SimpleRecipe[];
};

export default function RecipesGrid({ recipes }: RecipesGridProps) {
  return (
    <Container>
      <Grid container spacing={4} justifyContent='center'>
        {recipes.map((recipe, index) => {
          const props = { ...recipe, position: index };
          const oneOflastTwoCards =
            index !== recipes.length - 1 && index !== recipes.length - 2;

          return (
            <Grid
              item
              key={recipe.id}
              xs={recipes.length % 3 !== 2 ? true : oneOflastTwoCards ? true : false}
            >
              <RecipeCard {...props} />
            </Grid>
          );
        })}
      </Grid>
    </Container>
  );
}
