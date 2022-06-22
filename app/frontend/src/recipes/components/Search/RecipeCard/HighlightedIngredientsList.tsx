import { ListItem, ListItemIcon, ListItemText, Divider, List } from '@mui/material';
import React, { Fragment } from 'react';
import reactStringReplace from 'react-string-replace';
import ImageIcon from '../../../../shared/components/ImageIcon';
import {
  CONTINUOUS_HIGHLIGHTINGS_REGEX,
  HIGHLIGHTED_ITEM_REGEX,
} from '../../../constants';
import vegetableIcon from '../../../../assets/vegetable-icon.png';

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

    const ingredientItem = reactStringReplace(
      mergedHighlightsIngredient,
      HIGHLIGHTED_ITEM_REGEX,
      (match, i) => <strong key={i}>{match}</strong>,
    );

    return (
      <Fragment key={index}>
        <ListItem>
          <ListItemIcon>
            <ImageIcon src={vegetableIcon} alt={ingredient} size={20} />
          </ListItemIcon>
          <ListItemText secondary={ingredientItem} />
        </ListItem>
        <Divider variant='inset' component='li' />
      </Fragment>
    );
  });
  return <List dense>{highlightedIngredients}</List>;
}
