let carrotImg;
let rabbitImg;
let rabbitX = 400;
let rabbitY = 0;
let carrotX = 100;
let carrotY = 50;
let timeLeft = 10;
let theFont;
let timerInterval;
function preload() {
    carrotImg = loadImage('assets/images/carrot.jpg');
    rabbitImg = loadImage('assets/images/rabbit.jpg');
    theFont = loadFont('assets/fonts/Bungee-Regular.ttf');
}

function setup() {
    createCanvas(800, 600);
    setInterval(randomMovement, 5000);
   timerInterval = setInterval(timer, 1000);

}

function draw() {
    background(220);
    
    carrotImg.resize(100, 0);
    image(carrotImg, carrotX, carrotY);

    rabbitImg.resize(200, 0);
    image(rabbitImg, rabbitX, rabbitY);

    fill(255, 0, 0);
    textFont(theFont);
    textSize(32);
    text("Time Left: " + timeLeft , 20, 30);

    if(timeLeft <= 0){
         fill(0);
        textSize(64);
        text("Game Over!", width / 2 - 150, height / 2);
    }

    /*this is the keypressed stuff */
    if (isKeyPressed) {
        if (keyCode === LEFT_ARROW) {
            if (rabbitX <= -200) {
                rabbitX = width - 200;
            }
            rabbitX -= 5;
        } else if (keyCode === RIGHT_ARROW) {
            if (rabbitX >= width) {
                rabbitX = 0;
            }
            rabbitX += 5;
        }
        else if (keyCode === UP_ARROW) {
            rabbitY -= 5;
        } else if (keyCode === DOWN_ARROW) {
            rabbitY += 5;
        }
    }
}
function randomMovement() {
    //console.log("moving carrot");
    carrotX = random(0, width - 100);
    carrotY = random(0, height - 100);
} 

function timer() {
    console.log("timer tick");
    
    timeLeft -= 1;
    if (timeLeft <= 0) {
        clearInterval(timerInterval);
        
       
    noLoop();
    }
}
