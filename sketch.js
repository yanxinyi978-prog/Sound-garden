let songTitle = "Instrumental test track"; // 换歌后，把这里改成歌曲名。
let petalColours = ["#f3bcd1", "#cfc2f0", "#f4d99c"];


let flowerX = [];
let flowerY = [];
let flowerColours = [];

let beat;             
let analyzer;         
let musicReady = false;
let gardenCanvas;
let petalSize = 18;   

function setup() {
  let holder = document.getElementById("canvas-holder");
  gardenCanvas = createCanvas(holder.clientWidth, 420);
  gardenCanvas.parent("canvas-holder");

  describe("A dark teal garden. Click to plant pastel flowers, or use the Plant a flower button. Music changes the size of their four petals.");

  document.getElementById("plant-button").disabled = false;
  document.getElementById("clear-button").disabled = false;
  document.getElementById("track-title").textContent = songTitle;

 
  beat = loadSound("beat.mp3", musicLoaded, musicFailed);
}

function musicLoaded() {
  analyzer = new p5.Amplitude();
  analyzer.setInput(beat);  
  analyzer.smooth(0.8);   
  beat.setLoop(true);      
  beat.setVolume(0.6);     
  musicReady = true;
  document.getElementById("music-button").disabled = false;
  document.getElementById("music-status").textContent = "Music ready. Plant a flower, then press play.";
}

function musicFailed() {
  document.getElementById("music-status").textContent = "Music could not load. Check beat.mp3 and open the page with Live Server. You can still plant flowers.";
}

function draw() {
  background("#102f33");

  
  let level = 0;
  if (musicReady && beat.isPlaying()) {
    level = analyzer.getLevel();
  }

  
  
  petalSize = 18 + level * 160;
  petalSize = constrain(petalSize, 18, 44); 

 
  for (let i = 0; i < flowerX.length; i++) {
    drawFlower(flowerX[i], flowerY[i], petalSize, flowerColours[i]);
  }

  if (flowerX.length === 0) {
    noStroke();
    fill("#c0d1c2");
    textFont("Georgia");
    textSize(width < 500 ? 21 : 28);
    textAlign(CENTER, CENTER);
    text("Every garden starts", width / 2, height / 2 - 18);
    text("with a single flower.", width / 2, height / 2 + 18);
  }
}

function drawFlower(x, y, size, petalColour) {

  stroke("#87ae82");
  strokeWeight(3);
  line(x, y, x, y + 85);

  noStroke();
  fill("#87ae82");
  ellipse(x - 12, y + 45, 28, 12);
  ellipse(x + 12, y + 62, 28, 12);


  fill(petalColour);
  let offset = size * 0.55;
  ellipse(x - offset, y, size, size);
  ellipse(x + offset, y, size, size);
  ellipse(x, y - offset, size, size);
  ellipse(x, y + offset, size, size);

  
  fill("#fff1c8");
  ellipse(x, y, 15, 15);
}

function mousePressed(event) {

  if (event.target === gardenCanvas.elt &&
      mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height) {
    plantFlower(mouseX, mouseY);
    return false;
  }
}

function plantFlower(x, y) {
  
  flowerX.push(constrain(x, 50, width - 50));
  flowerY.push(constrain(y, 50, height - 105));
  flowerColours.push(random(petalColours));
  updateFlowerCount();
}

function plantRandomFlower() {
  
  plantFlower(random(50, width - 50), random(50, height - 105));
}

function toggleMusic() {
  if (!musicReady) {
    return;
  }

  
  userStartAudio();
  let button = document.getElementById("music-button");

  if (beat.isPlaying()) {
    beat.pause();
    button.textContent = "Play music";
    button.setAttribute("aria-pressed", "false");
    document.getElementById("music-status").textContent = "Music paused. Your flowers are resting.";
  } else {
    beat.play(); 
    button.textContent = "Pause music";
    button.setAttribute("aria-pressed", "true");
    document.getElementById("music-status").textContent = "Music playing. Watch the petals open and close.";
  }
}

function clearGarden() {
  flowerX = [];
  flowerY = [];
  flowerColours = [];
  updateFlowerCount();
  
}

function updateFlowerCount() {
  let label = flowerX.length + " flowers";
  if (flowerX.length === 1) {
    label = "1 flower";
  }
  document.getElementById("flower-count").textContent = label;
}

function windowResized() {

  let oldWidth = width;
  let newWidth = document.getElementById("canvas-holder").clientWidth;
  resizeCanvas(newWidth, 420);
  for (let i = 0; i < flowerX.length; i++) {
    flowerX[i] = constrain(flowerX[i] / oldWidth * newWidth, 50, width - 50);
  }
}
