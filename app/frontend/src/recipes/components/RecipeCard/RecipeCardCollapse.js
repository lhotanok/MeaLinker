import React from 'react';
import Collapse from '@mui/material/Collapse';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';

const getIngredientElements = (ingredients, searchedIngredients) => {
  return ingredients.map((ingredient) => {
    let emphasize = false;
    searchedIngredients.forEach((searched) => {
      if (ingredient.toLocaleLowerCase().includes(searched)) {
        emphasize = true;
      }
    });

    const ingredientItem = <li>{ingredient}</li>;

    return emphasize ? <strong>{ingredientItem}</strong> : ingredientItem;
  });
};

export default function RecipeCardCollapse(props) {
  const { expanded, ingredients, searchedIngredients } = props;
  const ingredientElements = getIngredientElements(
    ingredients,
    searchedIngredients,
  );

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
