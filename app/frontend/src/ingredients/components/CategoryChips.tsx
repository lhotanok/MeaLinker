import { Chip, Grid } from '@mui/material';
import { Category } from '../types/FullIngredient';

type CategoryChipsProps = {
  categories: Category[];
};

export default function CategoryChips({ categories }: CategoryChipsProps) {
  return (
    <Grid container spacing={1}>
      {categories.map((category) => (
        <Grid item key={category.name}>
          <Chip label={category.name} />
        </Grid>
      ))}
    </Grid>
  );
}
