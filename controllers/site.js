var Todo = require('../models/Todo'),
	Pics = require('../models/Pics'),
    path = require('path'),
    fs = require('fs'),
    formidable = require('formidable');

exports.removeTodo = function(req, res) {
	console.log(req.body);
	
	Todo.remove({_id:req.body._id},function(err, todo) {
		if(err) {
			console.log(err);
		}

		res.json({
			resultCode: 0,
			description: 'successful'
		});
		
	})

}


/**
 * @method index
 * 渲染index页面
 */
exports.index = function(req, res) {
	res.render('index', {
		title: "Todo Application",
		hasLogin: !! req.session.loginName,
	});
}

exports.todos = function(req, res) {
	// 用户登录了
	if ( !! req.session.loginName) {
		res.render('todos', {
			title: "Todos List",
			hasLogin: true,
			userName : req.session.loginName || "user"
		});
	} else { // 用户没有登录
		res.redirect('/login');
	}
}



/**
 * @method filterTodos
 * 根据传入的参数不同，来获取todo项
 */
exports.filterTodos = function(req, res) {
	Todo.find(req.query, function(err, docs) {
		if (err) {
			console.log(err);
		}
		res.json(docs);
	});
}

/**
 * @method getAllTags
 * 获取所有的分类列表
 */
exports.getAllTags = function(req, res) {
	Todo.find(req.query, function(err, docs) {
		var ret = [];
		if (err) {
			console.log(err);
		}
		for (var i = 0; i < docs.length; i++) {
			if (ret.indexOf(docs[i].tag) === -1) {
				ret.push(docs[i].tag);
			}
		}
		res.send(ret);
	});
}

/**
 * @method star
 * 获取所有的标星Todo项
 */
exports.star = function(req, res) {
	Todo.find({
		star: true
	}, function(err, docs) {
		if (err) {
			console.log(err);
		}
		res.json(docs);
	});
}

/**
 * @method unStar
 * 获取所有的未标星Todo项
 */
exports.unStar = function(req, res) {
	Todo.find({
		star: false
	}, function(err, docs) {
		if (err) {
			console.log(err);
		}
		res.json(docs);
	});
}

/**
 * @method addTodo
 * 添加一条Todo项
 */
exports.addTodo = function(req, res) {
	//create new model
	var todo = new Todo(req.body);

	//save model to MongoDB
	todo.save(function(err) {
		if (err) {
			return err;

		} else {
			console.log("todo saved");

		}
	});

	res.json({
		resultCode: 0,
		description: "successful!"
	});

}

/**
 * @method editTodo
 * 编辑一条Todo项
 */
exports.edit = function(req, res) {
	var id = req.query.id;
	res.render('edit', {
		title: "edit a Todo",
		userName : req.session.loginName || "user",
		hasLogin: true,
		id : id
	});

}

/**
 * @method editTodo
 * 编辑一条Todo项
 */
exports.editTodo = function(req, res) {
	var id = req.body._id;
	var obj = {
		"title" : req.body.title,
  		"user" : req.body.user,
		"star" : req.body.star,
		"done" : req.body.done,
		"tag" : req.body.tag
	};

	Todo.update({
		_id: id
	},obj,function(err, docs) {
		if (err) {
			console.log(err);
		}
		else{
			res.json({
				resultCode: 0,
				description: 'successful'
			});
		}
	});

}

exports.getTodo = function(req, res) {
	var id = req.body.id;
	console.log(id);
	Todo.find({
		_id: id
	}, function(err, docs) {
		if (err) {
			console.log(err);
		}
		else{
			res.json(docs);
		}
	});
}


/**
 * @method add
 * Add A Todo
 */
exports.add = function(req, res) {

	// 用户登录了
	if ( !! req.session.loginName) {
		res.render('add', {
			title: "Add a Todo",
			userName : req.session.loginName || "user",
			hasLogin: true
		});
	} else { // 用户没有登录
		res.redirect('/login');
	}


}


