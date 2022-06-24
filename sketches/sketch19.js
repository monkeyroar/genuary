let primaryFont, secondaryFont;
let textGraphics;
let strings;

function preload() {
  primaryFont = loadFont("assets/sketch19/StalinistOne-Regular.ttf");
  strings = loadStrings("assets/sketch19/translated.txt");
}

function setup() {
  createCanvas(1080, 1080);
  noLoop();
  background(255);

  textGraphics = createGraphics(width, height);
  strings = strings
    .map((s) => s.toLowerCase())
    .filter((value, index, self) => self.indexOf(value) === index);
}

function isPixelBlack(x, y) {
  let off = (y * width + x) * pixelDensity() * 4;
  let components = [pixels[off], pixels[off + 1], pixels[off + 2]];
  return components.toString() === [0, 0, 0].toString();
}

const rects = [];
const minDim = 2;
const maxDim = 100;
const totalRects = 3000;
const createRectAttempts = 500;

function createRect() {
  let newRect;
  let rectSafeToDraw = false;
  for (let tries = 0; tries < createRectAttempts; tries++) {
    newRect = {
      x: Math.round(Math.random() * width),
      y: Math.round(Math.random() * height),
      dim: minDim,
      ratio: random(0.5, 0.75),
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

  let rect = {
    x: newRect.x,
    y: newRect.y,
    width: newRect.dim,
    height: newRect.dim * newRect.ratio,
  };
  rects.push(rect);
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
  let rect = {
    x: newRect.x,
    y: newRect.y,
    width: newRect.dim,
    height: newRect.dim * newRect.ratio,
  };
  if (rect.x + rect.width > width || rect.y + rect.height > height) return true;
  for (let i = 0; i < rects.length; i++) {
    let otherRect = rects[i];
    if (intersect(rect, otherRect)) return true;
  }

  for (let x = 0; x < rect.width; x++) {
    for (let y = 0; y < rect.height; y++) {
      if (isPixelBlack(rect.x + x, rect.y + y)) return true;
    }
  }
  return false;
}

function drawRect(r) {
  translate(r.x + r.width / 2, r.y + r.height / 2);
  scale(random(0.8, 1.2), random(0.8, 1.2));
  rotate(random(-PI / 6, PI / 6));
  fill(240, 200);
  let size = textSize();
  let str = strings[Math.floor(Math.random() * strings.length)];
  let minSizeW = (size / textWidth(str)) * r.width;
  let minSizeH = (size / (textDescent() + textAscent())) * r.height;
  textSize(min(minSizeW, minSizeH));
  let scaleFactor = (r.height / (textAscent() + textDescent())) * 1.5;
  scale(1, scaleFactor);
  text(str, 0, 0);
}

function drawTextToGraphics() {
  textGraphics.textFont(primaryFont);
  textGraphics.textSize(300);
  textGraphics.textAlign(CENTER, CENTER);
  textGraphics.fill(0);
  textGraphics.text("ХТО", width / 2 + 8, height * 0.3);
  textGraphics.text("Я?", width / 2, height * 0.7);
}

function drawBackground() {
  push();
  let from = color(0, 87, 184);
  let to = color(255, 215, 0);
  for (let i = 0; i < height; i++) {
    let lerp = lerpColor(from, to, i / height);
    stroke(lerp);
    line(0, i, width, i);
  }
  pop();
}

function drawText() {
  textFont(primaryFont);
  textAlign(CENTER, CENTER);
  textSize(300);
  fill(0, 0);
  let numSteps = 20;
  translate(width / 2, height / 2);
  for (let i = 0; i < numSteps; i++) {
    let alpha = map(i, 0, 10, 255, 0);
    scale(0.9, 0.9);
    stroke(0, alpha);
    text("ХТО", 8, -height * 0.2);
    text("Я?", 0, height * 0.2);
  }
}

function draw() {
  drawTextToGraphics();
  image(textGraphics, 0, 0);
  loadPixels();
  clear();
  //background(240);

  drawBackground();

  for (let i = 0; i < totalRects; i++) {
    createRect();
  }

  textAlign(CENTER, CENTER);
  //textFont(secondaryFont);
  textStyle(BOLD);
  for (let i = 0; i < rects.length; i++) {
    push();
    drawRect(rects[i]);
    pop();
  }

  //drawText();
}
