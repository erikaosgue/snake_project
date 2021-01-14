
var config = {
        type: Phaser.AUTO,
        width: 800,
        height: 600,
        backgroundColor: '#bfcc00',
        physics: {
            default: 'arcade',
            arcade: {
                debug: false
            }
        },
        scene: {
            preload: preload,
            create: create,
            update: update,
        }
};
var snake;
var food;
var badfood;
var cursors;

//  Direction consts
var UP = 0;
var DOWN = 1;
var LEFT = 2;
var RIGHT = 3;

x_grid = 50; //40 default
y_grid = 38; //30 default

timeIncrement = 10000;
badfoodIsSeen = false;
lastObstacleOne = true;
score = 0;


var game = new Phaser.Game(config);

function preload ()
{
    //load images and sounds
    this.load.image('badfood', 'assets/apple5.png');
    this.load.image('body', 'assets/body5.png');
    this.load.image('food', 'assets/applegreen5.png');
    this.load.image('obstacle', 'assets/bomb5.png');
    this.load.image('obstacle2', 'assets/box_obstacle4.png');
    
}
function create ()
{
    scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });
    gameOverText = this.add.text(400, 300, 'Game Over', { fontSize: '32px', fill: '#000' });
    gameOverText.setOrigin(0.5)
    gameOverText.visible = false
    // var g2 = this.add.grid(5, 5, 1600, 1600, 20, 20, 0x00b9f2).setAltFillStyle(0x016fce).setOutlineStyle();
    
    //create the objects of the game
    var Food = new Phaser.Class({

        Extends: Phaser.GameObjects.Image,

        initialize:

        function Food (scene, x, y)
        {
            Phaser.GameObjects.Image.call(this, scene)

            this.setTexture('food');
            this.setPosition(x * 16, y * 16);
            this.setOrigin(0);

            this.total = 0;
            this.addObstacle = 0;

            scene.children.add(this);
        },

        eat: function ()
        {
            this.total++;
            this.addObstacle++;
        }

    });
    var BadFood = new Phaser.Class({

        Extends: Phaser.GameObjects.Image,

        initialize:

        function BadFood (scene, x, y)
        {
            Phaser.GameObjects.Image.call(this, scene)

            this.setTexture('badfood');
            this.setPosition(x * 16, y * 16);
            this.setOrigin(0);

            scene.children.add(this);
        },

    });
    var ObstacleOne = new Phaser.Class({

        Extends: Phaser.GameObjects.Image,

        initialize:

        function Obstacle (scene, x, y)
        {
            Phaser.GameObjects.Image.call(this, scene)

            this.setTexture('obstacle');
            this.setPosition(x * 16, y * 16);
            this.setOrigin(0);

            scene.children.add(this);
        },

    });
    var ObstacleTwo = new Phaser.Class({

        Extends: Phaser.GameObjects.Image,

        initialize:

        function Obstacle (scene, x, y)
        {
            Phaser.GameObjects.Image.call(this, scene)

            this.setTexture('obstacle2');
            this.setPosition(x * 16, y * 16);
            this.setOrigin(0);

            scene.children.add(this);
        },

    });

    var Snake = new Phaser.Class({

        initialize:

        function Snake (scene, x, y)
        {
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
        },

        update: function (time)
        {
            if (time >= this.moveTime)
            {
                return this.move(time);
            }
        },

        faceLeft: function ()
        {
            if (this.direction === UP || this.direction === DOWN)
            {
                this.heading = LEFT;
            }
        },

        faceRight: function ()
        {
            if (this.direction === UP || this.direction === DOWN)
            {
                this.heading = RIGHT;
            }
        },

        faceUp: function ()
        {
            if (this.direction === LEFT || this.direction === RIGHT)
            {
                this.heading = UP;
            }
        },

        faceDown: function ()
        {
            if (this.direction === LEFT || this.direction === RIGHT)
            {
                this.heading = DOWN;
            }
        },

        move: function (time)
        {
            /**
            * Based on the heading property (which is the direction the pgroup pressed)
            * we update the headPosition value accordingly.
            * 
            * The Math.wrap call allow the snake to wrap around the screen, so when
            * it goes off any of the sides it re-appears on the other.
            */
            switch (this.heading)
            {
                case LEFT:
                    this.headPosition.x = Phaser.Math.Wrap(this.headPosition.x - 1, 0, x_grid);
                    break;

                case RIGHT:
                    this.headPosition.x = Phaser.Math.Wrap(this.headPosition.x + 1, 0, x_grid);
                    break;

                case UP:
                    this.headPosition.y = Phaser.Math.Wrap(this.headPosition.y - 1, 0, y_grid);
                    break;

                case DOWN:
                    this.headPosition.y = Phaser.Math.Wrap(this.headPosition.y + 1, 0, y_grid);
                    break;
            }

            this.direction = this.heading;

            //  Update the body segments and place the last coordinate into this.tail
            Phaser.Actions.ShiftPosition(this.body.getChildren(), this.headPosition.x * 16, this.headPosition.y * 16, 1, this.tail);

            var hitBody = Phaser.Actions.GetFirst(this.body.getChildren(), { x: this.head.x, y: this.head.y }, 1);

            if (hitBody)
            {
                console.log('dead2');

                this.alive = false;

                // return false;
            }
            else
            {
                //  Update the timer ready for the next movement
                this.moveTime = time + this.speed;

                return true;
            }
        },

        grow: function ()
        {
            var newPart = this.body.create(this.tail.x, this.tail.y, 'body');

            newPart.setOrigin(0);
        },
        shrink: function ()
        {
            snakeLength = this.body.children.entries.length
            if (snakeLength <= 2)
            {
                console.log('dead3');
                this.alive = false
                return
            }
            console.log("shrinking?")
            image1 = this.body.children.entries[snakeLength - 1]
            image2 = this.body.children.entries[snakeLength - 2]
            this.body.remove(image1, true)
            this.body.remove(image2, true)
            // image.destroy();
        },

        collideWithFood: function (food)
        {
            if (this.head.x === food.x && this.head.y === food.y)
            {
                this.grow();

                food.eat();
                score += 2;
                scoreText.setText('Score: ' + score)

                //  For every 5 items of food eaten we'll increase the snake speed a little
                if (this.speed > 20 && food.total % 5 === 0)
                {
                    this.speed -= 5;
                }

                return true;
            }
            else
            {
                return false;
            }
        },
        collideWithBadFood: function (badfood)
        {
            if (this.head.x === badfood.x && this.head.y === badfood.y)
            {
                score += 4;
                scoreText.setText('Score: ' + score)
                return true;
            }
            else
            {
                return false;
            }
        },
        collideWithObstacle: function (obstacleOne, obstacleTwo)
        {
            if (this.head.x === obstacleOne.x && this.head.y === obstacleOne.y)
            {
                // window.location.replace("http://localhost:8082/UserHome")
                return true;
            }
            else if (this.head.x === obstacleTwo.x && this.head.y === obstacleTwo.y)
            {
                // window.location.replace("http://localhost:8082/UserHome")
                return true;
            }
            else
            {
                return false;
            }
        },

        updateGrid: function (grid)
        {
            //  Remove all body pieces from valid positions list
            this.body.children.each(function (segment) {

                var bx = segment.x / 16;
                var by = segment.y / 16;

                grid[by][bx] = false;

            });

            return grid;
        },
        gameOver: function ()
        {
            gameOverText.visible = true
            data = "?score=" + score
            window.location.replace("http://localhost:8082/UserHome" + encodeURIComponent(data))
            // sessionStorage.score = score
            // console.log(sessionStorage.score)
        }

    });

    food = new Food(this, 3, 4);
    badfood = new BadFood(this, -2, -2);
    snake = new Snake(this, 8, 8);
    obstacleOne = new ObstacleOne(this, -3, -3);
    obstacleTwo = new ObstacleTwo(this, -10, -10);
    
    //  Create our keyboard controls
    cursors = this.input.keyboard.createCursorKeys();
}


