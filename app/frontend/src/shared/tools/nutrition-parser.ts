import { GRAM_TYPE_IRI, MILLIGRAM_TYPE_IRI } from '../../ingredients/constants';
import { FullIngredient, MeasuredValue } from '../../ingredients/types/FullIngredient';
import { Measurable } from '../../recipes/types/FullRecipe';
import { ICON_PATHS } from '../constants';
import { NutritionIconValue } from '../types/NutritionIconValue';

export const parseNutritionFromIngredientJsonld = (ingredient: FullIngredient) => {
  const { carbs, fat, fiber, kj, protein, sugars } = ingredient.jsonld;

  const KCAL_TO_KJ = 4.184; // 4.184 kilojoule = 1 kilocalorie
  const kilojoules = Array.isArray(kj) ? kj[0] : kj;
  const calories = kilojoules ? Number((kilojoules / KCAL_TO_KJ).toFixed(2)) : undefined;

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

  return nutritionWithIcons;
};

export const buildNutritionItems = (
  nutritionWithIcons: {
    name: string;
    icon: string;
    value?: number | MeasuredValue | MeasuredValue[];
  }[],
): NutritionIconValue[] => {
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

      const measurableValue: Measurable = { value, unit: '' };

      if (typeof measuredValue === 'object') {
        if (measuredValue['@type'] === GRAM_TYPE_IRI) {
          measurableValue.unit = 'g';
        } else if (measuredValue['@type'] === MILLIGRAM_TYPE_IRI) {
          measurableValue.unit = 'mg';
        }
      }

      const nutritionValue: NutritionIconValue = { ...nutrition, value: measurableValue };
      nutritionItems.push(nutritionValue);
    }
  });

  return nutritionItems;
};
