function setup() {
  createCanvas(540, 540);
  noLoop();
  strokeCap(SQUARE);
}

function draw() {
  let num_layers = 5;
  let graphics = [];
  for (let i = 0; i < num_layers; i++) {
    let pg = createGraphics(width, height);
    let col = map(i, 0, num_layers - 1, 128, 0);
    trees(pg, col);
    landscape(pg, i, col);
    pg.filter(BLUR, num_layers - i - 1);
    graphics.push(pg);
  }
  let main_pg = createGraphics(width, height);
  main_pg.background(200);
  for (let i = 0; i < num_layers; i++) {
    let y = (num_layers - i - 1) * (land_h - land_amp / 2);
    main_pg.image(graphics[i], 0, -y);
  }
  colorMode(HSB);
  tint(random(360), random(30, 50), random(70, 90));
  image(main_pg, 0, 0);
}

const max_depth = 4;
const land_h = 50;
const land_amp = 20;

function trees(pg, col) {
  let num_trees = Math.round(random(3, 5));
  for (let i = 0; i < num_trees; i++) {
    let w = width / num_trees;
    let x = (i / num_trees) * width + random(w * 0.25, w * 0.75);
    let y = height - random(land_h - land_amp);
    tree(pg, x, y, random(80, 120), col);
  }
}

function landscape(pg, noise_offset, color) {
  pg.stroke(color);
  pg.fill(color);
  pg.beginShape();
  pg.vertex(0, height);
  for (let i = 0; i < width; i++) {
    let n = noise(i, noise_offset * 1000);
    let delta = map(n, 0, 1, -land_amp, land_amp);
    pg.vertex(i, height - land_h + delta);
  }
  pg.vertex(width, height);
  pg.endShape(CLOSE);
}

function tree(pg, x, y, start_branch, col) {
  pg.push();
  pg.translate(x, y);
  branch(pg, start_branch, 0, start_branch, 10, col);
  pg.pop();
}

function branch(pg, h, depth, start_branch, stop_branch, col) {
  if (depth > max_depth) return;
  let sw = map(h, stop_branch, start_branch, 1, 5);
  let alpha = map(h, stop_branch, start_branch, 32, 255);
  pg.stroke(col, alpha);
  pg.strokeWeight(sw);
  pg.line(0, 0, 0, -h);
  pg.translate(0, -h);

  let n = Math.floor(random(2, 4));
  for (let i = 0; i < n; i++) {
    let theta = random(-PI / 6, PI / 6);
    let newH = h * random(0.25, 1);
    if (newH > stop_branch) {
      pg.push();
      pg.rotate(theta);
      branch(pg, newH, depth + 1, start_branch, stop_branch, col);
      pg.pop();
    }
  }
}
