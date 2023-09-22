const PORT = 8000;
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

const { fetchLinks } = require('./models/fetchSiteMapLinks');
const { assignErrors } = require('./models/assignErrors');

app.get('/', (req, res) => {

    // Initialize Variables
    const siteMapUrl = "";
    const links = {};

    res.render("home", { siteMapUrl, links });
});

app.post('/', async (req, res) => {

    const siteMapUrl = req.body.siteMapUrl;
    let linksDict = req.body.linksDict || await fetchLinks(siteMapUrl) || {};


    let page = req.body.page || 1;
    let quantity = 5;

    linksDict = assignErrors(linksDict, page, quantity);
    console.log(linksDict);
    
    res.render("home", { siteMapUrl, linksDict, page, quantity });
});


app.post('/nextPage', async (req, res) => {

    const updatedText = 'NEXT BUTTON PRESSED';
    res.send(updatedText);

});

app.post('/previousPage', async (req, res) => {

    const updatedText = 'PREVIOUS BUTTON PRESSED';
    res.send(updatedText);

});


app.get('/test', function (req, res) {
    res.sendFile(__dirname + '/public/page.html');
})

app.listen(PORT, () => console.log(`server running on PORT ${PORT}`));