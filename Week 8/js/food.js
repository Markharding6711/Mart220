class Food {

  constructor(type) {

    this.type = type;
    this.size = 50;

    if (type === "apple") {
      this.image = appleImg;
    }

    if (type === "banana") {
      this.image = bananaImg;
    }

    if (type === "cherry") {
      this.image = cherryImg;
    }

    if (type === "strawberry") {
      this.image = strawberryImg;
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
      this.size/2 + playerSize/2;
  }

}