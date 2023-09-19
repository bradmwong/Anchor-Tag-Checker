const PORT = 8000;
const axios = require("axios");
const cheerio = require("cheerio");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const cors = require('cors');

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
    res.json('This is the default page');
})

app.get('/test', function (req, res) {
    res.sendFile(__dirname + '/public/page.html');
})

app.get('/results', (req, res) => {

})

const fetchLinks = async () => {
    try {
        const urlLink = "https://librarytrustees.ab.ca/wp-sitemap-posts-post-1.xml";
        // const urlLink = await axios.get('https://developers.google.com/maps/sitemap.xml');
        const response = await axios.get(urlLink);
        const headResponse = await axios.head(urlLink);
        const contentType = headResponse.headers["content-type"];
        const links = [];
        
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

console.log("start");
fetchLinks().then((links) => console.log(links));



app.listen(PORT, () => console.log(`server running on PORT ${PORT}`));