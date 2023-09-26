const PORT = 8000;
const express = require("express");
const ejsMate = require("ejs-mate");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(__dirname + "/public"));

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");

const { fetchLinks } = require("./models/fetchSiteMapLinks");
const { fetchAnchorElementsWithoutIDs } = require("./models/fetchAnchorElementsWithoutIDs");
const { assignErrors } = require("./models/assignErrors");


app.get("/", (req, res) => {
    // Initialize Variables
    const siteMapUrl = "";
    const links = {};

    res.render("home", { siteMapUrl, links });
});

app.post("/", async (req, res) => {
    const siteMapUrl = req.body.siteMapUrl;
    let linksDict = req.body.linksDict || (await fetchLinks(siteMapUrl)) || {};

    let page = req.body.page || 1;
    let quantity = 5;

    linksDict = await assignErrors(linksDict, page, quantity);
    // console.log(linksDict);
    // console.log(await fetchAnchorElementsWithoutIDs("https://bradmwong.github.io/test/broken%20anchor%20directs/"))
    console.log(await fetchAnchorElementsWithoutIDs("https://developers.google.com/maps/documentation/javascript/reference/3.53/places-autocomplete-service/"))

    res.render("home", { siteMapUrl, linksDict, page, quantity });
});

app.post("/changePage", async (req, res) => {
    const incompleteURLs = req.body.incompleteURLs;
    let completedURLsDict = {};
    for (let i = 0; i < incompleteURLs.length; i++) {
        completedURLsDict[incompleteURLs[i]] = await fetchAnchorElementsWithoutIDs(incompleteURLs[i]);
    }

    res.send(completedURLsDict);
});

app.get("/test", function (req, res) {
    res.sendFile(__dirname + "/public/page.html");
});

app.listen(PORT, () => console.log(`server running on PORT ${PORT}`));
