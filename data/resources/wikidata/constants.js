exports.WIKIDATA_SPARQL_QUERY_PREFIX =
  'https://query.wikidata.org/sparql?format=json&query=';

exports.WIKIDATA_INGREDIENTS_QUERY = 'ingredients-wikidata.sparql';

exports.INGREDIENTS_GROUP_SIZE = 10;

const LABEL_PROP = 'http://www.w3.org/2000/01/rdf-schema#label';
const DESCRIPTION_PROP = 'http://www.w3.org/2000/01/rdf-schema#comment';

const WIKIDATA_PROPERTY_PREFIX = 'http://www.wikidata.org/prop/direct/';
const WIKIDATA_IMAGE_PROP = `${WIKIDATA_PROPERTY_PREFIX}P18`;
const WIKIDATA_COLOR_PROP = `${WIKIDATA_PROPERTY_PREFIX}P462`;
const WIKIDATA_COUNTRY__PROP = `${WIKIDATA_PROPERTY_PREFIX}P495`;
const WIKIDATA_HAS_PARTS_PROP = `${WIKIDATA_PROPERTY_PREFIX}P527`;
const WIKIDATA_MATERIAL_PROP = `${WIKIDATA_PROPERTY_PREFIX}P186`;
const WIKIDATA_SUBCLASS_OF_ENTITY_PROP = `${WIKIDATA_PROPERTY_PREFIX}P279`;
const WIKIDATA_UNICODE_PROP = `${WIKIDATA_PROPERTY_PREFIX}P487`;

exports.INGREDIENT_CONTEXT = {
  label: {
    '@id': LABEL_PROP,
  },
  description: {
    '@id': DESCRIPTION_PROP,
  },
  image: {
    '@id': WIKIDATA_IMAGE_PROP,
  },
  color: {
    '@id': WIKIDATA_COLOR_PROP,
  },
  unicodeChar: {
    '@id': WIKIDATA_UNICODE_PROP,
  },
  countryOfOrigin: {
    '@id': WIKIDATA_COUNTRY__PROP,
  },
  hasParts: {
    '@id': WIKIDATA_HAS_PARTS_PROP,
    '@type': '@id',
  },
  madeFromMaterial: {
    '@id': WIKIDATA_MATERIAL_PROP,
    '@type': '@id',
  },
  subclassOf: {
    '@id': WIKIDATA_SUBCLASS_OF_ENTITY_PROP,
    '@type': '@id',
  },
};
