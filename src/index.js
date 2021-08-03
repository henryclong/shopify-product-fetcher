const { fetchRobots, fetchXML } = require('./fetch');
const { getProductSitemaps, getProductUrls } = require('./parseSitemap');
const defaults = require('../config/defaults.json');

const USER_AGENT = '*';

const fetchAllProductURLs = async (baseUrl) => {
    const { robots, timestamp: robotsTimestamp } = await fetchRobots(baseUrl);
    const sitemapUrl = robots[USER_AGENT].Sitemap;
    const crawlDelay = robots[USER_AGENT]['Crawl-delay'] ? robots[USER_AGENT]['Crawl-delay'] : defaults.crawlDelay;
    const { sitemap: sitemap, timestamp: sitemapTimestamp } = await fetchXML(sitemapUrl, crawlDelay, robotsTimestamp);
    const productSitemapUrls = getProductSitemaps(sitemap);
    const productUrls = [];
    let productSitemapTimestamp;
    for (productSitemapUrl of productSitemapUrls) {
        const { sitemap: productSitemap, timestamp: latestProductSitemapTimestamp } = await fetchXML(productSitemapUrl, crawlDelay, productSitemapTimestamp ? productSitemapTimestamp : sitemapTimestamp);
        productSitemapTimestamp = latestProductSitemapTimestamp;
        productUrls.push(...getProductUrls(productSitemap));
    }
    return productUrls;
}

module.exports = { fetchAllProductURLs };