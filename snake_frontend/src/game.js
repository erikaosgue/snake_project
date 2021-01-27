import Phaser from "phaser";
import axios from 'axios';
import router from "@/router/index.js"

var config = {
  type: Phaser.AUTO,
  width: 810,
  height: 600,
  backgroundColor: "#e5e5e5",
  physics: {
    default: "arcade",
    arcade: {
      debug: false
    }
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

let gameOverText
let snake;
let food;
let badfood;
let cursors;
let obstacleOne;
let obstacleTwo;


//  Direction consts
let UP = 0;
let DOWN = 1;
let LEFT = 2;
let RIGHT = 3;

let x_grid = 45 
let y_grid = 32

let timeIncrement = 10000;
let badfoodIsSeen = false;
let lastObstacleOne = true;
let score = 0;

let phaser = {
  game: config
};


function preload() {
   
  this.load.image("badfood", 'assets/apple5.png');
  this.load.image("body", 'assets/body5.png');
  this.load.image("food", 'assets/applegreen5.png');
  this.load.image("obstacle", "assets/bomb5.png");
  this.load.image("obstacle2", "assets/box_obstacle4.png");
  this.load.image("head_left", "assets/Graphics/head_left.png");
}

function create() {

    this.add.rectangle(19, 300, 60, 600, 0x6666ff);
    this.add.rectangle(786, 300, 60, 600, 0x6666ff);
    this.add.rectangle(400, 18, 750, 60, 0x6666ff);
    this.add.rectangle(400, 578, 750, 60, 0x6666ff);
  
    var scoreText = this.add.text(48, 10, "score: 0", {
    fontSize: "28px",
    fill: "#000"
    });

    gameOverText = this.add.text(400, 300, "Game Over", {
      fontSize: "32px",
      fill: "#000"
    });

    gameOverText.setOrigin(0.5);
    gameOverText.visible = false;

  //create the objects of the game Food, badFood, obstacles

  class Food extends Phaser.GameObjects.Image{
    // Extends: Phaser.GameObjects.Image,

    constructor (scene, x, y) {
      
      super(scene);
      
      this.name = "greenApple"
      this.setTexture("food");
      this.setPosition(x * 16, y * 16);
      this.setOrigin(0);

      this.total = 0;
      this.addObstacle = 0;

      scene.children.add(this);
    }

    eat() {
      this.total++;
      this.addObstacle++;
    }
  }

    class BadFood extends Phaser.GameObjects.Image{

    constructor (scene, x, y) {
     super(scene);
      
      this.name = "redApple"

      this.setTexture("badfood");
      this.setPosition(x * 16, y * 16);
      this.setOrigin(0);

      scene.children.add(this);
    }
  }
  class ObstacleOne extends Phaser.GameObjects.Image{

    constructor(scene, x, y) {
      super(scene);

      this.name = "obstacle_1"
      this.setTexture("obstacle");
      this.setPosition(x * 16, y * 16);
      this.setOrigin(0);

      scene.children.add(this);
    }
  }
  class ObstacleTwo extends Phaser.GameObjects.Image{

    constructor(scene, x, y) {
      super(scene);
      
      this.name = "obstacle_2"

      this.setTexture("obstacle2");
      this.setPosition(x * 16, y * 16);
      this.setOrigin(0);

      scene.children.add(this);
    }
  }

  class Snake {
    
    constructor(scene, x, y) {
      
      this.headPosition = new Phaser.Geom.Point(x, y);
      this.body = scene.add.group();
      this.head = this.body.create(x * 16, y * 16, 'body');
      this.head.setOrigin(0);

      this.alive = true;

      this.speed = 100;
      this.moveTime = 0;
      this.tail = new Phaser.Geom.Point(x, y);

      this.heading = RIGHT;
      this.direction = RIGHT;
    }

    update(time) {
      if (time >= this.moveTime) {
        return this.move(time);
      }
    }

    faceLeft() {
      if (this.direction === UP || this.direction === DOWN) {
        this.heading = LEFT;
      }
    }

    faceRight() {
      if (this.direction === UP || this.direction === DOWN) {
        this.heading = RIGHT;
      }
    }

    faceUp() {
      if (this.direction === LEFT || this.direction === RIGHT) {
        this.heading = UP;
      }
    }

    faceDown() {
      if (this.direction === LEFT || this.direction === RIGHT) {
        this.heading = DOWN;
      }
    }

    move(time) {
      /**
       * Based on the heading property (which is the direction the pgroup pressed)
       * we update the headPosition value accordingly.
       *
       */
      switch (this.heading) {
        case LEFT:
        // case for snake diying when crash with the wall
         
          if (this.headPosition.x  == 3) {
            console.log(this.headPosition.x)
            snake.alive = false;
          }
          else {
            this.headPosition.x = this.headPosition.x - 1;
          }
          break;

        case RIGHT:
          if (this.headPosition.x  == x_grid + 1){
            console.log(this.headPosition.x)
            snake.alive = false;
          }
          else {
            this.headPosition.x = this.headPosition.x + 1
          }
          break;

        case UP:
          if (this.headPosition.y == 3) {
            console.log(this.headPosition.y)
            snake.alive = false;
          }
          else {
            this.headPosition.y = this.headPosition.y -1;
          }
          break;

        case DOWN:
          if (this.headPosition.y == y_grid + 1) {
            console.log(this.headPosition.y)
            snake.alive = false;
          }
          else {
            this.headPosition.y = this.headPosition.y + 1
          }
          break;
      }

      this.direction = this.heading;

      //  Update the body segments and place the last coordinate into this.tail
      Phaser.Actions.ShiftPosition(
        this.body.getChildren(),
        this.headPosition.x * 16,
        this.headPosition.y * 16,
        1,
        this.tail
      );

      let hitBody = Phaser.Actions.GetFirst(
        this.body.getChildren(),
        { x: this.head.x, y: this.head.y },
        1
      );

      if (hitBody) {

        this.alive = false;

      } else {
        //  Update the timer ready for the next movement
        this.moveTime = time + this.speed;

        return true;
      }
    }

    grow() {
      let newPart = this.body.create(this.tail.x, this.tail.y, "body");
      newPart.setOrigin(0);
    }
    shrink() {
      let snakeLength = this.body.children.entries.length;
      if (snakeLength <= 2) {
        this.alive = false;
        return;
      }

      let image1 = this.body.children.entries[snakeLength - 1];
      let image2 = this.body.children.entries[snakeLength - 2];
      this.body.remove(image1, true);
      this.body.remove(image2, true);
      
    }

    collideWith(food) {
      if (this.head.x === food.x && this.head.y === food.y) {
          this.grow();
          food.eat();
          score += 2;
          scoreText.setText("Score: " + score);

        return true;
      } else {
        return false;
      }
    }
    collideWithBadFood(badfood) {
      if (this.head.x === badfood.x && this.head.y === badfood.y) {
        return true;
      } else {
        return false;
      }
    }
    collideWithObstacle(obstacleOne, obstacleTwo) {
      if (this.head.x === obstacleOne.x && this.head.y === obstacleOne.y) {
        return true;
      } else if (
        this.head.x === obstacleTwo.x &&
        this.head.y === obstacleTwo.y
      ) {
        return true;
      } else {
        return false;
      }
    }

    updateGrid(grid) {

      //  Remove all body pieces from valid positions list
      this.body.children.each(function(segment) {
        let bx = segment.x / 16;
        let by = segment.y / 16;
        // grid will be false where the body is
        grid[by][bx] = false;
      });

      return grid;
    }
    gameOver() {
      gameOverText.visible = true;
      gameOverText.setText("GAME OVER! \nTotal Score: " + score);
      setTimeout(() => {  
        
      
      let user = JSON.parse(sessionStorage.user)

      const params = {
          score: score
      };
      axios.put("http://localhost:8081/users/" + user.id, params)
      .then(response => {
          if (response.data.status == "error")
              alert("error updating score");
         })
      .catch(e => {
        console.log("error: =>", e.message);
      });
      router.push("/UserHome").catch(()=>{});

      }, 3000);
    }
  }
  
  // Initializion the objects
  food = new Food(this, 25, 25);
  badfood = new BadFood(this, -2, -2);
  snake = new Snake(this, 8, 8);
  obstacleOne = new ObstacleOne(this, -3, -3);
  obstacleTwo = new ObstacleTwo(this, -10, -10);

  //  Create our keyboard controls
  cursors = this.input.keyboard.createCursorKeys();
}

function update(time, delta) {

  this.game.scale.pageAlignHorizontally = true;
  this.game.scale.pageAlignVertically = true;
  this.game.scale.refresh();
  if (!snake.alive) {
    if (gameOverText.visible == true) {
      return;
    }
    snake.gameOver(delta);
  }
  // Move all obstacle outside to the screen 
  // after eating 5 apples
  if (food.addObstacle === 5) {
    obstacleOne.x = 10000;
    obstacleOne.y = 10000;
    obstacleTwo.x = 10000;
    obstacleTwo.y = 10000;

  }
  // Adds a new obstacle to the screen after 10 apples
  if (food.addObstacle === 10) {
    food.addObstacle = 0;
    if (lastObstacleOne === true) {
      repositionFood("obstacleTwo");
      lastObstacleOne = false;
    } else {
      repositionFood("obstacleOne");
      lastObstacleOne = true;
    }
  }
  // Adds red apple that shrinks the snake, every 10 seconds
  if (time > timeIncrement) {
    if (badfoodIsSeen === true) {
      badfood.x = 1000;
      badfood.y = 1000;
      badfoodIsSeen = false;
    } else {
      repositionFood("badfood");
      badfoodIsSeen = true;
    }
    timeIncrement = timeIncrement + 10000;
  }

  /**
   * Check which key is pressed, and then change the direction the snake
   * is heading based on that. The checks ensure you don't double-back
   * on yourself, for example if you're moving to the right and you press
   * the LEFT cursor, it ignores it, because the only valid directions you
   * can move in at that time is up and down.
   */
  if (cursors.left.isDown) {
    snake.faceLeft();
  } else if (cursors.right.isDown) {
    snake.faceRight();
  } else if (cursors.up.isDown) {
    snake.faceUp();
  } else if (cursors.down.isDown) {
    snake.faceDown();
  }

  if (snake.update(time)) {
    //  If the snake updated, we need to check for collision against food

    if (snake.collideWith(food)) {
      repositionFood("food");
    } 
    else if (snake.collideWithBadFood(badfood)) {
      snake.shrink();
      // Puts the red apple outside to the screen
      badfood.x = 1000;
      badfood.y = 1000;
      badfoodIsSeen = false;
      timeIncrement += 10000;
    } 
    else if (snake.collideWithObstacle(obstacleOne, obstacleTwo)) {
      //snake dies if collide with obstacle
      snake.alive = false;
    }
  }
}

/**
 * We can place the food anywhere in our 40x30 grid
 * *except* on-top of the snake, so we need
 * to filter those out of the possible food locations.
 * If there aren't any locations left, they've won!
 *
 * @method repositionFood
 * @return {boolean} true if the food was placed, otherwise false
 */
function repositionFood(typeFood) {
  //  First create an array that assumes all positions
  //  are valid for the new piece of food

  //  A Grid we'll use to reposition the food each time it's eaten
  let testGrid = [];

  for (let y = 3; y <= y_grid; y++) {
    testGrid[y] = [];

    for (let x = 3; x <= x_grid; x++) {
      testGrid[y][x] = true;
    }
  }

  snake.updateGrid(testGrid);

  //  Purge out false positions
  let validLocations = [];
  let typeF;

  for (let y = 4; y < y_grid; y++) {
    for (let x = 4; x < x_grid; x++) {
      //  Is this position valid for food? If so, add it here ...
      if (testGrid[y][x] === true) {
        validLocations.push({ x: x, y: y });
      }
    }
  }

  if (validLocations.length > 0) {
    let len = validLocations.length
    let ranNum = Math.floor(Math.random() * (len + 1)); 
    // get a valid location from the array validLocations, 
    // will give x, y position
    var pos = validLocations[ranNum]

    //  And place it
    if (typeFood === "food") {
      typeF = food;
    } else if (typeFood === "badfood") {
      typeF = badfood;
    } else if (typeFood === "obstacleOne") {
      typeF = obstacleOne;
    } else {
      typeF = obstacleTwo;
    }
    //typeF is the object to setPosition at x, y position
    typeF.setPosition(pos.x *16 , pos.y * 16);
    return true;
  } 
  else {
    return false;
  }
}

export default phaser;

