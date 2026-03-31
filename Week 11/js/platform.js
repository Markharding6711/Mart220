class Platform {
  constructor(x, y, w, h, type = "normal") {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;

    this.type = type;
    this.broken = false;

    this.speed = random(1, 2);
    this.direction = random([-1, 1]);

    this.scale = random(0.9, 1.2);
  }

  update() {
    if (this.type === "moving") {
      this.x += this.speed * this.direction;

      if (this.x < 0 || this.x + this.w * this.scale > width) {
        this.direction *= -1;
      }
    }
  }

  display() {
    if (this.broken) return;

    push();
    imageMode(CORNER);

    if (cloudImg) {
      image(
        cloudImg,
        this.x,
        this.y,
        this.w * this.scale,
        this.h * this.scale
      );
    } else {
      fill(255);
      rect(this.x, this.y, this.w, this.h, 10);
    }

    pop();
  }
}