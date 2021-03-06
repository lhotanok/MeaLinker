// 's' modifier causes that newlines are matched with '.' character as well
exports.NUTRITION_SECTION_REGEX = /##NUTRITION##(.)*##NUTRITION##/gs;
exports.LOCATION_SECTION_REGEX = /##LOCATION##(.)*##LOCATION##/gs;
exports.CONTEXT_KEY_DATATYPE_REGEX = /(@id)|(@num)|(http(.)*)|(string)|(MonthDay)/g;

exports.DBPEDIA_SPARQL_QUERY_PREFIX =
  'https://dbpedia.org/sparql?default-graph-uri=http%3A%2F%2Fdbpedia.org&format=application%2Fld%2Bjson&query=';

exports.DBPEDIA_INGREDIENT_TYPE = 'http://dbpedia.org/ontology/ingredient';

exports.DBPEDIA_INGREDIENTS_QUERY = 'ingredients-dbpedia.sparql';

exports.INGREDIENTS_GROUP_SIZE = 5;
