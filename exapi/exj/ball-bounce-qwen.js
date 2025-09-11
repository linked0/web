let balls = [];
let numBalls = 100;
let sphereRadius = 200;
let angleX = 0;
let angleY = 0;

function setup() {
  createCanvas(600, 600, WEBGL);
  // Initialize balls
  for (let i = 0; i < numBalls; i++) {
    balls.push(new Ball());
  }
}

function draw() {
  background(51);

  // Rotate the sphere
  rotateX(angleX);
  rotateY(angleY);
  angleX += 0.01;
  angleY += 0.02;

  // Draw the sphere boundary
  noFill();
  stroke(255);
  sphere(sphereRadius);

  // Update and display balls
  for (let ball of balls) {
    ball.update();
    ball.checkCollision();
    ball.display();
  }
}

class Ball {
  constructor() {
    this.radius = random(5, 10);
    this.position = createVector(
      random(-sphereRadius + this.radius, sphereRadius - this.radius),
      random(-sphereRadius + this.radius, sphereRadius - this.radius),
      random(-sphereRadius + this.radius, sphereRadius - this.radius)
    );
    this.velocity = p5.Vector.random3D().mult(random(1, 3));
  }

  update() {
    this.position.add(this.velocity);
  }

  checkCollision() {
    // Check if the ball is outside the sphere
    if (this.position.mag() + this.radius > sphereRadius) {
      // Reflect the velocity vector based on the normal at the point of collision
      let normal = this.position.copy().normalize();
      this.velocity.reflect(normal).mult(0.9); // Slightly dampen the velocity
    }
  }

  display() {
    push();
    translate(this.position.x, this.position.y, this.position.z);
    noStroke();
    fill(255, 255, 0);
    sphere(this.radius);
    pop();
  }
}