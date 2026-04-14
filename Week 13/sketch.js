let tankModel;
let tankTexture;
let textures = [];
let orbitObjects = [];
let hud;

let titleText = "Armored Orbit";
let artistName = "Mark Harding";

function preload() {
  tankModel = loadModel('assets/OBJ/AbramsLow.obj', true);

  tankTexture = loadImage('assets/Textures/lowabramstexture_Abrams_BaseColor.png');


  textures[0] = loadImage('assets/Textures/lowabramstexture_Abrams_BaseColor.png');
  textures[1] = loadImage('assets/Textures/rocky_terrain.jpg');
  textures[2] = loadImage('assets/Textures/rustic_stone.jpg');
  textures[3] = loadImage('assets/Textures/rusty_metal.jpg');
  textures[4] = loadImage('assets/Textures/marble.jpg');
}

function setup() {
  createCanvas(1000, 700, WEBGL);
  textFont('Arial');

  hud = createGraphics(1000, 700);
  hud.textFont('Arial');
  hud.textAlign(LEFT, TOP);

 
  for (let i = 0; i < 6; i++) {
    orbitObjects.push({
      angle: random(TWO_PI),
      orbitRadius: random(180, 300),
      orbitSpeed: random(0.005, 0.015),
      yOffset: random(-90, 90),
      zOffset: random(-80, 80),
      size: random(40, 65),
      type: i
    });
  }
}

function draw() {
  background(18, 18, 28);

  ambientLight(115);
  directionalLight(255, 255, 255, 0.5, 0.4, -1);
  pointLight(255, 220, 180, 0, -150, 250);

  rotateX(map(mouseY, 0, height, -0.12, 0.12));
  rotateY(map(mouseX, 0, width, -0.2, 0.2));

  drawTank();
  drawOrbitingObjects();
  drawOverlayText();
}

function drawTank() {
  push();

  translate(0, sin(frameCount * 0.02) * 8, 0);
  rotateY(frameCount * 0.01);
  rotateX(PI);

  noStroke();
  texture(tankTexture);

  scale(2);
  model(tankModel);

  pop();
}

function drawOrbitingObjects() {
  for (let i = 0; i < orbitObjects.length; i++) {
    let obj = orbitObjects[i];

    obj.angle += obj.orbitSpeed;

    let x = cos(obj.angle) * obj.orbitRadius;
    let z = sin(obj.angle) * obj.orbitRadius + obj.zOffset;
    let y = obj.yOffset + sin(frameCount * 0.03 + i) * 15;

    push();
    translate(x, y, z);

    rotateX(frameCount * obj.orbitSpeed * 2.0);
    rotateY(frameCount * obj.orbitSpeed * 1.5);
    rotateZ(frameCount * obj.orbitSpeed);

    noStroke();


    if (i < 5) {
      texture(textures[i]);
    }
    
    else {
      normalMaterial();
    }

    if (obj.type % 5 === 0) {
      box(obj.size);
    } else if (obj.type % 5 === 1) {
      sphere(obj.size * 0.6, 24, 16);
    } else if (obj.type % 5 === 2) {
      cone(obj.size * 0.45, obj.size, 24, 1);
    } else if (obj.type % 5 === 3) {
      cylinder(obj.size * 0.35, obj.size, 24, 1);
    } else if (obj.type % 5 === 4) {
      torus(obj.size * 0.45, obj.size * 0.16, 24, 16);
    }

    pop();
  }
}

function drawOverlayText() {
  hud.clear();

  hud.noStroke();
  hud.fill(0, 180);
  hud.rect(12, 12, 280, 78, 10);

  hud.fill(255);
  hud.textSize(28);
  hud.text(titleText, 24, 22);

  hud.textSize(18);
  hud.text(artistName, 24, 56);

  push();
  resetMatrix();
  translate(-width / 2, -height / 2);
  image(hud, 0, 0);
  pop();
}

function mousePressed() {
  let firstIndex = floor(random(orbitObjects.length));
  let secondIndex = floor(random(orbitObjects.length));

  while (secondIndex === firstIndex) {
    secondIndex = floor(random(orbitObjects.length));
  }

  moveOrbitObject(firstIndex);
  moveOrbitObject(secondIndex);
}

function moveOrbitObject(index) {
  orbitObjects[index].orbitRadius = random(160, 340);
  orbitObjects[index].yOffset = random(-160, 160);
  orbitObjects[index].zOffset = random(-180, 180);
  orbitObjects[index].orbitSpeed = random(0.005, 0.02);
  orbitObjects[index].angle = random(TWO_PI);
  orbitObjects[index].size = random(35, 80);
}