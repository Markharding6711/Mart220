// ======================================================
// GAME OBJECTS
// ======================================================

let platforms = [];
let enemies = [];
let fruits = [];
let particles = [];
let floatingTexts = [];
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
// FESTIVAL MENU / PAUSE / IDLE STATE
// ======================================================

let gameState = "menu"; // menu, playing, paused
let lastInputTime = 0;
let idleLimit = 120000;


// ======================================================
// TARGET FRUIT OBJECTIVE
// ======================================================

let targetFruitType = "banana";
let targetFruitName = "Bananas";


// ======================================================
// LEVEL INTRO POLISH
// ======================================================

let levelIntro = false;
let levelIntroTimer = 0;
let levelIntroDuration = 2000;


// ======================================================
// JUICE / GAME FEEL
// ======================================================

let screenShake = 0;
let hitStop = 0;
let combo = 0;
let jumpStreak = 0;
let levelCompleteTriggered = false;


// ======================================================
// BACKGROUND IMAGES
// ======================================================

let skyImg;
let cloudsFarImg;
let cloudsMidImg;
let cloudsNearImg;
let cloudsFrontImg;


// ======================================================
// IMAGES
// ======================================================

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
  skyImg = loadImage("images/backgrounds/sky.png");
  cloudsFarImg = loadImage("images/backgrounds/clouds_far.png");
  cloudsMidImg = loadImage("images/backgrounds/clouds_mid.png");
  cloudsNearImg = loadImage("images/backgrounds/clouds_near.png");
  cloudsFrontImg = loadImage("images/backgrounds/clouds_front.png");

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
  lastInputTime = millis();
}


// ======================================================
// BACKGROUND
// ======================================================

function drawParallaxBackground() {
  image(skyImg, width / 2, height / 2, width, height);
  image(cloudsFarImg, width / 2, height / 2, width, height);

  let heightTint = map(heightScore, 0, 5000, 0, 35);
  heightTint = constrain(heightTint, 0, 35);

  tint(255, 255 - heightTint, 255 - heightTint);

  let midOffset = map(sin(frameCount * 0.012), -1, 1, 0, 8);
  let nearOffset = map(sin(frameCount * 0.016), -1, 1, 0, 14);
  let frontOffset = map(sin(frameCount * 0.02), -1, 1, 0, 20);

  image(cloudsMidImg, width / 2, height / 2 + midOffset, width, height);
  image(cloudsNearImg, width / 2, height / 2 + nearOffset, width, height);
  image(cloudsFrontImg, width / 2, height / 2 + frontOffset, width, height);

  noTint();
}


// ======================================================
// LEVEL GOALS
// ======================================================

function setLevelGoals() {
  if (level <= 6) {
    levelKillGoal = 5 + (level - 1) * 5;
    levelFruitGoal = (level - 1) * 5;
  } else {
    levelKillGoal = 30 + (level - 6) * 10;
    levelFruitGoal = 25 + (level - 6) * 10;
  }
}

function chooseTargetFruit() {
  let possibleTargets = [
    { type: "banana", name: "Bananas" },
    { type: "cherry", name: "Cherries" },
    { type: "strawberry", name: "Strawberries" },
    { type: "orange", name: "Oranges" }
  ];

  let chosen = random(possibleTargets);

  targetFruitType = chosen.type;
  targetFruitName = chosen.name;
}

function randomPlatformType() {
  let roll = random();

  if (level >= 2 && roll < 0.035) {
    return "golden";
  }

  if (roll < 0.14) {
    return "boost";
  }

  if (roll < 0.38) {
    return "moving";
  }

  return "normal";
}


// ======================================================
// START LEVEL / GAME
// ======================================================

function startLevel(newLevel) {
  level = newLevel;
  setLevelGoals();
  chooseTargetFruit();

  heightScore = 0;
  foodsCollected = 0;
  enemiesKilled = 0;
  combo = 0;
  jumpStreak = 0;
  hitStop = 0;
  levelCompleteTriggered = false;

  platforms = [];
  enemies = [];
  fruits = [];
  particles = [];
  floatingTexts = [];

  resetPlayer();

  platforms.push(new Platform(width / 2 - 60, height - 80, 120, 20, "normal"));

  for (let i = 0; i < 8; i++) {
    let y = height - i * 80;
    platforms.push(new Platform(random(width - 120), y, 120, 20, randomPlatformType()));
  }

  spawnFruits();

  gameOver = false;
  gameWon = false;
  gameStarted = true;
  gameState = "playing";

  levelIntro = true;
  levelIntroTimer = millis();
  lastInputTime = millis();

  if (backgroundMusic && !backgroundMusic.isPlaying()) {
    backgroundMusic.loop();
  }
}

