import AutocompleteSearchBar from '../../../shared/components/AutocompleteSearchBar';
import { FacetItem } from '../../types/Facets';

type SearchIngredientBarProps = {
  ingredientFacets: FacetItem[];
  onSearch: (searchedItems: string[]) => void;
  onRemove: (removedIngredients: string[]) => void;
};

export default function SearchIngredientBar({
  ingredientFacets,
  onSearch,
  onRemove,
}: SearchIngredientBarProps) {
  return (
    <AutocompleteSearchBar
      facetItems={ingredientFacets}
      label='Add ingredients (from the list / your own)'
      onSearch={onSearch}
      onRemove={onRemove}
    />
  );
}
