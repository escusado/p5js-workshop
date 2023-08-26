function setup() {
  createCanvas(windowWidth, windowHeight);
  strokeWeight(2);
  stroke(5);
  rectMode(CENTER);
  angleMode(DEGREES);
}

let myPosX = 0;
let myPosY = 0;
let colorCicler = 0;
let timeCollector = 0;
let squareSize = 100;

function draw() {
  colorCicler += 2;
  if (colorCicler > 360) {
    colorCicler = 0;
  }
  fill(hslToHex(colorCicler, 100, 50));
  stroke(hslToHex(360 - colorCicler, 100, 50));
  myPosX = lerp(myPosX, mouseX, 0.05);
  myPosY = lerp(myPosY, mouseY, 0.05);
  
  translate (myPosX, myPosY);
  rotate(frameCount % 360);
  rect(0,0,100,100);
  
  // squareSize = map(colorCicler, 0, 360, 100, 200);
  // translate(windowWidth/2,windowHeight/2);
  // rotate(colorCicler * Math.PI/180);
  // rect(circlePosX , curclePosY , squareSize);
  

  background("#00003311");
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