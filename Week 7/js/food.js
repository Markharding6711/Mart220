class Food {
  constructor(type, x, y) {

    this.type = type;
    this.x = x;
    this.y = y;

    this.size = 50;
    this.active = true;

    // Assign image + score based on type
    if (type === "apple") {
      this.image = appleImg;
      this.points = 100;
    }

    if (type === "banana") {
      this.image = bananaImg;
      this.points = 200;
    }

    if (type === "cherry") {
      this.image = cherryImg;
      this.points = 300;
    }

    if (type === "orange") {
      this.image = orangeImg;
      this.points = 400;
    }

    if (type === "strawberry") {
      this.image = strawberryImg;
      this.points = 500;
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
}