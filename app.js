let grid;
let cols;
let rows;

// Frame rate slider HTML element
let frslider;
// Grid resolution HTML buttons
let gridSButton;
let gridMButton;
let gridLButton;
// Grid resolution
let resolution = 5;
// Freeze button HTML element
let frbutton;
// Freeze button state
let frozen = 0;

class Cell {
  constructor(state=0) {
    this.state = state;
  }
}

function makeGrid(cols, rows) {
    return Array(cols).fill().map(e => Array(rows).fill(new Cell()));
}

function countNeighbors(grid, x, y) {
  let sum = 0;
  for(let i = -1; i < 2; i++) {
    for(let j = -1; j < 2; j++) {

      // Wrap around the grid so that cells in the first and last column/row are neighbors
      let col = (x + i + cols) % cols;
      let row = (y + j + rows) % rows;

      sum += grid[col][row].state;
    }
  }
  // Subtract the original cell's value
  sum -= grid[x][y].state;
  return sum;
}

// Stops the draw loop from executing
function changeFreeze() {
  if(!frozen) {
    noLoop();
    frbutton.elt.innerHTML = "Unfreeze";
    frozen = 1;
  } else {
    loop();
    frbutton.elt.innerHTML = "Freeze";
    frozen = 0;
  }
}

function resetScreen(res) {
  resolution = res;
  cols = Math.floor(width / resolution);
  rows = Math.floor(height / resolution);

  grid = makeGrid(cols, rows);
  for(let i = 0; i < cols; i++) {
      for(let j = 0; j < rows; j++) {
        // Initialize with random state
        grid[i][j] = new Cell(floor(random(8)) === 0 ? 1 : 0);
      }
  }
}

function drawGrid() {
  // Black background
  background(0);
  
  for(let i = 0; i < cols; i++) {
    for(let j = 0; j < rows; j++) {
      let x = i * resolution;
      let y = j * resolution;
      if(grid[i][j].state === 1) {
        fill(255);
        stroke(0);
        rect(x, y, resolution-1, resolution-1); // -1 provides more space between cells
      }
    }
  }
}

/****************
 * Initialization
 ****************/
function setup() {
  // Canvas
  let grWidth = Math.floor(windowWidth / resolution) * resolution;
  let grHeight = (Math.floor(windowHeight / resolution) * resolution) - 100;
  createCanvas(grWidth, grHeight);

  // Framerate slider
  frslider = createSlider(2, 60, 10);
  frslider.position(80, 15);

  // Freeze button
  frbutton = createButton('Freeze');
  frbutton.position(250, 15);
  frbutton.mousePressed(changeFreeze);

  // Grid resolution buttons
  gridSButton = createButton('Small cells');
  gridSButton.position(350, 5);
  gridSButton.mousePressed(() => {
    resetScreen(5);
  });
  gridMButton = createButton('Medium cells');
  gridMButton.position(344, 30);
  gridMButton.mousePressed(() => {
    resetScreen(10);
  });
  gridLButton = createButton('Large cells');
  gridLButton.position(350, 55);
  gridLButton.mousePressed(() => {
    resetScreen(20);
  });

  // Start with default resolution of 10
  resetScreen(10);
}

/*******************
 * Primary draw loop
 *******************/
function draw() {
  // Update framerate according to the slider
  let fr = frslider.value();
  frameRate(fr);

  // Draw the grid
  drawGrid();
  
  // Initialize the grid for next frame
  let next = makeGrid(cols, rows);

  for(let i = 0; i < cols; i++) {
    for(let j = 0; j < rows; j++) {
      let cell = grid[i][j];
      let state = cell.state;

      // Check if the user toggled the frozen button while the app was drawing
      if(frozen) {
        drawGrid();
        next = grid;
        break;
      }

      // Count this cell's live neighbors
      let neighbors = countNeighbors(grid, i, j);

      // Apply game rules to obtain the next frame's grid
      if(state === 0 && neighbors === 3) {
        next[i][j].state = 1;
      } else if(state === 1 && (neighbors < 2 || neighbors > 3)) {
        next[i][j].state = 0;
      } else {
        next[i][j] = cell;
      }

    }
    if(frozen) break;
  }

  // Update grid for next frame
  grid = next;
}



// Enliven a cell by clicking on it
function mousePressed() {
  let cellX = Math.floor(mouseX/resolution);
  let cellY = Math.floor(mouseY/resolution);
  if(cellX < cols && cellX >= 0 && cellY < rows && cellY >= 0) {
    grid[cellX][cellY] = new Cell(1);
  }
  if(frozen) drawGrid();
}

let prevDragX, prevDragY;
function mouseDragged() {
  let cellX = Math.floor(mouseX/resolution);
  let cellY = Math.floor(mouseY/resolution);
  if(cellX !== prevDragX || cellY !== prevDragY) {
    if(cellX < cols && cellX >= 0 && cellY < rows && cellY >= 0) {
      grid[cellX][cellY] = new Cell(1);
    }
  }
  prevDragX = cellX;
  prevDragY = cellY;

  if(frozen) drawGrid();
}
