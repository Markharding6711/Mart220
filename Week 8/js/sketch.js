// ======================================================
// GAME STATE
// ======================================================

let gameState = "start";

// ======================================================
// PLAYER ANIMATION
// ======================================================

let idleFrame;

let jumpFrames = [];
let hurtFrames = [];
let deathFrames = [];

let currentAnimation = [];
let currentFrame = 0;
let animationSpeed = 6;

let playerState = "idle";
let playerDirection = 1;

// ======================================================
// PLAYER
// ======================================================

let playerX, playerY;
let playerSize = 70;

let velocityY = 0;
let gravity = 0.6;
let jumpForce = -18;

let playerHealth = 100;

// ======================================================
// GAME OBJECTS
// ======================================================

let platforms = [];
let enemies = [];
let foods = [];

// ======================================================
// SCORE
// ======================================================

let score = 0;

// ======================================================
// IMAGES
// ======================================================

let backgroundImg;

let appleImg, bananaImg, cherryImg, strawberryImg;

let enemy1 = [];
let enemy2 = [];
let enemy3 = [];

// ======================================================
// SOUND
// ======================================================

let jumpSound;
let goodFoodSound;
let badFoodSound;
let deathSound;
let backgroundMusic;

// ======================================================
// PRELOAD
// ======================================================

function preload(){

backgroundImg = loadImage("images/backrounds/backround.png");

idleFrame = loadImage("images/player/idle/dude.png");

for(let i=1;i<=8;i++){
jumpFrames.push(loadImage("images/player/jump/dude_jump"+i+".png"));
}

for(let i=1;i<=4;i++){
hurtFrames.push(loadImage("images/player/hurt/dude_hurt"+i+".png"));
}

for(let i=1;i<=8;i++){
deathFrames.push(loadImage("images/player/death/dude_death"+i+".png"));
}

appleImg = loadImage("images/food/apple.png");
bananaImg = loadImage("images/food/banana.png");
cherryImg = loadImage("images/food/cherry.png");
strawberryImg = loadImage("images/food/strawberry.png");

for(let i=1;i<=2;i++){
enemy1.push(loadImage("images/enemies/enemy1_"+i+".png"));
}

for(let i=1;i<=2;i++){
enemy2.push(loadImage("images/enemies/enemy2_"+i+".png"));
}

for(let i=1;i<=2;i++){
enemy3.push(loadImage("images/enemies/enemy3_"+i+".png"));
}

jumpSound = loadSound("sound/jump.mp3");
goodFoodSound = loadSound("sound/good_item.mp3");
badFoodSound = loadSound("sound/bad_item.mp3");
deathSound = loadSound("sound/death.mp3");
backgroundMusic = loadSound("sound/backround.mp3");

}

// ======================================================
// SETUP
// ======================================================

function setup(){

createCanvas(600,600);
imageMode(CENTER);

}

// ======================================================
// START GAME
// ======================================================

function startGame(){

playerX = width/2;
playerY = height - 150;

velocityY = 0;

score = 0;
playerHealth = 100;

platforms = [];
enemies = [];
foods = [];

// base platform
platforms.push(new Platform(width/2-60,height-80,120,20));

// generate platforms
for(let i=0;i<8;i++){

let y = height - i*80;

let type = random(["normal","normal","moving","breakable"]);

platforms.push(
new Platform(random(width-120),y,120,20,type)
);

}

// spawn food
spawnFood();

playerState="idle";
currentFrame=0;

}

// ======================================================
// DRAW
// ======================================================

function draw(){

image(backgroundImg,width/2,height/2,width,height);

if(gameState==="start"){
drawStartScreen();
return;
}

if(gameState==="gameover"){
showGameOver();
return;
}

handlePlayerMovement();
handlePlatforms();
handleEnemies();
handleFood();

updatePlayerAnimation();
drawUI();

}

// ======================================================
// START SCREEN
// ======================================================

function drawStartScreen(){

rectMode(CORNER);

fill(0,180);
rect(0,0,width,height);

fill(255);
textAlign(CENTER);

textSize(50);
text("Sky Climber",width/2,200);

textSize(22);
text("Press SPACE to Start",width/2,300);

}

// ======================================================
// PLAYER MOVEMENT
// ======================================================

function handlePlayerMovement(){

if(keyIsDown(LEFT_ARROW)){
playerX -= 5;
playerDirection = -1;
}

if(keyIsDown(RIGHT_ARROW)){
playerX += 5;
playerDirection = 1;
}

if(playerX < -playerSize/2) playerX = width + playerSize/2;
if(playerX > width + playerSize/2) playerX = -playerSize/2;

velocityY += gravity;
playerY += velocityY;

// scrolling camera
if(playerY < height/2){

let diff = height/2 - playerY;
playerY = height/2;

score += diff;

for(let p of platforms) p.y += diff;
for(let e of enemies) e.y += diff;
for(let f of foods) f.y += diff;

}

if(playerY - playerSize/2 > height){
triggerDeath();
}

}

// ======================================================
// PLATFORMS
// ======================================================

