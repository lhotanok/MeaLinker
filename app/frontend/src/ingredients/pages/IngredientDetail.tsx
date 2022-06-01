import React from 'react';
import { useParams } from 'react-router-dom';

export default function IngredientDetail() {
  const params = useParams();
  const { ingredientId } = params;

  return (
    <section>
      <h1>Ingredient Detail</h1>
      <p>{`ID: ${ingredientId}`}</p>
    </section>
  );
}
