import Collapse from '@mui/material/Collapse';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import { Card, Divider, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { Fragment } from 'react';
import reactStringReplace from 'react-string-replace';
import { CONTINUOUS_HIGHLIGHTINGS_REGEX, HIGHLIGHTED_ITEM_REGEX } from '../../constants';
import IngredientIcon from './IngredientIcon';

type RecipeCardCollapseProps = {
  expanded: boolean;
  ingredients: string[];
  cardWidth: number;
};

export default function RecipeCardCollapse({
  expanded,
  ingredients,
  cardWidth,
}: RecipeCardCollapseProps) {
  const ingredientElements = getIngredientElements(ingredients);

  return (
    <Collapse in={expanded} timeout='auto' unmountOnExit>
      <Card
        sx={{
          zIndex: 1,
          maxWidth: 400,
          width: cardWidth + 1,
          marginTop: -0.5,
          position: 'absolute',
        }}
      >
        <CardContent>
          <Typography variant='subtitle1'>{`${ingredients.length} ingredients`}</Typography>
          <List dense>{ingredientElements}</List>
        </CardContent>
      </Card>
    </Collapse>
  );
}

const getIngredientElements = (ingredients: string[]) => {
  return ingredients.map((ingredient) => {
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
      <Fragment key={Math.random()}>
        <ListItem>
          <ListItemIcon>
            <IngredientIcon />
          </ListItemIcon>
          <ListItemText secondary={ingredientItem} />
        </ListItem>
        <Divider variant='inset' component='li' />
      </Fragment>
    );
  });
};
