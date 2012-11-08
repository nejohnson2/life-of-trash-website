var express = require('express');
var ejs = require('ejs');

var ACCOUNT_SID = 'ACad716cc4da934be6ad19bf5353312248';
var AUTH_TOKEN = '3af91684fa2d040f587bf96955cffd82';
var ApplicationSid = 'AP83b62baab6177d2c7223264063bcd407';

var twilioAPI = require('twilio-api'),
    cli = new twilioAPI.Client(ACCOUNT_SID, AUTH_TOKEN);
    



var app = express.createServer(express.logger());
app.use(cli.middleware());
/*********** SERVER CONFIGURATION *****************/
app.configure(function() {
    
    /*********************************************************************************
        Configure the template engine
        We will use EJS (Embedded JavaScript) https://github.com/visionmedia/ejs
        
        Using templates keeps your logic and code separate from your HTML.
        We will render the html templates as needed by passing in the necessary data.
    *********************************************************************************/

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
cli.account.getApplication(ApplicationSid, function(err, app) {
    if(err) throw err; //Maybe do something else with the error instead of throwing?

    /* The following line tells Twilio to look at the URL path of incoming HTTP requests
    and pass those requests to the application if it matches the application's VoiceUrl/VoiceMethod,
    SmsUrl/SmsMethod, etc. As of right now, you need to create a Twilio application to use the
    Express middleware. */
    app.register();
});


app.get('/', function(request, response) {
	
	response.send("uh oh, can't find that post");
});

var port = process.env.PORT || PORT;
app.listen(port, function() {
  console.log("Listening on " + port);
});