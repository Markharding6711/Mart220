class Food {
  constructor(type, x, y) {

    this.type = type;
    this.x = x;
    this.y = y;

    this.size = 50;
    this.active = true;

    if (type === "apple") {
      this.image = appleImg;
      this.points = -20; // bad food
    }

    if (type === "banana") {
      this.image = bananaImg;
      this.points = 200;
    }

    if (type === "cherry") {
      this.image = cherryImg;
      this.points = 300;
    }

    if (type === "strawberry") {
      this.image = strawberryImg;
      this.points = 400;
    }
  }

  display() {
    if (!this.active) return;
    image(this.image, this.x, this.y, this.size, this.size);
  }

  collect() {
    this.active = false;
  }

  respawn() {
    this.x = random(50, width - 50);
    this.y = random(-600, -50);
    this.active = true;
  }

  collides(px, py, psize) {
    return dist(px, py, this.x, this.y) < this.size/2 + psize/2;
  }
}