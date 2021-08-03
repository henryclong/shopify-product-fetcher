const assert = require('assert');
const rewire = require('rewire');
const fetch = rewire('../src/fetch');

describe('getCrawlDelay()', function() {
    const TEST_CRAWL_DELAY = 250;

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