function handlePlatforms(){

for(let p of platforms){

p.update();
p.display();

if(

velocityY>0 &&
playerX > p.x &&
playerX < p.x+p.w &&
playerY+playerSize/2 > p.y &&
playerY+playerSize/2 < p.y+p.h

){

velocityY = jumpForce;

jumpSound.play();

playerState="jump";
currentAnimation=jumpFrames;
currentFrame=0;

if(p.type==="breakable") p.broken=true;

}

}

for(let i=platforms.length-1;i>=0;i--){
if(platforms[i].y>height+50){
platforms.splice(i,1);
}
}

// spawn platforms
while(platforms.length<12){

let highestY = height;

for(let p of platforms){
if(p.y < highestY) highestY = p.y;
}

let newY = highestY - random(80,140);

let type = random(["normal","normal","moving","breakable"]);

platforms.push(
new Platform(random(width-120),newY,120,20,type)
);

}

}

// ======================================================
// ENEMY CLASS
// ======================================================

class Enemy{

constructor(x,y,type){

this.x=x;
this.y=y;
this.type=type;

this.size=60;
this.frame=0;

this.dir=1;
this.speed=2;

}

update(){

if(this.type===1){

this.x += this.speed*this.dir;

if(this.x<30||this.x>width-30) this.dir*=-1;

}

if(this.type===3){

this.x += this.speed;
this.y += this.speed;

}

if(frameCount%20===0){
this.frame = 1-this.frame;
}

}

display(){

let img;

if(this.type===1) img = enemy1[this.frame];
if(this.type===2) img = enemy2[this.frame];
if(this.type===3) img = enemy3[this.frame];

image(img,this.x,this.y,this.size,this.size);

}

collide(){

return dist(playerX,playerY,this.x,this.y) < this.size/2 + playerSize/2;

}

}

// ======================================================
// ENEMIES
// ======================================================

function handleEnemies(){

// safe enemy spawn
if(score>1000 && frameCount%240===0){

let p = random(platforms);

let spawnX = p.x + p.w/2;
let spawnY = p.y - 50;

enemies.push(new Enemy(spawnX,spawnY,1));

}

if(score>2000 && frameCount%300===0){

let p = random(platforms);

enemies.push(new Enemy(p.x+p.w/2,p.y-40,2));

}

if(score>4000 && frameCount%360===0){

let p = random(platforms);

enemies.push(new Enemy(p.x+p.w/2,p.y-60,3));

}

for(let e of enemies){

e.update();
e.display();

if(e.collide()){

playerHealth -= 30;

badFoodSound.play();

playerState="hurt";
currentAnimation=hurtFrames;
currentFrame=0;

if(playerHealth<=0){
triggerDeath();
}

}

}

// cleanup
for(let i=enemies.length-1;i>=0;i--){
if(enemies[i].y > height+100){
enemies.splice(i,1);
}
}

}

// ======================================================
// FOOD
// ======================================================

function spawnFood(){

let types=["apple","banana","cherry","strawberry"];

for(let i=0;i<4;i++){

let type=random(types);

foods.push(
new Food(type, random(50,width-50), random(-600,-50))
);

}

}

function handleFood(){

for(let f of foods){

f.display();

if(!f.active) continue;

if(f.collides(playerX,playerY,playerSize)){

if(f.points < 0){

playerHealth += f.points;

badFoodSound.play();

playerState="hurt";
currentAnimation=hurtFrames;
currentFrame=0;

}else{

score += f.points;
goodFoodSound.play();

}

f.respawn();

}

}

}

// ======================================================
// PLAYER ANIMATION
// ======================================================

function updatePlayerAnimation(){

push();

translate(playerX,playerY);
scale(playerDirection,1);

if(playerState==="idle"||velocityY>0){

image(idleFrame,0,0,playerSize,playerSize);
pop();
return;

}

if(frameCount%animationSpeed===0){

currentFrame++;

if(currentFrame>=currentAnimation.length){

playerState="idle";
currentFrame=0;

}

}

image(currentAnimation[currentFrame],0,0,playerSize,playerSize);

pop();

}

// ======================================================
// UI
// ======================================================

function drawUI(){

fill(0);
textSize(20);
textAlign(LEFT);

text("Height: "+floor(score),20,30);

stroke(0);
fill(200);
rect(20,50,200,20);

fill(0,200,0);
rect(20,50,playerHealth*2,20);

}

// ======================================================
// DEATH
// ======================================================

function triggerDeath(){

gameState="gameover";

backgroundMusic.stop();
deathSound.play();

playerState="death";
currentAnimation=deathFrames;
currentFrame=0;

}

// ======================================================
// GAME OVER
// ======================================================

function showGameOver(){

fill(0,200);
rect(0,0,width,height);

if(frameCount%animationSpeed===0){
if(currentFrame<deathFrames.length-1) currentFrame++;
}

image(deathFrames[currentFrame],width/2,height/2,150,150);

fill(255);
textAlign(CENTER);

textSize(40);
text("GAME OVER",width/2,120);

textSize(20);
text("Press R to Restart",width/2,170);

}

// ======================================================
// INPUT
// ======================================================

function keyPressed(){

if(gameState==="start" && key===" "){

startGame();
gameState="play";

backgroundMusic.loop();

}

if(gameState==="gameover" && (key==="r"||key==="R")){

startGame();
gameState="play";

backgroundMusic.loop();

}

}