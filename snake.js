function main() {
  var columns = 90,
      rows = 60,
      snake = new Snake(),
      food = new Food(),
      KEYS = { UP: "ArrowUp", DOWN: "ArrowDown", LEFT: "ArrowLeft", RIGHT: "ArrowRight" }

  canvas = document.createElement('canvas'),
  canvas.width = 900,
  canvas.height = 600,
  canvas.style = "border: 2px solid black";
  document.body.appendChild(canvas);

  init();
  loop();
}

function init() {
  score = 0;

  clearBoard();

  var coords = { x: Math.floor(canvas.width/2), y: Math.floor(canvas.height/2) };
  snake.init( { x: coords.x, y: coords.y } );
  food.init();
}

function loop() {
  clearBoard();
  update();
  draw();
  requestAnimationFrame(loop);
}

function clearBoard() {
  context = canvas.getContext("2d"),
  context.fillStyle = "white";
  context.fillRect(0, 0, canvas.width, canvas.height);
}

function draw() {
  var dx = canvas.width / columns,
      dy = canvas.height / rows;

  snake.draw(dx,dy);
  food.draw(dx,dy);
}

function update() {
  snake.update();

  // if snake got food, add segment to queue
  if ( snake.head.x === food.coord.x && snake.head.y === food.coord.y ) {
    score++;
    food.init();
  }
  // else, remove tail segments
  else {
    snake.remove();
  }
  snake.add(snake.newHead.x, snake.newHead.y);
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

Snake.prototype.update = function() {
  // Update snake's direction based on key press
  document.onkeydown = function(event) {
    event = event || window.event;
    switch (event.keyCode) {
      // up
      case 38:
        if (this.direction !== KEYS.DOWN ) {
          this.direction = KEYS.UP;
          snake.updatePosition( 0, -10 );
        };
        break;
      // down
      case 40:
        if (this.direction !== KEYS.UP ) {
          this.direction = KEYS.DOWN;
          snake.updatePosition( 0, 10 );
        };
        break;
      // left
      case 37:
        if (this.direction !== KEYS.RIGHT ) {
          this.direction = KEYS.LEFT;
          snake.updatePosition( -10, 0 );
        };
        break;
      // right
      case 39:
        if (this.direction !== KEYS.LEFT ) {
          this.direction = KEYS.RIGHT;
          snake.updatePosition( 10, 0 );
        };
        break;
    }
    event.preventDefault();
  }
}

// Update the coordinates of snake's head
Snake.prototype.updatePosition = function(x,y) {
  this.newHead.x = (this.newHead.x += x);
  this.newHead.y = (this.newHead.y += y);
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

