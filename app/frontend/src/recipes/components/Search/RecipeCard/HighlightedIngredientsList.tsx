import {
  ListItem,
  ListItemText,
  Divider,
  List,
  Avatar,
  ListItemAvatar,
} from '@mui/material';
import { Fragment } from 'react';
import reactStringReplace from 'react-string-replace';
import {
  CONTINUOUS_HIGHLIGHTINGS_REGEX,
  HIGHLIGHTED_ITEM_REGEX,
} from '../../../constants';
import vegetableIcon from '../../../../assets/vegetable-icon.png';
import { escapeAHrefContent } from '../../../../shared/tools/value-prettifier';

type IngredientsListProps = {
  ingredients: string[];
};

export default function HighlightedIngredientsList({
  ingredients,
}: IngredientsListProps) {
  const highlightedIngredients = ingredients.map((ingredient, index) => {
    const mergedHighlightsIngredient = ingredient.replace(
      CONTINUOUS_HIGHLIGHTINGS_REGEX,
      ' ',
    );

    const ingredientItem = ingredient.includes('href')
      ? escapeAHrefContent(ingredient.replace(/<\/?em>/gi, ''))
      : reactStringReplace(
          mergedHighlightsIngredient,
          HIGHLIGHTED_ITEM_REGEX,
          (match, i) => <strong key={i}>{match}</strong>,
        );

    return (
      <Fragment key={index}>
        <ListItem>
          <ListItemAvatar>
            <Avatar
              variant='rounded'
              src={vegetableIcon}
              sx={{ width: 20, height: 20 }}
            />
          </ListItemAvatar>

          <ListItemText secondary={ingredientItem} />
        </ListItem>
        <Divider variant='inset' component='li' />
      </Fragment>
    );
  });
  return <List dense>{highlightedIngredients}</List>;
}
