import NutritionGrid from '../../shared/components/NutritionGrid';
import { ICON_PATHS } from '../../shared/constants';
import { NutritionIconValue } from '../../shared/types/NutritionIconValue';
import { FullIngredient } from '../types/FullIngredient';

type IngredientNutritionProps = {
  ingredient: FullIngredient;
};

export default function IngredientNutrition({ ingredient }: IngredientNutritionProps) {
  const { carbs, fat, fiber, kj, protein, sugars } = ingredient.jsonld;

  const KCAL_TO_KJ = 4.184; // 4.184 kilojoule = 1 kilocalorie
  const calories = kj ? Number((kj / KCAL_TO_KJ).toFixed(2)) : undefined;

  const {
    caloriesIcon,
    fiberIcon,
    carbohydratesIcon,
    sugarIcon,
    fatIcon,
    proteinIcon,
  } = ICON_PATHS;

  const nutritionWithIcons = [
    { name: 'Calories', icon: caloriesIcon, value: calories },
    { name: 'Fiber', icon: fiberIcon, value: fiber },
    { name: 'Carbs', icon: carbohydratesIcon, value: carbs },
    { name: 'Sugar', icon: sugarIcon, value: sugars },
    { name: 'Protein', icon: proteinIcon, value: protein },
    { name: 'Fat', icon: fatIcon, value: fat },
  ];

  const nutritionItems: NutritionIconValue[] = [];

  nutritionWithIcons.forEach((nutrition) => {
    if (nutrition.value) {
      const measuredValue = Array.isArray(nutrition.value)
        ? nutrition.value[0]
        : nutrition.value;

      const value =
        typeof measuredValue === 'object'
          ? Number(measuredValue['@value'])
          : measuredValue;

      const nutritionValue: NutritionIconValue = { ...nutrition, value };
      nutritionItems.push(nutritionValue);
    }
  });

  return <NutritionGrid nutritionItems={nutritionItems} xs={false} />;
}
