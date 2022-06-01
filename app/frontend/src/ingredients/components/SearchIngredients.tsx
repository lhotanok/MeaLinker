import RemovableChips from '../../shared/components/RemovableChips';
import Stack from '@mui/material/Stack';
import { SearchedIngredient } from '../../recipes/types/SearchedIngredient';

type SearchIngredientsProps = {
  ingredients: SearchedIngredient[];
  onRemove: (event: any) => void;
};

export default function SearchIngredients({
  ingredients,
  onRemove,
}: SearchIngredientsProps) {
  return (
    <Stack sx={{ pt: 4 }} direction='row' spacing={2} justifyContent='center'>
      <RemovableChips chips={ingredients} onRemove={onRemove} />{' '}
    </Stack>
  );
}
