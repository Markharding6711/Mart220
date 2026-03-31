class Food {
  constructor(type) {
    this.type = type;
    this.size = 50;

    if (type === "apple_bad") {
      this.image = appleBadImg;
    } else if (type === "apple") {
      this.image = appleImg;
    } else if (type === "banana") {
      this.image = bananaImg;
    } else if (type === "cherry") {
      this.image = cherryImg;
    } else if (type === "strawberry") {
      this.image = strawberryImg;
    } else if (type === "orange") {
      this.image = orangeImg;
    }

    this.relocate();
  }

  display() {
    image(this.image, this.x, this.y, this.size, this.size);
  }

  relocate() {
    this.x = random(50, width - 50);
    this.y = random(-600, -100);
  }

  collide() {
    return dist(playerX, playerY, this.x, this.y) <
      this.size / 2 + playerSize / 2;
  }
}