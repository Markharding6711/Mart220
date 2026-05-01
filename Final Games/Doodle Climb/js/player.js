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


// ======================================================
// LIVES SYSTEM
// ======================================================

let playerLives = 3;
let maxLives = 3;


// ======================================================
// DAMAGE + KNOCKBACK
// ======================================================

let invincible = false;
let invincibleTimer = 0;

let knockbackX = 12;
let knockbackY = -10;


// ======================================================
// PLAYER FUNCTIONS
// ======================================================

function resetPlayer() {
  playerX = width / 2;
  playerY = height - 150;
  velocityY = 0;

  playerLives = maxLives;

  playerState = "idle";
  currentAnimation = [];
  currentFrame = 0;
  playerDirection = 1;

  invincible = false;
  invincibleTimer = 0;
}

function resetPlayerPositionAfterLifeLost() {
  playerX = width / 2;
  playerY = height - 180;
  velocityY = jumpForce * 1.25;

  playerState = "hurt";
  currentAnimation = hurtFrames;
  currentFrame = 0;

  invincible = true;
  invincibleTimer = millis();
}

function loseLife(fromFall = false) {
  if (invincible || gameOver || gameWon) return;

  playerLives--;

  combo = 0;
  jumpStreak = 0;

  if (badFoodSound) {
    badFoodSound.play();
  }

  if (playerLives <= 0) {
    triggerDeath();
  } else {
    resetPlayerPositionAfterLifeLost();

    if (fromFall) {
      triggerClutchSave();
    }
  }
}

function handlePlayerMovement() {
  if (keyIsDown(LEFT_ARROW)) {
    playerX -= 5;
    playerDirection = -1;
  }

  if (keyIsDown(RIGHT_ARROW)) {
    playerX += 5;
    playerDirection = 1;
  }

  if (playerX < -playerSize / 2) {
    playerX = width + playerSize / 2;
  }

  if (playerX > width + playerSize / 2) {
    playerX = -playerSize / 2;
  }

  velocityY += gravity;
  playerY += velocityY;

  if (playerY < height / 2) {
    let diff = height / 2 - playerY;
    playerY = height / 2;

    heightScore += diff;
    totalScore += diff;

    for (let p of platforms) {
      p.y += diff;
    }

    for (let e of enemies) {
      e.y += diff;
    }

    for (let f of fruits) {
      f.y += diff;
    }

    for (let pt of particles) {
      pt.y += diff;
    }
  }

  if (playerY - playerSize / 2 > height) {
    loseLife(true);
  }
}

function damagePlayer(enemyX) {
  if (invincible || gameOver || gameWon) return;

  playerLives--;

  combo = 0;
  jumpStreak = 0;

  if (badFoodSound) {
    badFoodSound.play();
  }

  playerState = "hurt";
  currentAnimation = hurtFrames;
  currentFrame = 0;

  // bounce away from enemy
  if (playerX < enemyX) {
    playerX -= 35;
    playerDirection = -1;
  } else {
    playerX += 35;
    playerDirection = 1;
  }

  // bounce upward so player does not stay stuck inside enemy
  velocityY = jumpForce * 0.9;

  invincible = true;
  invincibleTimer = millis();

  if (playerLives <= 0) {
    triggerDeath();
  }
}

function updatePlayerAnimation() {
  push();

  translate(playerX, playerY);
  scale(playerDirection, 1);

  if (invincible && frameCount % 6 < 3) {
    tint(255, 120);
  }

  if (playerState === "hurt" && currentAnimation.length > 0) {
    if (frameCount % animationSpeed === 0) {
      currentFrame++;

      if (currentFrame >= currentAnimation.length) {
        playerState = "idle";
        currentFrame = 0;
      }
    }

    image(currentAnimation[currentFrame], 0, 0, playerSize, playerSize);
    noTint();
    pop();
    return;
  }

  if (velocityY < -2 && jumpFrames.length > 0) {
    let jumpIndex = floor(map(abs(velocityY), 0, 18, 0, jumpFrames.length - 1));
    jumpIndex = constrain(jumpIndex, 0, jumpFrames.length - 1);
    image(jumpFrames[jumpIndex], 0, 0, playerSize, playerSize);
    noTint();
    pop();
    return;
  }

  image(idleFrame, 0, 0, playerSize, playerSize);

  noTint();
  pop();
}