function update (time, delta)
{
    if (!snake.alive)
    {
        console.log("Here died last")
        snake.gameOver();
        return
    }
    if (food.addObstacle === 3)
    {
        food.addObstacle = 0;
        if (lastObstacleOne === true)
        {
            repositionFood('obstacleTwo');
            obstacleOne.x = 100000;
            obstacleOne.y = 100000;
            lastObstacleOne = false;
        }
        else{
            repositionFood('obstacleOne')
            obstacleTwo.x = 10000;
            obstacleTwo.y = 10000;
            lastObstacleOne = true
        }
       
    }
    if (time > timeIncrement)
    {
        if (badfoodIsSeen === true)
        {
            console.log("hidden")
            badfood.x = 1000;
            badfood.y = 1000;
            badfoodIsSeen = false
        }
        else
        {
            console.log("shown")
            repositionFood('badfood');
            badfoodIsSeen = true;
        }
        timeIncrement = timeIncrement + 10000


    }
    
    // if food.total %
    /**
    * Check which key is pressed, and then change the direction the snake
    * is heading based on that. The checks ensure you don't double-back
    * on yourself, for example if you're moving to the right and you press
    * the LEFT cursor, it ignores it, because the only valid directions you
    * can move in at that time is up and down.
    */
    if (cursors.left.isDown)
    {
        snake.faceLeft();
    }
    else if (cursors.right.isDown)
    {
        snake.faceRight();
    }
    else if (cursors.up.isDown)
    {
        snake.faceUp();
    }
    else if (cursors.down.isDown)
    {
        snake.faceDown();
    }

    if (snake.update(time))
    {
        //  If the snake updated, we need to check for collision against food

        if (snake.collideWithFood(food))
        {
            repositionFood('food');
        }
        else if (snake.collideWithBadFood(badfood))
        {
           snake.shrink();
           badfood.x = 1000;
           badfood.y = 1000;
           badfoodIsSeen = false
           timeIncrement += 10000

        }
        else if (snake.collideWithObstacle(obstacleOne, obstacleTwo))
        {
            console.log('dead1');
            snake.alive = false;
            // return;
            
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
function repositionFood (typeFood)
{
    //  First create an array that assumes all positions
    //  are valid for the new piece of food

    //  A Grid we'll use to reposition the food each time it's eaten
    var testGrid = [];

    for (var y = 0; y < y_grid; y++)
    {
        testGrid[y] = [];

        for (var x = 0; x < x_grid; x++)
        {
            testGrid[y][x] = true;
        }
    }

    snake.updateGrid(testGrid);

    //  Purge out false positions
    var validLocations = [];

    for (var y = 0; y < y_grid; y++)
    {
        for (var x = 0; x < x_grid; x++)
        {
            if (testGrid[y][x] === true)
            {
                //  Is this position valid for food? If so, add it here ...
                validLocations.push({ x: x, y: y });
            }
        }
    }

    if (validLocations.length > 0)
    {
        //  Use the RNG to pick a random food position
        var pos = Phaser.Math.RND.pick(validLocations);

        //  And place it
        if (typeFood === 'food')
        {
            ty = food;
        }
        else if (typeFood === 'badfood')
        {
            console.log("badfood")
            ty = badfood;
        }
        else if (typeFood === 'obstacleOne')
        {
            ty = obstacleOne;
        }
        else{
            ty = obstacleTwo;
        }
        ty.setPosition(pos.x * 16, pos.y * 16);

        return true;
    }
    else
    {
        return false;
    }
};