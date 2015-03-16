var cluster = require('cluster');
var fs = require('fs');
var appServer = require('./server.js');
var numCPUs = require('os').cpus().length;
var log = require('./log');

// 处理进程未能捕获的异常
process.on('uncaughtException', function(e) {
    log.error(e.stack);
});

if (false) {
    global.lastHeartBeat = new Date().getTime();

    function createWork() {
        // 启动多个进程.
        var worker = cluster.fork();
        console.log('worker ' + worker.process.pid + ' onstart');

        // 侦听子进程的message事件
        worker.on('message', function(msg) {
            if (msg.type && msg.type == 'heartbeat') {
                // console.log("isMaster  " + msg.date);
                global.lastHeartBeat = msg.date;
                worker.send({
                    type : 'heartbeat'
                });
            }
        });

        worker.process.on('uncaughtException', function(e) {
            log.error(e.stack);
        });

        return worker;
    }

    global.worker = createWork();

    cluster.on('exit', function(worker, code, signal) {
        log.info('worker ' + worker.process.pid + ' died');
        global.worker = createWork();
    });

    fs.writeFile('pid', process.pid, function(err) {
        if (err) {
            log.error(err);
        }
    });

//    setInterval(function() {
//        var currentDate = new Date();
//        var interval = currentDate.getTime() - global.lastHeartBeat;
//        if (interval > 1200000) { // 心跳间隔大于2分钟
//            process.kill(global.worker.process.pid, 'SIGHUP');
//        }
//    }, 30000); // 30 秒检测一次

} else {
    appServer.start();

    function heartbeat() {
        process.send({
            type : 'heartbeat',
            date : new Date().getTime()
        });
    }

    process.on('message', function(msg) {
        if (msg.type && msg.type == 'heartbeat') {
            setTimeout(heartbeat, 1000);
        }
    });

    //heartbeat();
}