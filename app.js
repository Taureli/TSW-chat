var express = require("express");
var app = express();

var httpServer = require("http").createServer(app);

var socketio = require("socket.io");
var io = socketio.listen(httpServer);

var history = [];
var rooms = ["Room0", "Room1"];

app.use(express.static("public"));
app.use(express.static("bower_components"));



io.sockets.on('connection', function (socket) {

	io.sockets.emit('showRooms', rooms);
	
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
		//if(socket.room){
		//	socket.in(socket.room).emit('history', history);
		//}
		temp = " * Użytkownik " + socket.username + " dołączył do pokoju";
		history.unshift(temp);
		console.log("SENT " + JSON.stringify(temp));
		io.sockets.in(socket.room).emit('rec msg', temp);
	});
	
	socket.on('create room', function(data){
		rooms.push(data);
		io.sockets.emit('showRooms', rooms);
	});
	
	socket.on('disconnect', function(){
		temp = " * Użytkownik " + socket.username + " wyszedł z pokoju";
		history.unshift(temp);
		console.log("SENT " + JSON.stringify(temp));
		io.sockets.in(socket.room).emit('rec msg', temp);
		
		if(io.sockets.clients(socket.room).length <= 1 && socket.room > 1){
			for(var i = 2; i < rooms.length; i++){
				if(i == socket.room){
					temp1 = rooms.slice(0,i);
					temp2 = rooms.slice(i + 1,rooms.length);
					temp3 = temp1.concat(temp2);
					rooms = temp3;
				}
			}
			io.sockets.emit('showRooms', rooms);
		}
		
	});
	
	
});

httpServer.listen(3000, function () {
    console.log('Serwer HTTP działa na pocie 3000');
});
