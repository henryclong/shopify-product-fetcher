const fetch = require('node-fetch');

const ROBOTS_PATH = '/robots.txt';

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