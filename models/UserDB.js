var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

//create schema for Todo
var UserSchema = new Schema({
	username: String,
	sex: String,
	userpic: String,
	account: String,
	password: String,
	level: String
});


module.exports = mongoose.model('UserDB', UserSchema);
