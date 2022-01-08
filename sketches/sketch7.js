function setup() {
  createCanvas(540, 540);
  background(240);
  noLoop();
}

function points() {
  let numPoints = random(40, 60);
  let points = [];
  for (let i = 0; i < numPoints; i++) {
    let x = random(-width / 2, width / 2);
    let y = random(-height / 2, height / 2);
    points.push(createVector(x, y));
  }

  for (let i = 0; i < numPoints; i++) {
    for (let j = 0; j < numPoints; j++) {
      if (i == j) continue;
      drawingContext.setLineDash([random(10, 20), random(2, 10)]);
      stroke(random(100), 128);
      strokeWeight(random(0.2, 0.4));
      line(points[i].x, points[i].y, points[j].x, points[j].y);
    }
  }
}

function draw() {
  translate(width / 2, height / 2);
  scale(1, -1);
  points();
}
