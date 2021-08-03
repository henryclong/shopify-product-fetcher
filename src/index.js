const fetch = require('node-fetch');
const { parseRobots } = require('./parseRobots');
const { parseXML, getProductSitemaps } = require('./parseSitemap');

const ROBOTS_PATH = '/robots.txt';
const USER_AGENT = '*';

const fetchRobots = async (baseUrl) => {
    const response = await fetch(new URL(ROBOTS_PATH, baseUrl));
    const robotsText = await response.text();
    const robots = parseRobots(robotsText);
    return robots;
}

const fetchSitemap = async (sitemapUrl) => {
    const response = await fetch(sitemapUrl);
    const sitemapText = await response.text();
    const sitemap = parseXML(sitemapText);
    return sitemap;
}

const fetchAllProductURLs = async (baseUrl, crawlDelay) => {
    const robots = await fetchRobots(baseUrl);
    const sitemapUrl = robots[USER_AGENT].Sitemap;
    const sitemap = await fetchSitemap(sitemapUrl);
    const productSitemaps = getProductSitemaps(sitemap);

    console.log(productSitemaps);

    // TODO: Store crawl-delay

    // TODO: Fetch parent sitemap

    // TODO: Fetch product sitemaps

    // TODO: Return product URLs

    return true;
}

fetchAllProductURLs('https://tulefogcandles.com/', 250);

module.exports = { fetchAllProductURLs };