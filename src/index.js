const { fetchRobots, fetchXML, fetchWithCrawlDelay } = require('./fetch');
const { getProductSitemaps, getProductUrls, parseProductDataFromHTML } = require('./parseSitemap');
const defaults = require('../config/defaults.json');

const USER_AGENT = '*';

/**
 * Fetches all product urls for a specified Shopify store
 * @param {string} baseUrl - The URL of the store to fetch from
 */
const fetchAllProductData = async (baseUrl) => {
    // Fetch robots.txt from the store, and save the parent sitemap url & crawl delay
    const { robots, timestamp: robotsTimestamp } = await fetchRobots(baseUrl);
    const sitemapUrl = robots[USER_AGENT].Sitemap;
    const crawlDelay = robots[USER_AGENT]['Crawl-delay'] ? robots[USER_AGENT]['Crawl-delay'] : defaults.crawlDelay;
    
    // Fetch the parent sitemap content from the store using the URL provided by robots.txt
    const { xml: sitemap, timestamp: sitemapTimestamp } = await fetchXML(sitemapUrl, crawlDelay, robotsTimestamp);
    const productSitemapUrls = getProductSitemaps(sitemap);

    // Iterate through the product sitemap urls, and extract the product urls from their contents
    const productUrls = [];
    let productSitemapTimestamp;
    for (productSitemapUrl of productSitemapUrls) {

        // Fetch the product sitemap content, and save the product urls stored within
        const { xml: productSitemap, timestamp: latestProductSitemapTimestamp } = await fetchXML(productSitemapUrl, crawlDelay, productSitemapTimestamp ? productSitemapTimestamp : sitemapTimestamp);
        productSitemapTimestamp = latestProductSitemapTimestamp;
        productUrls.push(...getProductUrls(productSitemap));
    }

    const productData = [];
    let productTimestamp = productSitemapTimestamp;
    for (productUrl of productUrls) {
        const { textContent: productHTML, timestamp: timestamp } = await fetchWithCrawlDelay(productUrl, crawlDelay, productTimestamp);
        productTimestamp = timestamp;
        const extractedProductData = parseProductDataFromHTML(productHTML);
        productData.push(extractedProductData);
    }

    console.log(productData);
    return productData;
}

module.exports = { fetchAllProductData };
