let form = document.getElementById("gameSetupForm");

form.addEventListener("submit", function (event) {
  event.preventDefault(); // Prevent page reload

  const gridSize = document.getElementById("gridSize").value;
  const difficulty = document.getElementById("difficulty").value;

//calculating no of mines using difficulty
  const mineNumber = calculateMines(gridSize, difficulty);
  
  // getting the main grid from the html dom
  const displayGrid = document.querySelector(".grid");

 //displaying the grid and removing the instructions and form
  displayGrid.style.display = "flex";
  form.style.display = "none";
  document.querySelector(".instructions").style.display = "none";


  // grid to store data for each cell
  let gameGrid = create2DArray(gridSize, gridSize);

  // grid to tell whether the cell is revealed or not
  // 1-revealed
  // 0-not revealed
  let revealGrid = create2DArray(gridSize, gridSize);

//   grid to strore whether the cell is flagged or not
  let flagGrid = create2DArray(gridSize, gridSize); // 0 - no flag, 1 - flagged

  // placing mines and numbers in the grid
  placeMines(gameGrid, gridSize, mineNumber);
  markGrid(gameGrid, gridSize);

  // creating each of the cell of grid to display on screen
  for (i = 0; i < gridSize; i++) {
    const row = document.createElement("div");
    row.classList.add("row");

    for (j = 0; j < gridSize; j++) {
      const cell = document.createElement("div");
      cell.classList.add("cell-hidden", `r${i}`, `c${j}`);
      cell.textContent = gameGrid[i][j];

      row.appendChild(cell);
    }
    displayGrid.appendChild(row);
  }


  // reveals the given cell
  const revealCells = (row, column, value) => {
    // if the cell is flagged then you can reveal it
    if (flagGrid[row][column] === 1) return;

   
    let cell = document.querySelector(`.r${row}.c${column}`);
    cell.classList.remove("cell-hidden");
    cell.classList.add("cell-found");

    // change the color of text content based on the value of it 
    if (value === 0) cell.style.color = "#BDBDBD";
    else if (value === 1) cell.style.color = "blue";
    else if (value === 2) cell.style.color = "green";
    else if (value === 3) cell.style.color = "red";
    else if (value === 4) cell.style.color = "purple";
    else if (value === -1)
      cell.innerHTML = '<img src="bomb.png" alt="Transparent Image">'; //adding bomb if -1
  };

  // function to reveal all the cells according to reveal grid
  const printGrid = (gameGrid, revealGrid, size) => {
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        if (revealGrid[i][j] === 1) revealCells(i, j, gameGrid[i][j]);
      }
    }
  };

  //flagging mechanism for pc -> right clicking
  displayGrid.addEventListener("contextmenu", function (event) {
    event.preventDefault(); // Prevent the default context menu

    let cell = event.target;

    // Check if the clicked element is an image and find its parent cell
    if (cell.tagName === "IMG") {
      cell = cell.parentElement;
    }

    console.log("flag is working");

    // Extract row and column
    let rowNo = parseInt(cell.classList[1].replace(/\D/g, ""), 10);
    let columnNo = parseInt(cell.classList[2].replace(/\D/g, ""), 10);

    console.log(rowNo, columnNo, revealGrid[rowNo][columnNo]);

    if (!columnNo && columnNo !== 0) {
      console.log("i am changing coordinates");
      rowNo = parseInt(cell.classList[0].replace(/\D/g, ""), 10);
      columnNo = parseInt(cell.classList[1].replace(/\D/g, ""), 10);
      console.log(rowNo, columnNo, revealGrid[rowNo][columnNo]);
    }

    console.log(rowNo, columnNo, revealGrid[rowNo][columnNo]);

    if (revealGrid[rowNo][columnNo] == 1) {
      console.log("i go out of the flag function");
      return;
    }

    // Toggle the flag state
    if (flagGrid[rowNo][columnNo] === 0) {
      flagGrid[rowNo][columnNo] = 1; // Place flag
      cell.innerHTML = '<img class="flag-img" src="flag.png" alt="Flag">';
      console.log("i print flag");
    } else {
      console.log("i remove flag");
      flagGrid[rowNo][columnNo] = 0; // Remove flag
      cell.innerHTML =
        '<img style="display:none;"class="flag-img" src="flag.png" alt="Flag">'; // Clear flag
      cell.textContent = gameGrid[rowNo][columnNo];
    }
  });

  // flag controls for mobile -----> using chat gpt
// ==============================================================================================================
  let touchTimer; // Timer for long-press detection
  let touchStartX, touchStartY;
  let isLongPress = false; // To differentiate single-tap vs long-press

  // Detect touch start
  displayGrid.addEventListener("touchstart", function (event) {
    event.preventDefault(); // Prevent default mobile behavior like vibration
    isLongPress = false; // Reset flag

    const touch = event.touches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;

    let cell =
      event.target.tagName === "IMG"
        ? event.target.parentElement
        : event.target;

    // Start the timer for long-press
    touchTimer = setTimeout(() => {
      console.log("long-press detected");
      isLongPress = true;
      cell.dispatchEvent(new Event("contextmenu", { bubbles: true })); // Trigger flag logic
    }, 500); // Long-press threshold: 500ms
  });

  // Detect touch move
  displayGrid.addEventListener("touchmove", function (event) {
    const touch = event.touches[0];
    const moveX = Math.abs(touch.clientX - touchStartX);
    const moveY = Math.abs(touch.clientY - touchStartY);

    // Cancel long-press if significant movement occurs
    if (moveX > 10 || moveY > 10) {
      clearTimeout(touchTimer);
    }
  });

  // Detect touch end
  displayGrid.addEventListener("touchend", function (event) {
    clearTimeout(touchTimer); // Clear long-press timer

    // If long-press didn't happen, treat as single tap (normal click)
    if (!isLongPress) {
      console.log("single tap detected");
      event.target.click(); // Trigger the existing click event
    }
  });
//   ================================================================================================================

// what happens when a cell is clicked
  displayGrid.addEventListener("click", function gamehandler(event) {
    let cell = event.target;

    // Check if the clicked element is an image and find its parent cell
    if (cell.tagName === "IMG") {
      cell = cell.parentElement;
    }

    console.log("click is working");

    // Extract row and column numbers and convert to integers
    const rowNo = parseInt(cell.classList[1].replace(/\D/g, ""), 10);
    const columnNo = parseInt(cell.classList[2].replace(/\D/g, ""), 10);

    
    if (flagGrid[rowNo][columnNo] === 1) return; // Ignore flagged cells

    // Check if the clicked cell contains a mine
    if (gameGrid[rowNo][columnNo] === -1) {
      console.log("game over");
      revealCells(rowNo, columnNo, -1);
      gameEnd("lost");
      displayGrid.removeEventListener("click", gamehandler);
      return;
    }

    // Perform recursive check and update the grid
    checkGrid(gameGrid, revealGrid, gridSize, rowNo, columnNo);
    printGrid(gameGrid, revealGrid, gridSize);

    let win = checkWin(gameGrid, revealGrid, gridSize);
    if (win) {
      gameEnd("won");
      console.log("congrats you won");
      displayGrid.removeEventListener("click", gamehandler);
      return;
    }
  });

  function gameEnd(result) {
    displayGrid.classList.add("blur");

    let para = document.querySelector(`.${result}`);
    para.style.display = "flex";

    document
      .querySelector(`.reloadButton${result}`)
      .addEventListener("click", function () {
        location.reload(); // Reload the current page
      });
  }
});
