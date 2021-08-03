const assert = require('assert');
const fs = require('fs');
const path = require('path');
const rewire = require('rewire');
const shopifyProductFetcher = rewire('../index');

const robotsPath = './testFiles/robots.txt';
let robots = '';
try {
    robots = fs.readFileSync(path.join(__dirname, robotsPath), 'utf-8');
} catch (e) { console.error(e); }

describe('parseRobots()', function() {
    it('returns an empty object when passed no parameters', function() {
        assert.deepEqual(shopifyProductFetcher.__get__('parseRobots')(), {});
    });

    it('returns an empty object when passed an empty string', function() {
        assert.deepEqual(shopifyProductFetcher.__get__('parseRobots')(''), {});
    });

    it('has a key for the wildcard user agent', function() {
        assert.ok(shopifyProductFetcher.__get__('parseRobots')(robots)['*']);
    });

    it('can access the site map entry for the wildcard user agent', function() {
        assert.ok(shopifyProductFetcher.__get__('parseRobots')(robots)['*']['Sitemap'], 'https://tulefogcandles.com/sitemap.xml');
    });
});
