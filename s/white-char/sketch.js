// Globals
const frameWidth = 12;

const colorFrame = "#fff";
const colorBackground = "#333";
const colorDot = "rgba(255,255,255,.6)";
const colorGridLine = "rgba(255,255,255,.1)";
const colorOccupiedSpot = "rgba(255,255,255,.1)";
const colorBrush = "#fff";

const horizontalCellCount = 5;
const stageWidthPercent = 75;
const dotSize = 2.5;
const brushSize = dotSize * 4;
const horizontalCellDotCount = 5;
const dotGridWidthPercent = 90;
const maxPossibleSegmentsPerCharacter = 3;
const changeDirectionProbability = 0.1;
const maxPossibleInkUnitsPerSegment = (horizontalCellDotCount * horizontalCellDotCount) * 2;

let cellSize, verticalCellCount, stageHorizontalMargin, globalPaddingY, dotGridSize, dotGridMargin, charactersSegments;

// tracks the dots positions after creating the dot grid
// so we can use it to create the characters
let dotGridPositions = [];

// Keeps track of the drawing animated brushes positions
const defaultSegmentBrush = {
  pixelCoordinateX: 0,
  pixelCoordinateY: 0,
  color: colorBrush,
  segmentIndex: 0,
  segmentLength: 0,
  vertexIndex: 0,
};
let segmentBrushes = [];

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

  // prefill charactersSegments spaces
  charactersSegments = Array.from(Array(horizontalCellCount), _ => Array(verticalCellCount).fill([]));
  segmentBrushes = Array.from(Array(horizontalCellCount), _ => Array(verticalCellCount).fill([]));

  // Prep stage
  // Main centering translate
  translate(stageHorizontalMargin, stageVerticalMargin);
  // Outside thick frame
  drawOutsideFrame();
  // Draw "dotted" background
  iterateOverMainGrid(drawBackgroundCell);

  // Create the characters
  iterateOverMainGrid(createCharacter);

  // Draw the characters
  iterateOverMainGrid(drawOccupiedCharacterSpots);


}

// Draw thick frame outside of grid
function drawOutsideFrame() {
  push();
  noStroke();
  fill(colorFrame);
  rect(0 - frameWidth / 2, 0 - frameWidth / 2, cellSize * horizontalCellCount + frameWidth, cellSize * verticalCellCount + frameWidth);
  fill(colorBackground);
  rect(0, 0, cellSize * horizontalCellCount, cellSize * verticalCellCount);
  pop();
}

// Generic function to draw a grid of cells w/ a custom drawing fn
function iterateOverMainGrid(cellMethod) {
  for (let i = 0; i < horizontalCellCount; i++) {
    for (let j = 0; j < verticalCellCount; j++) {
      push();
      translate(i * cellSize, j * cellSize);
      cellMethod(i, j);
      pop();
    }
  }
}

// Background "dot-grid" cell
function drawBackgroundCell() {
  // sqaure dot grid
  push();
  noStroke();
  fill(colorDot);
  translate(dotGridMargin, dotGridMargin);
  for (let i = 0; i < horizontalCellDotCount; i++) {
    dotGridPositions[i] = [];
    for (let j = 0; j < horizontalCellDotCount; j++) {
      const x = (i * dotGridSeparation) - dotGridSeparation / 2;
      const y = (j * dotGridSeparation) - dotGridSeparation / 2;
      square(
        x,
        y,
        dotSize
      );
      dotGridPositions[i][j] = { x, y };
    }
  }
  pop();

  // line perimeter per cell
  push();
  noFill();
  strokeWeight(1);
  stroke(colorGridLine);
  square(0, 0, cellSize);
  pop();
}

