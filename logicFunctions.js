


// function to create a 2d array with all cells initialised as 0
const create2DArray = function (row, column) {
    let grid = new Array(row);
    for (i = 0; i < row; i++) {
      grid[i] = new Array(column);
      for (j = 0; j < column; j++) {
        grid[i][j] = 0;
      }
    }
  
    return grid;
  };
  

// Function to calculate the number of mines
function calculateMines(gridSize, difficulty) {
    let difficultyPercentage;

    // Assign percentage based on difficulty
    switch (difficulty) {
        case "easy":
            difficultyPercentage = 0.10; // 10%
            break;
        case "medium":
            difficultyPercentage = 0.15; // 15%
            break;
        case "hard":
            difficultyPercentage = 0.20; // 20%
            break;
    }

    // Calculate the number of mines
    return Math.round(gridSize * gridSize * difficultyPercentage);
}


//function to place mines in a grid
  const placeMines = function (grid, size, mine) {
    while (mine > 0) {
      let xCoord = Math.floor(Math.random() * size);
      let yCoord = Math.floor(Math.random() * size);
      if (grid[xCoord][yCoord] !== -1) {
        grid[xCoord][yCoord] = -1;
        mine--;
      }
    }
  };
  
// function to add numbers to the grid
  const markGrid = function (grid, size) {
    for (i = 0; i < size; i++) {
      for (j = 0; j < size; j++) {
        if (grid[i][j] === -1) continue;
  
        let mines = 0;
        // checking for each cell around the current cell
        if (j + 1 < size && grid[i][j + 1] == -1) mines++;
        if (j - 1 >= 0 && grid[i][j - 1] == -1) mines++;
        if (i + 1 < size && grid[i + 1][j] == -1) mines++;
        if (i - 1 >= 0 && grid[i - 1][j] == -1) mines++;
        if (i - 1 >= 0 && j + 1 < size && grid[i - 1][j + 1] == -1) mines++;
        if (i - 1 >= 0 && j - 1 >= 0 && grid[i - 1][j - 1] == -1) mines++;
        if (i + 1 < size && j - 1 >= 0 && grid[i + 1][j - 1] == -1) mines++;
        if (i + 1 < size && j + 1 < size && grid[i + 1][j + 1] == -1) mines++;
  
        grid[i][j] = mines;
      }
    }
  };
  

// function to change reveal grid according to selected cell
  function checkGrid(grid, revealGrid, size, xCoord, yCoord) {
    // this function only executes if the cell number in input is valid
    if (xCoord >= 0 && xCoord < size && yCoord >= 0 && yCoord < size) {
      // stops if it founds a number greater than 0 and its not reveal till now
      if (grid[xCoord][yCoord] > 0 && revealGrid[xCoord][yCoord] == 0) {
        revealGrid[xCoord][yCoord] = 1;
        return;
      }
  
      // go to each cell with 0 and repeat the process for the adjacent cells
      if (grid[xCoord][yCoord] == 0 && revealGrid[xCoord][yCoord] == 0) {
        revealGrid[xCoord][yCoord] = 1;
        checkGrid(grid, revealGrid, size, xCoord, yCoord + 1);
        checkGrid(grid, revealGrid, size, xCoord, yCoord - 1);
        checkGrid(grid, revealGrid, size, xCoord + 1, yCoord);
        checkGrid(grid, revealGrid, size, xCoord - 1, yCoord);
  
        // for diagnols
        checkGrid(grid, revealGrid, size, xCoord + 1, yCoord + 1);
        checkGrid(grid, revealGrid, size, xCoord + 1, yCoord - 1);
        checkGrid(grid, revealGrid, size, xCoord - 1, yCoord + 1);
        checkGrid(grid, revealGrid, size, xCoord - 1, yCoord - 1);
      }
    }
  }
 
// checking if game is won or not
  const checkWin = function( grid, revealGrid, size){
      // it counts number of mines and no of safezones that are revealed
      // if sum of both equals to total no of cells then the user has won the game
      let countMines = 0;
      let countSafeZonesRevealed = 0;
      for (let i = 0; i < size; i++)
      {
          for (let j = 0; j < size; j++)
          {
              if (grid[i][j] == -1)
                  countMines++;
              else if (revealGrid[i][j] == 1)
                  countSafeZonesRevealed++;
          }
      }
  
      // returns 1 if won and 0 if not won till now
      if (countSafeZonesRevealed + countMines == size * size)
          return 1;
      else
          return 0;
  }