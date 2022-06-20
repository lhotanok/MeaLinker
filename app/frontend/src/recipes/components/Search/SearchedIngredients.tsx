import Stack from '@mui/material/Stack';
import RemovableChips from '../../../shared/components/RemovableChips';
import { SearchedIngredient } from '../../types/SearchedIngredient';

type SearchedIngredientsProps = {
  ingredients: SearchedIngredient[];
  onRemove: (event: any) => void;
  onRemoveAll: () => void;
};

export default function SearchedIngredients({
  ingredients,
  onRemove,
  onRemoveAll,
}: SearchedIngredientsProps) {
  return (
    <Stack sx={{ pt: 4 }} direction='row' spacing={2} justifyContent='center'>
      <RemovableChips
        chips={ingredients}
        onRemove={onRemove}
        onRemoveAll={onRemoveAll}
      />{' '}
    </Stack>
  );
}
