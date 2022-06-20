import {
  ListItem,
  ListItemIcon,
  Avatar,
  ListItemText,
  Divider,
  List,
} from '@mui/material';
import { Fragment } from 'react';
import FlexBox from '../../../shared/components/FlexBox';
import { PRIMARY_COLOR } from '../../../shared/constants';
import { shiftNonAmountIngredientsToBack } from '../../../shared/tools/value-prettifier';
import { RecipeIngredient } from '../../types/FullRecipe';

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
          <ListItemIcon>
            {amount && (
              <FlexBox>
                <Avatar
                  sx={{
                    color: PRIMARY_COLOR,
                    bgcolor: 'inherit',
                    width: 'fit-content',
                  }}
                >
                  {amount}
                </Avatar>
              </FlexBox>
            )}
          </ListItemIcon>
          <ListItemText primary={text} sx={{ paddingLeft: 1 }} />
        </ListItem>
        {index !== ingredients.length - 1 && <Divider component='li' variant='middle' />}
      </Fragment>
    );
  });

  return <List>{ingredientItems}</List>;
}
