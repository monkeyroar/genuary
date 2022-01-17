function setup() {
  pixelDensity(1);
  createCanvas(800, 800);
  background(20);
  noLoop();
  colorMode(HSB);

  initBoard();
  for (let i = 0; i < 50; i++) {
    simulateAnt();
  }
}

const cellSize = 10;
const cells = [];
let cellsWidth, cellsHeight;

function initBoard() {
  cellsWidth = floor(width / cellSize);
  cellsHeight = floor(height / cellSize);
  for (let i = 0; i < cellsWidth; i++) {
    cells[i] = [];
    for (let j = 0; j < cellsHeight; j++) {
      cells[i][j] = false;
    }
  }
}

function simulateAnt() {
  let currX = floor(random(cellsWidth));
  let currY = floor(random(cellsHeight));
  let currDirection = floor(random(4));
  let numSteps = 10000;

  for (let i = 0; i < numSteps; i++) {
    let currCell = cells[currX][currY];
    cells[currX][currY] = !currCell;
    if (currCell) {
      //black
      currDirection = (currDirection + 3) % 4;
    } else {
      currDirection = (currDirection + 1) % 4;
    }

    if (currDirection == 0) {
      currY--;
    } else if (currDirection == 1) {
      currX++;
    } else if (currDirection == 2) {
      currY++;
    } else {
      currX--;
    }

    currX = (currX + cellsWidth) % cellsWidth;
    currY = (currY + cellsHeight) % cellsHeight;
  }
}

function brokenRect() {
  let dim = cellSize;
  let x = -dim / 2;
  let y = -dim / 2;
  beginShape();
  vertex(x + random(dim), y);
  vertex(x + dim, y + random(dim));
  vertex(x + random(dim), y + dim);
  vertex(x, y + random(dim));
  endShape(CLOSE);
}

function draw() {
  translate(width / 2, height / 2);
  rotate((PI / 2) * floor(random(4)));
  translate(-width / 2, -height / 2);
  noStroke();

  let mainHue = random(720) % 360;
  let mainSat = random(50, 100);
  let secondaryHue = (mainHue + 180) % 360;
  let secondarySat = random(50, 100);

  for (let i = 0; i < cellsWidth; i++) {
    for (let j = 0; j < cellsHeight; j++) {
      let mapBounds, color, sat;
      if (floor((i * cellSize) / 80) % 2 == 0) {
        color = mainHue;
        mapBounds = [cellsHeight, 0];
        sat = mainSat;
      } else {
        color = secondaryHue;
        mapBounds = [0, cellsHeight];
        sat = secondarySat;
      }
      alpha = map(j, mapBounds[0], mapBounds[1], 0, 1);
      bri = map(j, mapBounds[0], mapBounds[1], 50, 100);
      xNoise = map(j, mapBounds[0], mapBounds[1], 0, 40);
      fill(color, sat, bri, alpha);
      if (cells[i][j]) {
        push();
        translate(
          i * cellSize + cellSize / 2 + random(-xNoise, xNoise),
          j * cellSize + cellSize / 2
        );
        rotate(random(2 * PI));
        scale(random(0.8, 2)), random(0.8, 2);
        brokenRect();
        pop();
      }
    }
  }
}
