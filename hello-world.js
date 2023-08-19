function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  circle(mouseX, mouseY, 20);
  console.log('🍕>>> wat', mouseX, mouseY);
}
