var assert = chai.assert;
var spy = sinon.spy();

var coords = { x: Math.floor(canvas.width/2), y: Math.floor(canvas.height/2) };

describe('Objects should be instantiated', function() {
  it('Game object', function() {
    assert.instanceOf(game, Game, 'game is an instance of Game')
  });
  it('Snake object', function() {
    assert.instanceOf(food, Food, 'snake is an instance of Snake')
  });
  it('Food object', function() {
    assert.instanceOf(food, Food, 'food is an instance of Food')
  });
});

describe('Game Object', function() {
  var game = new Game();

  game.init();

  describe('init()', function() {
    it('should initialize with default values', function() {
      assert(game.score === 0, 'score is 0');
      assert(game.over === true, 'over is true');
      assert(game.fps === 20, 'fps is 20');
    });
  });

  describe('start()', function() {
    it('should set over to false', function() {
      game.start();
      assert(game.over === false, 'over is false');
    });
  });

  describe('stop()', function() {
    it('should set over to true', function() {
      game.stop();
      assert(game.over === true, 'over is true');
    });
  });

  describe('clearBoard()', function() {
  });

  describe('showStartMessage()', function() {
  });

  describe('showGameOverMessage()', function() {
  });

  describe('showScore()', function() {
  });

  describe('checkCollision()', function() {
    var snake = new Snake();
    snake.init(coords);
    snake.add( coords.x + 10, coords.y );
    snake.add( coords.x + 10, coords.y + 10 );
    snake.add( coords.x + 10, coords.y + 20);
    snake.add( coords.x, coords.y + 20 );
    snake.add( coords.x - 10, coords.y + 20 );
    snake.add( coords.x - 10, coords.y + 10 );
    snake.add( coords.x - 10, coords.y );
    snake.add( coords.x, coords.y );
    console.log(snake.queue);
    describe('if food was rendered on any part of snake', function() {
      it('should return true', function() {
        var collision = game.checkCollision('food', coords.x + 10, coords.y + 10);
        assert.isTrue(collision, 'food did render on snake');
      });
      it('should return false', function() {
        var collision = game.checkCollision('food', coords.x + 100, coords.y + 100);
        assert.isFalse(collision, 'food did not render on snake');
      });
    });

    describe('if the snake collided with itself', function() {
      it('should return true', function() {
        var collision = game.checkCollision('snake',coords.x + 10,coords.y + 10);
        console.log(snake);
        assert.isTrue(collision, 'snake did collide with itself');
      });
    });
  });
});

describe('Snake Object', function() {
  var coords = { x: Math.floor(canvas.width/2), y: Math.floor(canvas.height/2) };


  describe('init()', function() {
    var snake = new Snake();
    snake.init(coords);
    snake.add(coords.x, coords.y);

    it('should initialize with default values', function() {
      assert.deepEqual(snake.head, coords, 'head coordinates is equal to parameter');
      assert(snake.direction === "right", 'direction is right');
      assert.deepEqual(snake.queue, [coords], 'queue is an empty Array');
      assert.deepEqual(snake.nextHead, { x: 10, y: 0 });
      assert(snake.collided === false);
    });
  });

  describe('setDirection()', function() {
    it('should set direction to down', function() {
      var snake = new Snake();
      snake.setDirection(40);
      assert(snake.direction === "down");
    });

    it('should set direction to up', function() {
      var snake = new Snake();
      snake.setDirection(38);
      assert(snake.direction === "up");
    });

    it('should set direction to right', function() {
      var snake = new Snake();
      snake.setDirection(39);
      assert(snake.direction === "right");
    });

    it('should set direction to left', function() {
      var snake = new Snake();
      snake.setDirection(37);
      assert(snake.direction === "left");
    });
  });

  describe('updateHead()', function() {

  });

  describe('updateHeadDirection()', function() {
    it('should set nextHead coordinates using arguments', function() {
      var snake = new Snake();
      snake.init(coords);
      snake.updateHeadDirection(100,100);
      assert(snake.nextHead.x === 100);
      assert(snake.nextHead.y === 100);
    });
  });

//  describe('updatePosition()', function() {
//    describe('should update position', function() {
//      it('should set coordinates for the new head', function() {
//        var snake = new Snake();
//        var spy = sinon.spy();
//        snake.init(coords);
//        snake.updateHeadDirection(100,100);
//        var newHead = {};
//        newHead.x = (snake.head.x += snake.nextHead.x);
//        newHead.y = (snake.head.y += snake.nextHead.y);
//
//        assert(spy.called(snake, 'checkAllCollisions(newHead)'));
//      });
//    });
//  });
});
