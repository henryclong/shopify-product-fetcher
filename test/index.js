const assert = require('assert');
const { fetchAllProductData } = require('../src/index');
const { getAndStartTestServer } = require('./testServer/testServer');

const PORT = 3000;
const TEST_URL = `http://localhost:${PORT}/`;

describe('index', function() {
    let server;
    before(async function() {
        server = getAndStartTestServer(PORT);
    });

    describe('fetchAllProductData()', async function(done) {
        it('returns an array', async () =>
            fetchAllProductData(TEST_URL)
                .then((result) => {
                    assert.equal(Array.isArray(result), true);
                })
        );

        it('returns a url list with length greater than 0', async () =>
            fetchAllProductData(TEST_URL)
                .then((result) => {
                    assert.equal(result.length > 0, true);
                })
        );
        done();
    });

    after(async function() {
        server.close();
    });
});
