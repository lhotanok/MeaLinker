import { Chip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { SimpleIngredient } from '../types/SimpleIngredient';

type IngredientChipProps = {
  item: SimpleIngredient;
};

export default function IngredientChip({ item }: IngredientChipProps) {
  const navigate = useNavigate();

  const ingredientPath = `/ingredients/${item.id}`;

  return (
    <Chip
      label={item.name}
      component='a'
      clickable
      color='secondary'
      onClick={() => navigate(ingredientPath)}
    />
  );
}
