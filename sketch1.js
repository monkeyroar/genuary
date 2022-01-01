function setup() {
  createCanvas(1080, 1080);
  rectMode(CENTER);
  noLoop();
  background(255);
}

function dist_to_line(x, y, line) {
  return abs(cos(line[2]) * (line[1] - y) - sin(line[2]) * (line[0] - x));
}

function draw() {
  translate(width / 2, height / 2);
  scale(1, -1);
  var lines = [];
  for (var i = 0; i < 5; i++) {
    var x = (Math.random() - 0.5) * width;
    var y = (Math.random() - 0.5) * height;
    var theta = Math.random() * PI * 2;
    lines.push([x, y, theta]);
  }
  for (var i = 0; i < 10000; i++) {
    var x = (randomGaussian() * width) / 4;
    var y = (randomGaussian() * height) / 4;
    var vec = dist(x, y, 0, 0);

    var distances = lines.map((line) => dist_to_line(x, y, line));
    var closest_dist = Math.min(...distances);
    var factor = exp(-closest_dist / 100);
    var base_r = 20;
    var r = base_r * factor;
    var r_div = 10;
    var w = map(Math.random(), 0, 1, r, r + r_div);
    var h = map(Math.random(), 0, 1, r, r + r_div);

    var n1 = noise(x, y);
    var n2 = noise(x, y, 1000);
    var n3 = noise(x, y, 2000);
    var n4 = noise(x, y, 3000);
    var n5 = noise(x * 0.003, y * 0.003);

    var alpha = map(factor, 1, 0, 255, 100);

    var col_stroke = map(n1, 0, 1, 0, 255);
    var thick = map(n2, 0, 1, 1, 3);
    stroke(col_stroke, alpha);
    strokeWeight(thick);

    angleMode(DEGREES);
    colorMode(HSB);
    var bri = map(factor, 1, 0, 100, 50);
    var sat = map(factor, 1, 0, 10, 0);
    var hue = map(n5, 0, 1, 0, 1440) % 360;
    fill(hue, sat, bri, alpha);
    colorMode(RGB);
    angleMode(RADIANS);

    var angle_x = map(n3, 0, 1, -PI / 8, PI / 8);
    var angle_y = map(n4, 0, 1, -PI / 8, PI / 8);
    var shear_x = 1 / tan(PI / 2 - angle_x);
    var shear_y = 1 / tan(PI / 2 - angle_y);
    push();
    applyMatrix(1, shear_x, shear_y, 1, 0, 0);
    rect(x, y, w, h);
    pop();
  }
}
