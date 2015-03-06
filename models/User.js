var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

//create schema for Todo
var UserSchema = new Schema({
	loginName: String,
	loginPass: String
});

//compile schema to model
module.exports = mongoose.model('User', UserSchema);