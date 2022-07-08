const fs = require('fs');
const N3 = require('n3');
const log4js = require('log4js');
const log = log4js.getLogger('RDF serializer');
log.level = 'debug';

const { DataFactory } = N3;
const { namedNode, literal, quad } = DataFactory;

const { RDF_PREFIXES } = require('./constants');

const { INGREDIENT_PREFIX, RDFS_PREFIX } = RDF_PREFIXES;

function dumpRdfToFile(writer, filePath) {
  writer.end((error, result) => {
    if (error) {
      log.error(error);
    } else {
      log.info(`Saved RDF data to ${filePath}`);
      fs.writeFileSync(filePath, result);
    }
  });
}

function serializeIngredientsToRdf(ingredients, filePath) {
  const prefixes = {
    ingr: INGREDIENT_PREFIX,
    rdfs: RDFS_PREFIX,
  };

  const writer = new N3.Writer({ prefixes });

  Object.keys(ingredients).forEach((id) => {
    const iri = `${INGREDIENT_PREFIX}${id}`;
    const property = `${RDFS_PREFIX}label`;
    const label = ingredients[id].name;

    writer.addQuad(quad(namedNode(iri), namedNode(property), literal(label, 'en')));
  });

  log.info(
    `Serialized ${Object.keys(ingredients).length} ingredients from json to rdf format`,
  );

  dumpRdfToFile(writer, filePath);
}

module.exports = {
  serializeIngredientsToRdf,
};
