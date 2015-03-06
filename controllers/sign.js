/**
 * 
 */

var User = require('../models/User');

/**
 * @method signup
 * 跳转到注册页面
 */
exports.signup = function(req, res) {
	res.render('signup', {
		hasLogin: !!req.session.loginName,
		title: "注册 - Todo Application"
	});
}

/**
 * @method login
 * 跳转到登录页面
 */
exports.login = function(req, res) {

	res.render('login', {
		hasLogin: !!req.session.loginName,
		title: "登录 - Todo Application"
	});
}

/**
 * @method loginIn
 * 登录操作
 */
exports.loginIn = function(req, res) {
	var user = req.body;

	User.findOne(user, function(err, doc) {
		if (err) {
			console.log(err);
		}

		// 用户验证成功
		if(!!doc) {
			req.session.loginName = user.loginName;
			console.log(req.session.loginName);

			res.json({
				resultCode: 0,
				description: 'successful',
				user: user.loginName
			});
		} else {
			res.json({
				resultCode: 1000,
				description: '用户名或密码错误，请重新输入！'
			});
		}
	});
}

/**
 * @method loginIn
 * 登录操作
 */
exports.register = function(req, res) {
	//create new model
	var user = new User(req.body);

	//save model to MongoDB
	user.save(function(err) {
		if (err) {
			return err;

		} else {
			console.log("用户名注册成功");
			req.session.loginName = user.loginName;
			res.json({
				resultCode: 0,
				description: "successful!",
				user:user.loginName
			});

		}
	});




}

/**
 * @method loginOut
 * 注销操作
 */
exports.loginOut = function(req, res) {
	req.session.destroy(function() {
        res.json({
        	resultCode: 0,
        	description: 'successful'
        });
    });
}