import AutocompleteSearchBar from '../../../../shared/components/AutocompleteSearchBar';
import { FacetItem } from '../../../types/Facets';

type SearchIngredientBarProps = {
  ingredientFacets: FacetItem[];
  searchedItems: string[];
  onSearch: (searchedItems: string[]) => void;
  onRemove: (removedIngredients: string[]) => void;
};

export default function SearchIngredientBar({
  ingredientFacets,
  searchedItems,
  onSearch,
  onRemove,
}: SearchIngredientBarProps) {
  return (
    <AutocompleteSearchBar
      facetItems={ingredientFacets}
      searchedItems={searchedItems}
      label='Add ingredients (from the list / your own)'
      placeholder='Ingredients'
      onSearch={onSearch}
      onRemove={onRemove}
    />
  );
}
