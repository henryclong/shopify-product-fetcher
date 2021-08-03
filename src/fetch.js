const fetch = require('node-fetch');
const { parseRobots } = require('./parseRobots');
const { parseXML } = require('./parseSitemap');
const defaults = require('../config/defaults.json');

const ROBOTS_PATH = '/robots.txt';

const crawlDelay = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const getCrawlDelay = (crawlDelay, lastVisitTimestamp) => {
    const currentTimestamp = Date.now();
    let delay = (lastVisitTimestamp + crawlDelay) - currentTimestamp;
    return delay > 0 ? delay : 0;
}

const fetchWithCrawlDelay = async (url, delay, lastVisitTimestamp) => {
    const delayTime = getCrawlDelay(delay ? delay : defaults.crawlDelay, lastVisitTimestamp);
    await crawlDelay(delayTime);
    try {
        const result = await fetch(url);
        const textContent = await result.text();
        return {
            textContent: textContent,
            timestamp: Date.now()
        }
    } catch (e) { console.error(e); }
}

exports.fetchRobots = async (baseUrl, delay, lastVisitTimestamp) => {
    const { textContent: robotsText, timestamp } = await fetchWithCrawlDelay(new URL(ROBOTS_PATH, baseUrl), delay, lastVisitTimestamp);
    const robots = parseRobots(robotsText);
    return { robots: robots, timestamp: timestamp };
}

exports.fetchXML = async (sitemapUrl, delay, lastVisitTimestamp) => {
    const { textContent: sitemapText, timestamp } = await fetchWithCrawlDelay(sitemapUrl, delay, lastVisitTimestamp);
    const sitemap = await parseXML(sitemapText);
    return { sitemap: sitemap, timestamp: timestamp };
}
