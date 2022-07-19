type SearchParameters = {
  ingredients: string[];
  tags: string[];
  cuisine: string;
  diets: string[];
  mealTypes: string[];
  time: string;
  rows: number;
  offset: number;
};

type SearchQueryParameters = {
  ingredients: string;
  tags: string;
  cuisine: string;
  diets: string;
  time: string;
  mealTypes: string;
  rows: string;
  offset: string;
};
