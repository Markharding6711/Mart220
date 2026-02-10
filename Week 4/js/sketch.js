let food1, food2, food3;
let customFont;

// TIMING / PHASES
let phase = 1;
let timer = 0;

// FOOD 1 (blink)
let food1X = 150;
let food1Y = 300;
let food1Visible = true;

// FOOD 2 (slide)
let food2X = -60;
let food2Y = 300;
let food2Speed = 3;

// FOOD 3 (bounce)
let food3X = 300;
let food3Y = 300;
let food3DX = 4;
let food3DY = 3;


function preload() {
  food1 = loadImage('images/pizza.jpg');
  food2 = loadImage('images/Ramen AI.png');
  food3 = loadImage('images/sushi.jpeg');
  customFont = loadFont('Assets/RubikGlitch-Regular.ttf');
}

function setup() {
  createCanvas(600, 600);
  imageMode(CENTER);
  textFont(customFont);
}

function draw() {
  background(51);

  // TEXT
  fill(255, 215, 0);
  textSize(32);
  text('Favorite Food Project', 40, 50);

  fill(255);
  textSize(20);
  text('By Mark Harding', 40, 80);

  timer++;

  // ----------------------
  // PHASE 1 – blinking pizza
  // ----------------------
  if (phase === 1) {
    if (timer % 120 === 0) {
      food1Visible = !food1Visible;
    }

    if (food1Visible) {
      image(food1, food1X, food1Y, 120, 120);
    }

    if (timer > 300) {
      phase = 2;
      timer = 0;
    }
  }

  // ----------------------
  // PHASE 2 – sliding ramen
  // ----------------------
  else if (phase === 2) {
    food2X += food2Speed;

    image(food2, food2X, food2Y, 120, 120);

    if (food2X > width + 60) {
      phase = 3;
    }
  }

  // ----------------------
  // PHASE 3 – bouncing sushi
  // ----------------------
  else if (phase === 3) {
    food3X += food3DX;
    food3Y += food3DY;

    if (food3X < 40 || food3X > width - 40) food3DX *= -1;
    if (food3Y < 40 || food3Y > height - 40) food3DY *= -1;

    image(food3, food3X, food3Y, 80, 80);
  }
}

