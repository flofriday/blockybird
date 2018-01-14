//The canvas element
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

/*
 * All Keybord
 */
var up = false;

document.addEventListener("keydown", keyDownHandler);
document.addEventListener("click", clickHandler);

function clickHandler() {
	up = true;
}

function keyDownHandler(e) {
	//Space, Enter or up arrow
	if(e.keyCode == 13 || e.keyCode == 32 || e.keyCode == 38) {
		up = true;
	}
}


/*
 * The space ship
 */
var birdSize = 150;
var birdSpeed = 0;
var defaultBirdY = canvas.height/2;
var birdY = defaultBirdY; //from bottom
var birdX = canvas.width / 10;

function drawBird() {
	ctx.beginPath();
	ctx.rect(birdX, canvas.height - birdSize - birdY, birdSize, birdSize);
	ctx.fillStyle = "#6495ED";
	ctx.fill();
	ctx.closePath();
}

function moveBird() {
	if (up === true) {
		up = false;
		birdSpeed = 9.81 * 2;
	}

	birdSpeed -= 9.81 / 12;	
	birdY += birdSpeed;
}

/*
 * The "evil" enemy
 */
var enemyList = []
var enemySpeed = 10;
var enemySize = 300;
var enemyGapSize = birdSize * 3;
var enemySpawnCounter = 0;

function Enemy(x, gap, passed) {
	this.x = x ;
	this.gap = gap;
	this.passed = passed;
}

function spawnEnemy() {
	if (enemySpawnCounter <= 0)  {
		var random = Math.random() * (canvas.height - enemySize) * 0.8 + 0.1;
		var newEnemy = new Enemy(canvas.width, random, false);
		enemyList.push(newEnemy);

		enemySpawnCounter = 200;
	}
	else {
		enemySpawnCounter --;
	}

	// Kill enemys which are out of frame
	if (enemyList[0] == null) return;
	if (enemyList[0].x <= enemySize * -1) {
		enemyList.shift();
	}
}

// move all enemys
function moveEnemy() {
	for (var i = 0; i < enemyList.length; i++) {
		enemyList[i].x -= enemySpeed;
	}

	spawnEnemy();
}

function drawEnemy() {

	for (var i = 0; i < enemyList.length; i++) {
		ctx.beginPath();
		ctx.rect(enemyList[i].x, canvas.height - enemyList[i].gap, enemySize, enemyList[i].gap);
		ctx.fillStyle = "green";
		ctx.fill();
		ctx.closePath();

		ctx.beginPath();
		ctx.rect(enemyList[i].x, 0, enemySize, canvas.height - enemyList[i].gap - enemyGapSize);
		ctx.fillStyle = "green";
		ctx.fill();
		ctx.closePath();
	}
}

/*
 * Some Game essential functions
 */
function drawGameOver() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	drawEnemy();
	drawBird();	
	ctx.font = "300px Arial";
	ctx.fillStyle = "black";
	ctx.fillText("Game Over", canvas.width/2 - 800, canvas.height/2 - 150);
	ctx.font = "80px Arial";
	ctx.fillStyle = "black";
	ctx.fillText("Press enter to play again.", canvas.width/2 - 460, canvas.height/2);
	drawScore();
	if (up === true) {
		birdY = defaultBirdY;
		enemyList.splice(0, enemyList.length);
		enemySpawnCounter = 0;
		score = 0;
		requestAnimationFrame(draw);
	}
	else {
		requestAnimationFrame(drawGameOver);
	}


}

function gameOver() {
	if (birdY <= 0) {
		return true;
	}

	// check X for colission
	if (enemyList[0] == null) return false;
	if (birdX < enemyList[0].x + enemySize && birdX + birdSize > enemyList[0].x)
	{
		if (birdY > enemyList[0].gap && birdY +  birdSize < enemyList[0].gap + enemyGapSize) {
			return false;
		}
		else {
			return true;
		}
	}
	return false;
}

/*
 * The Score
 */
var score = 0;
var highScore = 0;
function drawScore() {
	// detect score
	if (enemyList != undefined) {
		if (birdX > enemyList[0].x + enemySize) {
			if (enemyList[0].passed == false) {
				score ++;
				enemyList[0].passed = true;
			}
		}
	}

	if (score > highScore) {highScore = score}
	ctx.font = "72px Arial";
	ctx.fillStyle = "black";
	ctx.fillText("Score: "+ score, canvas.width - 450, 100);
	ctx.font = "72px Arial";
	ctx.fillStyle = "black";
	ctx.fillText("Highscore: "+ highScore, canvas.width - 585, 200);
}

/*
 * The main drawing function
 */
function draw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	moveEnemy();
	drawEnemy();
	moveBird();
	drawBird();
	drawScore();
	if (gameOver()) {requestAnimationFrame(drawGameOver);}
	else {requestAnimationFrame(draw);}
}

draw();
