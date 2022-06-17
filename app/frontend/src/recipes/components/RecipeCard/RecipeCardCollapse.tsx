import Collapse from '@mui/material/Collapse';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import { SearchedIngredient } from '../../types/SearchedIngredient';
import { Card, Divider, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { MenuBookTwoTone } from '@mui/icons-material';
import { Fragment } from 'react';

type RecipeCardCollapseProps = {
  expanded: boolean;
  ingredients: string[];
  searchedIngredients: SearchedIngredient[];
  cardWidth: number;
};

export default function RecipeCardCollapse({
  expanded,
  ingredients,
  searchedIngredients,
  cardWidth,
}: RecipeCardCollapseProps) {
  const ingredientElements = getIngredientElements(ingredients, searchedIngredients);

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
          <Typography variant='h6'>Ingredients</Typography>
          <List dense>{ingredientElements}</List>
        </CardContent>
      </Card>
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

    return (
      <Fragment key={Math.random()}>
        <ListItem>
          <ListItemIcon>
            <MenuBookTwoTone fontSize='small' />
          </ListItemIcon>
          <ListItemText secondary={ingredientItem} />
        </ListItem>
        <Divider variant='inset' component='li' />
      </Fragment>
    );
  });
};
