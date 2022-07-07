const Apify = require('apify');
const { RECIPES_RESULT } = require('./constants');
const { handleDetail } = require('./routes');

const { utils: { log } } = Apify;

Apify.main(async () => {
    const { startUrls } = await Apify.getInput();

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
            return handleDetail(context, recipes);
        },
    });

    log.info('Starting the crawl.');
    await crawler.run();
    log.info('Crawl finished.');

    await Apify.setValue(RECIPES_RESULT, recipes);
});
