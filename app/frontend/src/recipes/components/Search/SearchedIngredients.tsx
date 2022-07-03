import Stack from '@mui/material/Stack';
import RemovableChips from '../../../shared/components/RemovableChips';

type SearchedIngredientsProps = {
  ingredients: string[];
  onRemove: (items: string[]) => void;
};

export default function SearchedIngredients({
  ingredients,
  onRemove,
}: SearchedIngredientsProps) {
  return (
    <Stack sx={{ pt: 4 }} direction='row' spacing={2} justifyContent='center'>
      <RemovableChips items={ingredients} onRemove={onRemove} />{' '}
    </Stack>
  );
}
