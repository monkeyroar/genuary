function setup() {
  createCanvas(540, 540);
  noLoop();
  palette = [
    color("#2E294E"),
    color("#541388"),
    color("#F1E9DA"),
    color("#FFD400"),
    color("#D90368"),
  ];
  let rand_idx = Math.floor(Math.random() * palette.length);
  bg_color = palette[rand_idx];
  palette.splice(rand_idx, 1);

  background(bg_color);
}

let palette, bg_color;

function draw_star_layer(r_outer, r_inner, col) {
  for (let i = 0; i < 4; i++) {
    let theta = (i * PI) / 2;
    fill(col);
    beginShape();
    vertex(0, 0);
    vertex(r_outer * cos(theta), r_outer * sin(theta));
    vertex(r_inner * cos(theta + PI / 4), r_inner * sin(theta + PI / 4));
    endShape(CLOSE);

    fill(255);
    beginShape();
    vertex(0, 0);
    vertex(r_outer * cos(theta), r_outer * sin(theta));
    vertex(r_inner * cos(theta - PI / 4), r_inner * sin(theta - PI / 4));
    endShape(CLOSE);
  }
}

function draw_star(
  x_center,
  y_center,
  r_outer,
  inner_layer_scale,
  inner_radius_factor,
  col
) {
  let n_fac = 1;
  let n = noise(x_center * n_fac, y_center * n_fac);
  let rot_delta = map(n, 0, 1, -PI / 8, PI / 8);
  push();
  translate(x_center, y_center);
  push();
  rotate(PI / 4 + rot_delta);
  scale(inner_layer_scale, inner_layer_scale);
  draw_star_layer(r_outer, r_outer * (inner_radius_factor + 0.1), col);
  pop();
  draw_star_layer(r_outer, r_outer * inner_radius_factor, col);
  pop();
}

function draw() {
  let r_outer = random(50, 100);

  rotate(random(PI / 4));
  translate(random(r_outer), random(r_outer));

  strokeWeight(0.5);

  let inner_layer_scale = random(0.5, sqrt(2) / 2);
  let inner_radius_factor = random(
    inner_layer_scale * 0.3,
    inner_layer_scale * 0.7
  );
  let x_offset = 0;
  let col_idx = 0;
  for (let y = -height; y <= height * 2; y += r_outer) {
    for (let x = -width; x <= width * 2; x += r_outer * 2) {
      let col = palette[col_idx];
      draw_star(
        x + x_offset,
        y,
        r_outer,
        inner_layer_scale,
        inner_radius_factor,
        col
      );
      col_idx = (col_idx + 1) % palette.length;
    }
    x_offset = x_offset == 0 ? r_outer : 0;
  }
}