exports.remove = function(req,res){
	console.log('remove!!!!');
}

//上传文件/图片
exports.upload = function(req,res,callback){

	var form = new formidable.IncomingForm(),
		_end = false;

    form.parse( req, function( err, fields, files ) {
		console.log(req);
		if( !fields.name || fields.name.length > 10 ){
			_end = true;
			return  res.send( { resultCode: 1000 , msg: 'name must be in' } );
		}

		if( !fields.mobile || !/1\d{10}/.test( fields.mobile ) ){
			_end = true;
			return  res.send( { resultCode: 1001 , msg: 'mobile must be in' } );
		}

	   if( !files.upload ){
		   _end = true;
		  return  res.send( { resultCode: 1100 , msg: '请添加附件' } );
	   }
	   if( files.upload.size >= 5 * 1024 * 1024 ){
		   _end = true;
		  return  res.send( { resultCode: 1101 , msg: '附件超出限定大小' } );
	   } 
	   var s = files.upload.name.split('.'),
		   type = s[s.length -1];
	   if( ['docx','doc','rar','zip','pdf','wps','jpg','bmp','png','gif'].indexOf(s[s.length -1].toLowerCase()) < 0 ){
		   _end = true;
		  return  res.send( { resultCode: 1102 , msg: '附件类型错误' } );
	   }

	   var ip = tool.getClientIp( req );
		if( hosts[ ip ] ){
			res.send( {
				resultCode: 1104,
				msg: '提交过于频繁，请一分钟后再试'
			} );
			_end = true;
			return;
		}
		if( hostsDay[ ip ] && hostsDay[ip] > 9 ){
			res.send( {
				resultCode: 1105,
				msg: '提交过于频繁，请第二天再试'
			} );
			_end = true;
			return;
		} else {
			hostsDay[ ip ] ? hostsDay[ ip ]++ : hostsDay[ ip ] = 1;
		}
		hosts[ ip ] = tool.getTime( { type: 'millis' } );
	   req.body = fields;
	   req.body.annex = files.upload.path;

    });

	form.on('error', function( e ){
		console.log( e + '===============' );
	});
	form.maxFieldsSize = 5 * 1024 * 1024;
	form.uploadDir = "./public/upload";
	form.keepExtensions = true;
	form.on('progress', function(bytesReceived, bytesExpected) {
		//console.log( bytesReceived + ':' + bytesExpected );
	});
	form.on('end', function( a, b, c ) {
		if( _end ){
			return;
		}
		callback( req, res );
	});

    return;

}


//保存base64图片
exports.saveImg = function(req,res){

   var imgData = req.body.imgUrl,
       userId = req.body.userId;
       console.log(req.body);
   //var base64Data = imgData.replace(new RegExp("^data:image/png;base64,"), "");
   var dataBuffer = new Buffer(imgData, 'base64');

   var userPath = rootdir+'/userpics/'+userId+'/';

   //创建用户图片存放目录
	if(!fs.existsSync(userPath)){
        fs.mkdirSync(userPath, 0)    //0无任何权限，7读写权限
    }

    var picurl = userPath + '/1.jpg',                          //保存到服务器硬盘中的物理地址
    	saveurl = 'http://127.0.0.1:8666/userpics/'+userId+'/1.jpg';      //保存到数据库的图片查看路径

   fs.writeFile(picurl,dataBuffer, function (err) {
       if(err){
          console.log(err);
       }else{

       	  //保存图片之前需要压缩
       	  imgMinifier.smushit(userPath, {recursive: true,onComplete: function(reports){

       	  	 //图片压缩成功后，把图片查看路径保存到数据库中
				var newPic = new Pics({'userId':userId,'url':saveurl});
				newPic.save(function(err) {
					if( !err ){
		  	 			res.json({
							resultCode: 0,
							description: '保存成功！'
						});
					console.log('img saved success!');
					}
				});

		  }}); 


       }
   });

}