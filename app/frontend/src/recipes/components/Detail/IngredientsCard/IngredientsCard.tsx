import { Box } from '@mui/material';
import { RecipeIngredient } from '../../../types/FullRecipe';
import ingredientsIcon from '../../../../assets/diet-icon.png';
import IngredientsList from './IngredientsList';
import InfoCard from '../../../../shared/components/InfoCard';
import { buildPlural } from '../../../../shared/tools/value-prettifier';

type IngredientsCardProps = {
  ingredients?: RecipeIngredient[];
  servings?: string;
};

export default function IngredientsCard({
  ingredients = [],
  servings,
}: IngredientsCardProps) {
  const subheader = servings ? `Yield: ${buildPlural('serving', servings)}` : '';
  return (
    <Box pt={6}>
      <InfoCard
        title='Ingredients'
        subheader={subheader}
        iconSrc={ingredientsIcon}
        content={<IngredientsList ingredients={ingredients} />}
      />
    </Box>
  );
}
