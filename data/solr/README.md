# Setup

## Prerequisite

Docker installed: Docker - Get Started

## Solr server in Docker

There are multiple ways how to run Solr in a Docker container. We'll use manual settings as described at [Solr Docker Github](https://github.com/docker-solr/docker-solr#getting-started-with-the-docker-image).

```bash
docker run -d -p 8983:8983 --name solr-mealinker solr:8 
docker exec -it solr-mealinker solr create_core -c recipes
docker exec -it solr-mealinker solr create_core -c ingredients
```

Once all of the above commands finish successfully, we should have a Solr instance with 2 cores (recipes and ingredients) running on `localhost:8983`. When the Solr container has stopped (e.g. after device restart), we can run it again using command:

```bash
docker start solr-mealinker
```

## Indexed fields

All fields for `recipes` and `ingredients` cores are defined in `fields-manager.mjs` and can be posted to a running Solr server by:

```bash
node fields-manager.mjs
```

Only new fields are added and the operation response is logged to the console. If you try to add the existing fields repeatedly, the script doesn't log anything as all POST requests are unsuccessful. 