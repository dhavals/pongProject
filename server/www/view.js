window.onload = function(){

	// Make a connection to the socket.io server
	// This also fires the "connection" event, but it doesn't matter
	var socket = io.connect('http://128.237.225.185:3000/');
	var clientUserId;
	// When getting a "receive" event from the server
	socket.on('receive', function(data) {
		// update the DOM with received data
		clientUserId = data.clientUserId;

		if (clientUserId === "0")
			document.getElementById('acc0').innerHTML = data.secretstuff;
		else if (clientUserId === "1")
			document.getElementById('acc1').innerHTML = data.secretstuff;
	});
}
