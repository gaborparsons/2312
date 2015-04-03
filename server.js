var express = require('express'),
	app = express(),
	server = require('http').createServer(app),
	io = require('socket.io').listen(server);

app.configure(function() {
    app.use(express.static(__dirname + '/public'));
});

io.sockets.on('connection', function(socket) {
	socket.on('createNote', function(data) {
		socket.broadcast.emit('onNoteCreated', data);
	});

	socket.on('updateNote', function(data) {
		socket.broadcast.emit('onNoteUpdated', data);
	});

	socket.on('moveNote', function(data){
		socket.broadcast.emit('onNoteMoved', data);
	});

	socket.on('deleteNote', function(data){
		socket.broadcast.emit('onNoteDeleted', data);
	});

	//NEW
	// socket.on('swipeLeft', function(data){
	// 	// socket.broadcast.emit('onNoteDeleted', data);
	// 	console.log("TESTTESTTESTTESTTEST");
	// });
});

//server.listen(1337);

server.listen(3000, function () {
  console.log('Express server listening on port 3000');
});
