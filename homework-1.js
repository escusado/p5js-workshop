// Globals
const frameWidth = 12;
const colorPrimary = "#fff";
const colorBackground = "#333";
const dotColor = "rgba(255,255,255,.6)";
const gridLineColor = "rgba(255,255,255,.1)";
const horizontalCellCount = 4;
const stageWidthPercent = 60;
const dotSize = 2.5;
const horizontalCellDotCount = 4;
const dotGridWidthPercent = 60;

let cellSize, verticalCellCount, stageHorizontalMargin, globalPaddingY, dotGridSize, dotGridMargin;

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);
  background(colorBackground);

  // Get starting dynamic values
  cellSize = Math.floor((windowWidth * (stageWidthPercent / 100)) / horizontalCellCount);

  verticalCellCount = Math.floor(windowHeight / cellSize) - 2;
  stageHorizontalMargin = (windowWidth - (cellSize * horizontalCellCount)) / 2;
  stageVerticalMargin = (windowHeight - (cellSize * verticalCellCount)) / 2;

  dotGridSize = (cellSize * (dotGridWidthPercent / 100));
  dotGridSeparation = dotGridSize / (horizontalCellDotCount);
  dotGridMargin = (((cellSize - dotGridSize) / 2) + dotGridSeparation) - dotSize / 2;

  // Prep stage
  // Main centering translate
  translate(stageHorizontalMargin, stageVerticalMargin);
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
  // swaure dot grid
  push();
  noStroke();
  fill(dotColor);
  translate(dotGridMargin, dotGridMargin);
  for (let i = 0; i < horizontalCellDotCount; i++) {
    for (let j = 0; j < horizontalCellDotCount; j++) {
      square(
        (i * dotGridSeparation) - dotGridSeparation / 2,
        (j * dotGridSeparation) - dotGridSeparation / 2,
        dotSize
      );
    }
  }
  pop();

  // line perimeter per cell
  push();
  noFill();
  strokeWeight(1);
  stroke(gridLineColor);
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