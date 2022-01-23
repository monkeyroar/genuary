function setup() {
  createCanvas(540, 540);
  background(240);
  noLoop();
  rectMode(CENTER);
  colorMode(HSB);
  mainColor = random(360);
}

let mainColor;

function fill_wave(y_wave, y_next, wave_num, wave_amp) {
  let shear_fac = random(PI / 16, PI / 4);
  let rect_size = random(10, 20);
  let x_start, x_step;
  if (Math.random() > 0.5) {
    x_start = width;
    x_step = -rect_size;
  } else {
    shear_fac = -shear_fac;
    x_start = 0;
    x_step = rect_size;
  }

  let x = x_start;
  let y = height;
  let should_offset = true;

  let noise_fac = 0.01;
  while (true) {
    let n = noise(x * noise_fac, 1000 * wave_num);
    let y_stop = y_wave + map(n, 0, 1, -wave_amp / 2, wave_amp / 2);

    let y_norm = 1 - (y - y_stop) / (y_next - y_stop);
    let sat = map(noise(x * noise_fac, y * noise_fac), 0, 1, 0, 100);
    let bri = map(pow(y_norm, 3), 0, 1, 10, 100);

    push();
    fill(mainColor, sat, bri);
    stroke(mainColor, sat, bri);
    translate(x, y);
    shearX(shear_fac);
    rect(0, 0, rect_size, rect_size);
    pop();

    y -= rect_size / 2;

    if (y <= y_stop) {
      x += x_step;
      y = should_offset ? height + rect_size / 4 : height;
      should_offset = !should_offset;
    }

    if (x < -rect_size || x > width + rect_size) break;
  }
}

function draw() {
  let num_waves = random(5, 15);
  let base_wave_amp = (height / num_waves) * 2;
  for (let i = -1; i < num_waves; i++) {
    let y_wave = (height * i) / num_waves;
    let y_next = (height * (i + 1)) / num_waves;
    let wave_amp = base_wave_amp * random(0.8, 1.2);
    fill_wave(y_wave, y_next, i, wave_amp);
  }
}
