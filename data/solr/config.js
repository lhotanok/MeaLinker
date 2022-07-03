const COUCHDB = {
  PORT: 5984,
  USERNAME: 'admin',
  PASSWORD: process.env.COUCHDB_PASSWORD,
  RECIPES_DB_NAME: 'recipes',
  INGREDIENTS_DB_NAME: 'search-ingredients',
};

const SOLR = {
  HOST: 'localhost',
  PORT: 8983,
  CORES: {
    RECIPES: 'recipes',
  },
  PROTOCOL: 'http',
  SECURE: false,
};

const SOLR_RECIPES_SCHEMA = `http://${SOLR.HOST}:${SOLR.PORT}/solr/${SOLR.CORES
  .RECIPES}/schema`;

module.exports = {
  COUCHDB,
  SOLR,
  SOLR_RECIPES_SCHEMA,
};
