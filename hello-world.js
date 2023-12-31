function setup() {
  // createCanvas(windowWidth, windowHeight);
  createCanvas(windowWidth, windowHeight);
}

let oldMouseX = 0;
let oldMouseY = 0;
let colorCicler = 0;
function draw() {
  background("#FFFFFF11");
  colorCicler += 2;
  if (colorCicler > 360) {
    colorCicler = 0;
  }
  fill("#00FF00");
  strokeWeight(50);
  stroke(hslToHex(colorCicler, 100, 50));
  line(oldMouseX, oldMouseY, mouseX, mouseY);
  oldMouseX = mouseX;
  oldMouseY = mouseY;
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