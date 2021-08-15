const fetch = require('node-fetch');
const { parseRobots } = require('@henryclong/robots-parser');
const { parseXML } = require('./parseSitemap');
const defaults = require('../config/defaults.json');

const ROBOTS_PATH = '/robots.txt';

/**
 * Pause execution of code for a specified amount of time
 * @param {number} ms - The number of milliseconds to pause
 */
const crawlDelay = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Calculate the amount of time to wait in order to respect the specified Crawl-delay
 * @param {number} crawlDelay - The amount of time to wait between requests
 * @param {number} lastVisitTimestamp - The timestamp of the latest request
 */
const getCrawlDelay = (crawlDelay, lastVisitTimestamp) => {
    const currentTimestamp = Date.now();
    let delay = (lastVisitTimestamp + crawlDelay) - currentTimestamp;
    return delay > 0 ? delay : 0;
}

/**
 * Fetch data from a specified url, waiting long enough to respect the crawl-delay
 * @param {string} url - Location of the fetched resource
 * @param {number} delay - The amount of time to wait between requests
 * @param {number} lastVisitTimestamp - The timestamp of the latest request
 */
exports.fetchWithCrawlDelay = async (url, delay, lastVisitTimestamp) => {
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

/**
 * Fetch data from a specified url, waiting long enough to respect the crawl-delay
 * @param {string} baseUrl - Base url to fetch robots.txt from
 * @param {number} delay - The amount of time to wait between requests
 * @param {number} lastVisitTimestamp - The timestamp of the latest request
 */
exports.fetchRobots = async (baseUrl, delay, lastVisitTimestamp) => {
    const { textContent: robotsText, timestamp } = await exports.fetchWithCrawlDelay(new URL(ROBOTS_PATH, baseUrl), delay, lastVisitTimestamp);
    const robots = parseRobots(robotsText);
    return { robots: robots, timestamp: timestamp };
}

/**
 * Fetch data from a specified url, waiting long enough to respect the crawl-delay
 * @param {string} xmlUrl - Location of fetched xml file
 * @param {number} delay - The amount of time to wait between requests
 * @param {number} lastVisitTimestamp - The timestamp of the latest request
 */
exports.fetchXML = async (xmlUrl, delay, lastVisitTimestamp) => {
    const { textContent: xmlText, timestamp } = await exports.fetchWithCrawlDelay(xmlUrl, delay, lastVisitTimestamp);
    const xml = await parseXML(xmlText);
    return { xml: xml, timestamp: timestamp };
}
