var util = require('util');

var log4js = require('log4js');
log4js.configure('log4js.json', {
	reloadSecs : 300
});

var log = log4js.getLogger("WebPush");

function getLogger(category) {
	log = log4js.getLogger(category);
	return log;
}

// 记录info级别日志
function info() {
	log.info(util.format.apply(this, arguments));
}

// 记录warn级别日志
function warn() {
	log.warn(util.format.apply(this, arguments));
}

// 记录error级别日志
function error() {
	log.error(util.format.apply(this, arguments));
}

module.exports = {
	getLogger : getLogger,
	info : info,
	warn : warn,
	error : error
};