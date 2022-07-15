import { Grid, Box } from '@mui/material';
import { Fragment } from 'react';
import { Measurable } from '../../recipes/types/FullRecipe';
import NutritionGrid from '../../shared/components/NutritionGrid';
import { ICON_PATHS } from '../../shared/constants';
import { NutritionIconValue } from '../../shared/types/NutritionIconValue';
import { GRAM_TYPE_IRI, MILLIGRAM_TYPE_IRI } from '../constants';
import { FullIngredient, MeasuredValue } from '../types/FullIngredient';
import NutritionDivider from './NutritionDivider';

type IngredientNutritionProps = {
  ingredient: FullIngredient;
};

export default function IngredientNutrition({ ingredient }: IngredientNutritionProps) {
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

  const nutritionItems = buildNutritionItems(nutritionWithIcons);

  return (
    <Fragment>
      {nutritionItems.length > 0 && (
        <Grid item>
          <NutritionDivider />
        </Grid>
      )}
      <Grid item xs>
        <Box height='100%' pt={10}>
          <NutritionGrid nutritionItems={nutritionItems} xs={false} />
        </Box>
      </Grid>
    </Fragment>
  );
}

const buildNutritionItems = (
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
