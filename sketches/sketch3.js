function setup() {
  createCanvas(540, 540);
  background(Math.random() > 0.5 ? 20 : 235);
  noLoop();
  colorMode(HSB);
}

function colonize(hue) {
  let maxMag = (width * width + height * height) / 4;

  let attractors = [];
  let nodes = [];

  let influenceDist = 50;
  let segmentLength = 10;
  let killDist = 30;

  for (let i = 0; i < 1000; i++) {
    attractors.push(
      createVector(
        (Math.random() - 0.5) * width,
        (Math.random() - 0.5) * height
      )
    );
  }
  nodes.push(createVector(0, 0));
  while (attractors.length > 0) {
    console.log("Attractors left " + attractors.length);
    let nodesInfluence = {};

    attractors.forEach((attractor) => {
      let closestNodes = nodes
        .map((node) => {
          return {
            node: node,
            dist: dist(node.x, node.y, attractor.x, attractor.y),
          };
        })
        .filter((e) => e.dist < influenceDist);
      let closestNode = closestNodes.sort((a, b) => a.dist - b.dist)[0];
      if (closestNode) {
        let oldVal = nodesInfluence[closestNode.node] || [];
        oldVal.push(attractor);
        nodesInfluence[closestNode.node] = oldVal;
      }
    });

    let newNodes = [];
    nodes
      .filter((node) => nodesInfluence[node])
      .forEach((node) => {
        let nodeAttractors = nodesInfluence[node];
        let avgVec = createVector(0, 0);
        nodeAttractors
          .map((vec) => p5.Vector.sub(vec, node))
          .forEach((vec) => avgVec.add(vec));
        avgVec
          .div(nodeAttractors.length)
          .normalize()
          .mult(segmentLength)
          .add(node);

        let weight = map(avgVec.magSq(), 0, maxMag, 4, 1);
        let alpha = map(avgVec.magSq(), 0, maxMag, 150, 50);
        let bri = map(avgVec.magSq(), 0, maxMag, 70, 30);
        let sat = map(avgVec.magSq(), 0, maxMag, 80, 40);
        strokeWeight(weight);
        stroke(hue, sat, bri, alpha);
        fill(hue, sat, bri, alpha);
        line(node.x, node.y, avgVec.x, avgVec.y);
        ellipse(avgVec.x, avgVec.y, weight - 1, weight - 1);
        newNodes.push(avgVec);
      });
    nodes = nodes.concat(newNodes);

    let prevAttractorsLength = attractors.length;
    attractors = attractors.filter((attractor) => {
      let distances = nodes.map((node) =>
        dist(attractor.x, attractor.y, node.x, node.y)
      );
      return distances.filter((dist) => dist < killDist).length == 0;
    });
    if (attractors.length == prevAttractorsLength) break;
  }
}

function draw() {
  translate(width / 2, height / 2);
  scale(1, -1);

  let mainColor = Math.random() * 360;
  let secondaryColor = (mainColor + 120) % 360;
  let ternaryColor = (mainColor + 240) % 350;

  colonize(mainColor);
  colonize(secondaryColor);
  colonize(ternaryColor);
}
