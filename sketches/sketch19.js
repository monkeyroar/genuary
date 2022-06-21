let myFont;
let textGraphics;

function preload() {
  myFont = loadFont("assets/StalinistOne-Regular.ttf");
}

function setup() {
  createCanvas(1080, 1080);
  noLoop();
  background(255);

  textGraphics = createGraphics(width, height);
}

function isPixelBlack(x, y) {
  let off = (y * width + x) * pixelDensity() * 4;
  let components = [pixels[off], pixels[off + 1], pixels[off + 2]];
  return components.toString() === [0, 0, 0].toString();
}

const rects = [];
const minDim = 2;
const maxDim = 100;
const totalRects = 2000;
const createRectAttempts = 500;

function createRect() {
  let newRect;
  let rectSafeToDraw = false;
  for (let tries = 0; tries < createRectAttempts; tries++) {
    newRect = {
      x: Math.round(Math.random() * width),
      y: Math.round(Math.random() * height),
      dim: minDim,
      ratio: random(0.5, 1.5),
    };

    if (doesRectHaveACollision(newRect)) {
      continue;
    } else {
      rectSafeToDraw = true;
      break;
    }
  }

  if (!rectSafeToDraw) {
    return;
  }

  for (let dim = minDim; dim < maxDim; dim++) {
    newRect.dim = dim;
    if (doesRectHaveACollision(newRect)) {
      newRect.dim--;
      break;
    }
  }

  rects.push(newRect);
  drawRect(newRect);
}

function intersect(r1, r2) {
  return (
    r1.x <= r2.x + r2.width &&
    r1.x + r1.width >= r2.x &&
    r1.y <= r2.y + r2.height &&
    r1.y + r1.height >= r2.y
  );
}

function doesRectHaveACollision(newRect) {
  let r1 = {
    x: newRect.x,
    y: newRect.y,
    width: newRect.dim,
    height: newRect.dim * newRect.ratio,
  };
  for (let i = 0; i < rects.length; i++) {
    let otherRect = rects[i];
    let r2 = {
      x: otherRect.x,
      y: otherRect.y,
      width: otherRect.dim,
      height: otherRect.dim * otherRect.ratio,
    };
    if (intersect(r1, r2)) return true;
  }

  for (let x = 0; x < r1.width; x++) {
    for (let y = 0; y < r1.height; y++) {
      if (isPixelBlack(r1.x + x, r1.y + y)) return true;
    }
  }
  return false;
}

function drawRect(newRect) {
  //fill(255, 0, 0);
  //TODO: Random scale, translate and rotation, insert text here
  rect(newRect.x, newRect.y, newRect.dim, newRect.dim * newRect.ratio);
}

function drawText() {
  textGraphics.textFont(myFont);
  textGraphics.textSize(300);
  textGraphics.textAlign(CENTER, CENTER);
  textGraphics.fill(0);
  textGraphics.text("ХТО", width / 2 + 8, height * 0.3);
  textGraphics.text("Я?", width / 2, height * 0.7);
}

function draw() {
  drawText();
  image(textGraphics, 0, 0);
  loadPixels();
  clear();
  //background(240);

  for (let i = 0; i < totalRects; i++) {
    createRect();
  }

  // TODO: - vertical scaling only
  // textFont(myFont);
  // textAlign(CENTER, CENTER);
  // fill(0, 0);

  // for (let i = 0; i < 20; i++) {
  //   textSize(300 - i * 10);
  //   let alpha = map(i, 0, 10, 255, 0);
  //   stroke(0, alpha);
  //   text("ХТО", width / 2 + 8, height * 0.3);
  //   text("Я?", width / 2, height * 0.7);
  // }
}
