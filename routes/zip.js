var express = require('express');
var router = express.Router();
var JSZip = require("jszip");
var fetch = require("node-fetch");
var fs = require('fs');
var path = require('path');

// basic get route that tells you what to do
router.get('/', function(req, res) {
    // let pathToPdf = path.join(__dirname, '/../pdfs.zip')
    // res.sendFile(pathToPdf)
})

// post route that does the zippingl
router.post('/', function (req, res) {
    console.log('inside post: ', req.body)
    if (req.body.files && req.body.names) {
        if (Array.isArray(req.body.files)) {
            console.log('is an array')
            if (req.body.files.length === 0) {
                res.status(400).json({
                    'error': 
                    'There is no data in your array'
                })
            } else {
                async function renameAndZip (nameAttay, pdfArray) {
                    var zip = new JSZip();
                    var pdfZip = zip.folder('pdfs')
                    
                    let getData = async function(urlNum, url) {
                        await fetch(url).then( response => response.blob()).then( response => response.arrayBuffer()).then( response => {
                            console.log('this is the response:', response, '\n', urlNum, '\n', url)
                            pdfZip.file(`${nameAttay[urlNum]}.pdf`, response, {base64: true})
                            try {
                                pdfZip.generateNodeStream({
                                    type:'nodebuffer',
                                    streamFiles:true
                                })
                                    .pipe(
                                        fs.createWriteStream('pdfs.zip')
                                        )
                                    .on('finish', function () {
                                        // JSZip generates a readable stream with a "end" event,
                                        // but is piped here in a writable stream which emits a "finish" event.
                                        
                                    });
                            } catch (error) {
                                console.log(error)
                            }
                        })
                    }
            
                    pdfArray.forEach( (pdf, pdfnum) => {
                        getData(pdfnum, pdf)
                    })
                    setTimeout( () => {
                        // trying to send the zip
                        // let pathToPdf = path.join(__dirname, '/../pdfs.zip')

                        // res.sendFile(pathToPdf)
                        // res.send('hello')
                        res.status(200).send('finished')

                        // res.status(200).sendFile(pathToPdf, options)
                        console.log('file is sent')
                    }, 5000)
                }
                renameAndZip(req.body.names, req.body.files)
            }
        } else if (!Array.isArray(req.body.files)) {
            res.status(400).json({
                'error': 
                'Please be sure that the type is []Array'
            })
        }
    } else {
        res.status(299).json({
            'error': 
            'There was an error, please be sure that you send of form {"files": []Array}'
        })
    }
})

module.exports = router;