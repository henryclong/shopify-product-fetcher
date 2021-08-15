var xml2js = require('xml2js');
const { JSDOM } = require('jsdom');

exports.parseXML = async (sitemapContent) => {
    const a = await xml2js.parseStringPromise(sitemapContent).then(function (result) {
        return result;
    })
    .catch(function (e) {
        console.error(e);
        return {};
    });
    return a;
}

exports.getProductSitemaps = (sitemap) => {
    try {
        return sitemap.sitemapindex.sitemap.map(a => a.loc[0]).filter(b => b.includes('products'));
    } catch (e) {
        return [];
    }
}

exports.getProductUrls = (productSitemap) => {
    try {
        return productSitemap.urlset.url.map(a => a.loc[0]).filter(b => b.includes('products'))
    } catch (e) {
        return [];
    }
}

exports.parseProductDataFromHTML = (productHTML, selectors) => {
    const dom = new JSDOM(productHTML);
    const ogTags = dom.window.document.querySelectorAll('meta[property^="og:"]');
    const productData = {};
    for (node of ogTags) {
        productData[node.getAttribute('property').replace('og:','')] = node.getAttribute('content');
    }
    if (selectors && selectors.addToCartButton) {
        const buyButton = dom.window.document.querySelector(selectors.addToCartButton);
        productData.inStock = (buyButton && !buyButton.disabled);
    } else {
        productData.inStock = true;
    }
    return productData;
}