// Interactive Robot Game by Mark

let headX;
let antennaOffset = 0;
let antennaDirection = 1;

// Robot expression
let smiling = true;
let frownTimer = 0; // counts frames after being hit

// Movement flags
let movingLeft = false;
let movingRight = false;

// Health
let health = 3;

// Falling objects
let drops = [];

// Restart button
let restartBtn = {
  x: 300,
  y: 350,
  w: 180,
  h: 60
};

function setup() {
  createCanvas(600, 600);
  rectMode(CENTER);

  headX = width / 2;

  for (let i = 0; i < 6; i++) {
    drops.push({
      x: random(width),
      y: random(-400, -50),
      speed: random(2, 5)
    });
  }
}

function draw() {
  background(220);

  // Title
  noStroke();
  fill(0);
  textSize(24);
  text("Dodge the Rain!", 20, 40);

  // Footer name (correct spacing)
  textAlign(RIGHT);
  textSize(16);
  text("Created by Mark Harding", width - 20, height - 20);
  textAlign(LEFT);

  // Health
  textSize(20);
  fill(0);
  text("Health: " + health, 20, 80);

  // Game Over
  if (health <= 0) {
    drawGameOver();
    return;
  }

  // Animate antenna
  antennaOffset += 0.5 * antennaDirection;
  if (antennaOffset > 10 || antennaOffset < -10) antennaDirection *= -1;

  // Smooth movement
  if (movingLeft) headX -= 4;
  if (movingRight) headX += 4;
  headX = constrain(headX, 80, width - 80);

  // Robot vertical placement
  let baseY = height - 120;

  // Handle frown timer
  if (frownTimer > 0) {
    frownTimer--;
    if (frownTimer === 0) smiling = true;
  }

  // Draw robot
  drawRobot(baseY);

  // Falling objects
  for (let d of drops) {
    drawDrop(d);
    d.y += d.speed;

    if (d.y > height + 20) {
      d.y = random(-300, -50);
      d.x = random(width);
    }

    // Collision
    if (dist(d.x, d.y, headX, baseY) < 50) {
      health--;
      smiling = false;
      frownTimer = 60; // 1 second at 60fps

      d.y = random(-300, -50);
      d.x = random(width);
    }
  }
}

// Draw robot
function drawRobot(baseY) {
  // Body
  fill(160);
  stroke(50);
  strokeWeight(4);
  rect(headX, baseY + 90, 80, 120, 10);

  // Arms
  stroke(50);
  strokeWeight(6);
  line(headX - 40, baseY + 60, headX - 80, baseY + 100);
  line(headX + 40, baseY + 60, headX + 80, baseY + 100);

  // Legs
  strokeWeight(8);
  line(headX - 20, baseY + 150, headX - 20, baseY + 200);
  line(headX + 20, baseY + 150, headX + 20, baseY + 200);

  // Feet
  strokeWeight(4);
  fill(100);
  rect(headX - 20, baseY + 215, 40, 15, 3);
  rect(headX + 20, baseY + 215, 40, 15, 3);

  // Head
  fill(180);
  stroke(50);
  strokeWeight(4);
  rect(headX, baseY, 120, 120, 15);

  // Eyes
  fill(255);
  stroke(0);
  circle(headX - 25, baseY - 20, 25);
  circle(headX + 25, baseY - 20, 25);

  // Pupils
  fill(0);
  circle(headX - 25, baseY - 20, 10);
  circle(headX + 25, baseY - 20, 10);

  // Mouth (smile or frown)
  stroke(0);
  strokeWeight(4);
  noFill();
  if (smiling) {
    arc(headX, baseY + 20, 50, 30, 0, PI);
  } else {
    arc(headX, baseY + 35, 50, 30, PI, 0); // frown
  }

  // Antenna
  stroke(0);
  strokeWeight(4);
  line(headX, baseY - 60, headX, baseY - 90);

  // Antenna light
  fill(255, 0, 0);
  noStroke();
  circle(headX, baseY - 100 + antennaOffset, 15);

  // Ears
  drawEar(headX - 70, baseY);
  drawEar(headX + 70, baseY);
}

// Ear
function drawEar(x, y) {
  fill(120);
  stroke(0);
  strokeWeight(3);
  rect(x, y, 15, 30, 4);
}

// Falling object
function drawDrop(d) {
  fill(50, 50, 200);
  noStroke();
  ellipse(d.x, d.y, 20, 30);
}

// Game Over + Restart Button
function drawGameOver() {
  textSize(40);
  fill(200, 0, 0);
  text("GAME OVER", width / 2 - 120, height / 2 - 40);

  fill(255);
  stroke(0);
  strokeWeight(3);
  rect(restartBtn.x, restartBtn.y, restartBtn.w, restartBtn.h, 10);

  fill(0);
  textSize(25);
  text("Restart", restartBtn.x - 50, restartBtn.y + 10);
}

// Restart logic
function mousePressed() {
  if (
    mouseX > restartBtn.x - restartBtn.w / 2 &&
    mouseX < restartBtn.x + restartBtn.w / 2 &&
    mouseY > restartBtn.y - restartBtn.h / 2 &&
    mouseY < restartBtn.y + restartBtn.h / 2
  ) {
    resetGame();
  }
}

function resetGame() {
  health = 3;
  smiling = true;
  frownTimer = 0;
  headX = width / 2;

  for (let d of drops) {
    d.x = random(width);
    d.y = random(-400, -50);
  }
}

// Movement keys
function keyPressed() {
  if (key === 'a' || key === 'A') movingLeft = true;
  if (key === 'd' || key === 'D') movingRight = true;
}

function keyReleased() {
  if (key === 'a' || key === 'A') movingLeft = false;
  if (key === 'd' || key === 'D') movingRight = false;
}