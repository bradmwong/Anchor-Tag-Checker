const axios = require("axios");
const cheerio = require("cheerio");

module.exports.fetchLinks = async (urlLink) => {
    try {
        const response = await axios.get(urlLink);
        const contentType = response.headers["content-type"];
        let links = [];

        console.log(contentType)

        if (contentType.includes("application/xml") || contentType.includes("text/xml")) {
            
            // If XML -> Parse as XML
            const xmlData = response.data;
            const $ = cheerio.load(xmlData, {
                xmlMode: true, // Parse as XML
            });


            $("loc").each((index, el) => {

                let url = $(el).text();
                // Remove query params
                const parsedURL = new URL(url);
                parsedURL.search = '';
                url = parsedURL.toString();
                // Push to array
                links.push(url);

            });
            
            // Remove duplicate URL links
            links = [...new Set(links)];
            return links;
        }

    } catch (err) {
        console.error(`Error fetching or parsing sitemap: ${err}`);
        return [];
    }
};

function removeQueryParameters(url) {
    // Use the URL constructor to parse the URL
    const parsedURL = new URL(url);
  
    // Remove query parameters
    parsedURL.search = '';
  
    // Return the modified URL
    return parsedURL.toString();
  }