// Creates the random character segments
function createCharacter(characterX, characterY) {
  const randomSegmentsCount = random(maxPossibleSegmentsPerCharacter);
  const currentCharacterOccupiedSpots = Array.from(Array(horizontalCellDotCount), _ => Array(horizontalCellDotCount).fill(false));

  // Get random starting points for the segments, (`while`) makes sure we get ALL the starting points
  const randomSegmentsStartingPoints = [];
  while (randomSegmentsStartingPoints.length < randomSegmentsCount) {
    const position = {
      x: Math.floor(random(horizontalCellDotCount)),
      y: Math.floor(random(horizontalCellDotCount))
    };
    if (!randomSegmentsStartingPoints.some(p => p.x === position.x && p.y === position.y)) {
      randomSegmentsStartingPoints.push(position);
      currentCharacterOccupiedSpots[position.x][position.y] = true; // occupy startig point
    }
  }

  let currentCharacterSegments = [];
  let currentCharacterBrushes = [];
  for (let startingPoint of randomSegmentsStartingPoints) {
    // start segment
    let currentSegment = [startingPoint];
    // Get random direction [up,right,down,left]
    let randomDirection = Math.floor(random(4));
    // Get random line length
    let remainingInkUnits = Math.floor(random((maxPossibleInkUnitsPerSegment)));
    let lastBrushPosition = { ...startingPoint };

    // Draw the line segments until we run out of ink
    while (remainingInkUnits) {
      // Cointoss to change direction
      if (Math.random() > changeDirectionProbability) {
        randomDirection = Math.floor(random(4));
      }

      // Get candidate brush position based on direction and wrap around
      let candidateBrushPosition = { ...lastBrushPosition };
      // up
      if (randomDirection === 0) {
        candidateBrushPosition.y--;
        if (candidateBrushPosition.y < 0) {
          candidateBrushPosition.y = horizontalCellDotCount - 1;
          continue;
        }
      }

      // right
      if (randomDirection === 1) {
        candidateBrushPosition.x++;
        if (candidateBrushPosition.x >= horizontalCellDotCount) {
          candidateBrushPosition.x = 0;
          continue;
        }
      }

      // down
      if (randomDirection === 2) {
        candidateBrushPosition.y++;
        if (candidateBrushPosition.y >= horizontalCellDotCount) {
          candidateBrushPosition.y = 0;
          continue;
        }
      }

      // left
      if (randomDirection === 3) {
        candidateBrushPosition.x--;
        if (candidateBrushPosition.x < 0) {
          candidateBrushPosition.x = horizontalCellDotCount - 1;
          continue;
        }
      }

      // spot taken try again
      if (currentCharacterOccupiedSpots[candidateBrushPosition.x][candidateBrushPosition.y]) {

        // only if is the last ink unit, connect it to the blocking path
        if (remainingInkUnits === 1 && candidateBrushPosition.x === startingPoint.x && candidateBrushPosition.y === startingPoint.y) {
          currentSegment.push(candidateBrushPosition);
        }

        // reduce ink units so we don't get stuck in an infinite loop when trapped by other segments 🌀
        remainingInkUnits--;
        continue;
      }

      // spot free, draw
      currentSegment.push(candidateBrushPosition);
      currentCharacterOccupiedSpots[candidateBrushPosition.x][candidateBrushPosition.y] = true;
      lastBrushPosition = { ...candidateBrushPosition };
      remainingInkUnits--;
    }
    currentCharacterSegments.push(currentSegment);
    currentCharacterBrushes.push({
      ...defaultSegmentBrush,
      segmentIndex: currentCharacterSegments.length - 1,
      segmentLength: currentSegment.length,
      vertexIndex: 0,
      pixelCoordinateX: dotGridPositions[startingPoint.x][startingPoint.y].x,
      pixelCoordinateY: dotGridPositions[startingPoint.x][startingPoint.y].y,
    });
  }

  // save character segments to global grid
  charactersSegments[characterX][characterY] = [...currentCharacterSegments];
  segmentBrushes[characterX][characterY] = [...currentCharacterBrushes];
}

// Draw the occupied spots of a character as faint squares
function drawOccupiedCharacterSpots(x, y) {
  push();
  noStroke();
  fill(colorOccupiedSpot);
  const characterSegments = charactersSegments[x][y];
  const padding = dotGridMargin - (brushSize / 2) + (dotSize / 2);

  translate(padding, padding);
  for (let segment of characterSegments) {
    for (let position of segment) {
      const x = (position.x * dotGridSeparation) - dotGridSeparation / 2;
      const y = (position.y * dotGridSeparation) - dotGridSeparation / 2;
      square(
        x,
        y,
        brushSize
      );
    }
  }
  pop();
}

function draw() {
  // Main centering translate
  translate(stageHorizontalMargin, stageVerticalMargin);
  iterateOverMainGrid(drawAnimatedBrushes);

}

const drawAnimatedBrushes = (x, y) => {
  const characterSegments = charactersSegments[x][y];
  const characterBrushes = segmentBrushes[x][y];
  const padding = dotGridMargin - (brushSize / 2) + (dotSize / 2);

  push();
  noStroke();
  fill(colorBrush);
  translate(padding, padding);

  for (let brush of characterBrushes) {
    const targetVertexPosition = characterSegments[brush.segmentIndex][brush.vertexIndex];
    const targetPosition = dotGridPositions[targetVertexPosition.x][targetVertexPosition.y];
    const targetX = targetPosition.x;
    const targetY = targetPosition.y;

    brush.pixelCoordinateX = lerp(brush.pixelCoordinateX, targetX, 0.1);
    brush.pixelCoordinateY = lerp(brush.pixelCoordinateY, targetY, 0.1);

    // draw brush
    square(
      brush.pixelCoordinateX,
      brush.pixelCoordinateY,
      brushSize
    );

    // move to next vertex
    if (Math.abs(targetX - brush.pixelCoordinateX) < 0.2 &&
      Math.abs(targetY - brush.pixelCoordinateY) < 0.2) {
      brush.vertexIndex++;
      if (brush.vertexIndex === brush.segmentLength) {
        brush.vertexIndex = brush.segmentLength - 1;
      }
    }
  }
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