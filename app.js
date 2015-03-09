/**
 * Module dependencies.
 */

//所需依赖包，引入各个所需的模块

var express = require('express'),
	http = require('http'),
	path = require('path'),
	routes = require('./routes'),
	mongoose = require('mongoose'),
	bodyParser = require( 'body-parser' );

//连接数据库，如果连接成功，后台提示成功
mongoose.connect('mongodb://127.0.0.1:29197/Todos', function(err) {
	if (!err) {
		console.log('connected to MongoDB!');
	} else {
		throw err;
	}
});

//设置所有的后台框架环境
var app = express();

//设置视图目录，__dirname是一个全局变量，即取得JS执行的所在路径
app.set('views', __dirname + '/views');
app.use(express.static(path.join(__dirname, 'public') ) );

app.engine('.html', require('ejs').__express);

//设置页面模板引擎，这里用.html的模板
app.set('view engine', 'html');

//设置请求端口号
app.set('port', process.env.PORT || 8666);

app.use(express.favicon());
app.use(express.logger('dev'));

//express.bodyParser()是Connect内建的middleware，设置此处可以将client提交过来的post请求放入request.body中。
//app.use(express.bodyParser());

//express.methodOverride()也是Connect内建的，可以协助处理POST请求伪装PUT、DELETE和其他HTTP methods
app.use(express.methodOverride());

app.use(express.cookieParser('TodoApplication'));
app.use(express.session());
app.use(bodyParser.urlencoded({ extended: false }));

//express.static()也是一个Connect内建的middleware来处理静态的requests，例如css、js、img文件等;
//所以static()里面指定的文件夹中的文件会直接作为静态资源调用出来
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'pics'  ) ) );
app.use(express.static( __dirname ) );

//app.router()是route requests
app.use(app.router);


// express.errorHandler()是Connect内建的middleware来协助处理意外错误
if ('development' == app.get('env')) {
	app.use(express.errorHandler());
}

//当服务端与客户端连接成功后，后台提示连接的端口号
var server = http.createServer(app).listen(app.get('port'), function() {
	console.log('Express server listening on port ' + app.get('port'));
});


// 调用路由里的方法
routes(app,server,__dirname);



 