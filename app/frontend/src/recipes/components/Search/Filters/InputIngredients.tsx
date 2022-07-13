import AutocompleteSearchBar from '../../../../shared/components/AutocompleteSearchBar';
import { FilterHandler } from '../../../types/Filters';

type InputIngredientsProps = {
  filterHandler: FilterHandler;
};

export default function InputIngredients({ filterHandler }: InputIngredientsProps) {
  const { value, facets, onSearch, onRemove } = filterHandler;
  return (
    <AutocompleteSearchBar
      facetItems={facets}
      searched={value}
      label='Add ingredients (from the list / your own)'
      placeholder='ingredient'
      onSearch={onSearch}
      onRemove={onRemove}
    />
  );
}
