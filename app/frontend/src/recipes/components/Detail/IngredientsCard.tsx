import {
  Card,
  CardHeader,
  Divider,
  ListItem,
  ListItemIcon,
  ListItemText,
  CardContent,
  List,
  Avatar,
  Box,
} from '@mui/material';
import { RecipeIngredient } from '../../types/FullRecipe';
import ingredientsIcon from '../../../assets/ingredients-icon.png';
import { Fragment } from 'react';
import ImageIcon from '../../../shared/components/ImageIcon';
import { PRIMARY_COLOR } from '../../../shared/constants';
import IngredientsList from './IngredientsList';

type IngredientsCardProps = {
  ingredients?: RecipeIngredient[];
  servings?: string;
};

export default function IngredientsCard({
  ingredients = [],
  servings,
}: IngredientsCardProps) {
  return (
    <Box pt={5}>
      <Card raised>
        <CardHeader
          title='Ingredients'
          subheader={
            servings ? (
              `Yield: ${servings} serving${servings.length !== 1 ? 's' : ''}`
            ) : (
              ''
            )
          }
          titleTypographyProps={{ component: 'h2', variant: 'h5' }}
          avatar={<ImageIcon src={ingredientsIcon} alt='Ingredients' size={45} />}
        />
        <CardContent>
          <IngredientsList ingredients={ingredients} />
        </CardContent>
      </Card>
    </Box>
  );
}
