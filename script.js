// Initialize a 4x4 grid and score
var grid = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
];

var score = 0;

// Select the score display and game-over message
var scoreBoard = document.getElementById("score");
var gameOverMessage = document.getElementById("game-over");

// Function to draw the grid on the screen
function drawGrid() {
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            var tile = document.getElementById("tile-" + i + "-" + j);
            var value = grid[i][j];
            if (value === 0) {
                tile.innerHTML = ""; 
            } else {
                tile.innerHTML = value; 
            }
            tile.style.backgroundColor = getTileColor(value);
        }
    }
}


function getTileColor(value) {
    switch (value) {
        case 2: return "#eee4da";
        case 4: return "#ede0c8";
        case 8: return "#f2b179";
        case 16: return "#f59563";
        case 32: return "#f67c5f";
        case 64: return "#f65e3b";
        case 128: return "#edcf72";
        case 256: return "#edcc61";
        case 512: return "#edc850";
        case 1024: return "#edc53f";
        case 2048: return "#edc22e";
        default: return "#cdc1b4";
    }
}

// Function to slide non-zero values to the left
function slideRow(row) {
    var newRow = [];
    for (var i = 0; i < row.length; i++) {
        if (row[i] !== 0) {
            newRow.push(row[i]);
        }
    }
    while (newRow.length < 4) {
        newRow.push(0);
    }
    return newRow;
}

// Combine tiles if they are the same
function combineRow(row) {
    for (var i = 0; i < 3; i++) {  
        if (row[i] !== 0 && row[i] === row[i + 1]) {
            row[i] *= 2;  
            row[i + 1] = 0;  
            updateScore(row[i]); 
        }
    }
    return row;
}


// Function to move tiles to the left
function moveLeft() {
    var moved = false; 

    for (var i = 0; i < 4; i++) {
        var originalRow = [];
        for (var j = 0; j < 4; j++) {
            originalRow.push(grid[i][j]);
        }

        var rowAfterSlide = slideRow(grid[i]);
        var rowAfterCombine = combineRow(rowAfterSlide); 
        var newRow = slideRow(rowAfterCombine); 
        
        for (var j = 0; j < 4; j++) {
            grid[i][j] = newRow[j];
        }

        
        var rowChanged = false;
        for (var j = 0; j < 4; j++) {
            if (originalRow[j] !== newRow[j]) {
                rowChanged = true;
                break;
            }
        }

        if (rowChanged) {
            moved = true;
        }
    }

    return moved;
}


// Rotate the grid  (90 degrees)
function rotateGrid() {
    var newGrid = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ];
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            newGrid[j][3 - i] = grid[i][j];
        }
    }

    // Copy newGrid back to grid
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            grid[i][j] = newGrid[i][j];
        }
    }
}


// Move tiles based on direction
function move(direction) {
    var moved = false;
    switch (direction) {
        case "ArrowUp":
            rotateGrid();
            rotateGrid();
            rotateGrid();
            moved = moveLeft();
            rotateGrid();
            break;
        case "ArrowDown":
            rotateGrid();
            moved = moveLeft();
            rotateGrid();
            rotateGrid();
            rotateGrid();
            break;
        case "ArrowLeft":
            moved = moveLeft();
            break;
        case "ArrowRight":
            rotateGrid();
            rotateGrid();
            moved = moveLeft();
            rotateGrid();
            rotateGrid();
            break;
    }

    if (moved) {
        addRandomTile();
        drawGrid();
        checkGameOver();
    }
}


// Function to add a new tile (2 or 4) at a random empty position
function addRandomTile() {
    
    var emptyTiles = []; 
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            if (grid[i][j] === 0) { 
                emptyTiles.push(i + "," + j); 
            }
        }
    }

    // Step 2: Add a new tile if there are empty tiles
    if (emptyTiles.length > 0) {
        
        var randomIndex = Math.floor(Math.random() * emptyTiles.length);
        var chosenTile = emptyTiles[randomIndex].split(","); 
        var row = parseInt(chosenTile[0]);
        var col = parseInt(chosenTile[1]);

        
        var newValue;
        if (Math.random() < 0.9) {
            newValue = 2; 
        } else {
            newValue = 4; 
        }
        grid[row][col] = newValue;
    }
}


// It updates the score points on scoreboard
function updateScore(points) {
    score += points;
    scoreBoard.innerHTML = score;
}


// Checks the game is over
function checkGameOver() {
    for (var i = 0; i < 4; i++) {
      for (var j = 0; j < 4; j++) {
        if (grid[i][j] === 0) {
          return;
        }
        if (j < 3 && grid[i][j] === grid[i][j + 1]) {
          return;
        }
        if (i < 3 && grid[i][j] === grid[i + 1][j]) {
          return;
        }
      }
    }
  
    triggerGameOver();
}
  
// Triggers the animation on Gameover
function triggerGameOver() {
var overlay = document.getElementById("game-over-overlay");
var gameGrid = document.getElementById("game-grid");

gameGrid.classList.add("fade-out");

setTimeout(() => {
    overlay.classList.add("show");
}, 500); 
}


function startGame() {
    addRandomTile();
    addRandomTile();
    drawGrid();
}


document.addEventListener("keydown", function(event){
    move(event.key);
});

startGame();

function restart(){
    location.reload();
}