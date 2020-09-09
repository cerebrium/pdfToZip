var express = require('express');
var router = express.Router();
var JSZip = require("jszip");
var fetch = require("node-fetch");
var fs = require('fs');
var path = require('path');
var archiver = require('archiver')

var thePdf

let testerArray = [
    'https://v2.convertapi.com/d/9d91fc82461cb21c1411d628c226faa0/Invoices%2002Sep2020.pdf',
    'https://v2.convertapi.com/d/e595e319016222eba117730056c80160/Invoices%2002Sep2020-2.pdf',
    'https://v2.convertapi.com/d/5418cd94dc218f8eaea7eeb0fdb01cd5/Invoices%2002Sep2020-3.pdf',
    'https://v2.convertapi.com/d/bf72518c913878840a13523b860c2e10/Invoices%2002Sep2020-4.pdf',
    'https://v2.convertapi.com/d/6081985d13b35fa5b0f44ac4b21ac174/Invoices%2002Sep2020-5.pdf',
    'https://v2.convertapi.com/d/2bffb9ae50a090bef0a2acdbd39d7595/Invoices%2002Sep2020-6.pdf',
    'https://v2.convertapi.com/d/bf6c6fa9078dad6895750f87849cf218/Invoices%2002Sep2020-7.pdf',
    'https://v2.convertapi.com/d/ac66771f2591e39b237691e4cab26ad8/Invoices%2002Sep2020-8.pdf',
    'https://v2.convertapi.com/d/a9767dd986f3f3b727f1efa992a7ebcf/Invoices%2002Sep2020-9.pdf',
    'https://v2.convertapi.com/d/a8766073c1531b064f9f2ee207185278/Invoices%2002Sep2020-10.pdf',
    'https://v2.convertapi.com/d/a09d032bbfde0e90c9556ced65772abe/Invoices%2002Sep2020-11.pdf',
    'https://v2.convertapi.com/d/d9eaaa2018c77f76dbb971ecbe752e8f/Invoices%2002Sep2020-12.pdf',
    'https://v2.convertapi.com/d/7d1e85f5116bff6948dc84faac2a4b5b/Invoices%2002Sep2020-13.pdf',
    'https://v2.convertapi.com/d/031f157b19cd48cfb0c6065849ceff59/Invoices%2002Sep2020-14.pdf',
    'https://v2.convertapi.com/d/ef266f2a2ee74066113cda28c86ef1a6/Invoices%2002Sep2020-15.pdf',
    'https://v2.convertapi.com/d/c837f0ace485ddf088d75fde60ba1340/Invoices%2002Sep2020-16.pdf',
  ]
  
  let namesArray = [
    "ALEKSANDAR TOTEV WEEK 35 INV 6438 DSN1",
    "BRUNO CROSCATO WEEK 35 INV 6423 DSN1",
    "BRUNO KURSCHAT WEEK 35 INV 6424 DSN1",
    "CARLOS CONCEICAO WEEK 35 INV 6425 DSN1",
    "EVELYN RIBEIRO WEEK 35 INV 6426 DSN1",
    "FABIO USTULIN WEEK 35 INV 6427 DSN1",
    "IOLANDA DE LIMA WEEK 35 INV 6428 DSN1",
    "LEONARDO LUGLI WEEK 35 INV 6429 DSN1",
    "MARCELO BARBOSA WEEK 35 INV 6430 DSN1",
    "MARCOS CORDEIRO WEEK 35 INV 6433 DSN1",
    "MARCUS SIMPLICIO WEEK 35 INV 6431 DSN1",
    "MARIN KOSTOV WEEK 35 INV 6432 DSN1",
    "NIKOLAY KEHAYOV WEEK 35 INV 6434 DSN1",
    "PAULO MARCHESI WEEK 35 INV 6435",
    "PEDRO JESUS PAULOS WEEK 35 INV 6436 DSN1",
    "STANIMIR GEORGIEV WEEK 35 INV 6437 DSN1"
  ]

// basic get route that tells you what to do
router.get('/', function(req, res) {
    let pathToPdf = path.join(__dirname, '/../pdfs.zip')
    res.sendFile(pathToPdf)
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
                            pdfZip.file(`${namesArray[urlNum]}.pdf`, response, {base64: true})
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
                        let pathToPdf = path.join(__dirname, '/../pdfs.zip')

                        res.sendFile(pathToPdf)
                        // res.send('hello')

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