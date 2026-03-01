class Platform {
  constructor(x, y, w, h, type = "normal") {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;

    this.type = type; // normal, moving, breakable
    this.broken = false;

    this.speed = random(1, 2);
    this.direction = random([-1, 1]);
  }

  update() {

    if (this.type === "moving") {
      this.x += this.speed * this.direction;

      if (this.x < 0 || this.x + this.w > width) {
        this.direction *= -1;
      }
    }
  }

  display() {

    if (this.broken) return;

    if (this.type === "normal") {
      fill(80, 200, 120); // green
    }

    if (this.type === "moving") {
      fill(80, 150, 255); // blue
    }

    if (this.type === "breakable") {
      fill(255, 200, 0); // yellow
    }

    rect(this.x, this.y, this.w, this.h, 10);
  }
}