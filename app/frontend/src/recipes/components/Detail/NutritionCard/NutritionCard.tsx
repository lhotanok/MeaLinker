import { RecipeNutrition } from '../../../types/FullRecipe';
import nutritionIcon from '../../../../assets/nutrition-icon.png';
import caloriesIcon from '../../../../assets/kcal-icon.png';
import carbohydratesIcon from '../../../../assets/grain-icon.png';
import fatIcon from '../../../../assets/fat-icon.png';
import InfoCard from '../../../../shared/components/InfoCard';
import { Grid, List } from '@mui/material';
import NutritionListItem from './NutritionListItem';
import NutritionList, { NutritionItem } from './NutritionList';

type NutritionCardProps = {
  nutrition: RecipeNutrition;
};

export default function NutritionCard({ nutrition }: NutritionCardProps) {
  const {
    calories,
    fat,
    saturatedFat,
    carbohydrate,
    sugar,
    cholesterol,
    fiber,
    protein,
    sodium,
  } = nutrition;

  const nutritionItems: NutritionItem[] = [
    { name: 'Calories', icon: caloriesIcon, value: calories },
    { name: 'Carbs', icon: carbohydratesIcon, value: carbohydrate },
    { name: 'Protein', icon: fatIcon, value: protein },
    { name: 'Fiber', icon: fatIcon, value: fiber },
    { name: 'Sugar', icon: fatIcon, value: sugar },

    { name: 'Fat', icon: fatIcon, value: fat },
    { name: 'Cholesterol', icon: fatIcon, value: cholesterol },
    { name: 'Sodium', icon: fatIcon, value: sodium },
    { name: 'Saturated fat', icon: fatIcon, value: saturatedFat },
  ];

  const nutritionGrid = (
    <Grid container columnSpacing={15}>
      <Grid item xs={2.5}>
        <NutritionList nutritionItems={nutritionItems.slice(0, 3)} />
      </Grid>
      <Grid item xs={2.5}>
        <NutritionList nutritionItems={nutritionItems.slice(3, 6)} />
      </Grid>
      <Grid item xs={5.6}>
        <NutritionList nutritionItems={nutritionItems.slice(6, 9)} />
      </Grid>
    </Grid>
  );

  return <InfoCard title='Nutrition' iconSrc={nutritionIcon} content={nutritionGrid} />;
}
