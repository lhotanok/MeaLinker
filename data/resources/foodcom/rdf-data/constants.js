exports.DBPEDIA_LINKS_PATH = 'dbpedia-links.nt';
exports.WIKIDATA_LINKS_PATH = 'wikidata-links.nt';

exports.DBPEDIA_INGREDIENTS_PATH = 'dbpedia-ingredients.json';
exports.WIKIDATA_INGREDIENTS_PATH = 'wikidata-ingredients.json';

exports.RDF_INGREDIENTS_PATH = 'ingredients.ttl';
exports.UNIQUE_INGR_WITH_IDS_PATH = '../ingredients/unique_ingr_map.json';
exports.JSONLD_INGRS_PATH = 'jsonld-ingredients.json';

exports.RDF_PREFIXES = {
  INGREDIENT_PREFIX: `http://example.org/ingredients#`,
  RDFS_PREFIX: 'http://www.w3.org/2000/01/rdf-schema#',
};

exports.NON_DIGIT_REGEX = /[^0-9]/g;
exports.IRI_DEREFERENCE_REGEX = /[<>]/g;

const SAME_AS_PROP = 'http://www.w3.org/2002/07/owl#sameAs';
exports.SAME_AS_CONTEXT = {
  sameAs: {
    '@id': SAME_AS_PROP,
  },
};
