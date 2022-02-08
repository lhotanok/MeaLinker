# Knowledge graph search

## Ingredient search

All unique ingredients are linked with the corresponding DBpedia and Wikidata resources during the phase of data preprocessing.
An additional info for all matched ingredients is then extracted from the external graphs using their public sparql endopoints.
Scraped details are merged with ingredients basic information to form enriched json-ld documents.

JSON-LD documents representing detailed ingredient info will be used for generating ingredient pages. Recipe documents
will only contain basic ingredient info such as name and image link.

In case the user hovers to the ingredient name from the recipe detail page, the ingredient cover image should be shown if it's provided. Both ingredient name and image should be clickable to get to the page with more detailed info.