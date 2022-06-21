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
import NutritionListItem from './NutritionListItem';

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

  const nutritionItems = [
    { name: 'Calories', icon: caloriesIcon, value: calories },
    { name: 'Fiber', icon: fiberIcon, value: fiber },
    { name: 'Cholesterol', icon: cholesterolIcon, value: cholesterol },
    { name: 'Carbs', icon: carbohydratesIcon, value: carbohydrate },
    { name: 'Sugar', icon: sugarIcon, value: sugar },
    { name: 'Sodium', icon: sodiumIcon, value: sodium },
    { name: 'Protein', icon: proteinIcon, value: protein },
    { name: 'Fat', icon: fatIcon, value: fat },
    { name: 'Saturated fat', icon: fatIcon, value: saturatedFat },
  ];

  const nutritionGrid = (
    <Grid container spacing={1.5}>
      {nutritionItems.map(({ name, icon, value }) => (
        <Grid item key={name} xs>
          <NutritionListItem name={name} icon={icon} nutritionValue={value} />
        </Grid>
      ))}
    </Grid>
  );

  return <InfoCard title='Nutrition' iconSrc={nutritionIcon} content={nutritionGrid} />;
}
