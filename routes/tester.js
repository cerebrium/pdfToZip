var express = require('express');
var router = express.Router();
var JSZip = require("jszip");
var fetch = require("node-fetch");
var fs = require('fs');
var path = require('path');

// basic get route that tells you what to do
router.get('/', function(req, res) {
    let pathToPdf = path.join(__dirname, '/../pdfs.zip')
    res.sendFile(pathToPdf)

})

module.exports = router;