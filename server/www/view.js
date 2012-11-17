window.onload = function(){

	// Make a connection to the socket.io server
	// This also fires the "connection" event, but it doesn't matter
	var socket = io.connect('http://128.237.225.185:3000/');

	// When getting a "receive" event from the server
	socket.on('receive', function(data) {
		// update the DOM with received data
		document.getElementById('replace').innerHTML = data.secretstuff;
	});
}
