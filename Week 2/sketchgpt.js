function setup() {
  createCanvas(600, 600);
  rectMode(CENTER);
}

function draw() {
  background(15);

  // --- Flickering light effect ---
  let flicker = random(-10, 10);

  // --- Neck ---
  fill(40);
  noStroke();
  rect(width/2, height/2 + 120, 40, 120);

  // --- Head (tall + distorted) ---
  stroke(120);
  strokeWeight(3);
  fill(30);
  rect(width/2, height/2 - 40, 180, 260, 10);

  // Crack line
  stroke(90);
  line(width/2 - 40, height/2 - 160, width/2 - 20, height/2 + 40);

  // --- Eyes (hollow + glowing) ---
  noStroke();
  fill(200, 0, 0, 180);
  ellipse(width/2 - 40, height/2 - 80, 40 + flicker, 25);
  ellipse(width/2 + 50, height/2 - 60, 25 + flicker, 40);

  // Eye glow
  fill(255, 0, 0, 60);
  ellipse(width/2 - 40, height/2 - 80, 70, 50);
  ellipse(width/2 + 50, height/2 - 60, 50, 80);

  // --- Nose vent ---
  stroke(80);
  strokeWeight(2);
  for (let i = -10; i <= 10; i += 5) {
    line(width/2 + i, height/2 - 20, width/2 + i, height/2 + 10);
  }

  // --- Mouth (mechanical jaw) ---
  fill(20);
  stroke(150);
  rect(width/2, height/2 + 60, 120, 50);

  // Teeth
  stroke(220);
  for (let x = -50; x <= 50; x += 10) {
    line(width/2 + x, height/2 + 35, width/2 + x, height/2 + 85);
  }

  // --- Side wires ---
  stroke(180);
  strokeWeight(4);
  line(width/2 - 90, height/2 - 40, width/2 - 140, height/2);
  line(width/2 + 90, height/2 - 20, width/2 + 150, height/2 + 20);

  // Wire ends
  fill(255, 50, 50);
  noStroke();
  circle(width/2 - 140, height/2, 10);
  circle(width/2 + 150, height/2 + 20, 10);

  // --- Antenna spikes ---
  stroke(200);
  strokeWeight(3);
  line(width/2 - 30, height/2 - 190, width/2 - 60, height/2 - 240);
  line(width/2 + 30, height/2 - 190, width/2 + 80, height/2 - 230);

  // Sparks
  stroke(255, 0, 0);
  point(width/2 - 60, height/2 - 240);
  point(width/2 + 80, height/2 - 230);
}
