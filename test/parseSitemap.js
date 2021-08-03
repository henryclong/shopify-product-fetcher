const assert = require('assert');
const fs = require('fs');
const path = require('path');
const { getProductSitemaps } = require('../src/parseSitemap');

const sitemapPath = './testFiles/sitemap.xml';
let sitemap = '';
try {
    sitemap = fs.readFileSync(path.join(__dirname, sitemapPath), 'utf-8');
} catch (e) { console.error(e); }

describe('parseSitemap', function() {
    describe('getProductSitemaps()', function() {
        it('returns an empty array when passed no parameters', function() {
            assert.deepEqual(getProductSitemaps(), []);
        });
    })
});