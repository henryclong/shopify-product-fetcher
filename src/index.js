const fetch = require('node-fetch');
const { parseRobots } = require('./robotsParser');

const ROBOTS_PATH = '/robots.txt';
const USER_AGENT = '*';

const fetchSitemap = async (baseUrl) => {
    const response = await fetch(new URL(ROBOTS_PATH, baseUrl));
    const robotsContent = await response.text();
    const parsedRobots = parseRobots(robotsContent);
    const sitemap = parsedRobots[USER_AGENT].Sitemap;
    return sitemap;
}

const fetchAllProductURLs = async (baseUrl, crawlDelay) => {
    const sitemap = await fetchSitemap(baseUrl);

    console.log(sitemap);

    // TODO: Store crawl-delay

    // TODO: Fetch parent sitemap

    // TODO: Fetch product sitemaps

    // TODO: Return product URLs

    return true;
}

fetchAllProductURLs('https://tulefogcandles.com/', 250);

module.exports = { fetchAllProductURLs };