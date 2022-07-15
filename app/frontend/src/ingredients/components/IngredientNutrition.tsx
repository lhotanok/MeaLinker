import { Grid } from '@mui/material';
import { Fragment } from 'react';
import FlexBox from '../../shared/components/FlexBox';
import NutritionGrid from '../../shared/components/NutritionGrid';

import { NutritionIconValue } from '../../shared/types/NutritionIconValue';

import NutritionDivider from './NutritionDivider';

type IngredientNutritionProps = {
  nutritionItems: NutritionIconValue[];
};

export default function IngredientNutrition({
  nutritionItems,
}: IngredientNutritionProps) {
  return (
    <Fragment>
      {nutritionItems.length > 0 && (
        <Grid item>
          <NutritionDivider />
        </Grid>
      )}
      <Grid item xs>
        <FlexBox>
          <NutritionGrid nutritionItems={nutritionItems} xs={false} />
        </FlexBox>
      </Grid>
    </Fragment>
  );
}
