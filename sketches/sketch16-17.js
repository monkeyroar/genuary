function lerpColorArr(arr, step) {
  let sz = arr.length;
  if (sz == 1 || step <= 0.0) {
    return arr[0];
  } else if (step >= 1.0) {
    return arr[sz - 1];
  }
  let scl = step * (sz - 1);
  let i = int(scl);
  return lerpColor(arr[i], arr[i + 1], scl - i);
}

let renderer;
let centerX, centerY, angle;

function setup() {
  createCanvas(540, 540);
  background(random(255));
  noLoop();

  let palette = [randomColor(), randomColor(), randomColor()];
  renderer = createImage(width, height);
  renderer.loadPixels();

  let w = renderer.width;
  let h = renderer.height;

  centerX = random(w * 0.1, w * 0.9);
  centerY = random(h * 0.1, h * 0.9);
  let rise, run;

  if (centerX < w / 2 && centerY < h / 2) {
    angle = random(PI / 2, PI);
  } else if (centerX > w / 2 && centerY < h / 2) {
    angle = random(PI / 2);
  } else if (centerX < w / 2 && centerY > h / 2) {
    angle = random(PI, (3 * PI) / 2);
  } else {
    angle = random((3 * PI) / 2, 2 * PI);
  }

  for (let x = 0; x < w; x++) {
    run = centerX - x;
    for (let y = 0; y < h; y++) {
      rise = centerY - y;
      let t = angle + atan2(rise, run);
      t = floorMod(t, TWO_PI) / TWO_PI;
      renderer.set(x, y, lerpColorArr(palette, t));
    }
  }
  renderer.updatePixels();
}

function randomColor() {
  return color(random(255), random(255), random(255), random(64, 255));
}

function floorMod(a, b) {
  return a - b * floor(a / b);
}

function draw() {
  image(renderer, 0, 0);

  translate(centerX, centerY);
  rotate(-angle + PI);
  strokeCap(SQUARE);

  let lineLength = dist(0, 0, width, height);
  let rotation = 0;

  while (rotation < 2 * PI) {
    console.log(rotation);
    let rotationStep = random(0.1, 0.3);
    rotate(rotationStep);
    stroke(Math.random() > 0.5 ? 20 : 240, random(64, 255));    
    let lineWidth = random(20);
    for (let i = -lineWidth; i <= lineWidth; i++) {
      line(0, 0, lineLength, i);
    }
    rotation += rotationStep;
  }
}
