const PORT = 8000;
const axios = require("axios");
const cheerio = require("cheerio");
const express = require("express");
const ejsMate = require('ejs-mate');
const bodyParser = require("body-parser");
const app = express();
const cors = require('cors');

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');

app.get('/', async function (req, res) {
    const urlLink = "https://librarytrustees.ab.ca/wp-sitemap-posts-post-1.xml";
    const links = await fetchLinks(urlLink);
    console.log(links);
    res.render("home", { links });
})

app.get('/test', function (req, res) {
    res.sendFile(__dirname + '/public/page.html');
})

app.get('/results', (req, res) => {

})

const fetchLinks = async (urlLink) => {
    try {
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

app.listen(PORT, () => console.log(`server running on PORT ${PORT}`));