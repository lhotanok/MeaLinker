import { Grid } from '@mui/material';
import { NutritionIconValue } from '../types/NutritionIconValue';
import NutritionItem from './NutritionItem';

type NutritionGridProps = {
  nutritionItems: NutritionIconValue[];
  xs?: boolean;
};

export default function NutritionGrid({ nutritionItems, xs = true }: NutritionGridProps) {
  return (
    <Grid component='ul' container spacing={1.5} sx={{ padding: 0 }}>
      {nutritionItems.map(({ name, icon, value }) => (
        <Grid component='li' item key={name} xs={xs} sx={{ listStyle: 'none' }}>
          <NutritionItem
            name={name}
            icon={icon}
            nutritionValue={typeof value === 'object' ? value : { value, unit: '' }}
          />
        </Grid>
      ))}
    </Grid>
  );
}
