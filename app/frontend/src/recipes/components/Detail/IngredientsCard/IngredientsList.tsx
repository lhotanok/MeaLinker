import {
  ListItem,
  Avatar,
  ListItemText,
  Divider,
  List,
  ListItemAvatar,
  Box,
} from '@mui/material';
import { Fragment } from 'react';
import { PRIMARY_COLOR } from '../../../../shared/constants';
import { shiftNonAmountIngredientsToBack } from '../../../../shared/tools/value-prettifier';
import { RecipeIngredient } from '../../../types/FullRecipe';

type IngredientsListProps = {
  ingredients: RecipeIngredient[];
};
export default function IngredientsList({ ingredients }: IngredientsListProps) {
  const sortedIngredients = shiftNonAmountIngredientsToBack(ingredients);

  const ingredientItems = sortedIngredients.map((ingredient, index) => {
    const { text, amount, thumbnail } = ingredient;

    return (
      <Fragment key={index}>
        <ListItem>
          <ListItemAvatar>
            {amount && (
              <Box display='flex' justifyContent='center' alignItems='center' height={6}>
                <Avatar
                  sx={{
                    color: PRIMARY_COLOR,
                    bgcolor: 'inherit',
                    width: 'fit-content',
                  }}
                >
                  {amount}
                </Avatar>
              </Box>
            )}
          </ListItemAvatar>
          <ListItemText primary={text} sx={{ paddingLeft: 1 }} />
        </ListItem>
        {index !== ingredients.length - 1 && <Divider component='li' variant='inset' />}
      </Fragment>
    );
  });

  return <List>{ingredientItems}</List>;
}
