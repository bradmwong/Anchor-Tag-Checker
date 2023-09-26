const axios = require("axios");
const cheerio = require("cheerio");

module.exports.fetchLinks = async (urlLink) => {
    try {

        const response = await axios.get(urlLink);

        if (response.status === 200) {

            const contentType = response.headers["content-type"];
            const linksDict = {};

            console.log(contentType)

            if (contentType.includes("application/xml") || contentType.includes("text/xml")) {
                
                // If XML -> Parse as XML
                const xmlData = response.data;
                const $ = cheerio.load(xmlData, {
                    xmlMode: true
                });

                // Get URL Links
                $("loc").each((index, el) => {
                    let url = $(el).text();
                    url = removeQueryParameters(url);
                    if (!linksDict.hasOwnProperty(url)) {
                        linksDict[url] = [];
                    }
                });
                
                return linksDict;
            }
        } else {
            console.error(`Failed to retrieve webpage: ${urlLink}`)
        }
    } catch (err) {
        console.error(`Error fetching or parsing sitemap: ${err}`);
        return [];
    }
};

function removeQueryParameters(url) {
    const parsedURL = new URL(url);
    parsedURL.search = '';
    return parsedURL.toString();
}