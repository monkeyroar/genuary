let palette;
const cartesian = (...a) =>
  a.reduce((a, b) => a.flatMap((d) => b.map((e) => [d, e].flat())));

function setup() {
  createCanvas(540, 540);
  colorMode(HSB);
  palette = generatePalette();
  background(Math.random() * 30);
  noLoop();
}

function generatePalette() {
  let mainHue = (Math.random() * 720) % 360;
  let hues = [mainHue, (mainHue + 120) % 360, (mainHue + 240) % 360];
  let sats = [
    randomGaussian(25, 10),
    randomGaussian(50, 10),
    randomGaussian(75, 10),
  ];
  let bris = [80, 90, 100];
  let palette = cartesian(hues, sats, bris).map((col) =>
    color(col[0], col[1], col[2])
  );
  palette.push(color(255));
  return palette;
}

function draw() {
  let resolution = 100;
  let noiseFactor = 0.01;
  let flowField = [];
  let cellVisited = [];

  for (let i = -resolution; i < resolution * 2; i++) {
    flowField[i] = [];
    cellVisited[i] = [];
    for (let j = -resolution; j < resolution * 2; j++) {
      let n = noise(i * noiseFactor, j * noiseFactor);
      let rotateAng = map(n, 0, 1, 0, 4 * PI);
      flowField[i][j] = rotateAng;
      cellVisited[i][j] = false;
    }
  }

  let numCurves = 3000;
  noStroke();
  for (let i = 0; i < numCurves; i++) {
    let startX = Math.random() * width;
    let startY = Math.random() * height;
    drawCurve(
      resolution,
      flowField,
      cellVisited,
      startX,
      startY,
      i / numCurves
    );
  }
}

function downsample(resolution, vector) {
  let i = Math.floor(map(vector.x, 0, width, 0, resolution));
  let j = Math.floor(map(vector.y, 0, height, 0, resolution));
  return { i: i, j: j };
}

function generatePoints(
  resolution,
  flowField,
  cellVisited,
  startX,
  startY,
  points,
  oppositePoints,
  visitedCells,
  stagePercent
) {
  let x = startX;
  let y = startY;
  let stepLength = width / 1000;

  let curveWidthBounds = [];
  if (stagePercent > 0.75) {
    curveWidthBounds = [3, 3];
  } else if (stagePercent > 0.5) {
    curveWidthBounds = Math.random() > 0.5 ? [2, 10] : [1, 5];
  } else if (stagePercent > 0.25) {
    curveWidthBounds = Math.random() > 0.5 ? [5, 25] : [5, 15];
  } else {
    curveWidthBounds = Math.random() > 0.5 ? [10, 30] : [10, 20];
  }
  let curveWidth = random(curveWidthBounds[0], curveWidthBounds[1]);
  let numOfPoints = 500;

  for (let point = 0; point < numOfPoints; point++) {
    let pointVector = createVector(x, y);
    let pointGrid = downsample(resolution, pointVector);
    let rotateAng = flowField[pointGrid.i][pointGrid.j];
    let offsetVector = createVector(0, 1).rotate(rotateAng);

    if (cellVisited[pointGrid.i][pointGrid.j]) return;

    for (let k = 0; k <= Math.ceil(curveWidth); k++) {
      let offsetStep = offsetVector.copy().mult(k).add(pointVector);
      let offsetStepGrid = downsample(resolution, offsetStep);
      if (cellVisited[offsetStepGrid.i][offsetStepGrid.j]) return;
      visitedCells.push(offsetStepGrid);
    }

    offsetVector.mult(curveWidth).add(pointVector);
    points.push(pointVector);
    oppositePoints.unshift(offsetVector);

    x += stepLength * Math.cos(rotateAng);
    y += stepLength * Math.sin(rotateAng);
  }
}

function drawCurve(
  resolution,
  flowField,
  cellVisited,
  startX,
  startY,
  stagePercent
) {
  let points = [];
  let oppositePoints = [];
  let visitedCells = [];

  generatePoints(
    resolution,
    flowField,
    cellVisited,
    startX,
    startY,
    points,
    oppositePoints,
    visitedCells,
    stagePercent
  );

  if (points.length == 0) return false;

  for (let i = 0; i < visitedCells.length; i++) {
    let cellGrid = visitedCells[i];
    cellVisited[cellGrid.i][cellGrid.j] = true;
  }

  let randomColor = palette[Math.floor(Math.random() * palette.length)];
  fill(randomColor);
  beginShape();
  for (let i = 0; i < points.length; i++) {
    let point = points[i];
    vertex(point.x, point.y);
  }
  for (let i = 0; i < points.length; i++) {
    let point = oppositePoints[i];
    vertex(point.x, point.y);
  }
  endShape(CLOSE);
  return true;
}
