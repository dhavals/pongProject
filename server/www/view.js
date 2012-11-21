window.onload = function(){
	
	var socket = io.connect('http://128.237.133.187:3000/');
	var clientUserId;

	// When getting a "receive" event from the server

	socket.on('receive', function(data) {
		// update the DOM with received data

		clientUserId = data.clientUserId;
		if (clientUserId === "0"){
			updatePaddles(1, data.secretstuff);
		}
		else if (clientUserId === "1"){
			updatePaddles(2, data.secretstuff);
		}
	});


	var canvas = document.getElementById("myCanvas");
	var ctx = canvas.getContext("2d");

	var canvasWidth = canvas.width;
	var canvasHeight = canvas.height;

	var timerDelay = 10;

	var Paddle = function(config){
	    this.style = config.style || 'blue';
	    this.radius = config.radius;

	    this.x = config.x;
	    this.y = config.y;
	    
	    this.velx = config.velx;
	    this.vely = config.vely;

	   	this.height = config.height;
	    this.width = config.width;

	    this.maxX = config.maxX;
	    this.maxY = config.maxY;

	    this.score = 0;

	}

	Paddle.prototype.draw = function(){
    	roundedRect(ctx, this.x, this.y, this.width, this.height, this.radius, this.style);
	}


	Paddle.prototype.update = function(){
	    this.x += this.velx;
	    this.y += this.vely;

	    if (this.x < 0){
	        this.x = 0;
	        this.velx = -this.velx;
	    }
	    else if(this.x + this.width > this.maxX){
	        this.x = this.maxX - this.width;
	        this.velx = -this.velx;
	    }
	    if (this.y < 0){
	        this.y = 0;
	        this.vely = -this.vely;
	    }
	    else if (this.y + this.height > this.maxY){
	        this.y = this.maxY - this.height;
	        this.vely = -this.vely;
	    }
	}


	var Ball = function(config){
	    this.style = config.style || 'blue';
	    this.radius = config.radius;

	    this.x = config.x;
	    this.y = config.y;
	    
	    this.velx = config.velx;
	    this.vely = config.vely;

	    this.maxX = config.maxX;
	    this.maxY = config.maxY;

	}



	Ball.prototype.draw = function(){
    	drawCircle(ctx, this.x, this.y, this.radius, this.style);
	}


	Ball.prototype.update = function(paddle1, paddle2){
	    this.x += this.velx;
	    this.y += this.vely;

	    if (this.x - this.radius < 0){
	        this.x = canvas.width/2;
	        this.velx = -this.velx;
	        paddle2.score ++;
	    }
	    else if(this.x + this.radius > this.maxX){
	        this.x = canvas.width/2;
	        this.velx = -this.velx;
	        paddle1.score ++;
	    }
	    if (this.y - this.radius < 0){
	        this.y = this.radius;
	        this.vely = -this.vely;
	    }
	    else if (this.y + this.radius > this.maxY){
	        this.y = this.maxY - this.radius;
	        this.vely = -this.vely;
	    }
	}



	Ball.prototype.bouncePaddle = function(paddle1, paddle2){


	    if(((ball.x - ball.radius) < (paddle1.x + paddle1.width)) && ((ball.x - ball.radius) > paddle1.x)){
	        if ((ball.y - ball.radius) <= (paddle1.y + paddle1.height) && (ball.y + ball.radius) >= paddle1.y){
	            ball.x = paddle1.x + paddle1.width + ball.radius;
	            ball.vely = -ball.vely;
	            ball.velx = -ball.velx;
	        }
	    }

	    if((ball.x + ball.radius) > paddle2.x && (ball.x + ball.radius) < (paddle2.x + paddle2.width)){
	        if ((ball.y - ball.radius) <= (paddle2.y + paddle2.height) && (ball.y + ball.radius) >= paddle2.y){
	            ball.x = paddle2.x - ball.radius;
	            ball.vely = -ball.vely;
	            ball.velx = -ball.velx;
	        }
	    }
	}


	var ball = new Ball({'x': canvas.width/2, 'y': canvas.height/2,
                            'radius': 20,
                            'maxX': canvas.width, 'maxY': canvas.height, 'velx':5, 'vely':5});

	var paddle1 = new Paddle({'x': 25, 'y': canvas.height/2,
                            'radius': 20,
                            'maxX': canvas.width, 'maxY': canvas.height, 'velx':0, 'vely':0, 'height':120, 'width': 40});



	var paddle2 = new Paddle({'x': canvas.width - 65, 'y': canvas.height/2,
                            'radius': 20,
                            'maxX': canvas.width, 'maxY': canvas.height, 'velx':0, 'vely':0, 'height':120, 'width': 40});








	function redrawAll()
	{
		ctx.clearRect(0, 0, 800, 400);
		
		redrawScore();
		ball.draw();
		ball.update(paddle1, paddle2);
		ball.bouncePaddle(paddle1, paddle2);
		
		paddle1.draw();
		paddle1.update();
		paddle2.draw();
		paddle2.update();
		setTimeout(redrawAll, timerDelay);
	}

	function drawCircle(ctx, cx, cy, radius, color) 
	{
		ctx.beginPath();
		ctx.arc(cx, cy, radius, 0, 2*Math.PI, true);

		ctx.fillStyle = color;
		ctx.fill();
	}

	function roundedRect(ctx, x, y, width, height, radius, color)
	{
		ctx.beginPath();
		ctx.moveTo(x,y+radius);
		ctx.lineTo(x,y+height-radius);
		ctx.quadraticCurveTo(x,y+height,x+radius,y+height);
		ctx.lineTo(x+width-radius,y+height);
		ctx.quadraticCurveTo(x+width,y+height,x+width,y+height-radius);
		ctx.lineTo(x+width,y+radius);
		ctx.quadraticCurveTo(x+width,y,x+width-radius,y);
		ctx.lineTo(x+radius,y);
		ctx.quadraticCurveTo(x,y,x,y+radius);
		ctx.fillStyle = color;
		ctx.fill();
	}


	function redrawScore()
	{
		var paddle1score = "" + paddle1.score;
		var paddle2score = "" + paddle2.score;

		ctx.font = "30px Arial";
		ctx.textAlign = "center";
		ctx.fillStyle = "black";
		ctx.fillText(paddle1score, canvasWidth/2 - 30, 50);
		ctx.fillText(paddle2score, canvasWidth/2 + 30, 50);
	}

	function movePaddleUp(paddle, speed)
	{
		paddle.y -= speed;
	}

	function movePaddleDown(paddle, speed)
	{
		paddle.y += speed;
	}






	function run() 
	{
	    canvas.setAttribute('tabindex','0');
	    canvas.focus();

	    setTimeout(redrawAll, timerDelay);
	}




	function updatePaddles(playerNumber, accValue)
	{
		var paddleSpeed = 5;

		if (accValue >= 1.5 && playerNumber === 2) // up player2
	    {
	       
	            movePaddleUp(paddle2, paddleSpeed);
	    }
	    if (accValue < -1.5 && playerNumber === 2) // down player2
	    {
	            movePaddleDown(paddle2, paddleSpeed);
	    }
	    if (accValue >= 1.5 && playerNumber === 1) // up player1
	    {
	            movePaddleUp(paddle1, paddleSpeed);
	    }
	    if (accValue < -1.5 && playerNumber === 1) // down player1
	    {
	            movePaddleDown(paddle1, paddleSpeed);
	    }
	}

	run();

};
