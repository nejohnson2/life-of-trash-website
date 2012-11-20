//export to web.js

module.exports.configureSchema = function(Schema, mongoose) {
	
	
	SMS = new Schema({
		from: String,
		body: String,
		date: { type: Date, default: Date.now }
	});
	
	Location = new Schema({
		from: 	String,
		to:		String,
		body:	String,
		lat:	String,
		lon:	String,
		date:	{ type: Date, default: Date.now }
	});
	
	mongoose.model('SMS', SMS);
	mongoose.model('Location', Location)
};

