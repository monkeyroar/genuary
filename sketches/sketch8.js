function setup() {
  isDarkBack = Math.random() > 0.5;
  createCanvas(540, 540);
  background(isDarkBack ? 20 : 240);
  noLoop();
  alphaStep = random(2, 10);
}
let alpha = 0;
let alphaStep, isDarkBack;

function draw() {
  translate(width / 2, height / 2);
  scale(1, -1);

  let tStep = 0.0005;
  let t = 0;
  let a = Math.round(random(1, 20));
  let b = a;
  while (b == a) {
    b = Math.round(random(1, 20));
  }
  let delta = random(-PI / 2, PI / 2);
  console.log([a, b, delta]);
  let A = width / 2 - 20;
  let B = height / 2 - 20;
  while (t < 2 * PI) {
    let x = A * sin(a * t + delta);
    let y = B * sin(b * t);
    let r = map(alpha, 0, 255, 1, 5);
    let col = isDarkBack ? alpha : 255 - alpha;
    push();
    translate(x, y);
    stroke(col, alpha);
    fill(col, alpha);
    ellipse(0, 0, r, r);
    pop();
    t += tStep;
    alpha += alphaStep;
    if (alpha > 255) {
      alpha = 0;
      alphaStep = random(2, 10);
      t += tStep * random(20, 50);
    }
  }
}
