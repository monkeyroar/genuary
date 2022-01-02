function setup() {
  createCanvas(540, 540);
  rectMode(CENTER);
  noLoop();
  background(240);
}

function dist_to_line(x, y, line) {
  return abs(cos(line[2]) * (line[1] - y) - sin(line[2]) * (line[0] - x));
}

function draw() {
  translate(width / 2, height / 2);
  scale(1, -1);
  var randColor = Math.random() * 360;
  var lines = [];
  for (var i = 0; i < 7; i++) {
    var x = (Math.random() - 0.5) * width;
    var y = (Math.random() - 0.5) * height;
    var theta = Math.random() * PI * 2;
    lines.push([x, y, theta]);
  }
  for (var i = 0; i < 10000; i++) {
    var x = (randomGaussian() * width) / 4;
    var y = (randomGaussian() * height) / 4;

    var distances = lines.map((line) => dist_to_line(x, y, line));
    var closest_dist = Math.min(...distances);
    var factor = exp(-closest_dist / 75);
    var base_r = 20;
    var r = base_r * factor;
    var r_div = 5;
    var w = map(Math.random(), 0, 1, r, r + r_div);
    var h = map(Math.random(), 0, 1, r, r + r_div);

    var alpha = map(factor, 1, 0, 255, 100);
    var col_stroke = map(factor, 0, 1, 150, 50);
    var thick = map(pow(factor, 4), 0, 1, 0, 1);
    stroke(col_stroke, alpha);
    strokeWeight(thick);

    angleMode(DEGREES);
    colorMode(HSB);
    var n = noise(x * 0.05, y * 0.05);
    var bri = map(factor, 0, 1, 95, 85);
    var sat = map(factor, 1, 0, 30, 0);
    var hue = n > 0.5 ? randColor : (randColor + 180) % 360;
    fill(hue, sat, bri, alpha);
    colorMode(RGB);
    angleMode(RADIANS);

    var noiseFactor = 0.01;
    var n1 = noise(x * noiseFactor, y * noiseFactor, 1000);
    var n2 = noise(x * noiseFactor, y * noiseFactor, 2000);
    var angle_x = map(n1, 0, 1, -PI / 4, PI / 4);
    var angle_y = map(n2, 0, 1, -PI / 4, PI / 4);
    var shear_x = 1 / tan(PI / 2 - angle_x);
    var shear_y = 1 / tan(PI / 2 - angle_y);
    push();
    applyMatrix(1, shear_x, shear_y, 1, 0, 0);
    rect(x, y, w, h);
    pop();
  }
}
