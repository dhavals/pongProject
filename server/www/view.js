window.onload = function(){
	// Make a connection to the socket.io server
	// This also fires the "connection" event, but it doesn't matter
	
	var socket = io.connect('http://128.237.254.163:3000/');
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

	var intervalId;
	var timerDelay = 10;

	function Player()
	{
	    this.score = 0;
	}

	/*

	Note: Since we made Pong for our hw1, we used a fair amount of that code
	
	*/
	
	function MovingCircle(cx, cy, xSpeed, ySpeed, radius)
	{
		this.cx = cx;
		this.cy = cy;
		this.xSpeed = xSpeed;
		this.ySpeed = ySpeed;
		this.radius = radius;   
	}

	function Ball(cx, cy, xSpeed, ySpeed, radius, color)
	{
		MovingCircle.call(this, cx, cy, xSpeed, ySpeed, radius);
		this.color = color;
	}
	Ball.prototype = new MovingCircle();
	Ball.prototype.constructor = Ball;

	function BallBounds(edgeUp, edgeDown, edgeLeft, edgeRight)
	{
	    this.edgeUp = edgeUp;
	    this.edgeDown = edgeDown;
	    this.edgeLeft = edgeLeft;
	     this.edgeRight = edgeRight;
	}

	function Paddle(cx, cy, width, height, radius, name)
	{
		this.cx = cx;
		this.cy = cy;
		this.paddleWidth = width;
		this.paddleHeight = height;
		this.radius = radius;
		this.name = name;
	}

	var initBallX = 200;
	var initBallY = 200;
	var initBallXSpeed = 2;
	var initBallYSpeed = 2;
	var initBallRadius = 7;

	var initPaddleWidth = 10;
	var initPaddleHeight = 60;
	var initPaddleRadius = 5;

	var initPaddle1X = 25;
	var initPaddle1Y = (canvasHeight/2) - 50;
	var initPaddle2X = canvasWidth - 30 - 5;
	var initPaddle2Y = (canvasHeight/2) - 50;

	var ball = new Ball(initBallX, initBallY, initBallXSpeed, initBallYSpeed, initBallRadius, 'green');
	var ballBounds = new BallBounds(0, canvasHeight, 0, canvasWidth);

	var paddle1 = new Paddle(initPaddle1X, initPaddle1Y, initPaddleWidth, initPaddleHeight, initPaddleRadius, "one");
	var paddle2 = new Paddle(initPaddle2X, initPaddle2Y, initPaddleWidth, initPaddleHeight, initPaddleRadius, "two");

	var player1 = new Player();
	var player2 = new Player();

	function redrawAll(ball)
	{
		ctx.clearRect(0, 0, 800, 400);
		redrawBall(ball);
		redrawPaddles();
		redrawScore();
	}

	function drawCircle(ctx, cx, cy, radius, color) 
	{
		ctx.beginPath();
		ctx.arc(cx, cy, radius, 0, 2*Math.PI, true);

		ctx.fillStyle = color;
		ctx.fill();
	}

	function redrawBall(ball) 
	{    
		drawCircle(ctx, ball.cx, ball.cy, ball.radius, ball.color);
	} 


	function redrawPaddles()
	{
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

		roundedRect(ctx, paddle1.cx, paddle1.cy, paddle1.paddleWidth, paddle1.paddleHeight, paddle1.radius, "blue");
		roundedRect(ctx, paddle2.cx, paddle2.cy, paddle2.paddleWidth, paddle2.paddleHeight, paddle2.radius, "red");
	}

	function redrawScore()
	{
		var player1score = "" + player1.score;
		var player2score = "" + player2.score;

		ctx.font = "30px Arial";
		ctx.textAlign = "center";
		ctx.fillStyle = "black";
		ctx.fillText(player1score, canvasWidth/2 - 30, 50);
		ctx.fillText(player2score, canvasWidth/2 + 30, 50);
	}

	function movePaddleUp(paddle, speed)
	{
		paddle.cy -= speed;
	}

	function movePaddleDown(paddle, speed)
	{
		paddle.cy += speed;
	}


	function isScore(ball) // checks if the ball has left the board and places it back in the center
	{
		if (ball.cx + ball.radius >= ballBounds.edgeRight){
			player1.score += 1;
			console.log(" Player 1 scored!");
			ball.cx = canvasWidth/2;
			ball.cy = canvasHeight/2;
			ball.xSpeed = -Math.floor((Math.random()) + 2);
			ball.ySpeed = Math.floor((Math.random()) + 2)*Math.pow(-1, Math.round(Math.random())) ;
			setTimeout(onTimer, timerDelay * 10);
			return true;
		}

		if (ball.cx - ball.radius <= ballBounds.edgeLeft){
			player2.score += 1;
			console.log("Player 2 scored!");
			ball.cx = canvasWidth/2;
			ball.cy = canvasHeight/2;
			ball.xSpeed = Math.floor((Math.random()) + 2);
			ball.ySpeed = Math.floor((Math.random()) + 2)*Math.pow(-1, Math.round(Math.random()));
			setTimeout(onTimer, timerDelay * 10);
	        return true;
	    }
	    return false;
	}

	function onTimer() // called every timerDelay millis
	{
		if (Play() === "score")
			return;

		setTimeout(onTimer, timerDelay);
	}

	function Play()
	{
		if (isScore(ball) === true){
			return "score";
		}

	   	// first find out the new coordinates of where to draw the ball
	    setNextBallLocation(ball, paddle1, paddle2, BoundaryBouncePlay, PaddleBouncePlay);
	    // updatePaddles();

	    // then redraw it at that place
	    redrawAll(ball);
	    return "notScore";
	}

	function run() 
	{
	    // make canvas focusable, then give it focus!
	    canvas.setAttribute('tabindex','0');
	    canvas.focus();

	    setTimeout(onTimer, timerDelay);
	}

	function setNextBallLocation(ball, paddle1, paddle2, boundaryBounceFn, paddleBounceFn)
	{
	    
	    boundaryBounceFn(ball);

	    paddleBounceFn(ball, paddle1, paddle2);

	    ball.cx += ball.xSpeed;
	    ball.cy += ball.ySpeed;

	    // at this point, we may have exceeded the ball bounds. Thus, if we have, then meet the edge exactly.
	    if (ball.cx + ball.radius >= ballBounds.edgeRight)
	        ball.cx = ballBounds.edgeRight - ball.radius;

	    if (ball.cx - ball.radius <= ballBounds.edgeLeft)
	        ball.cx = ballBounds.edgeLeft + ball.radius;

	    if (ball.cy + ball.radius >= ballBounds.edgeDown)
	        ball.cy = ballBounds.edgeDown - ball.radius;

	    if (ball.cy - ball.radius <= ballBounds.edgeUp)
	        ball.cy = ballBounds.edgeUp + ball.radius;


	    // at this point, if the ball is inside the paddle, make it touch the paddle edge exactly. 
	    if(((ball.cx - ball.radius) < (paddle1.cx + paddle1.paddleWidth)) && ((ball.cx - ball.radius) > paddle1.cx)){
	        if ((ball.cy - ball.radius) <= (paddle1.cy + paddle1.paddleHeight) && (ball.cy + ball.radius) >= paddle1.cy)
	            ball.cx = paddle1.cx + paddle1.paddleWidth + ball.radius;
	    }

	    if((ball.cx + ball.radius) > paddle2.cx && (ball.cx + ball.radius) < (paddle2.cx + paddle2.paddleWidth)){
	        if ((ball.cy - ball.radius) <= (paddle2.cy + paddle2.paddleHeight) && (ball.cy + ball.radius) >= paddle2.cy)
	            ball.cx = paddle2.cx - ball.radius;
	    }

	}


	function BoundaryBouncePlay(ball)
	{
	    if (ball.cy + ball.radius >= ballBounds.edgeDown || ball.cy - ball.radius <= ballBounds.edgeUp)
	        ball.ySpeed = -ball.ySpeed;    
	}

	function PaddleBouncePlay(ball, paddle1, paddle2)
	{
	    if (touchingTop(ball) || touchingBottom(ball))
	        bounceEdge(ball);
	    if (touchingCenter(ball))
	        bounceCenter(ball);
	    if (touchingMiddleDown(ball) || touchingMiddleUp(ball))
	        bounceMiddle(ball);
	}


	function touchingTop(ball)
	{
	    if((ball.cx - ball.radius) === (paddle1.cx + paddle1.paddleWidth)){
	        if (ball.cy <= (paddle1.cy + (paddle1.paddleHeight * 0.2)) && (ball.cy + ball.radius) >= paddle1.cy)
	            return true;
	    }

	    if((ball.cx + ball.radius) === paddle2.cx){
	        if (ball.cy <= (paddle2.cy + (paddle2.paddleHeight * 0.2)) && (ball.cy + ball.radius) >= paddle2.cy)
	            return true;
	    }
	   
	    return false;
	}

	function touchingMiddleUp(ball)
	{
	    if((ball.cx - ball.radius) === (paddle1.cx + paddle1.paddleWidth)){
	        if (ball.cy <= (paddle1.cy + (paddle1.paddleHeight * 0.4)) && ball.cy > (paddle1.cy + (paddle1.paddleHeight * 0.2)))
	            return true;
	    }

	    if((ball.cx + ball.radius) === paddle2.cx){
	        if (ball.cy <= (paddle2.cy + (paddle2.paddleHeight * 0.4)) && ball.cy > (paddle2.cy + (paddle2.paddleHeight * 0.2)))
	            return true;
	    }
	   
	    return false;
	}


	function touchingCenter(ball)
	{
	    if((ball.cx - ball.radius) === (paddle1.cx + paddle1.paddleWidth)){
	        if (ball.cy <= (paddle1.cy + (paddle1.paddleHeight * 0.6)) && ball.cy > (paddle1.cy + (paddle1.paddleHeight * 0.4)))
	            return true;
	    }

	    if((ball.cx + ball.radius) === paddle2.cx){
	        if (ball.cy <= (paddle2.cy + (paddle2.paddleHeight * 0.6)) && ball.cy > (paddle2.cy + (paddle2.paddleHeight * 0.4)))
	            return true;
	    }
	   
	    return false;
	}

	function touchingMiddleDown(ball)
	{
	    if((ball.cx - ball.radius) === (paddle1.cx + paddle1.paddleWidth)){
	        if (ball.cy <= (paddle1.cy + (paddle1.paddleHeight * 0.8)) && ball.cy > (paddle1.cy + (paddle1.paddleHeight * 0.6)))
	            return true;
	    }

	    if((ball.cx + ball.radius) === paddle2.cx){
	        if (ball.cy <= (paddle2.cy + (paddle2.paddleHeight * 0.8)) && ball.cy > (paddle2.cy + (paddle2.paddleHeight * 0.6)))
	            return true;
	    }
	   
	    return false;
	}


	function touchingBottom(ball)
	{
	    if((ball.cx - ball.radius) === (paddle1.cx + paddle1.paddleWidth)){
	        if ((ball.cy - ball.radius) <= (paddle1.cy + paddle1.paddleHeight) && ball.cy > (paddle1.cy + (paddle1.paddleHeight * 0.8)))
	            return true;
	    }

	    if((ball.cx + ball.radius) === paddle2.cx){
	        if ((ball.cy - ball.radius) <= (paddle2.cy + paddle2.paddleHeight) && ball.cy > (paddle2.cy + (paddle2.paddleHeight * 0.8)))
	            return true;
	    }
	   
	    return false;
	}


	function updatePaddles(playerNumber, accValue)
	{
		var paddleSpeed = 5;

		if (accValue >= 1.5 && playerNumber === 2) // up player2
	    {
	        if(paddle2.cy - paddle2.radius>= 0)
	            movePaddleUp(paddle2, paddleSpeed);
	    }
	    if (accValue < -1.5 && playerNumber === 2) // down player2
	    {
	        if(paddle2.cy + paddle2.paddleHeight + paddle2.radius<= canvas.height)
	            movePaddleDown(paddle2, paddleSpeed);
	    }
	    if (accValue >= 1.5 && playerNumber === 1) // up player1
	    {
	        if(paddle1.cy - paddle1.radius>= 0)
	            movePaddleUp(paddle1, paddleSpeed);
	    }
	    if (accValue < -1.5 && playerNumber === 1) // down player1
	    {
	        if(paddle1.cy + paddle2.paddleHeight + paddle2.radius<= canvas.height)
	            movePaddleDown(paddle1, paddleSpeed);
	    }
	}

	function bounceEdge(ball)
	{
	    ball.xSpeed = -ball.xSpeed;
	    ball.ySpeed = -1.3*ball.ySpeed;
	}

	function bounceCenter(ball)
	{
	    ball.xSpeed = -ball.xSpeed;
	}

	function bounceMiddle(ball)
	{
	    ball.xSpeed = -ball.xSpeed;
	    ball.ySpeed = ball.ySpeed * 0.7;
	}

	run();

}
