
console.time("Function #1");

let resultsArr = [["addys"]];
const sitemapUrls = await fetchSitemapUrls();

for (let i = 0; i < sitemapUrls.length; i++) {
    // for (let i = 0; i < 100; i++) {
        const arr = await getAnchorElementsWithoutIds(sitemapUrls[i]);
        if (arr.length > 1) {
        resultsArr.push(arr);
    }
}
console.log("COMPLETE!");
console.timeEnd("Function #1");
// console.log(resultsArr);

async function fetchSitemapUrls() {
    try {
        const siteMapUrl = "https://developers.google.com/maps/sitemap.xml";
        const response = await fetch(siteMapUrl);
        const textResponse = await response.text();
        const doc = new DOMParser().parseFromString(textResponse, "text/html");

        let arr = [];
        const locs = doc.getElementsByTagName("loc");
        for (let i = 0, max = locs.length; i < max; i++) {
            // console.log(locs[i].textContent);
            arr.push(locs[i].textContent);
        }

        return arr;
    } catch (error) {
        console.log(error);
        return error;
    }
}

// const urlText = "https://developers.google.com/maps/faq";
// const result = await getAnchorElementsWithoutIds(urlText);

async function getAnchorElementsWithoutIds(url) {
    try {
        const response = await fetch(url);
        const textResponse = await response.text();
        const doc = new DOMParser().parseFromString(textResponse, "text/html");

        const anchors = doc.getElementsByTagName("a");
        let arr = [];
        arr.push(url);

        for (let i = 0, max = anchors.length; i < max; i++) {
            const href = anchors[i].getAttribute("href");

            // Check if href
            if (href) {
                // Check if href is over 1 character
                if (href.length > 1) {
                    // Check if href link is for same page reference
                    if (href.charAt(0) === "#") {
                        const str = href.substring(1);
                        // Check if href hasn't already been checked
                        if (!arr.includes(str)) {
                            // Check missing references to href

                            // Check for reference to Id
                            if (!doc.getElementById(str)) {
                                // Check for missing anchor tag name reference
                                if (doc.querySelector(`[name="${str}"]`)) {
                                    if (
                                        doc.querySelector(`[name="${str}"]`)
                                        .tagName !== "A"
                                        ) {
                                            // arr.push(str);
                                            console.log(`${url},${str},"Missing_Name"`)
    
                                    }
                                } else {
                                    console.log(`${url},${str},"Missing_ID"`)
                                }
                            }

                        }
                    }
                }
            }
        }

        return arr;
    } catch (error) {
        console.log(error);
        return error;
    }
}


