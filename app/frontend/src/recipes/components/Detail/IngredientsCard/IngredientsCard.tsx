import { Box } from '@mui/material';
import { RecipeIngredient } from '../../../types/FullRecipe';
import ingredientsIcon from '../../../../assets/diet-icon.png';
import IngredientsList from './IngredientsList';
import InfoCard from '../../../../shared/components/InfoCard';
import { buildPlural } from '../../../../shared/tools/value-prettifier';
import { SimpleIngredient } from '../../../types/SimpleIngredient';

type IngredientsCardProps = {
  ingredients?: RecipeIngredient[];
  servings?: string;
  detailIngredients: SimpleIngredient[];
};

export default function IngredientsCard({
  ingredients = [],
  servings,
  detailIngredients,
}: IngredientsCardProps) {
  const subheader = servings ? `Yield: ${buildPlural('serving', servings)}` : '';
  return (
    <Box pt={6}>
      <InfoCard
        title='Ingredients'
        subheader={subheader}
        iconSrc={ingredientsIcon}
        content={
          <IngredientsList
            ingredients={ingredients}
            detailIngredients={detailIngredients}
          />
        }
      />
    </Box>
  );
}
