// -----------------------------
// CHARACTER ANIMATION
// -----------------------------
let idleFrames = [];
let walkFrames = [];
let currentAnimation = [];
let currentFrame = 0;
let animationSpeed = 8;

// -----------------------------
// PLAYER PHYSICS
// -----------------------------
let playerX;
let playerY;
let playerSize = 70;

let velocityY;
let gravity = 0.6;
let jumpForce = -18;

// -----------------------------
let platforms = [];
let fruits = [];
let enemies = [];

let score = 0;
let gameOver = false;

// Restart button
let buttonX = 200;
let buttonY = 300;
let buttonW = 200;
let buttonH = 60;

// Fruit images
let appleImg, bananaImg, cherryImg, orangeImg, strawberryImg;

// -----------------------------
// PRELOAD
// -----------------------------
function preload() {
  // Character animations
  idleFrames[0] = loadImage("images/idle1.png");
  idleFrames[1] = loadImage("images/idle2.png");

  walkFrames[0] = loadImage("images/walk1.png");
  walkFrames[1] = loadImage("images/walk2.png");

  // Fruit images
  appleImg = loadImage("images/apple.png");
  bananaImg = loadImage("images/banana.png");
  cherryImg = loadImage("images/cherry.png");
  orangeImg = loadImage("images/orange.png");
  strawberryImg = loadImage("images/strawberry.png");
}

// -----------------------------
// FRUIT CLASS
// -----------------------------
class Fruit {
  constructor(type, x, y) {
    this.type = type;
    this.x = x;
    this.y = y;
    this.size = 50;
    this.active = true;

    if (type === "apple") this.points = 100, this.image = appleImg;
    if (type === "banana") this.points = 200, this.image = bananaImg;
    if (type === "cherry") this.points = 300, this.image = cherryImg;
    if (type === "orange") this.points = 400, this.image = orangeImg;
    if (type === "strawberry") this.points = 500, this.image = strawberryImg;
  }

  display() {
    if (!this.active) return;
    image(this.image, this.x, this.y, this.size, this.size);
  }

  collect() { this.active = false; }

  respawn() {
    this.x = random(50, width - 50);
    this.y = random(-600, -50);
    this.active = true;
  }
}

// -----------------------------
// ENEMY CLASSES
// -----------------------------
class CircleEnemy {
  constructor(x, y, size) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.active = true;
  }
  display() {
    if (!this.active) return;
    fill(255, 100, 100);
    ellipse(this.x, this.y, this.size);
  }
  collide(px, py, psize) {
    return dist(px, py, this.x, this.y) < this.size/2 + psize/2;
  }
}

class TriangleEnemy {
  constructor(x, y, size) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.active = true;
  }
  display() {
    if (!this.active) return;
    fill(255, 50, 50);
    triangle(
      this.x - this.size/2, this.y + this.size/2,
      this.x + this.size/2, this.y + this.size/2,
      this.x, this.y - this.size/2
    );
  }
  collide(px, py, psize) {
    return dist(px, py, this.x, this.y) < this.size/2 + psize/2;
  }
}

// -----------------------------
// SETUP
// -----------------------------
function setup() {
  createCanvas(600, 600);
  imageMode(CENTER);
  startGame();
}

// -----------------------------
// START / RESET GAME
// -----------------------------
function startGame() {
  playerX = width / 2;
  playerY = height - 150;
  velocityY = 0;
  score = 0;
  gameOver = false;

  platforms = [];
  fruits = [];
  enemies = [];

  // Safe starting platform
  platforms.push(new Platform(width/2 - 60, height - 80, 120, 15, "normal"));

  for (let i = 0; i < 6; i++) {
    platforms.push(new Platform(
      random(50, width - 100),
      random(i*100, i*100 + 80),
      100, 15,
      "normal"
    ));
  }

  // Fruits
  fruits.push(new Fruit("apple", random(50, width-50), random(-400, 300)));
  fruits.push(new Fruit("banana", random(50, width-50), random(-600, 200)));
  fruits.push(new Fruit("cherry", random(50, width-50), random(-800, 100)));
  fruits.push(new Fruit("orange", random(50, width-50), random(-1000, 0)));
  fruits.push(new Fruit("strawberry", random(50, width-50), random(-1200, -100)));

  currentAnimation = idleFrames;
}

