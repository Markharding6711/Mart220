// --- Global variables ---
let angryMode = false;
let t = 0; // time variable for noise

function setup() { 
  createCanvas(600, 600);
  rectMode(CENTER);
}

function draw() {
  background(15);

  // --- Time progression for noise ---
  t += 0.01;

  // --- Smooth motion using noise ---
  let eyeOffsetX = map(noise(t), 0, 1, -4, 4);
  let eyeOffsetY = map(noise(t + 10), 0, 1, -4, 4);
  let wireOffset = map(noise(t + 20), 0, 1, -10, 10);

  // --- Flicker stays chaotic ---
  let flicker = random(-8, 8);

  // --- Conditional styling ---
  if (angryMode) {
    stroke(255, 0, 0);
  } else {
    stroke(120);
  }

  // --- Neck ---
  fill(40);
  noStroke();
  rect(width/2, height/2 + 120, 40, 120);

  // --- Head ---
  strokeWeight(3);
  fill(30);
  rect(width/2, height/2 - 40, 180, 260, 10);

  // Crack
  stroke(90);
  line(width/2 - 40, height/2 - 160, width/2 - 20, height/2 + 40);

  // --- Eyes (smooth drifting) ---
  noStroke();
  fill(200, 0, 0, 180);
  ellipse(width/2 - 40 + eyeOffsetX, height/2 - 80 + eyeOffsetY, 40 + flicker, 25);
  ellipse(width/2 + 50 + eyeOffsetX, height/2 - 60 + eyeOffsetY, 25 + flicker, 40);

  // Glow
  fill(255, 0, 0, 60);
  ellipse(width/2 - 40 + eyeOffsetX, height/2 - 80 + eyeOffsetY, 70, 50);
  ellipse(width/2 + 50 + eyeOffsetX, height/2 - 60 + eyeOffsetY, 50, 80);

  // --- Nose vent ---
  stroke(80);
  strokeWeight(2);
  for (let i = -10; i <= 10; i += 5) {
    line(width/2 + i, height/2 - 20, width/2 + i, height/2 + 10);
  }

  // --- Mouth ---
  fill(20);
  stroke(150);
  rect(width/2, height/2 + 60, 120, 50);

  // Teeth
  stroke(220);
  for (let x = -50; x <= 50; x += 10) {
    line(width/2 + x, height/2 + 35, width/2 + x, height/2 + 85);
  }

  // --- Side wires (noise sway) ---
  stroke(180);
  strokeWeight(4);
  line(width/2 - 90, height/2 - 40, width/2 - 140 + wireOffset, height/2);
  line(width/2 + 90, height/2 - 20, width/2 + 150 + wireOffset, height/2 + 20);

  // Wire ends
  fill(255, 50, 50);
  noStroke();
  circle(width/2 - 140 + wireOffset, height/2, 10);
  circle(width/2 + 150 + wireOffset, height/2 + 20, 10);

  // --- Antennas ---
  stroke(200);
  strokeWeight(3);
  line(width/2 - 30, height/2 - 190, width/2 - 60, height/2 - 240);
  line(width/2 + 30, height/2 - 190, width/2 + 80, height/2 - 230);

  // --- Mouse sparks ---
  if (mouseIsPressed) {
    stroke(255, 0, 0);
    point(mouseX, mouseY);
    point(mouseX + random(-10, 10), mouseY + random(-10, 10));
  }
}

// --- Keyboard interaction ---
function keyPressed() {
  if (key === 'A' || key === 'a') {
    angryMode = !angryMode;
  }
}
