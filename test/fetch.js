const assert = require('assert');
const rewire = require('rewire');
const fetch = rewire('../src/fetch');
const { getAndStartTestServer } = require('./testServer/testServer');

const TEST_CRAWL_DELAY = 250;
const PORT = 3000;
const TEST_URL = `http://localhost:${PORT}/`;

describe('fetch', function() {
    let server;
    before(async function() {
        server = getAndStartTestServer(PORT);
    });

    describe('getCrawlDelay()', function() {
        it('returns a value of 0 if no delay is passed as a parameter', function() {
            assert.equal(fetch.__get__('getCrawlDelay')(), 0);
        });

        it('returns a value of 0 if no "last visited" timestamp is passed as a parameter', function() {
            assert.equal(fetch.__get__('getCrawlDelay')(TEST_CRAWL_DELAY), 0);
        });

        it('returns a value of 0 if the current time is more than TEST_CRAWL_DELAY ms greater than the current time', function() {
            const currentTimestamp = Date.now();
            assert.equal(fetch.__get__('getCrawlDelay')(TEST_CRAWL_DELAY, currentTimestamp - TEST_CRAWL_DELAY), 0);
        });

        it('returns a value equal to TEST_CRAWL_DELAY given a timestamp in the past', function() {
            const currentTimestamp = Date.now();
            const calculatedDelay = fetch.__get__('getCrawlDelay')(TEST_CRAWL_DELAY, currentTimestamp);
            assert.equal(calculatedDelay, TEST_CRAWL_DELAY);
        });
    });

    describe('fetchWithCrawlDelay()', function() {
        it('succefully fetches a resource at a given url, and return the text content and timestamp', async function() {
            const result = await fetch.__get__('fetchWithCrawlDelay')(TEST_URL, TEST_CRAWL_DELAY);
            assert.equal(typeof result.textContent, 'string');
            assert.equal(typeof result.timestamp, 'number');
        });

        it('takes longer than TEST_CRAWL_DELAY ms to access the same resource twice', async function() {
            const originalTimestamp = Date.now();
            const result = await fetch.__get__('fetchWithCrawlDelay')(TEST_URL, TEST_CRAWL_DELAY);
            await fetch.__get__('fetchWithCrawlDelay')(TEST_URL, TEST_CRAWL_DELAY, result.timestamp);
            const currentTimestamp = Date.now();
            const duration = currentTimestamp - originalTimestamp;
            assert.equal(duration >= TEST_CRAWL_DELAY, true);
        });
    });

    after(async function() {
        server.close();
    });
});