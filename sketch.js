// Global variables
// Size of each cell on grid
let cellSize = 30;

// Number of rows and columns
let numOfCols;
let numOfRows;

// Remember rows are y
// Columns are x

// Arrays that hold objects in grid
let garden = [];
let nextGarden = [];

// Probabilities
// Feel free to change these ONLY
let probDeath = 0.02;
let probSeed = 0.125;
let probRecovery = 0.25;
let probSick = 0.15;
let probGrowth = 0.75;

// Controls
let play = false;
let music = false;

// Images
let seedImg;
let sapImg;
let plantImg;

// Music
let wetHands;
let camVer;

// Load images and music
function preload() {
  // Music
  soundFormats("mp3");
  wetHands = loadSound("music/wetHands.mp3");
  camVer = loadSound("music/caminosVerdes.mp3");

  // Images
  seedImg = loadImage("sprites/seed.png");
  sapImg = loadImage("sprites/sapling.png");
  plantImg = loadImage("sprites/poppy.png");
}

function setup() {
  // Set image mode to center
  imageMode(CENTER);

  // Resize the seed image
  // This is because they look bigger than the other sprites
  seedImg.resize(15, 15);
  
  // Set framerate to 5 to avoid having it go too fast
  frameRate(5);

  // Canvas size is divisible by cell size
  createCanvas(630, 420);

  // Calculate columns and rows
  numOfCols = floor(width / cellSize);
  numOfRows = floor(height / cellSize);

  // Make space for the instructions
  numOfCols = numOfCols - 2;
  numOfRows = numOfRows - 3;

  // Set each row to an empty array that holds columns
  for (r = 0; r < numOfRows; r++) {
    garden[r] = [];
    nextGarden[r] = [];
  }
  
  // Reset arrays
  resetArrays();
}

function resetArrays() {
  // Populate the arrays
  let y = 15 + cellSize;
  for (let r = 0; r < numOfRows; r++) {
    let x = 15 + cellSize;
    for (let c = 0; c < numOfCols; c++) {
      n = new Empty(x, y)
      garden[r][c] = n;
      nextGarden[r][c] = n;
      x += cellSize;
    }
    y = y + cellSize;
  }
}

function draw() {
  // Only grow if the player pressed 'p'
  if (play) {
    grow();
  }

  // Set background green to look like grass
  background(34, 139, 34);

  // Render the array
  for (let r = 0; r < numOfRows; r++) {
    for (let c = 0; c < numOfCols; c++) {
      // Draw the background
      fill(205, 133, 63);
      stroke(139,69,19);

      let x = (c * cellSize) + cellSize;
      let y = (r * cellSize) + cellSize;

      rect(x, y, cellSize, cellSize);

      // Render each sprite
      if (garden[r][c].num != 0) {
        garden[r][c].render(); 
      }  
    }
  }
  
  // Add instructions
  noStroke();
  fill(255);
  textSize(20);
  textFont('Palatino');
  text("Click on the squares to plant a seed.", 10, 385);
  text("Press 'p' to play/pause growth and 'r' to reset the garden.", 10, 410);
}

class Empty {
  constructor(x, y) {
    // Set the properties
    // It has an x and y to avoid losing the coordinates
    this.x = x;
    this.y = y;
    this.num = 0;
  }
}

class Seed {
  constructor(x, y) {
    // Set the properties
    this.x = x;
    this.y = y;
    this.num = 1;
  }
  render() {
    // Display image
    // Make sure to do no tint so its color isn't affected
    noTint();
    image(seedImg, this.x, this.y);
  }
}

