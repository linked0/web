let balls = [];
let numBalls = 100;
let sphereRadius = 300;
let rotationAngle = 0;

function setup() {
  createCanvas(800, 800, WEBGL);
  for (let i = 0; i < numBalls; i++) {
    balls.push(new Ball());
  }
}

function draw() {
  background(30);
  rotateX(rotationAngle);
  rotateY(rotationAngle);
  rotationAngle += 0.005;

  // Draw the sphere (transparent)
  noFill();
  stroke(255);
  strokeWeight(1);
  sphere(sphereRadius);

  // Update and display balls
  for (let ball of balls) {
    ball.update();
    ball.display();
  }
}

class Ball {
  constructor() {
    this.position = p5.Vector.random3D().mult(sphereRadius * 0.8); // Start inside the sphere
    this.velocity = p5.Vector.random3D().mult(3); // Random initial velocity
    this.radius = 10;
    this.color = color(255, 255, 0); // Yellow
  }

  update() {
    // Update position
    this.position.add(this.velocity);

    // Check for collision with the sphere
    let distanceFromCenter = this.position.mag();
    if (distanceFromCenter > sphereRadius - this.radius) {
      // Calculate normal vector at collision point
      let normal = this.position.copy().normalize();
      // Reflect velocity vector
      this.velocity = this.velocity.sub(normal.mult(2 * this.velocity.dot(normal)));
      // Reposition ball to stay inside the sphere
      this.position = normal.mult(sphereRadius - this.radius);
    }
  }

  display() {
    push();
    translate(this.position.x, this.position.y, this.position.z);
    noStroke();
    fill(this.color);
    sphere(this.radius);
    pop();
  }
}