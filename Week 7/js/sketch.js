// ======================================================
// PLAYER ANIMATION
// ======================================================
let idleFrames = [];
let walkFrames = [];
let currentAnimation = [];
let currentFrame = 0;
let animationSpeed = 8;

// ======================================================
// PLAYER
// ======================================================
let playerX, playerY;
let playerSize = 70;
let velocityY = 0;
let gravity = 0.6;
let jumpForce = -18;

// ======================================================
// GAME OBJECTS
// ======================================================
let platforms = [];
let enemies = [];
let fruits = [];
let popups = [];

// ======================================================
// SCORE + TIMER
// ======================================================
let score = 0;        // height score
let foodScore = 0;    // rubric requirement
let timeRemaining = 10;
let lastTimeCheck = 0;

let gameOver = false;

// ======================================================
// IMAGES
// ======================================================
let appleImg, bananaImg, cherryImg, orangeImg, strawberryImg;
let enemyIdle, enemyWalk;

// ======================================================
function preload() {

  idleFrames[0] = loadImage("images/idle1.png");
  idleFrames[1] = loadImage("images/idle2.png");

  walkFrames[0] = loadImage("images/walk1.png");
  walkFrames[1] = loadImage("images/walk2.png");

  appleImg = loadImage("images/apple.png");
  bananaImg = loadImage("images/banana.png");
  cherryImg = loadImage("images/cherry.png");
  orangeImg = loadImage("images/orange.png");
  strawberryImg = loadImage("images/strawberry.png");

  enemyIdle = loadImage("images/enemy1_i.png");
  enemyWalk = loadImage("images/enemy1_w.png");
}

// ======================================================
function setup() {
  createCanvas(600, 600);
  imageMode(CENTER);
  startGame();
}

// ======================================================
function startGame() {

  playerX = width/2;
  playerY = height - 150;
  velocityY = 0;

  score = 0;
  foodScore = 0;
  timeRemaining = 10;
  lastTimeCheck = millis();

  platforms = [];
  enemies = [];
  fruits = [];
  popups = [];

  // Starting platform
  platforms.push(new Platform(width/2 - 60, height - 80, 120, 20));

  // Initial stack
  for (let i = 0; i < 8; i++) {
    let y = height - i * 80;
    platforms.push(new Platform(random(width-120), y, 120, 20));
  }

  spawnFruits();

  currentAnimation = idleFrames;
  currentFrame = 0;
  gameOver = false;
}

// ======================================================
function draw() {

  updateBiome();

  if (gameOver) {
    showGameOver();
    return;
  }

  updateTimer();
  handlePlayerMovement();
  handlePlatforms();
  handleEnemies();
  handleFruits();
  handlePopups();
  updatePlayerAnimation();
  drawUI();
}

// ======================================================
// TIMER
// ======================================================
function updateTimer() {

  if (millis() - lastTimeCheck >= 1000) {
    timeRemaining--;
    lastTimeCheck = millis();
  }

  if (timeRemaining <= 0) {
    gameOver = true;
  }
}

// ======================================================
// PLAYER
// ======================================================
function handlePlayerMovement() 

{

  let isMoving = false;

  if (keyIsDown(LEFT_ARROW)) {
    playerX -= 5;
    isMoving = true;
  }

  if (keyIsDown(RIGHT_ARROW)) {
    playerX += 5;
    isMoving = true;
  }

  playerX = constrain(playerX, playerSize/2, width - playerSize/2);

  currentAnimation = isMoving ? walkFrames : idleFrames;

  velocityY += gravity;
  playerY += velocityY;

  // Scroll world upward
  if (playerY < height/2) {
    let diff = height/2 - playerY;
    playerY = height/2;
    score += diff;

    for (let p of platforms) p.y += diff;
    for (let e of enemies) e.y += diff;
    for (let f of fruits) f.y += diff;
    for (let pop of popups) pop.y += diff;
  }

  // NEW: Lose if player falls below screen
  if (playerY - playerSize/2 > height) {
    gameOver = true;
  }
}

// ======================================================
// PLATFORMS (FIXED CONTINUOUS SPAWN)
// ======================================================
function handlePlatforms() {

  for (let p of platforms) {
    p.update();
    p.display();

    if (
      velocityY > 0 &&
      playerX > p.x &&
      playerX < p.x + p.w &&
      playerY + playerSize/2 > p.y &&
      playerY + playerSize/2 < p.y + p.h
    ) {
      velocityY = jumpForce;

      if (p.type === "breakable") {
        p.broken = true;
      }
    }
  }

  // Remove off-screen platforms
  for (let i = platforms.length - 1; i >= 0; i--) {
    if (platforms[i].y > height + 50) {
      platforms.splice(i, 1);
    }
  }

  // Spawn new platforms above highest
  while (platforms.length < 10) {

    let highestY = height;
    for (let p of platforms) {
      if (p.y < highestY) highestY = p.y;
    }

    let newY = highestY - random(70, 120);

    // Platform shrinking as score increases
    let minWidth = max(60, 140 - score / 50);
    let platformWidth = random(minWidth, 140);

    let type = "normal";

    if (score > 1000) {
      let chanceMoving = min(0.3, score / 10000);
      if (random() < chanceMoving) type = "moving";
    }

    if (score > 5000) {
      if (random() < 0.2) type = "breakable";
    }

    platforms.push(new Platform(random(width - platformWidth), newY, platformWidth, 20, type));
  }
}

