const fs = require('fs');
const N3 = require('n3');
const { DataFactory } = N3;
const { namedNode, literal, quad } = DataFactory;

const { UNIQUE_INGR_WITH_IDS_PATH, RDF_PREFIXES, FILE_ENCODING, RDF_INGREDIENTS_PATH } = require('./constants');
const { INGREDIENT_PREFIX, RDFS_PREFIX } = RDF_PREFIXES;

function readFileFromCurrentDir(filePath) {
    return fs.readFileSync(`${__dirname}/${filePath}`, FILE_ENCODING);
}

function loadJsonFromFile(filePath) {
    return JSON.parse(readFileFromCurrentDir(filePath));
}

function dumpRdfToFile(writer, filePath) {
    writer.end((error, result) => {
        if (error) {
            console.error(error);
        } else {
            fs.writeFileSync(filePath, result);
        }
    });
}

function serializeIngredientsToRdf(ingredients) {
    const prefixes = {
        ingr: INGREDIENT_PREFIX,
        rdfs: RDFS_PREFIX,
    }

    const writer = new N3.Writer({ prefixes });

    Object.keys(ingredients).forEach((id) => {
        const iri = `${INGREDIENT_PREFIX}${id}`;
        const property = `${RDFS_PREFIX}label`
        const label = ingredients[id].name;
        
        writer.addQuad(quad(
            namedNode(iri),
            namedNode(property),
            literal(label, 'en')
        ));
    });

    console.log(`Serialized ${Object.keys(ingredients).length} ingredients from json to rdf format`);

    dumpRdfToFile(writer, RDF_INGREDIENTS_PATH);
}

function main() {
    const ingredients = loadJsonFromFile(UNIQUE_INGR_WITH_IDS_PATH);

    serializeIngredientsToRdf(ingredients);
}

main ()