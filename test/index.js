const assert = require('assert');
const { fetchAllProductURLs } = require('../src/index');
const { getAndStartTestServer } = require('./testServer/testServer');

const PORT = 3000;
const TEST_URL = `http://localhost:${PORT}/`;

describe('index', function() {
    let server;
    before(async function() {
        server = getAndStartTestServer(PORT);
    });

    describe('fetchAllProductURLs()', async function(done) {
        it('returns an array', async () =>
            fetchAllProductURLs(TEST_URL)
                .then((result) => {
                    assert.equal(Array.isArray(result), true);
                })
        );

        it('returns a url list with length greater than 0', async () =>
            fetchAllProductURLs(TEST_URL)
                .then((result) => {
                    assert.equal(result.length > 0, true);
                })
        );

        it('returns the correct product url from the test product sitemap', async () =>
            fetchAllProductURLs(TEST_URL)
                .then((result) => {
                    assert.equal(result[0], 'http://localhost:3000/products/sea-lavender-soy-candle');
                })
        );
        done();
    });

    after(async function() {
        server.close();
    });
});
