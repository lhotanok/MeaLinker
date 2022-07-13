type SearchParameters = {
  ingredients: string[];
  tags: string[];
  cuisine: string;
  diets: string[];
  mealTypes: string[];
  rows: number;
  offset: number;
};

type SearchQueryParameters = {
  ingredients: string;
  tags: string;
  cuisine: string;
  diets: string;
  mealTypes: string;
  rows: string;
  offset: string;
};
