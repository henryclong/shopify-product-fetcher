const fetch = require('node-fetch');
const { parseRobots } = require('./parseRobots');

const ROBOTS_PATH = '/robots.txt';
const USER_AGENT = '*';

const fetchRobots = async (baseUrl) => {
    const response = await fetch(new URL(ROBOTS_PATH, baseUrl));
    const robotsText = await response.text();
    const robots = parseRobots(robotsText);
    return robots;
}

const fetchAllProductURLs = async (baseUrl, crawlDelay) => {
    const robots = await fetchRobots(baseUrl);

    const sitemapUrl = robots[USER_AGENT].Sitemap;

    console.log(sitemapUrl);

    // TODO: Store crawl-delay

    // TODO: Fetch parent sitemap

    // TODO: Fetch product sitemaps

    // TODO: Return product URLs

    return true;
}

fetchAllProductURLs('https://tulefogcandles.com/', 250);

module.exports = { fetchAllProductURLs };