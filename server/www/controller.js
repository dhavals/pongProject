window.onload = function(){

	window.util.patchFnBind();
	var accelerometer;
	var thisUserId;
	// Make a connection to the socket.io server
	// This fires the "connection" event!!
	var socket;

	function setup() {
        accelerometer = new Accelerometer();
        accelerometer.startListening(); 
        socket = io.connect('http://128.237.225.185:3000/');  
        var emitID = setInterval(repeat, 100);
    }


    function repeat(e) {
    	var lastValues = accelerometer.getLast();
		// emit to the server the "send" event, with our data object
		socket.emit('send', {secretstuff: lastValues.x, clientUserId: thisUserId});
	}

	function hasSessionCookie(){
		var cookieArray = document.cookie.split(';');
		var cookies = {};
        // make cookie hashmap
        for (var i = 0; i < cookieArray.length; i++){
        	var parts = cookieArray[i].split('=');
        	var key = parts[0].trim();
        	var value = parts[1];
        	cookies[key] = value;
        }
        //user will be an id if they're logged in
        thisUserId = cookies['user'];
        return cookies['user'] !== 'none';
    }

    if (hasSessionCookie())
	{	
		document.getElementById('login').style.display = 'none';
    	setup();
	}
}
