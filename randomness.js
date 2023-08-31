let noiseFactor = 0.01
function setup() {
  createCanvas(400, 400)
}

function draw() {
  randomSeed(1)
  background(220)
  strokeWeight(2)
  noFill()
  beginShape()

  for (let i = 0; i < width; i += 5) {
    // vertex(i, random(150, 250))
    vertex(
      i,
      map(noise(i * noiseFactor), 0, 1, 150, 250)
    )
  }
  endShape()
}

function keyPressed() {
  noiseFactor += 0.01
}