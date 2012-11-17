window.onload = function(){

	window.util.patchFnBind();
	var accelerometer;
    setup();

    var emitID = setInterval(repeat, 100);

	// Make a connection to the socket.io server
	// This fires the "connection" event!!
	var socket = io.connect('http://128.237.225.185:3000/');

	setup();

	function setup() {
        accelerometer = new Accelerometer();
        accelerometer.startListening();   
    }


    function repeat(e) {
    	var lastValues = accelerometer.getLast();
		// emit to the server the "send" event, with our data object
		socket.emit('send', {secretstuff: lastValues.x});
	}
}
