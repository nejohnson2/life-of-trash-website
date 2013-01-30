var sys = require('sys');
var ejs = require('ejs');

var querystring = require('querystring');
var CartoDB = require('cartodb');
var secret = require('./secret.js');
var mongoose = require('mongoose');
var schema = mongoose.Schema;

// CartoDB
var client = new CartoDB({user:secret.USER, api_key:secret.API_KEY});


// Twilio
var Twilio = require('twilio-js');
Twilio.AccountSid = "ACad716cc4da934be6ad19bf5353312248";
Twilio.AuthToken  = "3af91684fa2d040f587bf96955cffd82";

var express = require('express'),
    app = express.createServer();
    
/*********** Database CONFIGURATION *****************/ 
app.db = mongoose.connect(process.env.MONGOLAB_URI);

require('./models').configureSchema(schema, mongoose);

var SMS = mongoose.model('SMS');
var Neighbor = mongoose.model('Neighbor');

var neighborNumber = [];

/*********** End Database CONFIGURATION *****************/ 
    
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
/*
client.on('connect', function() {
    console.log("connected");
});

// Data if automatically parsed
client.on('data', function(data) {
    console.log(results.rows);
});

client.on('error', function(err) {
    console.log("some error ocurred");
});
*/

app.get('/', function(request, response) {

	response.render('maplive.html', {layout: false });
});

app.get('/splash', function(request, response) {

	response.render('splash.html', {layout: false });
});
app.get('/info', function(request, response) {

	response.render('info.html');
});
app.get('/maplive', function(request, response) {

	response.render('maplive.html', {layout: false });
});
app.get('/engage', function(request, response) {

	response.render('engage.html');
});
app.get('/blog', function(request, response) {

	response.render('blog.html');
});
app.get('/success', function(request, response) {

	response.render('success.html');
});
app.get('/post2', function(request, response) {

	response.render('post2.html');
});
app.get('/post3', function(request, response) {

	response.render('post3.html');
});
app.get('/post4', function(request, response) {

	response.render('post4.html');
});

app.get('/post5', function(request, response) {

	response.render('post5.html');
});

app.get('/app', function(request, response) {

	response.render('post4.html');
});
app.get('/incoming', function(request, response) {

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
  
  var smsTextData = {
	  from: req.body.To,
	  body: req.body.Body
  };
  
  var mySms = new SMS(smsTextData);
  mySms.save();

  Twilio.SMS.create({to: to, from: "+16464309130", body: message}, function(err,res) {
  console.log('Up Up and Away...SMS Sent!');
  });
  
  res.redirect('/incoming')
//  res.send("you made it");

});

app.get('/sms', function(req, res){
	var query = SMS.find({});
	//query.sort('date', -1); //sort by date in decending order
	
	query.exec({}, function(err, allPosts){
		
		//prepare template data
		templateData = {
			sms : allPosts
		};
		
	res.send(templateData);
	
	});
	
});

app.get('/twilio', function(req, res){
	var body, to, from;
	// This goes through the Twilio Database and pulls out all texts sent to twilio
	Twilio.SMS.all(function(err, res) {
		console.log('body : ' + res.smsMessages[0].body);
		console.log('to : ' + res.smsMessages[0].to);
		console.log('from : ' + res.smsMessages[0].from);	
		
	  }, {accountSid: Twilio.AccountSid, to: '+16464309130'});
	  
	  
  // parse the body into lat and lon
  
  console.log('here again' + from);
/*
  // save location data to mongoDB
  // add data a JSON array?
    var locationData = {
	    from: req.smsMessage[0].from,
	    body: req.smsMessage[0].body,
	    to:	  req.smsMessage[0].to
//		    lat:  
//		    lon:
	};

	// create a new instance of the database schema
	var location = new Location(locationData);
	
	// save the JSON array to the database
	location.save();
	
	// query the database for all information
	var query = Location.find({});
	
	query.exec({}, function(err, allPosts){
		
		templateData = {
			posts	:	allPosts
		};
	res.send(templateData);
	});	  
	res.send("hello");
*/
});

app.get('/location', function(request, response) {

/*
	response.send('<form method="POST" action="/location">' +
					'Lat: <input type="text" name="lat" />' +					
					'Lon: <input type="text" name="lon" />' +					
					'<input type="submit" />'+
					'</form>');
*/
	response.render('location.html')
});

