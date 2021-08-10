var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;
var cloudsGroup, cloudImage;
var obs1, obs2, obs3, obs4, obs5, obs6, obstaclesGroup;
var count;
var PLAY = 1;
var END = 0;
var gameState = PLAY;
var gameOver, gameOverImage, restart, restartImage;
let checkPoint;
let die;
let jump;

function preload() {
  trex_running = loadAnimation(
    "Images/trex1.png",
    "Images/trex3.png",
    "Images/trex4.png"
  );
  trex_collided = loadAnimation("Images/trex_collided.png");

  groundImage = loadImage("Images/ground2.png");
  cloudImage = loadImage("Images/cloud.png");

  obs1 = loadImage("Images/obstacle1.png");
  obs2 = loadImage("Images/obstacle2.png");
  obs3 = loadImage("Images/obstacle3.png");
  obs4 = loadImage("Images/obstacle4.png");
  obs5 = loadImage("Images/obstacle5.png");
  obs6 = loadImage("Images/obstacle6.png");

  gameOverImage = loadImage("Images/gameOver.png");
  restartImage = loadImage("Images/restart.png");

  checkpoint = loadSound("Sound/checkPoint.mp3");
  die = loadSound("Sound/die.mp3");
  jump = loadSound("Sound/jump.mp3");
}

function setup() {
  createCanvas(600, 200);

  trex = createSprite(50, 180, 20, 50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.scale = 0.5;

  ground = createSprite(200, 180, 400, 20);
  ground.addImage("ground", groundImage);
  ground.x = ground.width / 2;

  invisibleGround = createSprite(200, 190, 1000, 10);
  invisibleGround.visible = false;

  cloudsGroup = new Group();
  obstaclesGroup = new Group();

  count = 0;

  gameOver = createSprite(270, 80, 70, 20);
  gameOver.addImage("gameOver", gameOverImage);
  gameOver.scale = 0.5;
  gameOver.visible = false;

  restart = createSprite(270, 120, 70, 20);
  restart.addImage("restart", restartImage);
  restart.scale = 0.5;
  restart.visible = false;
}

function draw() {
  background(180);
  trex.x = camera.position.x - 200;
  if (gameState === PLAY) {
    textSize(17);
    text("Score: " + count, trex.x + 405, 50);

    //ground.velocityX = -(6+3*count/100);
    camera.position.x = camera.position.x + 10;

    if (trex.x % 100 === 0) {
      ground.x = trex.x + 600;
    }

    if (trex.x % 100 === 0) {
      invisibleGround.x = trex.x + 100;
    }

    count = count + Math.round(trex.x % 150 === 0);

    if (keyDown("space") && trex.y >= 161) {
      trex.velocityY = -11;
      jump.play();
    }

    trex.velocityY = trex.velocityY + 0.8;

    spawnClouds();

    spawnObstacles();

    if (obstaclesGroup.isTouching(trex)) {
      die.play();
      gameState = END;
    }
  } else if (gameState === END) {
    fill("black");
    stroke("grey");
    strokeWeight(3);
    textSize(20);
    text("Your Score: " + count, trex.x + 155, 60);
    gameOver.visible = true;
    gameOver.x = trex.x + 215;
    restart.visible = true;
    restart.x = trex.x + 215;

    trex.changeAnimation("collided", trex_collided);
    trex.velocityX = 0;
    trex.velocityY = 0;

    obstaclesGroup.setVelocityXEach(0);
    obstaclesGroup.setLifetimeEach(-1);

    cloudsGroup.setVelocityXEach(0);
    cloudsGroup.setLifetimeEach(-1);

    if (mousePressedOver(restart)) {
      reset();
    }
  }

  trex.collide(invisibleGround);

  drawSprites();
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(600, 120, 40, 10);
    cloud.x = trex.x + 700;
    cloud.y = Math.round(random(80, 120));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    //assign lifetime to the variable
    cloud.lifetime = 120;
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
}

function spawnObstacles() {
  if (frameCount % 60 === 0) {
    var obstacle = createSprite(600, 165, 10, 40);
    obstacle.x = trex.x + 565;
    obstacle.lifetime = 100;

    var rand = round(random(1, 6));

    switch (rand) {
      case 1:
        obstacle.addImage(obs1);
        break;
      case 2:
        obstacle.addImage(obs2);
        break;
      case 3:
        obstacle.addImage(obs3);
        break;
      case 4:
        obstacle.addImage(obs4);
        break;
      case 5:
        obstacle.addImage(obs5);
        break;
      case 6:
        obstacle.addImage(obs6);
        break;

      default:
        break;
    }
    obstacle.scale = 0.5;
    obstaclesGroup.add(obstacle);
  }
}

function reset() {
  gameState = PLAY;

  gameOver.visible = false;
  restart.visible = false;

  cloudsGroup.destroyEach();
  obstaclesGroup.destroyEach();

  trex.changeAnimation("running", trex_running);

  count = 0;
}
