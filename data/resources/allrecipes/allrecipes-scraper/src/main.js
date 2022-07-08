const Apify = require('apify');
const { RECIPES_RESULT, LABELS } = require('./constants');
const { handleDetail, handleList } = require('./routes');

const { utils: { log } } = Apify;

Apify.main(async () => {
    const startUrls = [{ url: 'https://www.allrecipes.com/recipes' }];

    const requestList = await Apify.openRequestList('start-urls', startUrls);
    const requestQueue = await Apify.openRequestQueue();
    const proxyConfiguration = await Apify.createProxyConfiguration();

    const recipes = await Apify.getValue(RECIPES_RESULT) || [];
    Apify.events.on('persistState', async () => Apify.setValue(RECIPES_RESULT, recipes));

    const crawler = new Apify.CheerioCrawler({
        requestList,
        requestQueue,
        proxyConfiguration,
        maxConcurrency: 50,
        handlePageFunction: async (context) => {
            const { url, userData: { label } } = context.request;
            log.info('Page opened.', { label, url });

            if (label === LABELS.DETAIL) {
                return handleDetail(context, recipes);
            }

            return handleList(context);
        },
    });

    log.info('Starting the crawl.');
    await crawler.run();
    log.info('Crawl finished.');

    await Apify.setValue(RECIPES_RESULT, recipes);
});
