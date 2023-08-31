/* jshint esversion: 9 */
let imageHead, imageTail, imageBody, imageLastBody;
let colorCicler = 0;

const bodyPiecesCount = 15;
const headWidth = 200;
const bodyWidth = headWidth / 2;

let detaultPart;
let theBodyOfGod = [];

function preload() {
  imageHead = loadImage('head.png');
  imageBody = loadImage('body.png');
  imageLastBody = loadImage('last-body.png');
  imageTail = loadImage('tail.png');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  strokeWeight(2);
  stroke(5);
  rectMode(CENTER);
  // angleMode(DEGREES);

  theBodyOfGod.push({ image: imageHead, x: 0, y: 0, rotation: 0 });
  for (let i = 0; i < bodyPiecesCount - 3; i++) {
    theBodyOfGod.push({ image: imageBody, x: 0, y: 0, rotation: 0 });
  }
  theBodyOfGod.push({ image: imageLastBody, x: 0, y: 0, rotation: 0 });
  theBodyOfGod.push({ image: imageTail, x: 0, y: 0, rotation: 0 });
}

function draw() {
  colorCicler += 2;
  if (colorCicler > 360) {
    colorCicler = 0;
  }
  fill(hslToHex(colorCicler, 100, 50));
  stroke(hslToHex(360 - colorCicler, 100, 50));


  // draw tail first
  for (let i = theBodyOfGod.length - 1; i > -1; i--) {
    push();
    const part = theBodyOfGod[i];
    const nextPartPosition = i > 0 ? { x: theBodyOfGod[i - 1].x, y: theBodyOfGod[i - 1].y } : { x: mouseX, y: mouseY };

    part.x = lerp(part.x, nextPartPosition.x, bodyPiecesCount * 0.01);
    part.y = lerp(part.y, nextPartPosition.y, bodyPiecesCount * 0.01);

    let targetAngle = Math.atan2(nextPartPosition.y - part.y, nextPartPosition.x - part.x) + PI / 2;
    part.rotation = lerp(part.rotation, targetAngle, i === 0 ? 1 : 0.2);
    translate(part.x, part.y);
    rotate(part.rotation);

    const squareWidth = i === 0 ? headWidth : bodyWidth;
    tint(hslToHex((frameCount - i * 20) % 360, 50, 80));
    image(part.image, -squareWidth / 2, -squareWidth / 2, squareWidth, squareWidth);
    pop();
  }

  background("#33333311 ");
}

function hslToHex(h, s, l) {
  l /= 100;
  const a = s * Math.min(l, 1 - l) / 100;
  const f = n => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');   // convert to Hex and prefix "0" if needed
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}