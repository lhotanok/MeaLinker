const COUCHDB = {
    PORT: 5984,
    USERNAME: 'admin',
    PASSWORD: process.env.COUCHDB_PASSWORD,
    DB_NAME: 'mealinker',
};

const SOLR = {
    HOST: 'localhost',
    PORT: 8983,
    CORES: {
        RECIPES: 'recipes',
        INGREDIENTS: 'ingredients',
    },
    PROTOCOL: 'http',
    SECURE: false,
};

const SOLR_RECIPES_SCHEMA = `http://${SOLR.HOST}:${SOLR.PORT}/solr/${SOLR.CORES.RECIPES}/schema`;
const SOLR_INGREDIENTS_SCHEMA = `http://${SOLR.HOST}:${SOLR.PORT}/solr/${SOLR.CORES.INGREDIENTS}/schema`;

module.exports = {
    COUCHDB,
    SOLR,
    SOLR_RECIPES_SCHEMA,
    SOLR_INGREDIENTS_SCHEMA,
};
