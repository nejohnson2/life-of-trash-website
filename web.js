var sys = require('sys');
var ejs = require('ejs');

var Twilio = require('twilio-js');
Twilio.AccountSid = "ACad716cc4da934be6ad19bf5353312248";
Twilio.AuthToken  = "3af91684fa2d040f587bf96955cffd82";

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

	
	response.render('home.html');
});

app.get('/info', function(request, response){
	
	response.render('info.html')
});


app.get('/about', function(request, response){
	var templateData = {
		pageTitle : 'NYC Trash Blog'
	};
	
	response.render('about.html', templateData);
});

app.get('/experience', function(request, response){
	
	response.render('experience.html');
	
});

app.get('/incoming', function(request, response) {
	//var message = 
	response.send('<form method="POST" action="/incoming">' +
					'To: <input type="text" name="To" value="+17654307001" />' +					
					'Body: <input type="text" name="Body" />' +					
					'<input type="submit" />'+
					'</form>');
	//response.render("layout.html");
});

// Create a function to handle our incoming SMS requests (POST request)
app.post('/incoming', function(req, res) {
  // Extract the From and Body values from the POST data

  var message = req.body.Body;
  var to = req.body.To;

  Twilio.SMS.create({to: to, from: "+16464309130", body: message}, function(err,res) {
  console.log('HOLY MOLY! PHONES ARE RINGING');
  });
  
  res.redirect('/incoming')
//  res.send("you made it");

});




var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log("Listening on " + port);
});