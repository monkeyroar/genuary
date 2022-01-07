function setup() {
  createCanvas(540, 540);
  background(Math.random() > 0.5 ? 20 : 240);
  noLoop();
  angleMode(DEGREES);
}

function draw() {
  translate(width / 2, height / 2);
  scale(1, -1);

  let gradientDirection = Math.random() > 0.5;
  let numSites = random(50, 250);
  let sites = [];
  for (let i = 0; i < numSites; i++) {
    let x = (Math.random() - 0.5) * width;
    let y = (Math.random() - 0.5) * height;
    sites.push({ x: x, y: y });
  }
  let bbox = { xl: -width / 2, xr: width / 2, yt: -height / 2, yb: height / 2 };
  let voronoi = new Voronoi();

  let diagram = voronoi.compute(sites, bbox);
  let cells = diagram.cells;
  for (let i = 0; i < cells.length; i++) {
    let cell = cells[i];
    let halfEdges = cell.halfedges;
    let baseScaleFactor = random(0.8, 1.2);
    let rotation = random(-15, 15);
    let offset = random(5);
    let offsetVec = p5.Vector.random2D().mult(offset);

    let subShards = random(15, 25);
    // let gradientDirection = Math.random() > 0.5;
    for (let i = 0; i < subShards; i++) {
      let scaleFactor = (baseScaleFactor * (subShards - i)) / subShards;
      let alpha = map(i, 0, subShards, 255, 0);
      let fillCol = gradientDirection ? 256 - 24 * i : 16 * i;
      stroke(fillCol, alpha);
      fill(fillCol);
      push();
      translate(cell.site.x, cell.site.y);
      scale(scaleFactor, scaleFactor);
      rotate(rotation);
      translate(-cell.site.x, -cell.site.y);
      beginShape();
      for (let i = 0; i < halfEdges.length; i++) {
        let point = halfEdges[i].getStartpoint();
        vertex(point.x + offsetVec.x, point.y + offsetVec.y);
      }
      endShape(CLOSE);
      pop();
    }
  }
}