class Sapling {
  constructor(x, y) {
    // Set the properties
    this.x = x;
    this.y = y;
    this.num = 2;

    // Sickness variables
    this.infected = false;
    this.sickLength = 0;
  }
  render() {
    // Display image
    if (this.infected) {
      tint(255,0,0);
    }
    else {
      noTint();
    }
    image(sapImg, this.x, this.y);
  }
  infect() {
    // If not sick, there's a chance it can get sick
    if (!this.infected && Math.random() <= probSick) {
      this.infected = true;

      // Reset the period it spent sick
      this.sickLength = 0;
    }

    // If sick, there's a chance it can recover
    else if (this.infected && Math.random() <= probRecovery) {
      this.infected = false;

      // Reset the period it spent sick
      this.sickLength = 0;
    }
    else if (this.infected) {
      // It stays sick
      // Update how long it has been sick
      this.sickLength++;
    }
  }
}

class Plant {
  constructor(x, y) {
    // Set properties
    this.x = x;
    this.y = y;
    this.num = 3;

    // Sickness variables
    this.infected = false;
    this.sickLength = 0;

    // Set age to 0 since it was just grown
    this.age = 0;
  }
  render() {
    // Display image
    if (this.infected) {
      tint(0,255,0);
    }
    else {
      noTint();
    }
    image(plantImg, this.x, this.y);
  }
  infect() {
    // If not sick, there's a chance it can get sick
    if (!this.infected && Math.random() <= probSick) {
      this.infected = true;

      // Reset the period it spent sick
      this.sickLength = 0;
    }

    // If sick, there's a chance it can recover
    else if (this.infected && Math.random() <= probRecovery) {
      this.infected = false;

      // Reset the period it spent sick
      this.sickLength = 0;
    }
    else if (this.infected) {
      // It stays sick
      // Update how long it has been sick
      this.sickLength++;
    }
  }
}

function mouseClicked() {
  if (!play) {
  // Check what row and column was pressed
  r = floor(mouseY / cellSize);
  c = floor(mouseX / cellSize);

  // Subtract 1 so the rows and columns are accurate
  r -= 1;
  c -= 1;
  
  // Plant the seed
  garden[r][c] = new Seed(mouseX, mouseY);
  }
  
  // Add this so music can actually play in browsers
  // usually blocked w/out user gesture in modern day browsers
  // which is annoying
  if (!music) {
    // Play music and loop it
    music = true;
    num = Math.random();

    if (num <= 0.5) {
      wetHands.play();
      wetHands.loop();
    }
    else {
      camVer.play();
      camVer.loop();
    }
  }
}

function keyPressed() {
  // Press p to start/pause the simulation
  if (key === 'p') {
    if (play) {
      play = false;
    }
    else {
      play = true;
    }
  }

  // Press r to reset
  if (key === 'r') {
    play = false;
    resetArrays();
  }
}

// Create a new generation
let plants;
let infectedCount;

