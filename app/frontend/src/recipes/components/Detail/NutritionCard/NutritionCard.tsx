import { RecipeNutrition } from '../../../types/FullRecipe';
import InfoCard from '../../../../shared/components/InfoCard';
import { ICON_PATHS } from '../../../../shared/constants';
import NutritionGrid from '../../../../shared/components/NutritionGrid';

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

  const {
    caloriesIcon,
    fiberIcon,
    cholesterolIcon,
    carbohydratesIcon,
    sugarIcon,
    sodiumIcon,
    proteinIcon,
    fatIcon,
    nutritionIcon,
  } = ICON_PATHS;

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

  return (
    <InfoCard
      title='Nutrition'
      iconSrc={nutritionIcon}
      content={<NutritionGrid nutritionItems={nutritionItems} />}
    />
  );
}
