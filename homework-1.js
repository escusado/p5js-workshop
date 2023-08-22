// Globals
const globalPaddingX = 200;
const globalPaddingY = 10;
const frameWidth = 12;
const colorPrimary = "#fff";
const colorBackground = "#333";
const horizontalCellCount = 3;

let cellSize, verticalCellCount;

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);
  background(colorBackground);

  // Get starting dynamic values
  cellSize = (windowWidth - (globalPaddingX + frameWidth) * 2) / horizontalCellCount;
  verticalCellCount = Math.floor(windowHeight - ((((globalPaddingY + frameWidth) * 2)) / cellSize));

  // Prep stage
  // Main centering translate
  translate(globalPaddingX, globalPaddingY * 2);
  // Outside thick frame
  drawOutsideFrame();
  // Draw "dotted" background
  drawGrid(drawBackgroundCell);
}

function draw() {
  //
}

// Draw thick frame outside of grid
function drawOutsideFrame() {
  push();
  noStroke();
  fill(colorPrimary);
  rect(0 - frameWidth / 2, 0 - frameWidth / 2, cellSize * horizontalCellCount + frameWidth, cellSize * verticalCellCount + frameWidth);
  fill(colorBackground);
  rect(0, 0, cellSize * horizontalCellCount, cellSize * verticalCellCount);
  pop();
}

// Generic function to draw a grid of cells w/ a custom drawing fn
function drawGrid(drawingMethod) {
  for (let i = 0; i < horizontalCellCount; i++) {
    for (let j = 0; j < verticalCellCount; j++) {
      push();
      translate(i * cellSize, j * cellSize);
      drawingMethod();
      pop();
    }
  }
}

// Background "dot-grid" cell
function drawBackgroundCell() {
  push();
  noFill();
  stroke("rgba(255,255,255,.05)");
  strokeWeight(1);

  square(0, 0, cellSize);
  pop();
}

function drawCell() {
  push();
  // circle(0,0,5);
  // square(cellSize-5, cellSize-5, 5);
  fill(hslToHexString(Math.floor(Math.random() * 360), 100, 50));
  square(0, 0, cellSize);
  pop();
}





// External code
function hslToHexString(h, s, l) {
  l /= 100;
  const a = s * Math.min(l, 1 - l) / 100;
  const f = n => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}