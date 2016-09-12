var COLUMNS = 90,
    ROWS = 60,
    game  = new Game(),
    snake = new Snake(),
    food = new Food();

function main() {
  canvas = document.createElement('canvas'),
  canvas.width = 900,
  canvas.height = 600,
  canvas.style = "border: 2px solid black";
  context = canvas.getContext("2d"),
  document.body.appendChild(canvas);

  addEventListener( "keydown", function(event) {
    event.preventDefault();
    if ( event.keyCode == 32 ) {
      game.start();
    }
    snake.setDirection( event.keyCode );
  }, false);

  loop();
}

function loop() {
  setTimeout( function() {
    requestAnimationFrame(loop);
    game.clearBoard();
    if (game.over == false) {
      if ( snake.collision == true ) {
        game.stop();
      } else {
        snake.move( snake.direction );
        draw();
      }
    } else {
      init();
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

/////////////// SNAKE ///////////////
// Each snake segment is stored in queue. Head is the first set of coordinates that can be found at the front of queue, an array that represents the snake's body.
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
  this.nextHead = this.head;
  this.collision = false;
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

// Moves the snake based on snake's direction
Snake.prototype.move = function(direction) {
  switch (direction) {
    // up
    case "up":
      snake.updatePosition( 0, -10 );
      break;
    case "down":
      snake.updatePosition( 0, 10 );
      break;
    case "left":
      snake.updatePosition( -10, 0 );
      break;
    case "right":
      snake.updatePosition( 10, 0 );
      break;
  }
  snake.checkCollision();
  snake.grow();
  snake.add(snake.nextHead.x, snake.nextHead.y);
}

// Update the coordinates of snake's head
Snake.prototype.updatePosition = function(x,y) {
  this.nextHead.x = (this.nextHead.x += x);
  this.nextHead.y = (this.nextHead.y += y);
}

// Check that the snake did not collided with itself or with the edge of the board
Snake.prototype.checkCollision = function() {
  if ( this.nextHead.x >= canvas.width || this.nextHead.x < 0 || this.nextHead.y > canvas.height || this.nextHead.y < 0 || this.queue.indexOf('x:' + this.nextHead.x + ', y:' + this.nextHead.y) >= 0) {
    this.collision = true;
  };
}

Snake.prototype.eat
// Check whether the snake got food
Snake.prototype.grow = function() {
  if ( this.head.x === food.coord.x && this.head.y === food.coord.y ) {
    this.score++;
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

// Check to see that food coordinates are not on snake
Food.prototype.setPosition = function() {
  this.setCoordinates();

  snake.queue.forEach( function(segment) {
    if ( food.coord === segment ) {
      food.setCoordinates();
    }
  });
}