function startGame() {
  userStartAudio();
  totalScore = 0;
  startLevel(1);
}

function returnToMainMenu() {
  gameState = "menu";
  gameStarted = false;
  gameOver = false;
  gameWon = false;
  levelIntro = false;
  combo = 0;
  jumpStreak = 0;
  hitStop = 0;

  if (backgroundMusic && backgroundMusic.isPlaying()) {
    backgroundMusic.stop();
  }
}

function exitGame() {
  if (typeof require !== "undefined") {
    const { ipcRenderer } = require("electron");
    ipcRenderer.send("quit-app");
  } else {
    window.close();
  }
}


// ======================================================
// DRAW
// ======================================================

function draw() {
  drawParallaxBackground();

  if (gameState === "playing" && millis() - lastInputTime > idleLimit) {
    returnToMainMenu();
  }

  if (gameState === "menu") {
    drawMainMenu();
    return;
  }

  if (gameState === "paused") {
    drawPauseMenu();
    return;
  }

  if (gameOver) {
    showGameOver();
    return;
  }

  if (gameWon) {
    handleParticles();
    handleFloatingTexts();
    showWinScreen();
    return;
  }

  if (levelIntro) {
    showLevelIntro();

    if (millis() - levelIntroTimer > levelIntroDuration) {
      levelIntro = false;
    }

    return;
  }

  push();

  if (screenShake > 0) {
    translate(random(-screenShake, screenShake), random(-screenShake, screenShake));
    screenShake *= 0.85;

    if (screenShake < 0.5) {
      screenShake = 0;
    }
  }

  if (hitStop > 0) {
    hitStop--;

    displayFrozenWorld();

    pop();

    handleFloatingTexts();
    drawUI();
    return;
  }

  handlePlayerMovement();
  handlePlatforms();
  handleFruits();
  handleEnemies();
  handleParticles();

  drawPlayerShadow();
  updatePlayerAnimation();

  pop();

  handleFloatingTexts();
  drawUI();

  if (invincible && millis() - invincibleTimer > 1000) {
    invincible = false;
  }

  checkWinCondition();
}


// ======================================================
// MAIN MENU
// ======================================================

function drawMainMenu() {
  fill(0, 120);
  rect(0, 0, width, height);

  fill(255);
  stroke(0);
  strokeWeight(5);
  textAlign(CENTER, CENTER);

  textSize(46);
  text("DOODLE CLIMB", width / 2, 75);

  strokeWeight(2);
  textSize(18);
  text("A vertical arcade platformer about climbing, momentum, and survival.", width / 2, 125);

  textSize(16);
  text("Created by Mark Harding", width / 2, 155);

  textSize(15);
  text("Development Team:", width / 2, 195);
  text("Design, Programming, Art Direction, and Level Tuning: Mark Harding", width / 2, 220);
  text("Built with p5.js, JavaScript, and Electron", width / 2, 245);

  textSize(15);
  text("Controls:", width / 2, 295);
  text("Arrow Keys = Move Left / Right", width / 2, 320);
  text("Stomp enemies to defeat them", width / 2, 345);
  text("ESC = Pause Menu", width / 2, 370);

  noStroke();

  fill(255);
  rect(width / 2 - 90, 415, 180, 50, 10);

  fill(0);
  textSize(24);
  text("START", width / 2, 440);

  fill(255);
  rect(width / 2 - 90, 485, 180, 50, 10);

  fill(0);
  textSize(24);
  text("EXIT", width / 2, 510);
}


// ======================================================
// PAUSE MENU
// ======================================================

function drawPauseMenu() {
  fill(0, 190);
  rect(0, 0, width, height);

  fill(255);
  stroke(0);
  strokeWeight(4);
  textAlign(CENTER, CENTER);

  textSize(42);
  text("PAUSED", width / 2, 170);

  strokeWeight(2);
  textSize(20);
  text("Press ESC to Resume", width / 2, 240);
  text("Press M to Return to Main Menu", width / 2, 280);

  noStroke();

  fill(255);
  rect(width / 2 - 100, 335, 200, 50, 10);

  fill(0);
  textSize(22);
  text("MAIN MENU", width / 2, 360);
}


// ======================================================
// FROZEN WORLD FOR HIT STOP
// ======================================================

function displayFrozenWorld() {
  for (let p of platforms) {
    p.display();
  }

  for (let f of fruits) {
    f.display();
  }

  for (let e of enemies) {
    e.display();
  }

  for (let pt of particles) {
    pt.display();
  }

  drawPlayerShadow();
  updatePlayerAnimation();
}


