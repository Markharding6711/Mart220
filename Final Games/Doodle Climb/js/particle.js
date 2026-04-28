class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;

    this.vx = random(-3, 3);
    this.vy = random(-4, 1);

    this.size = random(4, 8);

    this.birthTime = millis();
    this.lifespan = 500;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += 0.08;
  }

  display() {
    let age = millis() - this.birthTime;
    let alpha = map(age, 0, this.lifespan, 255, 0);

    noStroke();
    fill(255, 80, 80, alpha);
    circle(this.x, this.y, this.size);
  }

  isFinished() {
    return millis() - this.birthTime >= this.lifespan;
  }
}