# Database search

## Ingredient search

Gets ingredient names from the user. It is not guaranteed that the names exist in the database - it has to be validated, invalid names can be shortened and attempted to be matched again.

Ingredient names have to be mapped on ingredient ids.

## Recipe search

Starts with a list of ingredients, gets all recipe matches sorted by relevance (the more ingredients matched, the better).
If more ingredients are provided, an intersection of matched recipes is created and returned as a result. If no such intersection exists, search restrictions are weakened by requiring not all of the ingredients but only their subset.

If any excluded ingredients are specified, all recipes that include these ingredients have to be excluded from the matches. 

For the individual matched recipes, the cover image(s) have to be crawled from the source website Food.com. The recipe id might be passed to the Food.com search bar and the cover image of searched recipe would then be extracted and used in the application. The images should be crawled gradually, not all at once for all matched recipes. 

## Recipe details search

Once one of the matched recipes is clicked, the user is redirected to the page with detailed recipe information. Given the recipe id, the search engine is able to extract all that is needed:

- All recipe ingredients
- Directions
- Description
- Preparation time
- Tags
- Rating and review