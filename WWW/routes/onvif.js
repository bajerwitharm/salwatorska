var spawn = require('child_process').spawn;
var exec = require('child_process').exec;

var numberOfClients = 0;
var ffmpeg;
var EventEmitter = require('events').EventEmitter
var app = new EventEmitter;

module.exports = app

// defaults
app.settings = {
    host : 'kamerapietro1.salwatorska6',
    port : 81,
    user : 'viewer',
    pass : 'viewer123',
    name : 'KameraParter'
};

module.exports.initOnvif = function(db) {
    database = db;
    var datagram;
    var server = require('net').createServer(
	    function(stream) {
		stream.setEncoding('utf8');
		stream.addListener("data", function(slice) {
		    datagram = datagram + slice;
		    if (slice.length < 3472) {
			try {
			    var logentries = JSON.parse("["
				    + slice.slice(0, -1) + "]");
			    for ( var logentry in logentries) {
				logentry = logentries[logentry];
				if (logentry.length == 0) {
				    continue;
				}
				console.log(alarmEntry);
				//recordCamera(alarmEntry);
			    }
			} catch (err) {
			}

			datagram = "";
		    }
		});
	    });
    server.listen(15002, '0.0.0.0');
}

recordCamera = function(alarmEntry) {
    exec("ffmpeg -r 5 -t 60 -i 'http://"
		    + app.settings.host
		    + ":"
		    + app.settings.port
		    + "/cgi-bin/encoder?USER="
		    + app.settings.user
		    + "&PWD="
		    + app.settings.pass
		    + "&GET_STREAM' -acodec copy -vcodec mpeg4 -preset slow /home/salwatorska/`date +%#F_%H.%M.%S`BramaWejsciowa2.avi",
	    function puts(error, stdout, stderr) {
	    });
}

module.exports.getLiveCamera = function(req, res) {
    if (numberOfClients == 0) {
	ffmpeg = spawn("ffmpeg", [
		'-i',
		"rtsp://192.168.1.53/user=admin_password=FaWsG5QU_channel=1_stream=1.sdp?real_stream",
	           '-f','webm',
	           '-vcodec','libvpx',
	           '-acodec','libvorbis',
	           '-tune', 'zerolatency',
	           '-fflags', 'nobuffer',
	           '- 2>/dev/null|cat' ]);
	console.log("http://" + app.settings.host + ":" + app.settings.port
		+ "/cgi-bin/encoder?USER=" + app.settings.user + "&PWD="
		+ app.settings.pass + "&GET_STREAM");
    }
    ;
    numberOfClients++;
    res.writeHead(200, {
	'Transfer-Encoding' : 'chunked',
	'Content-Type' : 'video/webm'
    });
    req.on('close', function(code) {
	numberOfClients--;
	if (numberOfClients == 0) {
	    ffmpeg.kill();
	}
    });
    req.setTimeout(20000, function(code) {
	numberOfClients--;
	if (numberOfClients == 0) {
	    ffmpeg.kill();
	}
    });
    ffmpeg.stdout.pipe(res);
}