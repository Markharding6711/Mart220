function setup() {
  createCanvas(600, 600);
  rectMode(CENTER);
}

function draw() {
  background(220);

  // Head
  fill(180);
  stroke(50);
  strokeWeight(4);
  rect(width/2, height/2, 300, 300, 20);

  // Eyes
  fill(255);
  stroke(0);
  circle(width/2 - 70, height/2 - 40, 60);
  circle(width/2 + 70, height/2 - 40, 60);

  // Pupils
  fill(0);
  circle(width/2 - 70, height/2 - 40, 20);
  circle(width/2 + 70, height/2 - 40, 20);

  // Mouth
  stroke(0);
  strokeWeight(6);
  line(width/2 - 80, height/2 + 60, width/2 + 80, height/2 + 60);

  // Antenna
  stroke(0);
  strokeWeight(6);
  line(width/2, height/2 - 150, width/2, height/2 - 200);

  fill(255, 0, 0);
  noStroke();
  circle(width/2, height/2 - 210, 30);

  // Bolts on the side
  fill(120);
  stroke(0);
  strokeWeight(3);
  rect(width/2 - 170, height/2, 30, 60, 5);
  rect(width/2 + 170, height/2, 30, 60, 5);

  // Nose
  fill(100);
  noStroke();
  triangle(
    width/2, height/2 - 10,
    width/2 - 20, height/2 + 30,
    width/2 + 20, height/2 + 30
  );
}