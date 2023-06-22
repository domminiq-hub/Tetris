document.querySelector('#start').addEventListener('click', () => {

  //A class representing the Tetris game
  class Tetris {
    constructor() {
      this.board = document.querySelector('.board');
      this.nextShapes = document.querySelector('#nextshape');
      this.board.innerHTML = "";
      this.boardCells = [];
      this.shapes = [];
      this.nextShapeCells = [];
      this.currentShape = null;
      this.shapeInterval = null;
      this.randomShape = null;
      this.nextShape = null;
      this.speed = 400;
    }

    // Draws a Tetris board
    drawBoard() {
      for (let row = 0; row < 20; row++) {
        const newRow = [];
        for (let col = 0; col < 10; col++) {
          const cell = document.createElement('div');
          cell.className = 'cell';
          newRow.push(cell);
          this.board.appendChild(cell);
        }
        this.boardCells.push(newRow);
      }

      for (let row = 0; row < 4; row++) {
        const newRow = [];
        for (let col = 0; col < 4; col++) {
          const cell = document.createElement('div');
          cell.className = 'cell';
          newRow.push(cell);
          this.nextShapes.appendChild(cell);
        }
        this.nextShapeCells.push(newRow);
      }
    }

    // Create available Tetris shapes
    createShapes() {
      const shapes = [
        [[1, 1, 0, 0],        // Square
        [1, 1, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]],
        [[1, 1, 1, 1],        // Horizontal line
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]],
        [[1, 0, 0, 0],        // Vertical line
        [1, 0, 0, 0],
        [1, 0, 0, 0],
        [1, 0, 0, 0]],
        [[1, 1, 0, 0],       // Z
        [0, 1, 1, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]],
        [[0, 1, 1, 0],      // Reverse Z
        [1, 1, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]],
        [[0, 1, 0, 0],      // L
        [0, 1, 0, 0],
        [0, 1, 1, 0],
        [0, 0, 0, 0]],
        [[0, 0, 0, 0],     // Reverse L
        [1, 0, 0, 0],
        [1, 1, 1, 0],
        [0, 0, 0, 0]],
        [[1, 1, 1, 0],     // T
        [0, 1, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]],
        [[0, 1, 0, 0],    // Reverse T
        [1, 1, 1, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]],
        [[1, 0, 0, 0],    // Reverse T
        [1, 1, 0, 0],
        [1, 0, 0, 0],
        [0, 0, 0, 0]],
        [[0, 0, 1, 0],   // Reverse T
        [0, 1, 1, 0],
        [0, 0, 1, 0],
        [0, 0, 0, 0]],
      ];


      shapes.forEach(shapeData => {
        const shape = new Shape(shapeData);
        this.shapes.push(shape);
      });
    }

    // Removes the currently displayed piece from the board
    removeShape() {
      for (let row = 0; row < this.currentShape.cells.length; row++) {
        for (let col = 0; col < this.currentShape.cells[row].length; col++) {
          if (this.currentShape.cells[row][col] === 1) {
            this.boardCells[row + this.currentShape.position.y][col + this.currentShape.position.x].classList.remove('filled');
          }
        }
      }

    }

    // Places the currently displayed piece on the board
    placeShape() {
      for (let row = 0; row < this.currentShape.cells.length; row++) {
        for (let col = 0; col < this.currentShape.cells[row].length; col++) {
          if (this.currentShape.cells[row][col] === 1) {
            this.boardCells[row + this.currentShape.position.y][col + this.currentShape.position.x].classList.add('filled');
          }
        }
      }

      for (let row = 0; row < this.nextShape.cells.length; row++) {
        for (let col = 0; col < this.nextShape.cells[row].length; col++) {
          if (this.nextShape.cells[row][col] === 1) {
            const cell = this.nextShapeCells[row][col];
            cell.classList.add('filled');
          } else if (this.nextShape.cells[row][col] === 0) {
            const cell = this.nextShapeCells[row][col];
            cell.classList.remove('filled');
          }
        }
      }
    }

    // Remove full lines from the Tetris board
    clearFilledLines() {
      const filledRows = [];
      for (let row = 0; row < this.boardCells.length; row++) {
        let isFilled = true;
        for (let col = 0; col < this.boardCells[row].length; col++) {
          if (!this.boardCells[row][col].classList.contains('filled')) {
            isFilled = false;
            break;
          }
        }
        if (isFilled) {
          filledRows.push(row);
          for (let col = 0; col < this.boardCells[row].length; col++) {
            this.boardCells[row][col].classList.remove('filled');
          }
        }
      }

      // Responsible for moving the top cells on the Tetris board downwards after removing full lines.
      for (const rowIndex of filledRows) {
        for (let row = rowIndex - 1; row >= 0; row--) {
          for (let col = 0; col < this.boardCells[row].length; col++) {
            if (this.boardCells[row][col].classList.contains('filled')) {
              this.boardCells[row][col].classList.remove('filled');
              this.boardCells[row + 1][col].classList.add('filled');
            }
          }
        }
      }
    }

    // Moves the figure down
    moveDown() {
      this.removeShape();
      this.currentShape.position.y++;

      if (this.checkCollision()) {
        this.currentShape.position.y--;
        this.placeShape();
        this.currentShape = null;
        this.clearFilledLines();
        this.createShape();
        if (this.checkCollision()) {
          clearInterval(this.shapeInterval);
          alert("Game Over!");
        } else {
          this.placeShape();
        }
      } else {
        this.placeShape();
      }
    }

    // Moves the figure to the right
    moveRight() {
      this.removeShape();
      this.currentShape.position.x++;

      if (this.checkCollision()) {
        this.currentShape.position.x--;
      }

      this.placeShape();
    }

    // Moves the figure to the left
    moveLeft() {
      this.removeShape();
      this.currentShape.position.x--;

      if (this.checkCollision()) {
        this.currentShape.position.x++;
      }

      this.placeShape();
    }

    // Checks the collision of the piece with other elements of the board
    checkCollision(shape = this.currentShape) {
      const shapeCells = shape.cells;
      const shapePosition = shape.position;

      for (let row = 0; row < shapeCells.length; row++) {
        for (let col = 0; col < shapeCells[row].length; col++) {
          if (shapeCells[row][col] === 1) {
            const cellRow = row + shapePosition.y;
            const cellCol = col + shapePosition.x;

            if (
              cellRow >= this.boardCells.length ||
              cellCol < 0 ||
              cellCol >= this.boardCells[cellRow].length ||
              this.boardCells[cellRow][cellCol].classList.contains('filled') ||
              this.boardCells[cellRow][cellCol].classList.contains('filled-final')
            ) {
              return true;
            }
          }
        }
      }

      return false;
    }

    // Creates a new random piece to display on the board
    createShape() {
      if (this.randomShape == null) {
        this.randomShape = [this.shapes[Math.floor(Math.random() * this.shapes.length)], this.shapes[Math.floor(Math.random() * this.shapes.length)]];
      }
      this.currentShape = Object.assign({}, this.randomShape[0]);
      this.currentShape.position = { x: 4, y: 0 };
      this.randomShape[0] = this.randomShape[1];
      this.randomShape[1] = this.shapes[Math.floor(Math.random() * this.shapes.length)];
      this.nextShape = Object.assign({}, this.randomShape[0]);
      this.nextShape.position = { x: 3, y: 0 };
    }

    // Starts a Tetris game
    startGame() {
      this.drawBoard();
      this.createShapes();
      this.createShape();
      this.placeShape();

      this.shapeInterval = setInterval(() => {
        this.moveDown();
      }, this.speed);

      document.addEventListener('keydown', event => {
        if (event.key === 'ArrowRight') {
          this.moveRight();
        } else if (event.key === 'ArrowLeft') {
          this.moveLeft();
        }
      });
    }
  }

  //A class representing the Shape
  class Shape {
    constructor(cells) {
      this.cells = cells;
      this.position = { x: 0, y: 0 };
    }
  }

  const tetris = new Tetris();
  tetris.startGame();
});
