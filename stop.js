var fs = require('fs');

fs.readFile('pid', function(err, data) {
	if (err) {
		console.log(err);
	} else {
		console.log("kill Node.js - appserver pid : " + data);
		var pid = parseInt(data);
		setTimeout(function() {
			console.log('Exiting.');
			process.exit(0);
		}, 1000);
		process.kill(pid, 'SIGHUP');
	}
});
