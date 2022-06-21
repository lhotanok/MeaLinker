import { RecipeNutrition } from '../../../types/FullRecipe';
import nutritionIcon from '../../../../assets/pyramid-icon.png';
import caloriesIcon from '../../../../assets/kcal-icon.png';
import carbohydratesIcon from '../../../../assets/grain-icon.png';
import proteinIcon from '../../../../assets/protein-icon.png';
import fatIcon from '../../../../assets/fat-icon.png';
import fiberIcon from '../../../../assets/fiber-icon.png';
import sugarIcon from '../../../../assets/sugar-icon.png';
import sodiumIcon from '../../../../assets/sodium-icon.png';
import cholesterolIcon from '../../../../assets/cholesterol-icon.png';
import InfoCard from '../../../../shared/components/InfoCard';
import { Grid } from '@mui/material';
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
    { name: 'Protein', icon: proteinIcon, value: protein },
    { name: 'Fiber', icon: fiberIcon, value: fiber },
    { name: 'Sugar', icon: sugarIcon, value: sugar },
    { name: 'Fat', icon: fatIcon, value: fat },
    { name: 'Cholesterol', icon: cholesterolIcon, value: cholesterol },
    { name: 'Sodium', icon: sodiumIcon, value: sodium },
    { name: 'Saturated fat', icon: fatIcon, value: saturatedFat },
  ];

  const nutritionGrid = (
    <Grid container>
      <Grid item xs={3.7}>
        <NutritionList nutritionItems={nutritionItems.slice(0, 3)} />
      </Grid>
      <Grid item xs={3.7}>
        <NutritionList nutritionItems={nutritionItems.slice(3, 6)} />
      </Grid>
      <Grid item xs={4.3}>
        <NutritionList nutritionItems={nutritionItems.slice(6, 9)} />
      </Grid>
    </Grid>
  );

  return <InfoCard title='Nutrition' iconSrc={nutritionIcon} content={nutritionGrid} />;
}
