class Enemy {
  constructor(x, y, type) {
    this.x = x;
    this.y = y;
    this.type = type;

    this.size = 60;

    // different health by enemy type
    if (this.type === 1) {
      this.health = 100;
    } else if (this.type === 2) {
      this.health = 200;
    } else {
      this.health = 300;
    }

    this.frame = 0;

    this.dir = 1;
    this.speed = 2;

    this.diagX = random([-1, 1]);
    this.diagY = 1;

    this.hitCooldown = 0;
  }

  update() {
    // enemy1: left and right
    if (this.type === 1) {
      this.x += this.speed * this.dir;

      if (this.x < 30 || this.x > width - 30) {
        this.dir *= -1;
      }
    }

    // enemy2: faster left and right
    if (this.type === 2) {
      this.x += (this.speed + 1) * this.dir;

      if (this.x < 30 || this.x > width - 30) {
        this.dir *= -1;
      }
    }

    // enemy3: diagonal movement
    if (this.type === 3) {
      this.x += this.speed * this.diagX;
      this.y += this.speed * this.diagY;

      if (this.x < 30 || this.x > width - 30) {
        this.diagX *= -1;
      }

      if (this.y < 30 || this.y > height - 100) {
        this.diagY *= -1;
      }
    }

    if (frameCount % 20 === 0) {
      this.frame = 1 - this.frame;
    }
  }

  display() {
    let img;

    if (this.type === 1) {
      img = this.frame === 0 ? enemy1[0] : enemy1[1];
    } else if (this.type === 2) {
      img = this.frame === 0 ? enemy2[0] : enemy2[1];
    } else {
      img = this.frame === 0 ? enemy3[0] : enemy3[1];
    }

    image(img, this.x, this.y, this.size, this.size);

    let maxHealth;
    if (this.type === 1) {
      maxHealth = 100;
    } else if (this.type === 2) {
      maxHealth = 200;
    } else {
      maxHealth = 300;
    }

    let barW = 40;
    let barH = 6;
    let healthW = map(this.health, 0, maxHealth, 0, barW);

    noStroke();
    fill(100);
    rect(this.x - barW / 2, this.y - 42, barW, barH);

    fill(255, 0, 0);
    rect(this.x - barW / 2, this.y - 42, healthW, barH);
  }

  collide() {
    return dist(playerX, playerY, this.x, this.y) <
      this.size / 2 + playerSize / 2;
  }
}