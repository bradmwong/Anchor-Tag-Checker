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

    const siteMapUrl = "";
    const links = {};

    res.render("home", { activeTab: 'home', siteMapUrl, links });
});

app.post("/", async (req, res) => {

    const siteMapUrl = req.body.siteMapUrl;
    let linksDict = req.body.linksDict || (await fetchLinks(siteMapUrl)) || {};
    let page = req.body.page || 1;
    let quantity = 5;

    // Assign URL to object as a single entry if no SiteMap URLs found
    if (Object.keys(linksDict).length <= 0) {
        linksDict[siteMapUrl] = [];
        quantity = 1;
    };

    // Check first page for errors
    linksDict = await assignErrors(linksDict, page, quantity);
    console.log(linksDict);

    // Reload home page with updated variables
    res.render("home", { activeTab: 'home', siteMapUrl, linksDict, page, quantity });
});


app.post("/changePage", async (req, res) => {

    const incompleteURLs = req.body.incompleteURLs;
    let completedURLsDict = {};

    for (let i = 0; i < incompleteURLs.length; i++) {
        completedURLsDict[incompleteURLs[i]] = await fetchAnchorElementsWithoutIDs(incompleteURLs[i]);
    }

    res.send(completedURLsDict);
});


app.get("/about", async (req, res) => {
    res.render("about", {activeTab: 'about'});
});

app.listen(PORT, () => console.log(`server running on PORT ${PORT}`));
