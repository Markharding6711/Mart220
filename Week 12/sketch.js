let bubbles = [];
let coins = [];
let fish = [];

let sandTex;
let woodTex;
let crownTex;
let hud;

function setup() {
  createCanvas(1000, 750, WEBGL);
  textAlign(CENTER, CENTER);

  hud = createGraphics(1000, 750);
  hud.textAlign(CENTER, CENTER);

  makeTextures();

  for (let i = 0; i < 20; i++) {
    bubbles.push({
      x: random(-430, 430),
      y: random(120, 360),
      z: random(-320, 220),
      size: random(6, 14),
      speed: random(0.4, 1.2),
      drift: random(TWO_PI)
    });
  }

  for (let i = 0; i < 6; i++) {
    coins.push({
      x: random(40, 150),
      y: random(185, 220),
      z: random(-40, 50),
      rX: random(TWO_PI),
      rY: random(TWO_PI)
    });
  }

  for (let i = 0; i < 5; i++) {
    fish.push({
      baseX: random(-380, 380),
      y: random(-100, 40),
      z: random(-280, -80),
      speed: random(0.6, 1.2),
      offset: random(TWO_PI),
      size: random(0.8, 1.15)
    });
  }
}

function draw() {
  background(10, 70, 120);

  rotateY(sin(frameCount * 0.004) * 0.08);

  ambientLight(55, 85, 105);
  directionalLight(100, 170, 220, -0.3, 0.8, -0.5);
  pointLight(255, 220, 130, 0, 105, 110);
  pointLight(90, 220, 255, -250, -120, 180);

  drawSeafloor();
  drawFish();
  drawSeaweed();
  drawTreasureChest();
  drawChestGlow();
  drawCoinPile();
  drawSunkenCrown();
  drawFrontRocks();
  drawBubbles();

  drawTitleText();
}

function makeTextures() {
  sandTex = createGraphics(256, 256);
  sandTex.background(210, 185, 125);
  sandTex.noStroke();
  for (let i = 0; i < 1200; i++) {
    sandTex.fill(
      210 + random(-18, 18),
      185 + random(-18, 18),
      125 + random(-18, 18),
      160
    );
    sandTex.circle(random(256), random(256), random(2, 5));
  }

  woodTex = createGraphics(256, 256);
  woodTex.background(120, 72, 34);
  woodTex.stroke(95, 55, 25);
  woodTex.strokeWeight(3);
  for (let y = 8; y < 256; y += 18) {
    woodTex.line(0, y + random(-3, 3), 256, y + random(-3, 3));
  }

  crownTex = createGraphics(256, 256);
  crownTex.background(230, 180, 40);
  crownTex.stroke(255, 225, 100);
  crownTex.strokeWeight(2);
  for (let i = 0; i < 40; i++) {
    crownTex.line(random(256), 0, random(256), 256);
  }
}

function drawTitleText() {
  hud.clear();

  hud.noStroke();
  hud.fill(0, 110);
  hud.rectMode(CENTER);
  hud.rect(width / 2, 58, 340, 64, 12);

  hud.fill(255);
  hud.textSize(30);
  hud.text("Underwater Treasure", width / 2, 42);

  hud.textSize(18);
  hud.text("By Mark Harding", width / 2, 72);

  push();
  resetMatrix();

  drawingContext.disable(drawingContext.DEPTH_TEST);
  noLights();

  imageMode(CORNER);
  image(hud, -width / 2, -height / 2, width, height);

  drawingContext.enable(drawingContext.DEPTH_TEST);
  pop();
}

function drawSeafloor() {
  push();
  translate(0, 255, 0);
  rotateX(HALF_PI);
  texture(sandTex);
  plane(1200, 1200);
  pop();
}

function drawFish() {
  for (let i = 0; i < fish.length; i++) {
    let f = fish[i];

    let swimX = ((frameCount * f.speed + f.baseX + i * 120) % 950) - 475;
    let swimY = f.y + sin(frameCount * 0.03 + f.offset) * 14;
    let swimZ = f.z + cos(frameCount * 0.02 + f.offset) * 18;

    push();
    translate(swimX, swimY, swimZ);
    rotateY(HALF_PI + sin(frameCount * 0.02 + f.offset) * 0.15);
    scale(f.size);

    push();
    rotateY(frameCount * 0.01);
    ambientMaterial(255, 150 + i * 10, 100 + i * 8);
    ellipsoid(34, 16, 8);
    pop();

    push();
    translate(-24, 0, 0);
    rotateY(frameCount * 0.01);
    rotateZ(sin(frameCount * 0.18 + f.offset) * 0.4);
    ambientMaterial(255, 165 + i * 8, 110 + i * 8);
    cone(10, 20, 3, 1);
    pop();

    push();
    translate(15, -2, 5);
    rotateY(frameCount * 0.01);
    specularMaterial(255);
    sphere(2.5);
    pop();

    pop();
  }
}

