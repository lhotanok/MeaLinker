export type SimpleRecipe = {
  id: string;
  name: string;
  image: string;
  description: string;
  recipeCategory: string;
  stepsCount: number;
  rating: number;
  reviewsCount: number;
  tags: string[];
  ingredients: string[];
  cookMinutes: number;
  prepMinutes: number;
  totalMinutes: number;
  date: string;
  calories: number;
  fat: number;
  saturatedFat: number;
  cholesterol: number;
  sodium: number;
  carbohydrate: number;
  fiber: number;
  sugar: number;
  protein: number;
  _version_: number;
};

export type HighlightedFields = {
  ingredients?: string[];
};

export type SimpleRecipesResponse = {
  docs: SimpleRecipe[];
  totalCount: number;
  highlighting?: Record<string, HighlightedFields>;
};
