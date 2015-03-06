var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

//create schema for Todo
var PicsSchema   = new Schema({
		userId : String,
		url    : String
});

//compile schema to model
module.exports = mongoose.model('Pics', PicsSchema);