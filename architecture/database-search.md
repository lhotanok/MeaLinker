## Database search

### Ingredient search

Gets ingredient names from the user. It is not guaranteed that the names exists in the database - it has to be validated, invalid name can be shortened and pushed to match attempt again.

Ingredient names have to be matched with ingredient IDs.

### Recipe search

Starts with the list of ingredients, gets all recipe matches sorted by relevance (the more ingredients matched, the better).

The total recipes count (170K) is significantly bigger than the number of all unique ingredients (8K). A suitable data pre-processing might help to decrease searching time a lot.

A table of columns `ingredient ID` and the list of `recipe IDs` might serve the purpose of getting all recipes that use a given ingredient. If more ingredients are provided, an intersection of  matched recipes is created and returned as a result. If no such intersection exists, search restrictions are weakened by requiring not all of the ingredients but their subset only.

If any excluded ingredients are specified, all recipes that include these ingredients have to be excluded from the matches. 

For the individual matched recipes the cover images have to be crawled from the Food.com source page. The recipe ID might be passed to the Food.com search bar and the cover image of searched recipe is then extracted and used in the application. The images shall be crawled gradually, not all at once for all matched recipes. 

### Recipe details search

Once one of the matched recipes is clicked the user is redirected to the page with detailed recipe information. Given the recipe ID, the search engine is able to extract all that is needed:

* All recipe ingredients
* Directions
* Description
* Preparation time
* Tags
* Rating and review

For this purpose the following source csv files mapped on database tables are used:

* `RAW_recipes.csv` (ingredients, steps, description, tags, minutes)
* `RAW_interactions.csv` (rating, review)