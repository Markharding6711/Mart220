// ARRAYS FOR FOOD
let foodImages = [];
let foodX = [];
let foodY = [];
let foodDX = [];
let foodDY = [];
let foodSize = [];

let customFont;

// Animation controls
let growing = true;

function preload() {
  foodImages[0] = loadImage('images/pizza.jpg');
  foodImages[1] = loadImage('images/Ramen AI.png');
  foodImages[2] = loadImage('images/sushi.jpeg');

  customFont = loadFont('Assets/RubikGlitch-Regular.ttf');
}

function setup() {
  createCanvas(600, 600);
  imageMode(CENTER);
  textFont(customFont);

  // Starting positions
  foodX = [150, 300, 450];
  foodY = [300, 300, 300];

  // Movement speeds
  foodDX = [0, -3, 2];
  foodDY = [0, 0, -2];

  // Initial sizes
  foodSize = [100, 100, 100];
}

function draw() {
  background(40);

  
  // Title
  fill(100, 100, 0);
  textSize(36);
  textAlign(CENTER);
  text("Favorite foods!", width / 2, 60);

  fill(100, 100, 0);
  textSize(18);
  text("By Mark Harding", width / 2, 90);


  // (Animating the pizza to grow and shrink)

  if (growing) {
    foodSize[0] += 0.5;
    if (foodSize[0] > 140) {
      growing = false;
    }
  } else {
    foodSize[0] -= 0.5;
    if (foodSize[0] < 80) {
      growing = true;
    }
  }


  // loop through all food items

  for (let i = 0; i < foodImages.length; i++) {

    // Move (if speed not zero)
    foodX[i] += foodDX[i];
    foodY[i] += foodDY[i];

    // Bounce off edges (except pizza since it doesn't move)
    if (foodX[i] < 60 || foodX[i] > width - 60) {
      foodDX[i] *= -1;
    }

    if (foodY[i] < 60 || foodY[i] > height - 60) {
      foodDY[i] *= -1;
    }

    // Draw using size array
    image(foodImages[i], foodX[i], foodY[i], foodSize[i], foodSize[i]);
  }

  // -----------------------------------
  // LOOP-BASED ANIMATION (Bottom Right Corner)
  // -----------------------------------

  let baseX = width - 80;
  let baseY = height - 80;

  noFill();
  stroke(255, 215, 0);
  strokeWeight(2);

  // Animated expanding rings
  for (let i = 0; i < 5; i++) {
    let size = (frameCount * 2 + i * 20) % 100;
    ellipse(baseX, baseY, size);
  }

}
