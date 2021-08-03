const { fetchRobots, fetchXML } = require('./fetch');
const { getProductSitemaps, getProductUrls } = require('./parseSitemap');

const USER_AGENT = '*';

const fetchAllProductURLs = async (baseUrl) => {
    const robots = await fetchRobots(baseUrl);
    const sitemapUrl = robots[USER_AGENT].Sitemap;
    const sitemap = await fetchXML(sitemapUrl);
    const productSitemapUrls = getProductSitemaps(sitemap);
    const productUrls = [];
    for (productSitemapUrl of productSitemapUrls) {
        const productSitemap = await fetchXML(productSitemapUrl);
        productUrls.push(...getProductUrls(productSitemap));
    }
    return productUrls;
}

module.exports = { fetchAllProductURLs };