import React from 'react';
import { useParams } from 'react-router-dom';

export default function RecipeDetail() {
  const params = useParams();
  const { recipeId } = params;

  return (
    <section>
      <h1>Recipe Detail</h1>
      <p>{`ID: ${recipeId}`}</p>
    </section>
  );
}
