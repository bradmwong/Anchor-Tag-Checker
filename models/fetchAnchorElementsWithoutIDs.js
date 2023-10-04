
const axios = require("axios");
const cheerio = require("cheerio");

module.exports.fetchAnchorElementsWithoutIDs = async (urlLink) => {
    try {
        const response = await axios.get(urlLink);

        if (response.status === 200) {

            const $ = cheerio.load(response.data);
            const anchorElements = $(`a`);
            let anchorIDs = [];

            for (let i = 0; i < anchorElements.length; i++) {
                const anchorElement = anchorElements[i];
                const href = $(anchorElement).attr(`href`);

                // Check if href
                if (href) {
                    // Check if href is over 1 character
                    if (href.length > 1) {
                        // Check if href directs to an ID
                        if (href.charAt(0) === "#") {
                            const id = href.substring(1);
                            // Check if href hasn`t already been checked
                            if (!anchorIDs.includes(id)) {
                                // Check for reference to Id
                                const sanitizedID = escapeSpecialCheerioCharacters(id);
                                if (!$(`#${sanitizedID}`).length > 0 && !$(`a[name="${sanitizedID}"]`).length) {
                                    anchorIDs.push(id);
                                }
                            }
                        }
                    }
                }
            }

            if (!anchorIDs.length) {
                anchorIDs.push("-");
            }

            return anchorIDs;

        } else {
            console.error(`Failed to retrieve webpage: ${urlLink}`)
            return [`ERROR: Request failed with status code ${response.status}`];
        }
    } catch (err) {
        console.error(`Error fetching or parsing webpage: ${err}`);
        return [`ERROR: ${err}`];
    }
};


function escapeSpecialCheerioCharacters(id) {

    const specialCharacters = ['.', '#', ':', '[', ']', ',', '"', "'"];
    let sanitizedID = '';

    for (let i = 0; i < id.length; i++) {
        const char = id.charAt(i);
        if (specialCharacters.includes(char)) {
            sanitizedID += `\\${char}`;
        } else {
            sanitizedID += char;
        }
    }

    return sanitizedID;
}