function drawSeaweed() {
  let seaweedData = [
    { x: -340, h: 150, z: -60, phase: 0.8, c: [30, 155, 90] },
    { x: -285, h: 165, z: 25, phase: 1.5, c: [35, 170, 100] },
    { x: 300, h: 155, z: -30, phase: 2.2, c: [30, 150, 95] },
    { x: 355, h: 140, z: 70, phase: 3.1, c: [40, 165, 110] }
  ];

  for (let s of seaweedData) {
    push();
    translate(s.x, 195, s.z);
    rotateY(frameCount * 0.01);
    rotateZ(sin(frameCount * 0.025 + s.phase) * 0.18);
    ambientMaterial(s.c[0], s.c[1], s.c[2]);
    cylinder(10, s.h);
    pop();
  }
}

function drawTreasureChest() {
  push();
  translate(-20, 150, 10);
  rotateY(frameCount * 0.01);

  push();
  texture(woodTex);
  box(150, 75, 90);
  pop();

  push();
  translate(0, -48, -38);
  rotateX(0.55 + sin(frameCount * 0.02) * 0.04);
  translate(0, 8, 38);
  texture(woodTex);
  box(150, 30, 90);
  pop();

  push();
  translate(0, 3, 46);
  specularMaterial(255, 215, 60);
  shininess(90);
  box(154, 12, 6);
  pop();

  push();
  translate(0, -24, 46);
  specularMaterial(255, 215, 60);
  shininess(90);
  box(154, 8, 6);
  pop();

  push();
  translate(0, -8, 49);
  specularMaterial(255, 210, 70);
  shininess(100);
  box(16, 24, 8);
  pop();

  pop();
}

function drawChestGlow() {
  push();
  translate(-20, 118, 0);
  rotateY(frameCount * 0.01);

  push();
  rotateY(frameCount * 0.02);
  emissiveMaterial(255, 210, 90);
  sphere(20 + sin(frameCount * 0.06) * 2);
  pop();

  for (let i = 0; i < 3; i++) {
    push();
    translate(
      sin(frameCount * 0.02 + i) * 18,
      sin(frameCount * 0.03 + i * 0.7) * 6,
      cos(frameCount * 0.02 + i) * 12
    );
    rotateX(frameCount * 0.02 + i);
    rotateY(frameCount * 0.02 + i);
    emissiveMaterial(255, 220, 110);
    box(8, 8, 8);
    pop();
  }

  pop();
}

function drawCoinPile() {
  for (let i = 0; i < coins.length; i++) {
    let c = coins[i];
    push();
    translate(c.x, c.y, c.z);
    rotateX(HALF_PI + sin(frameCount * 0.01 + i) * 0.08 + c.rX);
    rotateY(frameCount * 0.01 + i * 0.2);
    rotateZ(frameCount * 0.01 + c.rY);
    specularMaterial(255, 210, 40);
    shininess(100);
    cylinder(22, 7);
    pop();
  }
}

function drawSunkenCrown() {
  push();
  translate(235, 195, 35);
  rotateY(frameCount * 0.015);
  rotateZ(-0.15);

  push();
  texture(crownTex);
  cylinder(28, 24);
  pop();

  for (let i = 0; i < 5; i++) {
    let a = map(i, 0, 5, 0, TWO_PI);
    let x = cos(a) * 20;
    let z = sin(a) * 20;

    push();
    translate(x, -20, z);
    rotateY(a + frameCount * 0.01);
    specularMaterial(255, 215, 70);
    shininess(90);
    cone(8, 22);
    pop();
  }

  push();
  translate(0, -8, 0);
  rotateX(frameCount * 0.02);
  rotateY(frameCount * 0.04);
  emissiveMaterial(80, 255, 220);
  sphere(8 + sin(frameCount * 0.08) * 1.2);
  pop();

  pop();
}

function drawFrontRocks() {
  push();
  translate(115, 225, 120);
  rotateX(frameCount * 0.006);
  rotateY(frameCount * 0.006);
  ambientMaterial(90, 100, 110);
  ellipsoid(55, 34, 40);
  pop();

  push();
  translate(-255, 228, 130);
  rotateX(frameCount * 0.006);
  rotateY(frameCount * 0.005);
  ambientMaterial(92, 102, 112);
  sphere(34);
  pop();
}

function drawBubbles() {
  for (let b of bubbles) {
    push();
    translate(b.x, b.y, b.z);
    rotateX(frameCount * 0.01);
    rotateY(frameCount * 0.01);
    specularMaterial(180, 225, 255);
    shininess(100);
    sphere(b.size);
    pop();

    b.y -= b.speed;
    b.x += sin(frameCount * 0.01 + b.drift) * 0.14;

    if (b.y < -320) {
      b.y = random(170, 370);
      b.x = random(-430, 430);
      b.z = random(-320, 220);
    }
  }
}