import { Chip } from '@mui/material';
import { SimpleIngredient } from '../types/SimpleIngredient';

type IngredientChipProps = {
  item: SimpleIngredient;
};

export default function IngredientChip({ item }: IngredientChipProps) {
  return (
    <Chip
      label={item.name}
      component='a'
      href={`/ingredients/${item.id}`}
      clickable
      color='secondary'
    />
  );
}
