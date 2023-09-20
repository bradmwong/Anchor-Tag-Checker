const axios = require("axios");
const cheerio = require("cheerio");

module.exports.fetchLinks = async (urlLink) => {
    try {
        const response = await axios.get(urlLink);
        const contentType = response.headers["content-type"];
        const links = [];

        console.log(contentType)

        if (contentType.includes("application/xml") || contentType.includes("text/xml")) {
            
            // If XML -> Parse as XML
            const xmlData = response.data;
            const $ = cheerio.load(xmlData, {
                xmlMode: true, // Parse as XML
            });
            $("loc").each((index, el) => {
                const url = $(el).text();
                links.push(url);
            });
            return links;
        }

    } catch (err) {
        console.error(`Error fetching or parsing sitemap: ${err}`);
        return [];
    }
};