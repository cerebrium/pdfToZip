
require('dotenv').config();
const express = require('express');
const app = express();
const helmet = require('helmet');
var cors = require('cors')
var bodyParser = require('body-parser')

// middleware
app.use(cors())

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.static('backend'));
app.use(helmet());

// middleware ended, app getting
app.get('/', function(req, res) {
  res.status(200).send('The backend is up and running')
});

app.use('/zip', require('./routes/zip'))
app.use('/tester', require('./routes/tester'))

// have it listen to the localhost port
var server = app.listen(process.env.PORT || 3001);

module.exports = server;