// Create a function to handle our incoming SMS requests (POST request)
app.post('/location', function(req, res) {
  // Extract the From and Body values from the POST data
  var smsBody = req.body.Body; // this is from twilio
  
  //need to parse lat and long


  // this is for form feild testing
  var lat = req.body.lat;
  var lon = req.body.lon;

  //store values into the location database
  
  //


  res.render('location.html')
//  res.send("you made it");

});

// This receives the twilio text and will add it to cartoDB!!!
app.post('/received', function(req, res) {
	
	var message = req.body.Body;
	var to = req.body.To;
	
	console.log(message + " : " + to);
	
	var twiml = '<?xml version="1.0" encoding="UTF-8" ?><Response>n<Sms>Thanks for your text, we\'ll be in touch.</Sms>n</Response>';

    res.send(twiml, {'Content-Type':'text/xml'}, 200);
    
    // send Insert to CartoDB database
    res.redirect('http://nejohnson2.cartodb.com/api/v2/sql?q=INSERT INTO life_of_trash (name) VALUES (' + 'this is a string' +', 11, ST_SetSRID(ST_Point(-110, 43),4326))&api_key=032c33b652860d5e5ede3493db15adda21d2e763')
    
});

app.get('/sendCarto', function(req, res) {

	res.send('<form method="POST" action="/sendCarto">' +
					'Lat: <input type="text" name="lat" />' +					
					'Lon: <input type="text" name="lon" />' +
					'Body: <input type="text" name="body" />' +					
					'<input type="submit" />' +
					'</form>');	
	
});

app.post('/sendCarto', function(req, res) {
	
	// get the body of the text message
	var body = req.body.Body;
	var splitArray = body.split(",")
	var lat = splitArray[0];
	var lon = splitArray[1];
	var from = req.body.From;
	
	console.log(lat + " , " + lon);
	console.log("From: " + from);
/*
	// parse the body of the text message  (ex. lat=70%lon=45)
	var split = querystring.parse(body);
	var lat = split.lat;
	var lon = split.lon;
*/

	//console.log('Lat = ' + split.lat + ' - Lon = ' + split.lon);

	//var thing = '{"type":"MultiLineString","coordinates":[[[-73.988113,40.674389],[-73.989315,40.720462],[-74.013519,40.703026]]]}'; //works
	//var thing = '{"type":"Point","coordinates":[-74.013519,40.703026]}';
	
	// use the form to post lat/lon coordinates - NOTE: CartoDB recieves them as lon/lat	
	var location = '{"type":"Point","coordinates":['+lon+','+lat+']}';
	
	// send individual lat, lon values to cartoDB
	//client.query('INSERT INTO life_of_trash (lat, lon) VALUES (' + lat + ',' + lon + ');');  //this works
	
	// send geojson values
	client.query('INSERT INTO live_map (the_geom, number) VALUES (ST_SetSRID(ST_GeomFromGeoJSON(\'' + location + '\'), 4326),\'' + from + '\');'); //this works	

	// catch any errors from cartodb
	client.on('error', function(err) {
	    console.log("some error ocurred from CartoDB");
	    //console.log(err);
	});

	res.send('here');

});

app.get('/neighbor', function(req, res){


	res.send('<form method="POST" action="/neighbor">' +
					'Body: <input type="text" name="Body" />' +	
					'who is it going to: <input type="text" name="From" />' +	
					'Twilio Number: <input type="text" name="To" />' +									
					'<input type="submit" />'+
					'</form>');	
  
/*
	var query = Neighbor.find({});
//	query.sort('Date',-1);
	
	query.exec({}, function(err, allNeighbors){
		
		neighborData = {
			neighbors : allNeighbors
		};
		
		res.render(neighborData);
		
		
	});
*/
});

