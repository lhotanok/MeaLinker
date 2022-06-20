import { Card, CardHeader, Avatar } from '@mui/material';
import { RecipeIngredient } from '../../types/FullRecipe';
import ingredientsIcon from '../../../assets/ingredients-icon.png';

type IngredientsCardProps = {
  ingredients?: RecipeIngredient[];
  servings?: string;
};

export default function IngredientsCard({
  ingredients = [],
  servings,
}: IngredientsCardProps) {
  return (
    <Card>
      <CardHeader
        title='Ingredients'
        subheader={servings ? `Yield: ${servings} servings` : ''}
        titleTypographyProps={{ component: 'h2', variant: 'h5' }}
        avatar={
          <Avatar>
            <img src={ingredientsIcon} alt='MeaLinker' width={30} />
          </Avatar>
        }
      />
    </Card>
  );
}
