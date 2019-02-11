/*Простая змейка. Правила обычные: нельзя врезаться в границы и самого себя. 
Если нажать поочередено W, S или A, D будет столкновение.
Игру делала по туториалу, от себя добавила только переключатель скорости и всякие мелочи с ним связанные (функции checkedRadioButton и gameOver). */

const 	canvas = document.getElementById("canv");
const 	context = canvas.getContext("2d");
const	box = 32;
const 	ground = new Image();
	  	ground.src = "img/ground.png";

const 	foodImage = new Image();
	  	foodImage.src = "img/food.png";
//load audio 
const	dead = new Audio();
const	eat = new Audio();
const	up = new Audio();
const	down = new Audio();
const	left = new Audio();
const	right = new Audio();

dead.src="audio/dead.mp3";
eat.src="audio/eat.mp3";
up.src="audio/up.mp3";
down.src="audio/down.mp3";
left.src="audio/left.mp3";
right.src="audio/right.mp3";

var 	snake = [];
snake[0] = {
		x: 9 * box,
		y: 10 * box
}
var 	food = {
			x: Math.floor(Math.random()*17 + 1) * box,
			y: Math.floor(Math.random()*15 + 3)	* box
		}
var 	score = 0, endGame=0, d, game; // d - direction ch, result?? 
var 	velocity = document.getElementsByName("velocity");

document.addEventListener("keydown", direction);
//control the snake with WASD
function direction(event) {
	if(event.keyCode == "65" && d!="RIGHT" ) {
		d="LEFT";
		left.play();
	} else if (event.keyCode == "83"  && d!="DOWN") {
		d="UP";
		up.play();
	} else if (event.keyCode == "68" && d!="LEFT") {
		d="RIGHT";
		right.play();
	} else if (event.keyCode == "87" && d!="UP" ) {
		d="DOWN";
		down.play();
	}
}


//true if radio button checked
function checkedRadioButton() {
  	let i;
  	for( i=0; i<velocity.length; i++) {
  		if (velocity[i].checked) {
  			//console.log(velocity[i].checked, i);
  			break;
  		}
  	}
  	return (i);
  }


// function will return 'flag'=1 for crashed
function gameOver(X, Y){
 	if (X<box || X>17*box || Y< 3*box || Y>17*box) {
		clearInterval(game);	
		console.log('end game');
		endGame=1;
		dead.play();
	}
	for(let i=1; i<snake.length; i++)
	{
		if(snake[0].x==snake[i].x && snake[0].y==snake[i].y) {
			clearInterval(game);	
			console.log('end game');
			endGame=1;
			dead.play();
		}	
	}
	return (endGame);
 }


//draw evreything to the canvas
function draw() {
	let flag, question, radioNumber, ms;// ms - milliseconds
	radioNumber=checkedRadioButton();
	context.drawImage(ground,0,0);
	for(let i=0; i<snake.length; i++) {
		context.fillStyle = (i == 0) ? "green" : "white"; //head green, other white
		context.fillRect(snake[i].x, snake[i].y, box, box); //draw rectangle

		context.strokeStyle = "red";
		context.strokeRect(snake[i].x, snake[i].y, box, box);  // draw rectangle without ground
	}
	//old head position
	let 	snakeX = snake[0].x;
	let 	snakeY = snake[0].y;
	if (snakeX == food.x && snakeY == food.y) {
			score++;
			eat.play();
			food = {
				x: Math.floor(Math.random()*17 + 1) * box,
				y: Math.floor(Math.random()*15 + 3)	* box
			} 

	} 	else { //remove the tail
				snake.pop();
		}
	flag = gameOver(snakeX, snakeY);	
	context.drawImage(foodImage, food.x, food.y);
	if (d == "LEFT") snakeX-=box;
	if (d == "RIGHT") snakeX+=box;
	if (d == "UP") snakeY+=box;
	if (d == "DOWN") snakeY-=box;
	//add new head
	let 	newHead = {
				x: snakeX,
				y: snakeY
			}
	snake.unshift(newHead);
	context.fillStyle = "white";
	context.font = "45px Changa one";
	context.fillText(score, 2*box, 1.6*box);
	//console.log('flag'+flag);
	if(!flag) { //if alive then we calculate the velocity 
		ms = 200-50*radioNumber; //ch result
		game = setTimeout(draw, ms);
	} 	else { 
				clearInterval(game);
				question = confirm('Am i dead? I wanna live. Can you help me please?'); 
				if(question) {
				 	location.reload(false); 
				}
		}

}
game = setTimeout(draw, 200); //start with slow velocity

