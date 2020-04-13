let grid;
let cols;
let rows;
let frslider;
let frbutton;
let resolution = 10;
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

      let col = (x + i + cols) % cols;
      let row = (y + j + rows) % rows;

      sum += grid[col][row].state;
    }
  }
  sum -= grid[x][y].state;
  return sum;
}

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

function setup() {
  let grWidth = Math.floor(windowWidth / resolution) * resolution;
  let grHeight = (Math.floor(windowHeight / resolution) * resolution) - 100;
  createCanvas(grWidth, grHeight);
  frslider = createSlider(1, 60, 10);
  frslider.position(80, 15);
  frbutton = createButton('Freeze');
  frbutton.position(250, 15);
  frbutton.mousePressed(changeFreeze);
  cols = width / resolution;
  rows = height / resolution;

  grid = makeGrid(cols, rows);
  for(let i = 0; i < cols; i++) {
      for(let j = 0; j < rows; j++) {
        // Initialize with random state
        grid[i][j] = new Cell(floor(random(2)));
      }
  }
}

function draw() {
  background(0);
  let fr = frslider.value();
  frameRate(fr);
  for(let i = 0; i < cols; i++) {
    for(let j = 0; j < rows; j++) {
      let x = i * resolution;
      let y = j * resolution;
      if(grid[i][j].state) {
        fill(255);
        stroke(0);
        rect(x, y, resolution-1, resolution-1);
      }
    }
  }
  
  let next = makeGrid(cols, rows);

  for(let i = 0; i < cols; i++) {
    for(let j = 0; j < rows; j++) {
      let state = grid[i][j].state;

      // Count live neighbors
      let neighbors = countNeighbors(grid, i, j);

      // Game rules
      if(state == 0 && neighbors == 3) {
        next[i][j].state = 1;
      } else if(state == 1 && (neighbors < 2 || neighbors > 3)) {
        next[i][j].state = 0;
      } else {
        next[i][j] = grid[i][j];
      }

    }
  }

  grid = next;
}

// Enliven a cell by clicking on it
function mousePressed() {
  for(let i = 0; i < cols; i++) {
    for(let j = 0; j < rows; j++) {
      if(mouseX > i * resolution && mouseX < (i+1)*resolution && mouseY > j * resolution && mouseY < (j+1)*resolution) {
        grid[i][j].state = 1;
      }
    }
  }
}
function mouseDragged() {
  for(let i = 0; i < cols; i++) {
    for(let j = 0; j < rows; j++) {
      if(mouseX > i * resolution && mouseX < (i+1)*resolution && mouseY > j * resolution && mouseY < (j+1)*resolution) {
        grid[i][j].state = 1;
      }
    }
  }
}