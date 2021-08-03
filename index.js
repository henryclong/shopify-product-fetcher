module.exports.fetchAllProductURLs = async (baseUrl, crawlDelay) => {
    // TODO: Fetch and parse robots.txt

    // TODO: Store crawl-delay

    // TODO: Fetch parent sitemap

    // TODO: Fetch product sitemaps

    // TODO: Return product URLs

    return true;
}

const parseRobots = (robotsContent) => {
    if (!robotsContent) return {};
    const robots = {};
    let userAgent;

    for (line of robotsContent.split('\n')) {
        if (line.length === 0 || line[0] === '#') continue;
        const splitLine = line.split(': ');
        const key = splitLine[0].trim();
        const value = splitLine[1].trim();
        switch (key) {
            case 'User-agent':
                userAgent = value;
                robots[userAgent] = {};
                break;
            case 'Disallow':
                if (!userAgent) continue;
                if (robots[userAgent].Disallow == undefined) robots[userAgent].Disallow = [];
                robots[userAgent].Disallow = [...robots[userAgent].Disallow, value];
                break;
            default:
                if (!userAgent) continue;
                robots[userAgent][key] = value;
        }
    }

    return robots;
}