// ======================================================
// ENEMIES
// ======================================================
class Enemy {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = 60;
    this.dir = random([-1,1]);
    this.speed = 2;
    this.frame = 0;
  }

  update() {
    this.x += this.speed * this.dir;
    if (this.x < 30 || this.x > width-30) this.dir *= -1;
    if (frameCount % 20 === 0) this.frame = 1 - this.frame;
  }

  display() {
    let img = this.frame === 0 ? enemyIdle : enemyWalk;
    image(img, this.x, this.y, this.size, this.size);
  }

  collide() {
    return dist(playerX, playerY, this.x, this.y) < this.size/2 + playerSize/2;
  }
}

function handleEnemies() {

  if (score > 1000 && frameCount % 240 === 0) {
    enemies.push(new Enemy(random(50,width-50), -50));
  }

  for (let e of enemies) {
    e.update();
    e.display();
    if (e.collide()) gameOver = true;
  }
}

// ======================================================
// FRUITS
// ======================================================
class Fruit {

  constructor(type) {

    this.size = 50;
    this.type = type;

    if (type === "apple") { this.image = appleImg; this.timeValue = 1; }
    if (type === "banana") { this.image = bananaImg; this.timeValue = 2; }
    if (type === "cherry") { this.image = cherryImg; this.timeValue = 3; }
    if (type === "orange") { this.image = orangeImg; this.timeValue = 4; }
    if (type === "strawberry") { this.image = strawberryImg; this.timeValue = 5; }

    this.relocate();
    this.nextMove = millis() + random(3000,6000);
  }

  update() {
    if (millis() > this.nextMove) {
      this.relocate();
      this.nextMove = millis() + random(3000,6000);
    }
  }

  display() {
    image(this.image, this.x, this.y, this.size, this.size);
  }

  relocate() {
    this.x = random(50,width-50);
    this.y = random(-600,-50);
  }

  collide() {
    return dist(playerX, playerY, this.x, this.y) < this.size/2 + playerSize/2;
  }
}

function spawnFruits() {
  let types = ["apple","banana","cherry","orange","strawberry"];
  for (let i = 0; i < 3; i++) {
    fruits.push(new Fruit(random(types)));
  }
}

function handleFruits() {

  for (let f of fruits) {
    f.update();
    f.display();

    if (f.collide()) {

      foodScore++;
      timeRemaining += f.timeValue;
      score += 50;

      popups.push(new TimePopup(f.x, f.y, "+" + f.timeValue));

      f.relocate();
    }
  }
}

// ======================================================
// POPUPS
// ======================================================
class TimePopup {
  constructor(x,y,text) {
    this.x = x;
    this.y = y;
    this.text = text;
    this.alpha = 255;
  }

  update() {
    this.y -= 1;
    this.alpha -= 4;
  }

  display() {
    fill(0, this.alpha);
    textAlign(CENTER);
    text(this.text, this.x, this.y);
  }
}

function handlePopups() {
  for (let i = popups.length-1; i >= 0; i--) {
    popups[i].update();
    popups[i].display();
    if (popups[i].alpha <= 0) popups.splice(i,1);
  }
}

// ======================================================
function updatePlayerAnimation() {
  if (frameCount % animationSpeed === 0) {
    currentFrame = (currentFrame+1) % currentAnimation.length;
  }
  image(currentAnimation[currentFrame], playerX, playerY, playerSize, playerSize);
}

// ======================================================
function drawUI() {
  fill(0);
  textAlign(CENTER);
  textSize(22);
  text("Height: " + floor(score), width/2, 40);
  text("Food: " + foodScore, width/2, 70);
  text("Time: " + floor(timeRemaining), width/2, 100);
}

// ======================================================
function updateBiome() {
  let stage = floor(score / 3000);
  if (stage % 3 === 0) background(200,230,255);
  else if (stage % 3 === 1) background(255,220,200);
  else background(200,255,220);
}

// ======================================================
function showGameOver() {
  background(30);
  fill(255);
  textAlign(CENTER);
  textSize(40);
  text("GAME OVER", width/2, height/2 - 40);
  textSize(24);
  text("Final Height: " + floor(score), width/2, height/2);
  text("Food Collected: " + foodScore, width/2, height/2 + 40);
  text("Press SPACE to Restart", width/2, height/2 + 80);
}

function keyPressed() {
  if (gameOver && key === ' ') {
    startGame();
  }
}