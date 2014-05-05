var express = require("express");
var app = express();

var httpServer = require("http").createServer(app);

var socketio = require("socket.io");
var io = socketio.listen(httpServer);

var history = [];

app.use(express.static("public"));
app.use(express.static("bower_components"));



io.sockets.on('connection', function (socket) {

	socket.on('send msg', function (data) {
		data = socket.username + ': ' + data;
		history.unshift(data);
		console.log("SENT " + JSON.stringify(data));
		io.sockets.in(socket.room).emit('rec msg', data);
	});
	
	socket.on('set name', function(data){
		socket.username = data;
	});
	
	socket.on('join room', function(data){
		socket.room = data;
		socket.join(data);
		if(socket.room){
			socket.in(socket.room).emit('history', history);
		}
	});
	
	//socket.emit('history', history);
	
});

httpServer.listen(3000, function () {
    console.log('Serwer HTTP działa na pocie 3000');
});