// -----------------------------
// DRAW LOOP
// -----------------------------
function draw() {
  background(200, 230, 255);

  if (gameOver) {
    showGameOver();
    return;
  }

  let isMoving = false;
  if (keyIsDown(LEFT_ARROW)) { playerX -= 5; isMoving = true; }
  if (keyIsDown(RIGHT_ARROW)) { playerX += 5; isMoving = true; }

  if (playerX < 0) playerX = width;
  if (playerX > width) playerX = 0;

  currentAnimation = isMoving ? walkFrames : idleFrames;

  // Gravity
  velocityY += gravity;
  playerY += velocityY;

  // Platform collision
  if (velocityY > 0) {
    for (let p of platforms) {
      if (p.broken) continue;
      if (playerX > p.x && playerX < p.x + p.w &&
          playerY + playerSize/2 > p.y && playerY + playerSize/2 < p.y + p.h) {
        if (p.type === "breakable") { p.broken = true; }
        else { velocityY = jumpForce; }
      }
    }
  }

  // Infinite scrolling
  if (playerY < height/3) {
    let offset = height/3 - playerY;
    playerY = height/3;

    for (let p of platforms) {
      p.y += offset;
      if (p.y > height) {
        p.y = random(-50,-10);
        p.x = random(50,width-100);
        if (score >= 10000) p.type = random(["normal","moving","breakable"]);
        else if (score >= 5000) p.type = random(["normal","moving"]);
        else p.type = "normal";
        p.broken = false;
      }
    }

    for (let f of fruits) f.y += offset;
    for (let e of enemies) e.y += offset;

    score += int(offset);
  }

  // Game over if player falls
  if (playerY > height + 100) gameOver = true;

  // Draw platforms
  for (let p of platforms) { p.update(); p.display(); }

  // Fruits collision
  for (let f of fruits) {
    f.display();
    if (!f.active) continue;
    let d = dist(playerX, playerY, f.x, f.y);
    if (d < playerSize/2 + f.size/2) {
      score += f.points;
      f.collect();
      setTimeout(() => f.respawn(), 2000);
    }
  }

  // Spawn CircleEnemy & TriangleEnemy occasionally after score > 1000
  if (score > 1000 && frameCount % 300 === 0) {
    enemies.push(new CircleEnemy(random(50,width-50), -50, random(30,60)));
    enemies.push(new TriangleEnemy(random(50,width-50), -50, random(30,60)));
  }

  // Draw enemies and check collision
  for (let e of enemies) {
    e.display();
    if (e.collide(playerX, playerY, playerSize)) {
      gameOver = true;
    }
  }

  // Animation
  if (frameCount % animationSpeed === 0) {
    currentFrame++;
    if (currentFrame >= currentAnimation.length) currentFrame = 0;
  }

  // Draw player
  image(currentAnimation[currentFrame], playerX, playerY, playerSize, playerSize);

  // Score
  fill(0);
  textAlign(CENTER);
  textSize(28);
  text("Score: " + score, width/2, 40);
}

// -----------------------------
// GAME OVER SCREEN
// -----------------------------
function showGameOver() {
  background(30);
  fill(255);
  textAlign(CENTER);
  textSize(40);
  text("GAME OVER", width/2, 200);
  textSize(24);
  text("Final Score: " + score, width/2, 240);

  fill(80,200,120);
  rect(buttonX, buttonY, buttonW, buttonH, 10);

  fill(0);
  textSize(28);
  text("RESTART", width/2, buttonY + 40);
}

// -----------------------------
// MOUSE CLICK RESTART
// -----------------------------
function mousePressed() {
  if (gameOver &&
      mouseX > buttonX && mouseX < buttonX + buttonW &&
      mouseY > buttonY && mouseY < buttonY + buttonH) {
    startGame();
  }
}