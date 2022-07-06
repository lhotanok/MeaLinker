Dataset downloaded from Kaggle:
https://www.kaggle.com/shuyangli94/food-com-recipes-and-user-interactions

Once `recipes/RAW_recipes.csv` file is downloaded, `run.bat` script can be invoked. The number of recipes that should be extracted can be easily specified in
`constants.js`, namely through `RECIPES_TO_EXTRACT` value.

Recipe ids extracted from Kaggle dataset are used to create start urls for Apify actor
that fetches JSON-LDs from recipe detail pages. It also extends JSON-LD by collection of
structured values parsed from JSON-LD. Fetched JSON-LDs are then merged with normalized
ingredient names.

Normalized ingredient names from Kaggle dataset are mapped on the corresponding entities
in DBpedia and Wikidata. These external knowledge graphs are used for extraction of additional
information for each matched ingredient. Food.com ingredients are extended by description,
image link, nutrition information and other info from DBpedia and Wikidata.