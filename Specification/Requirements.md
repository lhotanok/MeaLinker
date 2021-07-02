# Requirements

## Recipe search

* **Searching by ingredients**
  * Add ingredients from the menu
  * Add ingredients using search bar with autocomplete (offering known ingredients from dataset)
* **Results filtering**
  * Exclude ingredient (using search bar with autocomplete)
  * Edit implicit best-match sorting
    * Add tags
    * Sort by recipe's total number of ingredients (both ascending and descending)
    * Sort by number of minutes needed for recipe's preparation
    * Sort by rating (and secondary by best match)

## Recipe preview

* Recipe's page shall be opened after clicking on the cover image from the grid of searched results
  * Page shall be integrated in the application, no redirection to source page without clicking the link explicitly
* **Recipe page shall consist of**
  * Recipe name and cover image
  * Ingredients
  * Directions
  * Preparation time
  * Link to source page
* **Each ingredient should have icons for**
  * Redirect to ingredient page within application
  * Add to shopping list
* **Button for adding all ingredients to the shopping list** should be provided

## Ingredient preview

* Ingredient name
* Cover image
* Short description
* Nutrition info (if extracted successfully, else left empty template or empty space)
* **'Is ingredient of' list**
  * If meal item clicked, recipes including this name are searched in dataset
* **Categories this ingredient is member of**
  * Can be clicked for redirection to page with category name and its ingredient members (ideally with cover images)
    * Ingredients can be added to the recipe search
    * Ingredients can be added to the shopping list

## Shopping list management

* **Ingredient items**
  * Can be deleted
  * Can be clicked for ingredient page redirection