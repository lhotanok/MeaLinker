# Food.com Apify actor based on CheerioCrawler

This actor receives start urls pointing to the Food.com recipes detail pages in the input. It sends http request to each of these urls and extracts jsonld data from the html header.

## Run this actor

### Prerequisities

- Node.js server with npm package manager installed
- [Apify CLI](https://docs.apify.com/cli) installed

```bash
cd food-com-scraper
npm install
apify init
```

Apify actor should be initialized properly by now. `apify_storage` directory should be generated with `datasets` and `key_value_stores` directories in it. 

### Input

Default input file was generated in `apify_storage/key_value_stores/default/INPUT.json`. Add all recipe detail urls you want to scrape using the following pattern (with url format`https://www.food.com/recipe/${RECIPE_ID}`):

```json
{
  "startUrls": [
    {
      "url": "https://www.food.com/recipe/137739"
    },
    {
      "url": "https://www.food.com/recipe/63793"
    },
    {
      "url": "https://www.food.com/recipe/207525"
    },
    {
      "url": "https://www.food.com/recipe/259784"
    }
  ]
}
```

Once you've initialized actor's directory and input file, you can proceed with the following command:

```bash
apify run -p
```

- `-p` flag stands for `--purge` and it's needed for each run as it clears all states from the previous run

Wait for the log signalization `Crawl finished` or stop scraping whenever you want by pressing `Ctrl + C`.

> NOTE: Actor uses Apify proxy by default which requires to be logged in Apify platform. You can run the scraper without proxy as well but you might get blocked if you send too many requests from the same IP address. To run without proxy, simply remove `proxyConfiguration` from `CheerioCrawler` constructor in `src/main.js`. You can also decrease `maxConcurrency` to improve your chance of not getting blocked.

## Apify documentation reference

- [Apify SDK](https://sdk.apify.com/)
- [Apify Actor documentation](https://docs.apify.com/actor)
- [Apify CLI](https://docs.apify.com/cli)