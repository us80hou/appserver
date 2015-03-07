//引入站点、登录控制器模块

var site = require('./controllers/site');
	sign = require('./controllers/sign');

var Pics = require('./models/Pics'),
    path = require('path'),
    fs = require('fs'),
    imgMinifier  = require('node-smushit');

module.exports = function(app,server,rootdir) {

	// GET站点控制器
	app.get('/', site.index);
	app.get('/todos', site.todos);
	app.get('/add', site.add);
	app.get('/remove',site.remove);
	app.get('/api/filterTodos', site.filterTodos);
	app.get('/api/getAllTags', site.getAllTags);
	app.get('/api/filterTodos/star', site.star);
	app.get('/api/filterTodos/unStar', site.unStar);
	app.get('/api/edit', site.edit);
	

	// GET登录控制器
	app.get('/signup', sign.signup);
	app.get('/login', sign.login);
	app.get('/api/loginOut', sign.loginOut);

	// POST站点控制器
	app.post('/api/addTodo', site.addTodo);
	app.post('/api/removeTodo', site.removeTodo);
	app.post('/api/getTodo', site.getTodo);

	// PUT站点控制器
	app.put('/api/editTodo', site.editTodo);

	// POST登录控制器
	app.post('/api/loginIn', sign.loginIn);
	app.post('/api/register', sign.register);

	//保存base64图片
	app.post('/api/saveImg',site.saveImg);

	//上传图片
	// app.post('/upload', site.upload);
	
	//注册
	app.post('/register', site.register);

}