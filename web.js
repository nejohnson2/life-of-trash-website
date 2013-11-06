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
Twilio.AccountSid = process.env.Twilio_AccountSid;
Twilio.AuthToken  = process.env.Twilio_AuthToken;

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

    app.set('port', process.env.PORT || 3000);
    app.set('view engine','ejs');  // use the EJS node module
    app.set('views',__dirname+ '/views'); // use /views as template directory
    app.set('view options',{layout:true}); // use /views/layout.html to manage your main header/footer wrapping template
    app.register('html',require('ejs')); //use .html files in /views

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

/* 	response.render('maplive.html', {layout: false }); */
	response.render('blog.html');
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
app.get('/contact', function(request, response) {

	response.render('contact.html');
});
app.get('/lab', function(request, response) {

	response.render('lab.html');
});
app.get('/citizen_research', function(request, response) {

	response.render('future/citizen_research.html');
});
app.get('/tracking_research', function(request, response) {

	response.render('future/tracking_research.html');
});
app.get('/education', function(request, response) {

	response.render('future/education.html');
});
app.get('/lab-info', function(request, response) {

	response.render('future/labinfo.html');
});


/******************************************************************/
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
app.get('/post7', function(request, response) {

	response.render('post7.html');
});
app.get('/post8', function(request, response) {

	response.render('post8.html');
});
app.get('/post9', function(request, response) {

	response.render('post9.html');
});

app.get('/trashtubes', function(request, response) {

	response.render('trashtubes.html');
});

app.get('/archive', function(request, response) {

	response.render('archive.html');
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

app.get('/landfill', function(request, response){
	
	response.render('engage/landfill.html', {layout : true});
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


var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log("Listening on " + port);
});