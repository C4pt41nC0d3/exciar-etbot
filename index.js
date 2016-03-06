var express = require("express");
var app = express();
var http = require("http").Server(app);
var io = require("socket.io")(http);
var fs = require("fs");
var path= require("path");

var spawn = require("child_process").spawn;
var proc;

app.use("/", express.static(path.join(__dirname, "stream")));

app.get("/", function(req, res){
	res.sendFile(__dirname+"/dash-board.html");
});

app.get("/video", function(req, res){
	res.sendFile(__dirname+"/video-stream.html");
});

var sockets;

io.on("connection", function(socket){
	sockets[socket.id] = socket;
	console.log("RobotLogger [clients connected]>"+Object.keys(sockets).length);

	//socket events
	socket.on("disconnect", function(){
		delete sockets[socket.id];

		if(Object.keys(sockets).length == 0){
			app.set("matchingFile", false); 
			if(proc) proc.kill();
			fs.unwatchFile("./stream/image.jpeg");
		}	
	});

	socket.on("start-stream", function(){
		startStreaming(io);
	});

});

http.listen(3200, function(){
	console.log("RobotLogger [HTTP Server port]>3200");
});

function StartStreaming(io){
	if(Object.keys(sockets).length == 0){
		app.set("watchingFile", false);
		if(proc) proc.kill();
		else fs.unwatchFile("./stream/image.jpeg"); 
	}
}

function startStreaming(io){
	if(app.get("watchFile"){
		io.sockets.emit("liveStream", "frame_stream.jpeg?_tw="+(Math.random() * 100000));
		return;
	}
	
	var tz = setInterval(function(){
		var camera_args = ["-r", "320x240", "", "./stream/image.jpeg"];
		spawn("fswebcam", camera_args);
	}, 100); 

	app.set("watchingFile", true);

	fs.watchFile("./stream/image.jpeg", function(c,r){
		io.sockets.emit("liveStream", "frame_stream.jpeg?_tw="+(Math.random()*100000)); 
	});	
}

