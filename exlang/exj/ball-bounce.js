let balls = [];
const boundaryRadius = 300; // radius of the boundary sphere

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  // Create 100 balls
  for (let i = 0; i < 100; i++) {
    // Ensure balls are created fully inside the sphere.
    // We subtract a margin equal to the ball's radius (here, 10) from the boundary.
    let pos = randomPointInSphere(boundaryRadius - 10);
    let vel = p5.Vector.random3D().mult(random(1, 3));
    let radius = 10;
    balls.push(new Ball(pos, vel, radius));
  }
}

function draw() {
  background(0);

  // Slowly rotate the scene around the Y-axis
  rotateY(frameCount * 0.005);

  // Draw the boundary sphere (wireframe style)
  noFill();
  stroke(255);
  sphere(boundaryRadius);

  // Update ball positions (including checking for boundary collisions)
  for (let ball of balls) {
    ball.update();
  }

  // Check and resolve collisions between all pairs of balls
  for (let i = 0; i < balls.length; i++) {
    for (let j = i + 1; j < balls.length; j++) {
      resolveCollision(balls[i], balls[j]);
    }
  }

  // Draw all balls
  for (let ball of balls) {
    ball.draw();
  }
}

// --- Ball class ---
class Ball {
  constructor(pos, vel, radius) {
    this.pos = pos;       // p5.Vector representing position
    this.vel = vel;       // p5.Vector representing velocity
    this.radius = radius; // radius of the ball
  }

  update() {
    // Update position based on velocity
    this.pos.add(this.vel);

    // Check collision with the spherical boundary.
    // If (distance from center + ball radius) > boundaryRadius, then the ball is out-of-bounds.
    let d = this.pos.mag();
    if (d + this.radius > boundaryRadius) {
      // Compute the outward normal from the center
      let normal = this.pos.copy().normalize();
      // Reflect the velocity: v = v - 2*(v · normal)*normal
      let dot = this.vel.dot(normal);
      // We use a copy of normal so that we do not modify it during the multiplication.
      this.vel.sub(normal.copy().mult(2 * dot));
      // Reposition the ball exactly on the boundary (just inside)
      this.pos = normal.copy().mult(boundaryRadius - this.radius);
    }
  }

  draw() {
    push();
    translate(this.pos.x, this.pos.y, this.pos.z);
    noStroke();
    fill(255, 255, 0); // yellow color
    sphere(this.radius);
    pop();
  }
}

// --- Collision resolution between two balls ---
function resolveCollision(ball1, ball2) {
  // Compute the vector between the two ball centers
  let distVec = p5.Vector.sub(ball2.pos, ball1.pos);
  let distance = distVec.mag();
  let minDist = ball1.radius + ball2.radius;

  // Check for collision (overlap)
  if (distance < minDist && distance > 0) {
    // Calculate how much they overlap
    let overlap = minDist - distance;
    // Normal vector pointing from ball1 to ball2
    let n = distVec.copy().normalize();

    // Reposition each ball by half the overlap distance in opposite directions
    ball1.pos.add(n.copy().mult(-overlap / 2));
    ball2.pos.add(n.copy().mult(overlap / 2));

    // Compute relative velocity along the collision normal
    let relativeVelocity = p5.Vector.sub(ball1.vel, ball2.vel);
    let speed = relativeVelocity.dot(n);

    // Only adjust velocities if the balls are moving toward each other
    if (speed < 0) {
      // For equal-mass elastic collisions, swap the components along the normal.
      let impulse = n.copy().mult(speed);
      ball1.vel.sub(impulse);
      ball2.vel.add(impulse);
    }
  }
}

// --- Utility: generate a random point uniformly distributed inside a sphere ---
function randomPointInSphere(maxRadius) {
  // Generate random spherical coordinates:
  // theta: angle around the Y-axis (0 to TWO_PI)
  // phi: angle from the positive Z-axis (0 to PI)
  let theta = random(0, TWO_PI);
  let phi = acos(random(-1, 1));
  // For uniform distribution in volume, use cube root of a random value
  let r = Math.cbrt(random()) * maxRadius;
  // Convert spherical coordinates to Cartesian coordinates
  let x = r * sin(phi) * cos(theta);
  let y = r * sin(phi) * sin(theta);
  let z = r * cos(phi);
  return createVector(x, y, z);
}
