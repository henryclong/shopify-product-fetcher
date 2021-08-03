const { fetchRobots, fetchXML } = require('./fetch');
const { getProductSitemaps, getProductUrls } = require('./parseSitemap');

const USER_AGENT = '*';

const fetchAllProductURLs = async (baseUrl) => {
    const { robots, timestamp: robotsTimestamp } = await fetchRobots(baseUrl);
    const sitemapUrl = robots[USER_AGENT].Sitemap;
    const { sitemap: sitemap, timestamp: sitemapTimestamp } = await fetchXML(sitemapUrl);
    const productSitemapUrls = getProductSitemaps(sitemap);
    const productUrls = [];
    for (productSitemapUrl of productSitemapUrls) {
        const { sitemap: productSitemap, timestamp: productSitemapTimestamp } = await fetchXML(productSitemapUrl);
        productUrls.push(...getProductUrls(productSitemap));
    }
    return productUrls;
}

module.exports = { fetchAllProductURLs };