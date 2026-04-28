class Food {
  constructor(type, startY = null) {
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

    this.relocate(startY);
  }

  display() {
    image(this.image, this.x, this.y, this.size, this.size);
  }

  relocate(startY = null) {
    this.x = random(70, width - 70);

    if (startY !== null) {
      this.y = startY;
    } else {
      this.y = random(-1400, -500);
    }
  }

  collide() {
    return dist(playerX, playerY, this.x, this.y) <
      this.size / 2 + playerSize / 2;
  }
}