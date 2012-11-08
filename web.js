var sys = require('sys');
var express = require('express'),
	app = express.createServer();

app.get('/', function(request, response) {
	
	response.send("uh oh, can't find that post");
});

// Create a function to handle our incoming SMS requests (POST request)
app.post('/incoming', function(req, res) {
  // Extract the From and Body values from the POST data
  var message = req.body.Body;
  var from = req.body.From;
  sys.log('From: ' + from + ', Message: ' + message);
  
  // Return sender a very nice message
  // twiML to be executed when SMS is received
  var twiml = '<Response><Sms>HA! HA! This response is auto generated.</Sms></Response>';
  res.send(twiml, {'Content-Type':'text/xml'}, 200);
});

var port = process.env.PORT || PORT;
app.listen(port, function() {
  console.log("Listening on " + port);
});