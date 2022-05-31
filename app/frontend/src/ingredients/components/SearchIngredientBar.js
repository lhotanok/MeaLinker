import React, { useEffect, useState } from 'react';
import AutocompleteSearchBar from '../../shared/components/AutocompleteSearchBar';
import useHttp from '../../shared/hooks/use-http';

export default function SearchIngredientBar(props) {
  const { onSearch } = props;

  const [ingredients, setIngredients] = useState([]);

  const { sendRequest: fetchIngredients } = useHttp();

  useEffect(
    () => {
      const requestConfig = {
        url: `http://localhost:5000/api/ingredients`,
      };

      const fetchedIngredientsHandler = (ingredients) => {
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
