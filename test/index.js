const assert = require('assert');
const { fetchAllProductURLs } = require('../src/index');

const TEST_URL = 'https://tulefogcandles.com/';

describe('index', function() {
    describe('fetchAllProductURLs()', async function() {
        it('returns an array', async function() {
            const productUrlList = await fetchAllProductURLs(TEST_URL);
            assert.equal(Array.isArray(productUrlList), true);
        });

        it('returns a url list with length greater than 0', async function() {
            const productUrlList = await fetchAllProductURLs(TEST_URL);
            assert.equal(productUrlList.length > 0, true);
        });
    })
});
