import Collapse from '@mui/material/Collapse';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import { SearchedIngredient } from '../../types/SearchedIngredient';

type RecipeCardCollapseProps = {
  expanded: boolean;
  ingredients: string[];
  searchedIngredients: SearchedIngredient[];
};

export default function RecipeCardCollapse({
  expanded,
  ingredients,
  searchedIngredients,
}: RecipeCardCollapseProps) {
  const ingredientElements = getIngredientElements(ingredients, searchedIngredients);

  return (
    <Collapse in={expanded} timeout='auto' unmountOnExit>
      <CardContent>
        <Typography variant='h6'>Ingredients</Typography>
        <Typography variant='body2' color='text.secondary'>
          <ul>{ingredientElements}</ul>
        </Typography>
      </CardContent>
    </Collapse>
  );
}

const getIngredientElements = (
  ingredients: string[],
  searchedIngredients: SearchedIngredient[],
) => {
  return ingredients.map((ingredient) => {
    let emphasize = false;
    searchedIngredients.forEach((searched) => {
      if (ingredient.toLocaleLowerCase().includes(searched.label.toLocaleLowerCase())) {
        emphasize = true;
      }
    });

    const ingredientItem = emphasize ? <strong>{ingredient}</strong> : ingredient;

    return <li key={Math.random()}>{ingredientItem}</li>;
  });
};
