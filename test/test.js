var assert = chai.assert;
var expect = chai.expect;
var canvas = document.createElement('canvas');
var context = canvas.getContext("2d");


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

describe('main()', function() {
 // main();
});

describe('eventListener()', function() {


});

describe('loop()', function() {

});

describe('init()', function() {

});

describe('draw()', function() {

});

describe('Game Object', function() {
  let game = new Game();

  game.init();

  describe('init()', function() {
    it('should initialize with default values', function() {
      assert(game.score === 0, 'score is 0');
      expect(game.clearBoard).to.have.been.calledOnce;
      assert(game.fps === 20, 'fps is 20');
      expect(game.showStartMessage).to.have.been.calledOnce;
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

  describe('isOver()', function() {
    it('should return true', function() {
      game.over = true;
      assert(game.isOver() == true);
    });

    it('should return false', function() {
      game.over = false;
      assert(game.isOver() == false);
    });
  });

  describe('clearBoard()', function() {
  });

  describe('showStartMessage()', function() {
  });

  describe('showScore()', function() {
  });

  describe('checkCollision()', function() {
    let snake = new Snake();
    snake.init(coords);
    snake.add( coords.x + 10, coords.y );
    snake.add( coords.x + 10, coords.y + 10 );
    snake.add( coords.x + 10, coords.y + 20);
    snake.add( coords.x, coords.y + 20 );
    snake.add( coords.x - 10, coords.y + 20 );
    snake.add( coords.x - 10, coords.y + 10 );
    snake.add( coords.x - 10, coords.y );
    snake.add( coords.x, coords.y );
    describe('if food was rendered on any part of snake', function() {
      it('should return true', function() {
        let collision = game.checkCollision('food', coords.x + 10, coords.y + 10);
        assert.isTrue(collision, 'food did render on snake');
      });
      it('should return false', function() {
        let collision = game.checkCollision('food', coords.x + 100, coords.y + 100);
        assert.isFalse(collision, 'food did not render on snake');
      });
    });

    describe('if the snake collided with itself', function() {
      it('should return true', function() {
        let collision = game.checkCollision('snake',coords.x + 10,coords.y + 10);
        assert.isTrue(collision, 'snake did collide with itself');
      });

      it('should return false', function() {
        let collision = game.checkCollision('snake',coords.x + 10,coords.y + 10);
        //assert.isFalse(collision, 'snake did not collide with itself');
      });
    });
  });
});

describe('Snake Object', function() {
  describe('init()', function() {
    let snake = new Snake();
    snake.init(coords);
    snake.add(coords.x, coords.y);

    it('should initialize with default values', function() {
      assert.deepEqual(snake.head, coords, 'head coordinates is equal to parameter');
      assert(snake.direction === "right", 'direction is right');
      assert.deepEqual(snake.queue, [coords], 'queue is not an empty Array');
      expect(snake.add).to.have.been.calledOnce;
    });
  });

  describe('setDirection()', function() {
    it('should set direction to down', function() {
      let snake = new Snake();
      snake.setDirection(40);
      assert(snake.direction === "down");
    });

    it('should set direction to up', function() {
      let snake = new Snake();
      snake.setDirection(38);
      assert(snake.direction === "up");
    });

    it('should set direction to right', function() {
      let snake = new Snake();
      snake.setDirection(39);
      assert(snake.direction === "right");
    });

    it('should set direction to left', function() {
      let snake = new Snake();
      snake.setDirection(37);
      assert(snake.direction === "left");
    });
  });

  describe('fromDirection()', function() {
    describe('should return up coords', function() {

    });
    describe('should return up coords', function() {

    });
    describe('should return up coords', function() {

    });
    describe('should return up coords', function() {

    });
  });

  describe('getNextHead()', function() {
    let snake = new Snake();
    snake.init(coords);
    snake.add(coords.x, coords.y);

    let newCoords = getNextHead();
    console.log(newCoords)
    console.log(snake.direction)

    it('should return a new set of coordinates that is 10px to the right', function() {
      assert.deepEqual( newCoords === { x: 160, y: 75 });
    });
  });

  describe('update()', function() {
    describe('should update position', function() {
      it('should set coordinates for the new head', function() {
        let snake = new Snake();
        snake.init(coords);
        snake.update();

        let grow = sinon.stub(snake, 'grow');
        let add = sinon.stub(snake, 'add');

        expect(grow).to.have.been.calledOnce;
        expect(add).to.have.been.calledOnce;
      });
    });
  });

  describe('collided()', function() {
    it('should return false if the snake collided with the edge of the board', function() {
    });

    it('should return false if the snake collided with itself', function() {
    });

    it('should return true', function() {
    });
  });

  describe('grow()', function() {
    let game = new Game();
    game.init();
    let score = game.score;
    let snake = new Snake();
    snake.head = (coords.x, coords.y);

    describe('when snake eats food', function() {
      it('should increase the score and initialize another set of food coordinates if the snake ate the current food', function() {
        let food = new Food();
        food.coord  = {x: 150, y: 75};
        snake.grow();
        debugger
        console.log("hellooo")
        assert(game.score === score + 1);
      });
    });

    it('should call remove method', function() {
    });
  });

  describe('add()', function() {
    let snake = new Snake();
    snake.add(100,100);
    it('should add a segment to the queue', function() {
      assert.include(snake.queue, {x:100, y:100});
    });
    it('should set the head property to the the added coordinate', function() {
      assert.deepEqual(snake.head, {x:100, y:100});
    });
  });

  describe('remove()', function() {
    let snake = new Snake();
    snake.add(100,100);
    let lastCoord = snake.remove(snake.queue);
    it('should return the last coordinate from the queue', function() {
      assert.deepEqual(lastCoord, {x:100, y:100});
    });
  });
});

describe('Food Object', function() {
  let food = new Food();
  food.init();

  describe('init()', function() {
    it('should call setPosition()', function() {
      expect(food.setPosition()).to.have.been.calledOnce;
    });
  });

 // describe('draw()', function() {
 //   it('', function() {
 //   });
 // });

  describe('setPosition()', function() {
    it('should call setCoordinates()', function() {
    });

    it('should reset the food coordinate if it collided with the snake', function() {
    });
  });

  describe('setCoordinates()', function() {
    it('generates coordinates', function() {
      assert.isNotNull(food.coord.x && food.coord.y);
    });
  });
});

describe('floor10Random()', function() {
  let random = floor10Random(0,100);
  it('should return a number between the min and max', function() {
    assert((random > 0) && (random < 100));
  });

  it('should be a number divisible by 10', function() {
    assert(random % 10 === 0);
  });
});
