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
    if ( event.keyCode in KEYS ) {
      snake.direction = KEYS[event.keyCode];
    }
  }, false);

  init();
  loop();
}

function init() {
  var coords = { x: Math.floor(canvas.width/2), y: Math.floor(canvas.height/2) };

  game.init();
  snake.init( { x: coords.x, y: coords.y } );
  food.init();
}

function loop() {
    game.clearBoard();
    snake.move( snake.direction );
    draw();
  requestAnimationFrame(loop);
}

function draw() {
  var dx = canvas.width / columns,
      dy = canvas.height / rows;

  snake.draw(dx,dy);
  food.draw(dx,dy);
}

/////////////// GAME ///////////////
function Game() {}

Game.prototype.init = function() {
  this.score = 0;
  this.over = false;
  game.clearBoard();
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

/////////////// SNAKE ///////////////
// Each snake segment is stored in queue. Head is at the front of queue
function Snake() {
  this.head = null,
  this.queue = [],
  this.direction = null;
}

Snake.prototype.init = function(params) {
  this.head = { x: params.x, y: params.y };
  this.direction = KEYS.RIGHT;
  this.queue = [];
  this.length = this.queue.length;
  snake.add( params.x, params.y )
  this.newHead = this.head;
}

Snake.prototype.draw = function(dx,dy) {
  var snake = this.queue;
  for (var i = 0; i < snake.length; i++) {
    context.fillStyle = "green"
    context.fillRect(snake[i].x, snake[i].y, dx, dy);
  }
}

// Moves the snake based on snake's direction
Snake.prototype.move = function(direction) {
  switch (direction) {
    case "up":
      if (this.direction !== KEYS.DOWN ) {
        snake.updatePosition( 0, -10 );
      };
      break;
    case "down":
      if (this.direction !== KEYS.UP ) {
        snake.updatePosition( 0, 10 );
      };
      break;
    case "left":
      if (this.direction !== KEYS.RIGHT ) {
        snake.updatePosition( -10, 0 );
      };
      break;
    case "right":
      if (this.direction !== KEYS.LEFT ) {
        snake.updatePosition( 10, 0 );
      };
      break;
  }
  snake.checkCollision();
  snake.grow();
  snake.add(snake.newHead.x, snake.newHead.y);
}

// Update the coordinates of snake's head
Snake.prototype.updatePosition = function(x,y) {
  this.newHead.x = (this.newHead.x += x);
  this.newHead.y = (this.newHead.y += y);
}

// Check that the snake did not collided with itself or with the edge of the board
Snake.prototype.checkCollision = function() {
  if ( this.newHead.x > canvas.width || this.newHead.y > canvas.height || snake.queue.indexOf('x:' + this.newHead.x + ', y:' + this.newHead.y) >= 0) {
    game.stop();
  };
  //for( var i = 0; i < snake.queue.length; i++ ) {
  //  if (snake.queue[i].x === snake.x && snake.queue[i].y === snake.y) {
  //    game.stop();
  //  }
  //}
}

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

