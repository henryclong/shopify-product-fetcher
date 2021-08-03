const fetch = require('node-fetch');

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
    const delayTime = getCrawlDelay(delay, lastVisitTimestamp);
    const response = await crawlDelay(delayTime).then(async (resolve, reject) => {
        try {
            const response = await fetch(url);
            resolve(response);
        } catch (e) { reject(e); }

    });
    return {
        result: response,
        timestamp: Date.now()
    }
}

exports.fetchRobots = async (baseUrl) => {
    const response = await fetch(new URL(ROBOTS_PATH, baseUrl));
    const robotsText = await response.text();
    const robots = parseRobots(robotsText);
    return robots;
}

exports.fetchXML = async (sitemapUrl) => {
    const response = await fetch(sitemapUrl);
    const sitemapText = await response.text();
    const sitemap = parseXML(sitemapText);
    return sitemap;
}
