function setup() {
  createCanvas(540, 540);
  backColor = random(20);
  minBri = (backColor / 255) * 100;
  background(backColor);
  noLoop();
  mainColor = (Math.random() * 720) % 360;
  secondaryColor = (mainColor + 180) % 360;
  colorMode(HSB);
}

const circles = [];
const minRadius = 2;
const maxRadius = 100;
const totalCircles = 1000;
const createCircleAttempts = 500;
let mainColor, secondaryColor, backColor, minBri;

function createCircle() {
  let newCircle;
  let circleSafeToDraw = false;
  for (let tries = 0; tries < createCircleAttempts; tries++) {
    newCircle = {
      x: Math.round((Math.random() - 0.5) * width),
      y: Math.round((Math.random() - 0.5) * height),
      radius: minRadius,
    };

    if (doesCircleHaveACollision(newCircle)) {
      continue;
    } else {
      circleSafeToDraw = true;
      break;
    }
  }

  if (!circleSafeToDraw) {
    return;
  }

  for (let radiusSize = minRadius; radiusSize < maxRadius; radiusSize++) {
    newCircle.radius = radiusSize;
    if (doesCircleHaveACollision(newCircle)) {
      newCircle.radius--;
      break;
    }
  }

  circles.push(newCircle);
  drawCircle(newCircle);
}

function drawCircle(circle) {
  let noiseAmp = random(3, 10);
  let thetaStep = random(3, 10) / 100;
  let hue = Math.random() > 0.5 ? mainColor : secondaryColor;
  let radius = circle.radius - noiseAmp / 2;
  noStroke();
  for (let i = radius; i > 0; i -= noiseAmp / 2) {
    let bri = map(i, radius, 0, minBri, 100);
    let sat = i == radius ? 0 : map(i, radius, 0, 100, 20);
    fill(hue, sat, bri);
    beginShape();
    for (let theta = 0; theta < 2 * PI; theta += thetaStep) {
      let r = i + (Math.random() - 0.5) * noiseAmp;
      let x = circle.x + r * cos(theta);
      let y = circle.y + r * sin(theta);
      vertex(x, y);
    }
    endShape(CLOSE);
    //ellipse(circle.x, circle.y, i * 2, i * 2);
  }
}

function doesCircleHaveACollision(circle) {
  for (let i = 0; i < circles.length; i++) {
    let otherCircle = circles[i];
    let a = circle.radius + otherCircle.radius;
    if (a >= dist(circle.x, circle.y, otherCircle.x, otherCircle.y)) {
      return true;
    }
  }
  if (
    circle.x + circle.radius >= width / 2 ||
    circle.x - circle.radius <= -width / 2
  ) {
    return true;
  }
  if (
    circle.y + circle.radius >= height / 2 ||
    circle.y - circle.radius <= -height / 2
  ) {
    return true;
  }
  return false;
}

function draw() {
  translate(width / 2, height / 2);
  scale(1, -1);

  for (let i = 0; i < totalCircles; i++) {
    createCircle();
  }
}
