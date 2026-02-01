// Firefly Animation Demo
// Student Name: 

// ---------------- VARIABLES ----------------
let x = 200;      // firefly x position
let y = 200;      // firefly y position
let speedX = 3;   // movement speed horizontally
let speedY = 2;   // movement speed vertically
let fireflySize = 20;

// Color variables
let r = 255;
let g = 255;
let b = 0;

function setup() {
  createCanvas(500, 400);
}

function draw() {
  background(20);

  // Draw background stars using a LOOP
  drawStars();

  // Move and draw the firefly
  moveFirefly();
  drawFirefly();

  // Firefly title text
  fill(255);
  textSize(16);
  text("Click to change color — Press SPACE to stop/start", 10, 20);
}

// ---------------- FUNCTIONS ----------------

// Draw a glowing firefly
function drawFirefly() {
  fill(r, g, b);
  noStroke();
  ellipse(x, y, fireflySize, fireflySize);
}

// Move firefly and bounce using CONDITIONALS
function moveFirefly() {
  x += speedX;
  y += speedY;

  // Bounce off left or right walls
  if (x > width || x < 0) {
    speedX *= -1;
  }

  // Bounce off top or bottom walls
  if (y > height || y < 0) {
    speedY *= -1;
  }
}

// Draw 20 stars using a LOOP (no arrays)
function drawStars() {
  fill(255);
  for (let i = 0; i < 20; i++) {
    // Pseudo-random positions using simple math
    let starX = (i * 23) % width;
    let starY = (i * 97) % height;
    ellipse(starX, starY, 3, 3);
  }
}

// --------------- EVENTS ----------------

// Mouse click event → change firefly color
function mousePressed() {
  r = random(255);
  g = random(255);
  b = random(255);
}

// Keyboard event → Spacebar toggles motion
function keyPressed() {
  if (key === ' ') { // spacebar
    // CONDITIONAL toggles speed between moving & stopped
    if (speedX !== 0 || speedY !== 0) {
      speedX = 0;
      speedY = 0;
    } else {
      speedX = 3;
      speedY = 2;
    }
  }
}