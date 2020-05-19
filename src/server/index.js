// Endpoint for all routes
let projectData = {};
//Node Server Config 
var path = require('path')
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser');
//test 
const mockAPIResponse = require('./mockAPI.js')
/* Middleware*/
//Here we are configuring express to use body-parser as middle-ware.
const app = express()
app.use(cors())
app.use(express.static('dist'))
app.use(bodyParser.urlencoded({ extended: false}));
  app.use(bodyParser.json())
 

//test API 
app.get('/test', function (req, res) {
    res.json(mockAPIResponse);
})

// designates what port the app will listen to for incoming requests
app.listen(5050, function () {
    console.log('Example app listening on port 5050!')
})
//Get route
app.get('/', function (req, res) {
  res.sendFile('dist/index.html')
})

// Post Route
app.post('/add', addInfo);
function addInfo(req, res) {
  projectData['depCity'] = req.body.depCity;
  projectData['arrCity'] = req.body.arrCity;
  projectData['depDate'] = req.body.depDate;
  projectData['weather'] = req.body.weather;
  projectData['summary'] = req.body.summary;
  projectData['daysLeft'] = req.body.daysLeft;
  res.send(projectData);
}
