import { useState, useCallback, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useHttp from '../../shared/hooks/use-http';

export default function RecipeDetail() {
  const [recipe, setRecipe] = useState({});

  const params = useParams();
  const { recipeId } = params;

  const { isLoading, error, sendRequest: fetchRecipe } = useHttp();

  useEffect(
    () => {
      const requestConfig = {
        url: `http://localhost:5000/api/recipes/${recipeId}`,
      };

      const fetchedRecipeHandler = (recipeObj) => {
        console.log(JSON.stringify(recipeObj, null, 2));
        const recipeDocument = recipeObj.response.docs[0];
        setRecipe(recipeDocument);
      };

      fetchRecipe(requestConfig, fetchedRecipeHandler);
    },
    [recipeId, fetchRecipe],
  );

  return (
    <section>
      <h1>{recipe.name}</h1>
    </section>
  );
}
