var sys = require('sys');
var ejs = require('ejs');
var express = require('express'),
	app = express.createServer();

/*********** SERVER CONFIGURATION *****************/
app.configure(function() {
    
    /*********************************************************************************
        Configure the template engine
        We will use EJS (Embedded JavaScript) https://github.com/visionmedia/ejs
        
        Using templates keeps your logic and code separate from your HTML.
        We will render the html templates as needed by passing in the necessary data.
    *********************************************************************************/
    app.set('port', process.env.PORT || 3000);
    app.set('view engine','ejs');  // use the EJS node module
    app.set('views',__dirname+ '/views'); // use /views as template directory
    app.set('view options',{layout:true}); // use /views/layout.html to manage your main header/footer wrapping template
    app.register('html',require('ejs')); //use .html files in /views

    /******************************************************************
        The /static folder will hold all css, js and image assets.
        These files are static meaning they will not be used by
        NodeJS directly. 
        
        In your html template you will reference these assets
        as yourdomain.heroku.com/img/cats.gif or yourdomain.heroku.com/js/script.js
    ******************************************************************/
    app.use(express.static(__dirname + '/static'));
    
    //parse any http form post
    app.use(express.bodyParser());
    
    /**** Turn on some debugging tools ****/
    app.use(express.logger());
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));

});
/*********** END SERVER CONFIGURATION *****************/

app.get('/', function(request, response) {
	
	response.send("uh oh, can't find that post");
});


app.get('/incoming', function(request, response) {
	//var message = 
	
	response.render("layout.html");
});

// Create a function to handle our incoming SMS requests (POST request)
app.post('/incoming', function(req, res) {
  // Extract the From and Body values from the POST data
/*
  var message = req.body.Body;
  var from = req.body.From;
  sys.log('From: ' + from + ', Message: ' + message);
  
  var body = req.body.body;
  // Return sender a very nice message
  // twiML to be executed when SMS is received
  var twiml = '<Response><Sms>' + body + '  HA! HA! This response is auto generated.</Sms></Response>';
  
  res.send(twiml, {'Content-Type':'text/xml'}, 200);
  res.send("are you there?")
*/

	var message = {
		"sid": "SM64d837baa9f94353ba603e52ef4a9d25",
	    "date_created": "Fri, 09 Nov 2012 02:32:10 +0000",
	    "date_updated": "Fri, 09 Nov 2012 02:32:10 +0000",
	    "date_sent": null,
	    "account_sid": "ACad716cc4da934be6ad19bf5353312248",
	    "to": "+17654307001",
	    "from": "+16464309130",
	    "body": "Nick please please please?! I love you <3",
	    "status": "queued",
	    "direction": "outbound-api",
	    "api_version": "2010-04-01",
	    "price": null,
	    "uri": "\/2010-04-01\/Accounts\/ACad716cc4da934be6ad19bf5353312248\/SMS\/Messages\/SM64d837baa9f94353ba603e52ef4a9d25.json"		
	};	
	res.send(message, {'Content-Type':'text/json'}, 200);
});

var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log("Listening on " + port);
});