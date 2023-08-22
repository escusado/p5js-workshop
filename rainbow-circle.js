function setup() {
  createCanvas(windowWidth, windowHeight);
  strokeWeight(2);
  stroke(5);
}

let circlePosX = 0;
let curclePosY = 0;
let colorCicler = 0;
let timeCollector = 0;

function draw() {
  colorCicler += 2;
  if (colorCicler > 360) {
    colorCicler = 0;
  }
  fill(hslToHex(colorCicler, 100, 50));
  stroke(hslToHex(360 - colorCicler, 100, 50));
  circlePosX = lerp(circlePosX, mouseX, 0.05);
  curclePosY = lerp(curclePosY, mouseY, 0.05);
  circle(circlePosX, curclePosY, 50);
  background("#33333311");
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