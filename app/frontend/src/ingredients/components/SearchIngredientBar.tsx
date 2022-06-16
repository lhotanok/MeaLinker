import { useEffect, useState } from 'react';
import AutocompleteSearchBar from '../../shared/components/AutocompleteSearchBar';
import useHttp from '../../shared/hooks/use-http';
import { SimpleIngredient } from '../types/SimpleIngredient';

type SearchIngredientBarProps = {
  onSearch: (searchedItems: string[]) => void;
};

export default function SearchIngredientBar({
  onSearch,
}: SearchIngredientBarProps) {
  const [ingredients, setIngredients] = useState<SimpleIngredient[]>([]);

  const { sendRequest: fetchIngredients } = useHttp();

  useEffect(
    () => {
      const requestConfig = {
        url: `http://localhost:5000/api/ingredients`,
      };

      const fetchedIngredientsHandler = (ingredients: SimpleIngredient[]) => {
        setIngredients(ingredients);
      };

      fetchIngredients(requestConfig, fetchedIngredientsHandler);
    },
    [fetchIngredients],
  );

  const ingredientLabels = ingredients.map((ingredient) => ingredient.label);

  return (
    <AutocompleteSearchBar
      hints={ingredientLabels}
      label='Add ingredients'
      onSearch={onSearch}
    />
  );
}