let primaryFont, secondaryFonts;
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
  angleMode(DEGREES);

  secondaryFonts = ["Verdana", "Courier New", "Georgia"];
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
let rectsSq;
const minDim = 1;
const maxDim = 100;
const totalRects = 10000;
const createRectAttempts = 500;

function createRect() {
  let newRect;
  let rectSafeToDraw = false;
  for (let tries = 0; tries < createRectAttempts; tries++) {
    newRect = {
      x: Math.round(Math.random() * width),
      y: Math.round(Math.random() * height),
      dim: minDim,
      ratio: random(0.25, 0.75),
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

function drawRect(r, i) {
  translate(r.x + r.width / 2, r.y + r.height / 2);
  rotate(random(-10, 10));

  textFont(secondaryFonts[Math.floor(Math.random() * secondaryFonts.length)]);
  let size = textSize();
  let str = strings[Math.floor(Math.random() * strings.length)];
  let minSizeW = (size / textWidth(str)) * r.width;
  let minSizeH = (size / (textDescent() + textAscent())) * r.height;
  textSize(min(minSizeW, minSizeH));
  let scaleFactor = r.height / textSize();
  let scaleConst = 1.1;
  scale(scaleConst, scaleFactor * scaleConst);

  let rand = Math.random();
  if (rand > 0.75) textStyle(BOLD);
  else if (rand > 0.5) textStyle(ITALIC);
  else if (rand > 0.25) textStyle(BOLDITALIC);

  fill(0);
  text(str, 0.5, 0.5);

  colorMode(HSB);
  let offset = Math.abs(r.y - height / 2);
  let n = noise(r.x, r.y);
  let sat = map(offset, 0, height / 2, 60, 80);
  let bri = map(n, 0, 1, 50, 100);
  let alpha = map(rectsSq[i], 0, 1, 1, 0.75);
  fill(0, sat, bri, alpha);

  text(str, 0, 0);
}

function drawTextToGraphics() {
  textGraphics.textFont(primaryFont);
  textGraphics.textSize(300);
  textGraphics.textAlign(CENTER, CENTER);
  textGraphics.fill(0);
  textGraphics.text("ХТО", width / 2, height * 0.3);
  textGraphics.text("Я?", width / 2, height * 0.7);
}

function drawBackground() {
  push();
  strokeWeight(2);
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
  fill(0, 0);
  let numSteps = 5;
  translate(width / 2, height / 2);
  for (let i = 0; i < numSteps; i++) {
    let alpha = map(i, 0, numSteps, 255, 0);
    textSize(300 - i * 20);
    stroke(0, alpha);
    text("ХТО", 0, -height * 0.2);
    text("Я?", 0, height * 0.2);
  }
}

function draw() {
  drawTextToGraphics();
  image(textGraphics, 0, 0);
  loadPixels();
  clear();

  drawBackground();

  for (let i = 0; i < totalRects; i++) {
    createRect();
  }
  console.log(rects.length);
  rectsSq = rects.map((r) => r.width * r.height);
  let maxSq = Math.max.apply(Math, rectsSq);
  rectsSq = rectsSq.map((sq) => sq / maxSq);

  textAlign(CENTER, CENTER);
  for (let i = 0; i < rects.length; i++) {
    push();
    drawRect(rects[i], i);
    pop();
  }

  //drawText();
}
