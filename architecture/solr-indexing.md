# Solr indices

Apache Solr search platform will be used as an intermediate layer between CouchDB and application's backend. It will store indices mapped on the individual JSON documents in CouchDB to provide faster and more advanced searching. It will support facet searching to help with website navigation and quick discovery of relevant results.

Documents stored in Solr will contain only a subset of fields from the complete CouchDB document. Fields that won't be used for indexing will be stored just in CouchDB to not overwhelm Solr with unnecessary data.

## Recipes

Application's main goal is to provide advanced recipe searching with many different custom filters. It is focused mainly on searching for recipes containing or excluding particular ingredients. 

### Indexed fields

- **id** (`string`)
- **name** (`string`)
- **ingredients** (`array<string>`)
- **recipeCategory** (`string`)
- **tags** (`array<string>`)
- **rating** (`float`)
- **stepsCount** (`int`)

#### Preparation time fields

- **cookMinutes** (`int`)
- **prepMinutes** (`int`)
- **totalMinutes** (`int`)

#### Nutrition fields

- **calories** (`int`)

- **fat** (`float`)
- **saturatedFat** (`float`)
- **cholesterol** (`float`)
- **sodium** (`float`)
- **carbohydrate** (`float`)
- **fiber** (`float`)
- **sugar** (`float`)
- **protein** (`float`)

## Ingredients

Indexing of recipe ingredients can be used for fast searching through all known ingredients during search ingredients specification. Various matching patterns can be used to offer all ingredients the user might consider using for recipe search. Once the ingredient is selected, it can be hovered and a corresponding thumbnail image should be displayed.

### Indexed fields

- **id** (`string`)
- **label** (`string`)
- **thumbnail** (`string`)
