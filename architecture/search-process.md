# Search process

User adds the ingredients from the list of predefined ingredients or specifies their own.

Recipes should be matched instantly - matching should be updated each time a new ingredient is added.

If the provided ingredient is unknown, it is ignored completely if it's 1 word only or trimmed (from the start) and tried to be matched again. At this point, source dataset offers above 8000 unique ingredients with unique IDs. Each recipe record in the dataset is provided with the set of ingredients IDs.

Recipes shall be sorted by relevance - the more requested ingredients included, the more relevant the recipe is.

Ingredients can be added to the list of excluded ingredients so that no recipes with these ingredients included are shown.

Matched recipes are displayed in a grid with cover image, recipe name and perhaps some additional info (cooking time or rating...).

At this point, more than 170 000 tokenized recipes with ingredient IDs are available. Free datasets from kaggle.com are used.

## Recipe display

Once the recipe is clicked, the searching grid is replaced with the recipe description

### Cover image on the top

- Extracted dynamically from the source Food.com to avoid redundant image storage 

### Ingredients

- The list of matched ingredient names
- Does not include measures
- If matched with Wikidata ingredient, the ingredient image is shown on mouse hover
  - Can be clicked for redirection to the ingredient info page (with data extracted from Wikidata)

### Steps

- Individual recipe directions as they were extracted from the database

### Additional info

- Preparation time (in minutes)
- Tags
- Description
- Rating
- Review text

### Link to the source

- Currently all the recipes are crawled from Food.com

