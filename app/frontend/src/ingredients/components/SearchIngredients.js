import * as React from 'react';
import RemovableChips from '../../shared/components/RemovableChips';
import Stack from '@mui/material/Stack';

export default function SearchIngredients(props) {
  const { ingredients, onRemove } = props;

  return (
    <Stack sx={{ pt: 4 }} direction='row' spacing={2} justifyContent='center'>
      <RemovableChips chips={ingredients} onRemove={onRemove} />{' '}
    </Stack>
  );
}