app.post('/neighbor', function(req, res){
	// Setup DB instance
	var neighbor = new Neighbor();
	var help = ['EMERGENCIES', 'CHORES/LABOR', 'SOCIALIZING'];
	
	//Parse the parameters of the incoming SMS from twilio
	var body = req.body.Body;
	var from = req.body.From;
	var to = req.body.To;
	var date = req.body.date;
	
	var message = "Thanks for registering.";
	
	console.log('To : ' + to)
	console.log('From : ' + from)
	//Twilio Numbers: Building 1 : 16464612494, Building 2 : 16464612588, Building 3 : 16464612530
	// Building 4 : 16464309891, Building 5 : 16464025754,

	if( !(neighborNumber.indexOf(from) >= 0))
		neighborNumber.push(from);
		
	console.log(neighborNumber)

	if(to == '+16464612494'){
		if( body == 'I want to help' || 'yes' ){
			message = "Thanks for registering with Building 1.  How are you willing to help? A)EMERGENCIES B)CHORES/LABOR C)SOCIAL Choose all that apply.";
		} else if(body == 'a' || 'A' || 'EMERGENCIES' || 'A)EMERGENCIES' || 'emergencies' || 'a)emergencies') {
			message = "Thanks for helping with EMERGENCIES.  We will send a text when a neighbor is in need of help or text your needs to this number."; 
		} else if (body == 'b' || 'B' || 'CHORES/LABOR' || 'B)CHORES/LABOR' || 'chores/labor' || 'b)chores/labor' || 'chores' || 'labor') {
			message = "Thanks for helping with CHORES/LABOR.  We will send a text when a neighbor is in need of help or text your needs to this number.";
		} else if (body == 'c' || 'C' || 'SOCIAL' || 'social' || 'C)SOCIAL' || 'c)social'){
			message = "Thanks for being SOCIAL.  We will send a text when a neighbor is in need or text your needs to this number.";
		} else { 
			message = "To register, text 'I want to help.' to 1-646-461-2494";
		}
	} else if(to == '+16464612588' ) {
		message = "Thanks for registering with Building 2.";
	} else if(to == '+16464612530' ) {
		message = "Thanks for registering with Building 3.";
	} else if(to == '+16464309891' ) {
		message = "Thanks for registering with Building 4.";
	} else if(to == '+16464025754' ) {
		message = "Thanks for registering with Building 5.";
	} else {
		message = "Thanks for registering.";
	}
	console.log(message);
	// Registration Function:
	// Start with: 'I want to help"
	// Thanks for contacting neighbors of ______(Building).  To signu up, reply 'I want to help'.
	// Thanks for registering.  How are you willing to help? A)EMERGENCIES B)CHORES/LABOR C)SOCIAL? Choose all that apply.
		// if nothing 
	// B
	// Thanks for 'helping with ________'.  We will send a text when a neighbor is in need of help.  If you need help, text this number otherwise we  
	// We will send a text when a neighbor needs 'help with _______a'.  If you need help, text your needs to 88888. 


	//Help Function:
	//
	// I need help with ___ at __(time) at __(apartment). 
	//
	// We have contacted your neighbors and will update you shortly.
	//
	// send sms to people who are registered
	// 
	// A neighbor needs help with ______ at _(time)_ at _(location)_.  Text YES if you can help.
	//
	// if YES - Thanks for helping your neighbor!
	// if NO - Thanks.  Maybe next time.
	//
	// after a half hour - neighbors are unavailable
	//	
	// Send a text to those signed up with 10

	Twilio.SMS.create({to: from, from: to, body: message}, function(err,res) {
		console.log('Up Up and Away...SMS Sent!');
	});
	
	neighbor.number = from;
	neighbor.to = to;
	neighbor.body = body;
	neighbor.save();
	
	res.redirect('/neighbor/' + neighbor.from)


/*
	 // received twilio
	var from = req.body.From;
	var to = req.body.To;
	var body = req.body.Body;

  
	var newNeighbor = {
	  from: req.body.To,
	  body: req.body.Body,
	  to: 	req.body.From
	};
  
	var Neighbor = new Neighbor(newNeighbor);
	Neighbor.save();
	 
	 
	var twiml = '<?xml version="1.0" encoding="UTF-8" ?><Response>n<Sms>Thanks for signing up!  What would you like to help with? A) Emergencies, B) Around the House, C) Socializing, D) Pet Walking.</Sms>n</Response>';

    res.send(twiml, {'Content-Type':'text/xml'}, 200);
*/
});



var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log("Listening on " + port);
});