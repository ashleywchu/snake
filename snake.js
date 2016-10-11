var COLUMNS = 90;
var ROWS = 60;
var game  = new Game();
var snake = new Snake();
var food = new Food();
var canvas = document.createElement('canvas');
var context = canvas.getContext("2d");

function main() {
  canvas.width = 900,
  canvas.height = 600,
  canvas.style = "border: 2px solid black";
  document.body.appendChild(canvas);

  eventListener();
  loop();
}

function eventListener() {
  addEventListener( "keydown", function(event) {
    event.preventDefault();
    if ( event.keyCode == 32 ) {
      game.start();
    }
    snake.setDirection( event.keyCode );
  }, false);

  init();
  loop();
}

function loop() {
  setTimeout( function() {
    requestAnimationFrame(loop);
    game.clearBoard();
    game.showScore();
    if (game.over == false) {
      if (snake.collided == true) {
        game.stop();
      } else {
        snake.updateHead( snake.direction );
        snake.updatePosition();
        draw();
      }
    } else if (game.over == true) {
      game.clearBoard();
      game.showGameOverMessage();
      init();
      return;
    }
  }, 1000 / game.fps);
}

function init() {
  var coords = { x: Math.floor(canvas.width/2), y: Math.floor(canvas.height/2) };

  game.init();
  snake.init( { x: coords.x, y: coords.y } );
  food.init();
}

function draw() {
  var dx = canvas.width / COLUMNS,
      dy = canvas.height / ROWS;

  snake.draw(dx,dy);
  food.draw(dx,dy);
}

/////////////// GAME ///////////////
function Game() {}

Game.prototype.init = function() {
  this.score = 0;
  this.over = true;
  game.clearBoard();
  this.fps = 20;
  game.showStartMessage();
}

Game.prototype.start = function() {
  this.over = false;
}

Game.prototype.stop = function() {
  this.over = true;
}

Game.prototype.clearBoard = function() {
  context.fillStyle = "white";
  context.fillRect(0, 0, canvas.width, canvas.height);
}

Game.prototype.showStartMessage = function() {
  context.font = "40px sans-serif";
  context.fillStyle= "grey";
  context.fillText("Space bar to start", canvas.width / 4, canvas.height / 2);
}

Game.prototype.showGameOverMessage = function() {
  context.font = "40px sans-serif";
  context.fillStyle= "grey";
  context.fillText("Game Over. Your score is " + game.score, canvas.width / 4, canvas.height / 2);
}

Game.prototype.showScore = function() {
  context.font = "20px sans-serif"
  context.fillStyle= "grey";
  context.fillText("Score: " + game.score, 10, canvas.height - 10);
}

// Check whether the snake collided with the edge of the board, itself, or
// food (being drawn on top of the snake's body)
Game.prototype.checkCollision = function(type,x,y) {
  if ( type === "food" || type === "snake" ) {
    for( var i = 0; i < snake.queue.length; i++ ) {
      if (snake.queue[i].x === x && snake.queue[i].y === y) {
        return true;
      }
    }
  } else if ( type === "board" ) {
    if ( x >= canvas.width || x < 0 || y >= canvas.height || y < 0 ) {
      return true;
    }
  }
  return false;
}

/////////////// SNAKE ///////////////
// Each snake segment is stored in queue. Head is the first set of coordinates 
// that can be found at the front of queue, an array that represents the snake's body.
function Snake() {
  this.head = null,
  this.queue = [],
  this.direction = null;
}

Snake.prototype.init = function(params) {
  this.head = { x: params.x, y: params.y };
  this.direction = "right";
  this.queue = [];
  this.length = this.queue.length;
  this.nextHead = { x: 10, y: 0};
  this.collided = false;
  snake.add( params.x, params.y );
}

Snake.prototype.draw = function(dx,dy) {
  var snake = this.queue;
  for (var i = 0; i < snake.length; i++) {
    context.fillStyle = "green"
    context.fillRect(snake[i].x, snake[i].y, dx, dy);
  }
}

// Sets the snake's direction
Snake.prototype.setDirection = function(keyCode) {
  if( keyCode == 40 && this.direction !== "up" ) this.direction = "down";
  else if( keyCode == 38 && this.direction !== "down" ) this.direction = "up";
  else if( keyCode == 39 && this.direction !== "left" ) this.direction = "right";
  else if( keyCode == 37 && this.direction !== "right" ) this.direction = "left";
}

// Updates the snake's head based on snake's direction
Snake.prototype.updateHead = function(direction) {
  switch (direction) {
    // up
    case "up":
      snake.updateHeadDirection( 0, -10 );
      break;
    case "down":
      snake.updateHeadDirection( 0, 10 );
      break;
    case "left":
      snake.updateHeadDirection( -10, 0 );
      break;
    case "right":
      snake.updateHeadDirection( 10, 0 );
      break;
  }
}

// Update the coordinates of the next snake head
Snake.prototype.updateHeadDirection = function(x,y) {
  this.nextHead.x = x;
  this.nextHead.y = y;
}

// Update the snake's position accordingly
Snake.prototype.updatePosition = function() {
  var newHead = {};
  newHead.x = (this.head.x += this.nextHead.x);
  newHead.y = (this.head.y += this.nextHead.y);

  snake.checkAllCollisions(newHead);
  snake.grow();
  snake.add(newHead.x, newHead.y);
}

Snake.prototype.checkAllCollisions = function(newHead) {
  // check collision with edges of the board
  var boardCollide = game.checkCollision( "board", newHead.x, newHead.y );

  // check collision with self
  if ( this.length <= 1 ) {
    var selfCollide = false;
  } else {
    var selfCollide = game.checkCollision( "snake", newHead.x, newHead.y );
  }

  if ( boardCollide || selfCollide ) { return this.collided = true;}
  return this.collided = false;
}

// Check whether the snake got food
Snake.prototype.grow = function() {
  if ( this.head.x === food.coord.x && this.head.y === food.coord.y ) {
    game.score++;
    food.init();
  }
  else {
    snake.remove();
  }
}

// Add a segment to the FIFO stack
Snake.prototype.add = function(x,y) {
  length++;
  this.queue.unshift( {x:x, y:y} );
  this.head = this.queue[0];
}

// Returns the last segment
Snake.prototype.remove = function(queue) {
  length--;
  return this.queue.pop();
}

/////////////// FOOD ///////////////
function Food() {
  this.coord = { x: null, y: null };
}

Food.prototype.init = function() {
  this.setPosition();
}

Food.prototype.draw = function(dx,dy) {
  context.fillStyle = "pink";
  context.fillRect( this.coord.x, this.coord.y, dx, dy );
}

// Set food's position
Food.prototype.setPosition = function() {
  this.setCoordinates();

  // Check to see that food coordinates are not on snake. 
  // If it is, re-set food's coordinates.
  if ( game.checkCollision( "food", food.coord.x, food.coord.y ) ) {
    food.setCoordinates();
  }
}

Food.prototype.setCoordinates = function() {
  var minX = 0,
      maxX = canvas.width,
      minY = 0,
      maxY = canvas.height;

  this.coord.x = floor10Random( minX, maxX );
  this.coord.y = floor10Random( minY, maxY );
}

// Round randomly generated numbers to the nearest tenth
function floor10Random(min,max) {
  var rand = Math.floor( Math.random() * (max - min + 1) );
  return Math.floor( rand / 10 ) * 10;
}
