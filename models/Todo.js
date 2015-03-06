var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

//create schema for Todo
var TodoSchema = new Schema({
	title: String,
	user: String,
	star: Boolean,
	tag: String,
	done: Boolean
});

//compile schema to model
module.exports = mongoose.model('Todo', TodoSchema);