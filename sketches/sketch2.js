let img;
p5.disableFriendlyErrors = true;

function setup() {
  pixelDensity(1);
  createCanvas(1080, 1080);
  background(255);
  noLoop();
}

function preload() {
  img = loadImage("../assets/sketch2.jpg");
}

function iterate(callback) {
  let fullImage = 4 * width * height;
  for (let i = 0; i < fullImage; i += 4) {
    let x = (i / 4) % width;
    let y = Math.floor(i / (4 * width));
    let result = callback(
      [pixels[i] / 255, pixels[i + 1] / 255, pixels[i + 2] / 255],
      x,
      y
    );
    pixels[i] = result[0] * 255;
    pixels[i + 1] = result[1] * 255;
    pixels[i + 2] = result[2] * 255;
  }
}

function isInBounds(x, y) {
  return x > 0 && x < width && y < height;
}

function pixelAt(x, y, newColor) {
  let idx = 4 * (y * width + x);
  if (newColor) {
    for (let i = 0; i < 3; i++) {
      pixels[idx + i] = newColor[i] * 255;
    }
  } else {
    return [pixels[idx] / 255, pixels[idx + 1] / 255, pixels[idx + 2] / 255];
  }
}

let r = [226, 0, 35].map((v) => v / 255);
let b = [255, 238, 44].map((v) => v / 255);

function quantize(color) {
  let r_dist =
    abs(color[0] - r[0]) + abs(color[1] - r[1]) + abs(color[2] - r[2]);
  let b_dist =
    abs(color[0] - b[0]) + abs(color[1] - b[1]) + abs(color[2] - b[2]);
  if (r_dist === b_dist) {
    return [0, 0, 0];
  } else {
    return r_dist < b_dist ? r : b;
  }
}

let diffusor = {
  width: 3,
  height: 2,
  pixels: [0, 0, 7, 3, 5, 1].map((val) => val / 16),
};

function matrixErrorDiffusion(color, x, y) {
  let quantized = quantize(color);
  let error = [
    color[0] - quantized[0],
    color[1] - quantized[1],
    color[2] - quantized[2],
  ];
  for (let i = 0; i < diffusor.height; i++) {
    for (let j = -1; j < diffusor.width - 1; j++) {
      if (isInBounds(x + j, y + i)) {
        let offsetPixel = pixelAt(x + j, y + i);
        let diffuseFactor = diffusor.pixels[j + 1 + i * diffusor.width];
        let newColor = [
          offsetPixel[0] + error[0] * diffuseFactor,
          offsetPixel[1] + error[1] * diffuseFactor,
          offsetPixel[2] + error[2] * diffuseFactor,
        ];
        pixelAt(x + j, y + i, newColor);
      }
    }
  }
  return quantized;
}

function sortRow(pixelColors, y) {
  let brightThresh = y < height / 3 ? 40 : 20;
  let x = 0;
  let xEnd = 0;
  while (xEnd < width - 1) {
    x = pixelColors.findIndex((e, i) => i > x && brightness(e) > brightThresh);
    xEnd = pixelColors.findIndex(
      (e, i) => i > x && brightness(e) < brightThresh
    );
    if (x < 0 || xEnd < 0) break;

    let sortLength = xEnd - x;
    let unsorted = [];

    for (let i = 0; i < sortLength; i++) {
      unsorted[i] = pixelColors[x + i];
    }

    unsorted.sort((a, b) => brightness(a) - brightness(b));

    for (let i = 0; i < sortLength; i++) {
      let pix = unsorted[i];
      let idx = (x + i + y * width) * 4;
      pixels[idx] = red(pix);
      pixels[idx + 1] = green(pix);
      pixels[idx + 2] = blue(pix);
      pixels[idx + 3] = alpha(pix);
    }

    x = xEnd + 1;
  }
}

function pixelSort() {
  let rowStep = 1;
  for (let row = 0; row < height; row += rowStep) {
    console.log("Processing row " + row);
    let startIndex = row * width * 4;
    let endIndex = (row + 1) * width * 4;
    let pixelColors = [];
    for (let i = startIndex; i < endIndex; i += 4) {
      let pix = color(pixels[i], pixels[i + 1], pixels[i + 2], pixels[i + 3]);
      pixelColors.push(pix);
    }
    sortRow(pixelColors, row);
  }
}

function draw() {
  image(img, 0, 0, width, height);
  loadPixels();
  pixelSort();
  iterate(matrixErrorDiffusion);
  updatePixels();
}
