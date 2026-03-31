// ======================================================
// GAME OBJECTS
// ======================================================

let platforms = [];
let enemies = [];
let fruits = [];
let particles = [];
let cloudImg;


// ======================================================
// SCORE / LEVEL STATE
// ======================================================

let heightScore = 0;
let totalScore = 0;
let foodsCollected = 0;
let enemiesKilled = 0;

let gameOver = false;
let gameStarted = false;
let gameWon = false;

let level = 1;
let levelKillGoal = 10;
let levelFruitGoal = 0;


// ======================================================
// IMAGES
// ======================================================

let backgroundImg;

let appleImg, appleBadImg, bananaImg, cherryImg, strawberryImg, orangeImg;

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

function preload() {
  backgroundImg = loadImage("images/backrounds/backround.png");

  idleFrame = loadImage("images/player/idle/dude.png");
  cloudImg = loadImage("images/platforms/cloud_1.png");

  for (let i = 1; i <= 8; i++) {
    jumpFrames.push(loadImage("images/player/jump/dude_jump" + i + ".png"));
  }

  for (let i = 1; i <= 4; i++) {
    hurtFrames.push(loadImage("images/player/hurt/dude_hurt" + i + ".png"));
  }

  for (let i = 1; i <= 8; i++) {
    deathFrames.push(loadImage("images/player/death/dude_death" + i + ".png"));
  }

  appleImg = loadImage("images/food/apple.png");
  appleBadImg = loadImage("images/food/apple_bad.png");
  bananaImg = loadImage("images/food/banana.png");
  cherryImg = loadImage("images/food/cherry.png");
  strawberryImg = loadImage("images/food/strawberry.png");
  orangeImg = loadImage("images/food/orange.png");

  for (let i = 1; i <= 2; i++) {
    enemy1.push(loadImage("images/enemies/enemy1_" + i + ".png"));
  }

  for (let i = 1; i <= 2; i++) {
    enemy2.push(loadImage("images/enemies/enemy2_" + i + ".png"));
  }

  for (let i = 1; i <= 2; i++) {
    enemy3.push(loadImage("images/enemies/enemy3_" + i + ".png"));
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

function setup() {
  createCanvas(600, 600);
  imageMode(CENTER);
  rectMode(CORNER);
  textAlign(CENTER, CENTER);
}


// ======================================================
// LEVEL GOALS
// ======================================================

function setLevelGoals() {
  // Levels 1–6: +5 each level
  if (level <= 6) {
    levelKillGoal = 5 + (level - 1) * 5;
    levelFruitGoal = (level - 1) * 5;
  }
  // Level 7+: +10 each level
  else {
    levelKillGoal = 30 + (level - 6) * 10;
    levelFruitGoal = 25 + (level - 6) * 10;
  }
}


// ======================================================
// START LEVEL / GAME
// ======================================================

function startLevel(newLevel) {
  level = newLevel;
  setLevelGoals();

  heightScore = 0;
  foodsCollected = 0;
  enemiesKilled = 0;

  platforms = [];
  enemies = [];
  fruits = [];
  particles = [];

  resetPlayer();

  platforms.push(new Platform(width / 2 - 60, height - 80, 120, 20));

  for (let i = 0; i < 8; i++) {
    let y = height - i * 80;
    let type = random() < 0.3 ? "moving" : "normal";
    platforms.push(new Platform(random(width - 120), y, 120, 20, type));
  }

  spawnFruits();

  gameOver = false;
  gameWon = false;
  gameStarted = true;

  if (backgroundMusic && !backgroundMusic.isPlaying()) {
    backgroundMusic.loop();
  }
}

function startGame() {
  userStartAudio();
  totalScore = 0;
  startLevel(1);
}


// ======================================================
// DRAW
// ======================================================

function draw() {
  image(backgroundImg, width / 2, height / 2, width, height);

  if (!gameStarted) {
    showStartScreen();
    return;
  }

  if (gameOver) {
    showGameOver();
    return;
  }

  if (gameWon) {
    showWinScreen();
    return;
  }

  handlePlayerMovement();
  handlePlatforms();
  handleFruits();
  handleEnemies();
  handleParticles();

  updatePlayerAnimation();
  drawUI();

  if (invincible && millis() - invincibleTimer > 700) {
    invincible = false;
  }

  checkWinCondition();
}


// ======================================================
// START SCREEN
// ======================================================

function showStartScreen() {
  fill(0, 180);
  rect(0, 0, width, height);

  fill(255);
  textSize(40);
  text("DOODLE CLIMB", width / 2, 190);

  textSize(22);
  text("Press SPACE to Start", width / 2, 270);
  text("Move: Arrow Keys", width / 2, 320);
  text("Jump on enemies to defeat them!", width / 2, 360);
  text("Climb, collect fruit, and survive!", width / 2, 395);

  fill(255);
  rect(width / 2 - 90, 440, 180, 50, 10);

  fill(0);
  textSize(24);
  text("START", width / 2, 465);
}


// ======================================================
// PLATFORMS
// ======================================================

function handlePlatforms() {
  for (let p of platforms) {
    p.update();
    p.display();

    let pw = p.w * p.scale;
    let ph = p.h * p.scale;

    if (
      velocityY > 0 &&
      playerX > p.x &&
      playerX < p.x + pw &&
      playerY + playerSize / 2 > p.y &&
      playerY + playerSize / 2 < p.y + ph
    ) {
      velocityY = jumpForce;

      if (jumpSound) {
        jumpSound.play();
      }
    }
  }

  if (platforms.length < 12) {
    let highest = height;

    for (let p of platforms) {
      if (p.y < highest) {
        highest = p.y;
      }
    }

    let newY = highest - random(60, 120);
    let type = random() < 0.3 ? "moving" : "normal";
    platforms.push(new Platform(random(width - 120), newY, 120, 20, type));
  }

  for (let i = platforms.length - 1; i >= 0; i--) {
    if (platforms[i].y > height + 50) {
      platforms.splice(i, 1);
    }
  }
}


// ======================================================
// PARTICLE SYSTEM
// ======================================================

function createParticles(x, y) {
  let amount = floor(random(6, 11));

  for (let i = 0; i < amount; i++) {
    particles.push(new Particle(x, y));
  }
}

function handleParticles() {
  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    particles[i].display();

    if (particles[i].isFinished()) {
      particles.splice(i, 1);
    }
  }
}


// ======================================================
// FRUITS
// ======================================================

function spawnFruits() {
  fruits = [];

  fruits.push(new Food("apple_bad"));
  fruits.push(new Food("apple"));
  fruits.push(new Food("banana"));
  fruits.push(new Food("cherry"));
  fruits.push(new Food("strawberry"));
  fruits.push(new Food("orange"));
}

function handleFruits() {
  for (let f of fruits) {
    f.display();

    if (f.collide()) {
      if (f.type === "apple_bad") {
        playerHealth -= 20;

        if (badFoodSound) {
          badFoodSound.play();
        }

        playerState = "hurt";
        currentAnimation = hurtFrames;
        currentFrame = 0;
      } else {
        totalScore += 100;
        foodsCollected++;

        if (goodFoodSound) {
          goodFoodSound.play();
        }
      }

      playerHealth = constrain(playerHealth, 0, 100);

      if (playerHealth <= 0) {
        triggerDeath();
      }

      f.relocate();
    }
  }
}


// ======================================================
// ENEMY SYSTEM
// ======================================================

function maybeSpawnMoreEnemies() {
  if (gameOver || gameWon) return;

  if (frameCount % 120 !== 0) return;

  let availableTypes = [];

  // first window: only enemy1
  if (heightScore >= 1500 && heightScore < 2500) {
    availableTypes.push(1);
  }

  // second window: enemy1 and enemy2 only
  if (heightScore >= 2500 && heightScore < 4000) {
    availableTypes.push(1);
    availableTypes.push(2);
  }

  // final window: all three
  if (heightScore >= 4000) {
    availableTypes.push(1);
    availableTypes.push(2);
    availableTypes.push(3);
  }

  if (availableTypes.length === 0) return;

  let type = random(availableTypes);
  enemies.push(new Enemy(random(60, width - 60), -40, type));
}

function handleEnemies() {
  maybeSpawnMoreEnemies();

  for (let i = enemies.length - 1; i >= 0; i--) {
    let e = enemies[i];

    e.update();
    e.display();

    let d = dist(playerX, playerY, e.x, e.y);
    let touchingEnemy = d < e.size / 2 + playerSize / 2;

    let playerBottom = playerY + playerSize / 2;
    let enemyTop = e.y - e.size / 2;

    let stomped =
      touchingEnemy &&
      velocityY > 0 &&
      playerBottom > enemyTop &&
      playerY < e.y;

    if (stomped && millis() > e.hitCooldown) {
      let stompDamage = 50;

      // enemy1 dies in one stomp
      if (e.type === 1) {
        stompDamage = 100;
      }

      e.health -= stompDamage;
      e.hitCooldown = millis() + 250;

      // smaller bounce after stomp
      velocityY = jumpForce / 2;

      createParticles(e.x, e.y);

      if (e.health <= 0) {
        for (let j = 0; j < 3; j++) {
          createParticles(e.x, e.y);
        }
        enemies.splice(i, 1);
        enemiesKilled++;
        totalScore += 200;
      }

      continue;
    }

    if (touchingEnemy) {
      damagePlayer(e.x);
    }

    if (e.y > height + 80) {
      enemies.splice(i, 1);
    }
  }
}


// ======================================================
// WIN CONDITION
// ======================================================

function checkWinCondition() {
  if (
    enemiesKilled >= levelKillGoal &&
    foodsCollected >= levelFruitGoal
  ) {
    gameWon = true;

    if (backgroundMusic && backgroundMusic.isPlaying()) {
      backgroundMusic.stop();
    }
  }
}


// ======================================================
// UI
// ======================================================

function drawUI() {
  noStroke();
  textSize(20);

  fill(0);
  textAlign(LEFT, CENTER);
  text("Health", 20, 30);

  stroke(0);
  fill(200);
  rect(20, 40, 200, 20);

  fill(0, 200, 0);
  rect(20, 40, playerHealth * 2, 20);

  noStroke();

  fill(0);
  textAlign(LEFT, CENTER);
  text("Height: " + floor(heightScore), 20, 90);
  text("Total Score: " + floor(totalScore), 20, 120);
  text("Level: " + level, 20, 150);

  textAlign(RIGHT, CENTER);
  text("Fruit: " + foodsCollected + " / " + levelFruitGoal, width - 20, 30);
  text("Kills: " + enemiesKilled + " / " + levelKillGoal, width - 20, 60);
}


// ======================================================
// DEATH
// ======================================================

function triggerDeath() {
  gameOver = true;

  if (backgroundMusic && backgroundMusic.isPlaying()) {
    backgroundMusic.stop();
  }

  if (deathSound) {
    deathSound.play();
  }

  playerState = "death";
  currentAnimation = deathFrames;
  currentFrame = 0;
}


// ======================================================
// GAME OVER
// ======================================================

function showGameOver() {
  fill(0, 200);
  rect(0, 0, width, height);

  if (frameCount % animationSpeed === 0) {
    if (currentFrame < deathFrames.length - 1) {
      currentFrame++;
    }
  }

  image(deathFrames[currentFrame], width / 2, height / 2, 150, 150);

  fill(255);
  textAlign(CENTER, CENTER);
  textSize(40);
  text("GAME OVER", width / 2, 120);

  textSize(20);
  text("Press R to Restart", width / 2, 170);
}


// ======================================================
// WIN SCREEN
// ======================================================

function showWinScreen() {
  fill(0, 200);
  rect(0, 0, width, height);

  fill(255);
  textAlign(CENTER, CENTER);
  textSize(40);
  text("LEVEL CLEAR!", width / 2, 120);

  textSize(22);
  text("Level " + level + " complete", width / 2, 170);

  textSize(18);
  text("Press N for Next Level", width / 2, 220);
  text("Press R to Restart from Level 1", width / 2, 255);
}


// ======================================================
// CONTROLS
// ======================================================

function keyPressed() {
  if (!gameStarted && keyCode === 32) {
    startGame();
    return false;
  }

  if (gameWon && (key === "n" || key === "N")) {
    userStartAudio();
    startLevel(level + 1);
    return false;
  }

  if ((gameOver || gameWon) && (key === "r" || key === "R")) {
    userStartAudio();
    totalScore = 0;
    startLevel(1);
    return false;
  }

  return false;
}

function mousePressed() {
  if (!gameStarted) {
    if (
      mouseX > width / 2 - 90 &&
      mouseX < width / 2 + 90 &&
      mouseY > 440 &&
      mouseY < 490
    ) {
      startGame();
    }
  }
}