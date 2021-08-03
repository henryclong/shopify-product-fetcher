const fetch = require('node-fetch');
const { parseRobots } = require('./parseRobots');
const { parseXML, getProductSitemaps, getProductUrls } = require('./parseSitemap');

const ROBOTS_PATH = '/robots.txt';
const USER_AGENT = '*';

const fetchRobots = async (baseUrl) => {
    const response = await fetch(new URL(ROBOTS_PATH, baseUrl));
    const robotsText = await response.text();
    const robots = parseRobots(robotsText);
    return robots;
}

const fetchXML = async (sitemapUrl) => {
    const response = await fetch(sitemapUrl);
    const sitemapText = await response.text();
    const sitemap = parseXML(sitemapText);
    return sitemap;
}

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