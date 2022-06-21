import { useEffect, useState } from 'react';
import AutocompleteSearchBar from '../../../shared/components/AutocompleteSearchBar';
import useHttp from '../../../shared/hooks/use-http';
import { shuffleElements } from '../../../shared/tools/value-prettifier';
import { SimpleIngredient } from '../../types/SimpleIngredient';

type SearchIngredientBarProps = {
  onSearch: (searchedItems: string[]) => void;
};

export default function SearchIngredientBar({ onSearch }: SearchIngredientBarProps) {
  const [ingredients, setIngredients] = useState<SimpleIngredient[]>([]);

  const { sendRequest: fetchIngredients } = useHttp();

  useEffect(
    () => {
      const requestConfig = {
        url: `http://localhost:5000/api/ingredients`,
      };

      const fetchedIngredientsHandler = (ingredients: SimpleIngredient[]) => {
        shuffleElements(ingredients);
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
      label='Add ingredients (from the list / your own)'
      onSearch={onSearch}
    />
  );
}
