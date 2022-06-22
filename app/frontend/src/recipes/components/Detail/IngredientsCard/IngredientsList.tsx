import {
  ListItem,
  ListItemText,
  Divider,
  List,
  ListItemAvatar,
  Box,
} from '@mui/material';
import { Fragment } from 'react';
import { shiftNonAmountIngredientsToBack } from '../../../../shared/tools/value-prettifier';
import { RecipeIngredient } from '../../../types/FullRecipe';
import HighlightedIngredient from './HighlightedIngredient';
import IngredientAmount from './IngredientAmount';

type IngredientsListProps = {
  ingredients: RecipeIngredient[];
};
export default function IngredientsList({ ingredients }: IngredientsListProps) {
  const sortedIngredients = shiftNonAmountIngredientsToBack(ingredients);

  const ingredientItems = sortedIngredients.map((ingredient, index) => {
    const { amount } = ingredient;

    return (
      <Fragment key={index}>
        <ListItem>
          <ListItemAvatar>
            {amount && (
              <Box display='flex' justifyContent='center' alignItems='center' height={6}>
                <IngredientAmount amount={amount} />
              </Box>
            )}
          </ListItemAvatar>
          <ListItemText
            primary={<HighlightedIngredient ingredient={ingredient} />}
            sx={{ paddingLeft: 1 }}
          />
        </ListItem>
        {index !== ingredients.length - 1 && <Divider component='li' variant='inset' />}
      </Fragment>
    );
  });

  return <List>{ingredientItems}</List>;
}