// ======================================================
// LEVEL INTRO SCREEN
// ======================================================

function showLevelIntro() {
  fill(0, 220);
  rect(0, 0, width, height);

  fill(255);
  stroke(0);
  strokeWeight(4);
  textAlign(CENTER, CENTER);

  textSize(44);
  text("LEVEL " + level, width / 2, 160);

  strokeWeight(2);
  textSize(24);
  text("Goals", width / 2, 230);

  textSize(20);
  text("Kills: " + levelKillGoal, width / 2, 285);

  if (levelFruitGoal > 0) {
    text("Collect " + targetFruitName + ": " + levelFruitGoal, width / 2, 320);
  } else {
    text("Fruit Goal: None Yet", width / 2, 320);
  }

  textSize(16);
  text("Golden clouds are rare. Streaks and combos give bonus points.", width / 2, 390);

  noStroke();
}


// ======================================================
// PLAYER SHADOW
// ======================================================

function drawPlayerShadow() {
  noStroke();
  fill(0, 70);
  ellipse(playerX, playerY + 35, 42, 10);
}


// ======================================================
// CLUTCH SAVE
// ======================================================

function triggerClutchSave() {
  screenShake = 12;
  hitStop = 8;
  createParticles(playerX, playerY, 30);
  addFloatingText("CLUTCH SAVE!", playerX, playerY - 60);
  totalScore += 100;
}


// ======================================================
// LEVEL COMPLETE JUICE
// ======================================================

