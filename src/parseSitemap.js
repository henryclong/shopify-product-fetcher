var xml2js = require('xml2js');

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