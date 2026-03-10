var img;
var myFont;
var carrots;
var x = 200;
var y = 200;
var timerValue = 10;
function preload() {
    img = loadImage("assets/images/rabbit.jpg");
    carrots = loadImage("assets/images/carrots.jpg");
    myFont = loadFont('assets/fonts/Orbitron-Regular.ttf');

}

function setup() {
    createCanvas(800, 400);
    background(220);
    setInterval(timeIt, 1000);
}

function draw() {
    // image(img, 0, 0);
    background(img);
    ellipse(100, 100, 50, 50);
    image(carrots, x, y, 50, 50);
    textFont(myFont);
    textSize(36);
    text('Hello World!!!', width / 2 - 100, 50);



    if (keyIsPressed) {
        if (keyCode === LEFT_ARROW) {
            if (x >= 0) {
                x -= 5;
            }
        } else if (keyCode === RIGHT_ARROW) {
            if (x <= width - 50) {
                x += 5;
            }

        } else if (keyCode === UP_ARROW) {
            if (y >= 0) {
                y -= 5;
            }

        } else if (keyCode === DOWN_ARROW) {
            if (y <= height - 50) {

                y += 5;
            }
        }
    }

    if (timerValue >= 10) {
        text("0:" + timerValue, width / 2, height / 2);
    }

    if (timerValue < 10) {
        text("0:0" + timerValue, width / 2, height / 2);
    }

    if (timerValue == 0) {
        text("game over", width / 2, height / 2 + 15);
    }

}
function timeIt() {
    if (timerValue > 0) {
        timerValue--;
    }
    else{
            
    }

    console.log("hello");
}