function grow() {
  // Loop through the whole array
  for (let r = 0; r < numOfRows; r++) {
    for (let c = 0; c < numOfCols; c++) {
      // Reset counts
      let count = 0;
      infectedCount = 0;
      plants = 0;
      
      // Grab column and row indices
      let left = c - 1;
      let right = c + 1;
      let top = r - 1;
      let bottom = r + 1;
      
      // Check the counts
      // Top left
      if (r != 0 && c != 0 && garden[top][left].num != 0) {
        count++;
        checkPlants(top, left);
      }
      // Top
      if (r != 0 && garden[top][c].num != 0) {
        count++;
        checkPlants(top, c);
      }
      // Top right
      if (r != 0 && c != (numOfCols - 1) && garden[top][right].num != 0) {
        count++;
        checkPlants(top, right);
      }
      // Left
      if (c != 0 && garden[r][left].num != 0) {
        count++;
        checkPlants(r, left);
      }
      // Right
      if (c != (numOfCols - 1) && garden[r][right].num != 0) {
        count++;
        checkPlants(r, right);
      }
      // Bottom left
      if (r != (numOfRows - 1) && c != 0 && garden[bottom][left].num != 0) {
        count++;
        checkPlants(bottom, left);
      }
      // Bottom
      if (r != (numOfRows - 1) && garden[bottom][c].num != 0) {
        count++;
        checkPlants(bottom, c);
      }
      // Bottom right
      if (r != (numOfRows - 1) && c != (numOfCols - 1) && garden[bottom][right].num != 0) {
        count++;
        checkPlants(bottom, right);
      }

      // Get the x and y
      let x = garden[r][c].x;
      let y = garden[r][c].y;

      // RULES

      // If it is empty and there are at least 2 plants
      // and less than 3 saplings/plants are sick
      // There is a chance that a seed may take root in the empty space
      // The more plants, the more likely there is to be a seed
      // Else, remain empty
      if (garden[r][c].num === 0) {
        if(plants >= 2 && infectedCount < 3 && Math.random() <= (probSeed * plants)) {
          nextGarden[r][c] = new Seed(x,y);
        }
        else {
          nextGarden[r][c] = garden[r][c];
        }
      }

      // If it is a seed
      // If more than 5 or less than 2 neighbors present, die
      // Also dies if more than 3 sick neighbors
      // Else there's the chance it may grow if there are enough healthy neighbors
      // Otherwise remain a seed
      else if(garden[r][c].num === 1) {
        if (count > 5 || count < 2) {
          nextGarden[r][c] = new Empty(x,y);
        }
        else if (infectedCount > 3) {
          nextGarden[r][c] = new Empty(x,y);
        }
        else if (infectedCount < 3 && Math.random() <= probGrowth) {
          nextGarden[r][c] = new Sapling(x,y);
        }
        else {
          nextGarden[r][c] = garden[r][c];
        }
      }

      // If it is a sapling
      // If 6 or more or less than 2 neighbors present, die
      // Else there's a chance it can grow only if it's healthy
      else if(garden[r][c].num === 2) {
        if (count >= 6 || count < 2) {
          nextGarden[r][c] = new Empty(x,y);
        }
        else {
          // If more than 3 neighbors sick, it gets sick too
          if (infectedCount > 3 && !garden[r][c].infected) {
            garden[r][c].infected = true;
          }
          else {
            // Call infect to see if it recovers or gets sick
            garden[r][c].infect();
          }          

          // Check how long it has been sick
          // If more than 5 generations sick, it dies
          // Else it remains the same
          if (garden[r][c].sickLength > 5) {
            nextGarden[r][c] = new Empty(x,y);
          }
          else if (!garden[r][c].infected && Math.random() <= probGrowth) {
            nextGarden[r][c] = new Plant(x,y);
          }
          else {
            nextGarden[r][c] = garden[r][c];
          }
        }
      }

      // If it is a plant
      // If more than 5 plants or more than 6 neighbors present, die
      else if (garden[r][c].num === 3) {
        if (plants > 5 || count > 6) {
          nextGarden[r][c] = new Empty(x,y);
        }
        // There is a chance it may die even after getting through the first check
        // The older they are, their chances increase (probDeath * age)
        else if(Math.random() <= (probDeath * garden[r][c].age)) {
          nextGarden[r][c] = new Empty(x,y);
        }
        else {
          // Increase the age since it lived
          garden[r][c].age++;

          // If more than 4 neighbors sick, it gets sick too
          if (infectedCount > 4 && !garden[r][c].infected) {
            garden[r][c].infected = true;
          }
          else {
            // Call infect to see if it recovers or gets sick
            garden[r][c].infect();
          }

          // Check how long it has been sick
          // If more than 5 generations sick, it dies
          // Else remain the same
          if (garden[r][c].sickLength > 5) {
            nextGarden[r][c] = new Empty(x,y);
          }
          else {
            nextGarden[r][c] = garden[r][c];
          }
        }
      }
    }
  }

  // Set the garden to the next gen
  let temp = garden;
  garden = nextGarden;
  nextGarden = temp;
}

// Helper function to check plant and infection count
function checkPlants(r, c) {
  // If a plant, add to the plant count
  if (garden[r][c].num === 3) {
    plants++;
  }

  // If sapling or plant, check if it is sick
  if (garden[r][c].num === 3 || garden[r][c].num === 2) {
    if (garden[r][c].infected) {
      infectedCount++;
    }
  }
}