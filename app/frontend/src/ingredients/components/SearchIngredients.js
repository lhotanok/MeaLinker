import * as React from 'react';
import RemovableChips from '../../shared/components/RemovableChips';

export default function SearchIngredients(props) {
  const { ingredients, onRemove } = props;

  console.log(ingredients);

  return <RemovableChips chips={ingredients} onRemove={onRemove} />;
}