function triggerLevelCompleteBurst() {
  if (levelCompleteTriggered) return;

  levelCompleteTriggered = true;

  screenShake = 14;
  hitStop = 10;

  for (let i = 0; i < 6; i++) {
    createParticles(playerX + random(-80, 80), playerY + random(-80, 80), 12);
  }

  addFloatingText("LEVEL COMPLETE!", width / 2, height / 2 - 80);

  if (playerLives === maxLives) {
    addFloatingText("PERFECT!", width / 2, height / 2 - 120);
    totalScore += 500;
  }
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
      combo = 0;
      jumpStreak++;

      let streakBonus = jumpStreak * 5;
      totalScore += streakBonus;

      if (jumpStreak > 2) {
        addFloatingText("STREAK x" + jumpStreak, playerX, playerY - 55);
      }

      if (p.type === "golden") {
        velocityY = jumpForce * 2;
        screenShake = 10;
        hitStop = 6;
        totalScore += 500;
        createParticles(playerX, playerY + 25, 35);
        addFloatingText("GOLDEN BOOST!", playerX, playerY - 65);

        for (let i = enemies.length - 1; i >= 0; i--) {
          if (dist(playerX, playerY, enemies[i].x, enemies[i].y) < 180) {
            createParticles(enemies[i].x, enemies[i].y, 20);
            enemies.splice(i, 1);
            enemiesKilled++;
            totalScore += 200;
          }
        }
      }

      else if (p.type === "boost") {
        velocityY = jumpForce * 1.45;
        screenShake = 4;
        createParticles(playerX, playerY + 25, 12);
        addFloatingText("BOOST!", playerX, playerY - 45);
      }

      else {
        velocityY = jumpForce;
      }

      if (jumpSound) {
        jumpSound.rate(random(0.95, 1.08));
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

    let newY = highest - random(70, 125);
    platforms.push(new Platform(random(width - 120), newY, 120, 20, randomPlatformType()));
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

function createParticles(x, y, amount = null) {
  let particleAmount = amount;

  if (particleAmount === null) {
    particleAmount = floor(random(6, 11));
  }

  for (let i = 0; i < particleAmount; i++) {
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
// FLOATING TEXT
// ======================================================

function addFloatingText(txt, x, y) {
  floatingTexts.push({
    text: txt,
    x: x,
    y: y,
    alpha: 255,
    life: 60
  });
}

function handleFloatingTexts() {
  for (let i = floatingTexts.length - 1; i >= 0; i--) {
    let ft = floatingTexts[i];

    fill(255, 255, 255, ft.alpha);
    stroke(0, ft.alpha);
    strokeWeight(3);
    textAlign(CENTER, CENTER);
    textSize(22);
    text(ft.text, ft.x, ft.y);

    noStroke();

    ft.y -= 1;
    ft.alpha -= 4;
    ft.life--;

    if (ft.life <= 0 || ft.alpha <= 0) {
      floatingTexts.splice(i, 1);
    }
  }
}


// ======================================================
// FRUITS
// ======================================================

function getAppleBonusChance() {
  if (level <= 3) {
    return 0.12;
  }

  if (level <= 8) {
    return 0.22;
  }

  return 0.35;
}

function spawnFruits() {
  fruits = [];

  fruits.push(new Food(targetFruitType, -500));
  fruits.push(new Food(targetFruitType, -1100));

  if (targetFruitType !== "banana") {
    fruits.push(new Food("banana", -1600));
  }

  if (targetFruitType !== "cherry") {
    fruits.push(new Food("cherry", -2050));
  }

  if (targetFruitType !== "strawberry") {
    fruits.push(new Food("strawberry", -2500));
  }

  if (targetFruitType !== "orange") {
    fruits.push(new Food("orange", -2950));
  }

  fruits.push(new Food("apple_bad", -3400));

  if (random() < getAppleBonusChance()) {
    fruits.push(new Food("apple", -3900));
  }
}

function relocateAppleBonus(f) {
  if (random() < getAppleBonusChance()) {
    f.x = random(70, width - 70);
    f.y = random(-4200, -2000);
  } else {
    f.x = random(70, width - 70);
    f.y = random(-7000, -4500);
  }
}

function handleFruits() {
  for (let f of fruits) {
    f.display();

    if (f.collide()) {
      if (f.type === "apple_bad") {
        screenShake = 8;
        hitStop = 4;
        addFloatingText("-1 LIFE", f.x, f.y - 35);
        loseLife(false);
        f.relocate();
      }

      else if (f.type === "apple") {
        screenShake = 5;
        hitStop = 3;

        if (playerLives < maxLives) {
          playerLives++;
          addFloatingText("+1 LIFE", f.x, f.y - 35);
        } else {
          totalScore += 150;
          addFloatingText("+150", f.x, f.y - 35);
        }

        if (goodFoodSound) {
          goodFoodSound.rate(random(1.05, 1.2));
          goodFoodSound.play();
        }

        relocateAppleBonus(f);
      }

      else {
        totalScore += 100;

        if (f.type === targetFruitType) {
          foodsCollected++;
          addFloatingText("+1 " + targetFruitName, f.x, f.y - 35);
        } else {
          addFloatingText("+100", f.x, f.y - 35);
        }

        screenShake = 2;

        if (goodFoodSound) {
          goodFoodSound.rate(random(0.95, 1.12));
          goodFoodSound.play();
        }

        f.relocate();
      }
    }
  }
}


// ======================================================
// ENEMY SYSTEM
// ======================================================

function getEnemySpawnRate() {
  if (level <= 3) {
    return 260;
  }

  if (level <= 8) {
    return 220;
  }

  return 180;
}

function maybeSpawnMoreEnemies() {
  if (gameOver || gameWon || levelIntro || gameState !== "playing") return;

  let spawnRate = getEnemySpawnRate();

  if (frameCount % spawnRate !== 0) return;

  if (enemies.length >= 3) return;

  let availableTypes = [];

  if (level >= 1 && level <= 3) {
    availableTypes.push(1);
  }

  if (level >= 4 && level <= 8) {
    availableTypes.push(1);
    availableTypes.push(2);
  }

  if (level >= 9) {
    availableTypes.push(1);
    availableTypes.push(2);
    availableTypes.push(3);
  }

  if (availableTypes.length === 0) return;

  let type = random(availableTypes);
  enemies.push(new Enemy(random(60, width - 60), -80, type));
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
      combo++;

      let stompDamage = 50;

      if (e.type === 1) {
        stompDamage = 100;
      }

      e.takeHit(stompDamage);
      e.hitCooldown = millis() + 250;

      velocityY = jumpForce * 1.25;
      screenShake = 5;
      hitStop = 4;

      createParticles(e.x, e.y, 10);
      addFloatingText("ENEMY BOOST!", playerX, playerY - 45);
      addFloatingText("-" + stompDamage, e.x, e.y - 45);

      if (combo > 1) {
        addFloatingText("COMBO x" + combo, e.x, e.y - 75);
      }

      if (e.health <= 0) {
        let comboScore = 200 * combo;

        screenShake = 10;
        hitStop = 7;

        createParticles(e.x, e.y, 30);
        addFloatingText("+" + comboScore, e.x, e.y - 65);

        enemies.splice(i, 1);
        enemiesKilled++;
        totalScore += comboScore;
      }

      continue;
    }

    if (touchingEnemy) {
      combo = 0;
      jumpStreak = 0;
      screenShake = 8;
      hitStop = 5;
      addFloatingText("-1 LIFE", playerX, playerY - 45);
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
    triggerLevelCompleteBurst();
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

  fill(0);
  textAlign(LEFT, CENTER);
  textSize(20);

  text("Lives: " + playerLives, 20, 30);

  if (playerLives === 1) {
    fill(255, 0, 0);
    stroke(0);
    strokeWeight(3);
    text("LAST LIFE!", 20, 55);
    noStroke();
    fill(0);
  }

  text("Height: " + floor(heightScore), 20, 85);
  text("Total Score: " + floor(totalScore), 20, 115);
  text("Level: " + level, 20, 145);

  if (jumpStreak > 2) {
    fill(0, 140, 255);
    stroke(0);
    strokeWeight(3);
    text("Streak x" + jumpStreak, 20, 175);
    noStroke();
    fill(0);
  }

  if (combo > 1) {
    fill(255, 180, 0);
    stroke(0);
    strokeWeight(3);
    text("Combo x" + combo, 20, 205);
    noStroke();
    fill(0);
  }

  let fruitText;

  if (levelFruitGoal > 0) {
    fruitText = targetFruitName + ": " + foodsCollected + " / " + levelFruitGoal;
  } else {
    fruitText = targetFruitName + ": No Goal";
  }

  let killText = "Kills: " + enemiesKilled + " / " + levelKillGoal;

  if (foodsCollected >= levelFruitGoal) {
    fruitText += " COMPLETE";
  }

  if (enemiesKilled >= levelKillGoal) {
    killText += " COMPLETE";
  }

  textAlign(RIGHT, CENTER);

  fill(0);
  text(fruitText, width - 20, 30);
  text(killText, width - 20, 60);
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

  image(deathFrames[currentFrame], width / 2, height / 2, 130, 130);

  fill(255);
  stroke(0);
  strokeWeight(4);
  textAlign(CENTER, CENTER);

  textSize(40);
  text("GAME OVER", width / 2, 95);

  strokeWeight(2);
  textSize(20);
  text("Level Reached: " + level, width / 2, 170);
  text("Total Score: " + floor(totalScore), width / 2, 205);
  text(targetFruitName + " Collected: " + foodsCollected, width / 2, 240);
  text("Enemies Defeated: " + enemiesKilled, width / 2, 275);

  textSize(18);
  text("Press R to Restart", width / 2, 340);
  text("Press M for Main Menu", width / 2, 375);

  noStroke();
}


// ======================================================
// WIN SCREEN
// ======================================================

function showWinScreen() {
  fill(0, 200);
  rect(0, 0, width, height);

  fill(255);
  stroke(0);
  strokeWeight(4);
  textAlign(CENTER, CENTER);

  textSize(40);
  text("LEVEL CLEAR!", width / 2, 95);

  strokeWeight(2);
  textSize(22);
  text("Level " + level + " complete", width / 2, 145);

  textSize(18);
  text("Total Score: " + floor(totalScore), width / 2, 200);
  text(targetFruitName + ": " + foodsCollected + " / " + levelFruitGoal, width / 2, 230);
  text("Enemies Defeated: " + enemiesKilled + " / " + levelKillGoal, width / 2, 260);

  if (playerLives === maxLives) {
    fill(255, 220, 0);
    text("PERFECT CLEAR BONUS!", width / 2, 295);
    fill(255);
  }

  textSize(18);
  text("Press N for Next Level", width / 2, 355);
  text("Press R to Restart from Level 1", width / 2, 385);
  text("Press M for Main Menu", width / 2, 415);

  noStroke();
}


// ======================================================
// CONTROLS
// ======================================================

function keyPressed() {
  lastInputTime = millis();

  if (gameState === "menu" && keyCode === 32) {
    startGame();
    return false;
  }

  if (keyCode === ESCAPE) {
    if (gameState === "playing" && !gameOver && !gameWon) {
      gameState = "paused";
    } else if (gameState === "paused") {
      gameState = "playing";
    }
    return false;
  }

  if (gameState === "paused" && (key === "m" || key === "M")) {
    returnToMainMenu();
    return false;
  }

  if ((gameOver || gameWon) && (key === "m" || key === "M")) {
    returnToMainMenu();
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
  lastInputTime = millis();

  if (gameState === "menu") {
    if (
      mouseX > width / 2 - 90 &&
      mouseX < width / 2 + 90 &&
      mouseY > 415 &&
      mouseY < 465
    ) {
      startGame();
      return;
    }

    if (
      mouseX > width / 2 - 90 &&
      mouseX < width / 2 + 90 &&
      mouseY > 485 &&
      mouseY < 535
    ) {
      exitGame();
      return;
    }
  }

  if (gameState === "paused") {
    if (
      mouseX > width / 2 - 100 &&
      mouseX < width / 2 + 100 &&
      mouseY > 335 &&
      mouseY < 385
    ) {
      returnToMainMenu();
      return;
    }
  }
}