const SudokuConstants = require('../constants/sudokuConstants.js');

// Use shared constants.
const PUZZLE_SIZE = SudokuConstants.PUZZLE_SIZE;
const BOX_SIZE = SudokuConstants.BOX_SIZE;
const BOX_COUNT = SudokuConstants.BOX_COUNT;
const EMPTY_VALUE = SudokuConstants.EMPTY_VALUE;
const MIN_VALUE = SudokuConstants.MIN_VALUE;
const MAX_VALUE = SudokuConstants.MAX_VALUE;
const EMPTY_PUZZLE = SudokuConstants.EMPTY_PUZZLE;;

// Makes a copy of a puzzle board
function copyBoard(board) {
    let copy = [
        [EMPTY_VALUE, EMPTY_VALUE, EMPTY_VALUE, EMPTY_VALUE, EMPTY_VALUE, EMPTY_VALUE, EMPTY_VALUE, EMPTY_VALUE, EMPTY_VALUE],
        [EMPTY_VALUE, EMPTY_VALUE, EMPTY_VALUE, EMPTY_VALUE, EMPTY_VALUE, EMPTY_VALUE, EMPTY_VALUE, EMPTY_VALUE, EMPTY_VALUE],
        [EMPTY_VALUE, EMPTY_VALUE, EMPTY_VALUE, EMPTY_VALUE, EMPTY_VALUE, EMPTY_VALUE, EMPTY_VALUE, EMPTY_VALUE, EMPTY_VALUE],
        [EMPTY_VALUE, EMPTY_VALUE, EMPTY_VALUE, EMPTY_VALUE, EMPTY_VALUE, EMPTY_VALUE, EMPTY_VALUE, EMPTY_VALUE, EMPTY_VALUE],
        [EMPTY_VALUE, EMPTY_VALUE, EMPTY_VALUE, EMPTY_VALUE, EMPTY_VALUE, EMPTY_VALUE, EMPTY_VALUE, EMPTY_VALUE, EMPTY_VALUE],
        [EMPTY_VALUE, EMPTY_VALUE, EMPTY_VALUE, EMPTY_VALUE, EMPTY_VALUE, EMPTY_VALUE, EMPTY_VALUE, EMPTY_VALUE, EMPTY_VALUE],
        [EMPTY_VALUE, EMPTY_VALUE, EMPTY_VALUE, EMPTY_VALUE, EMPTY_VALUE, EMPTY_VALUE, EMPTY_VALUE, EMPTY_VALUE, EMPTY_VALUE],
        [EMPTY_VALUE, EMPTY_VALUE, EMPTY_VALUE, EMPTY_VALUE, EMPTY_VALUE, EMPTY_VALUE, EMPTY_VALUE, EMPTY_VALUE, EMPTY_VALUE],
        [EMPTY_VALUE, EMPTY_VALUE, EMPTY_VALUE, EMPTY_VALUE, EMPTY_VALUE, EMPTY_VALUE, EMPTY_VALUE, EMPTY_VALUE, EMPTY_VALUE]
    ];
    
    for(let x = 0; x < PUZZLE_SIZE; x++) {
        for(let y = 0; y < PUZZLE_SIZE; y++) {
            copy[x][y] = board[x][y];
        }
    }
    
    return copy;
}

// Shuffles an array.
function shuffleArray(arr) {
    let newArr = [];
    
    while(arr.length > 0) {
        newArr.push(arr.splice(Math.floor(Math.random() * arr.length), 1)[0]);
    }
    
    return newArr;
}


// The sudoku puzzle class.
class Sudoku {
    // Constructs a sudoku puzzle as a copy of the provided puzzle
    constructor(puzzle = EMPTY_PUZZLE) {
        this.board = copyBoard(puzzle);
    }


    // Gets a random value to place on the game board.
    randomValueForCoordinates(coords) {
        var allValues = this.valuesForCoords(coords);
        if(allValues.length > 0) {
            var index = Math.floor(Math.random() * allValues.length);
            return allValues[index];
        }
        
        return null;
    }

    // Check if there is any other valid value in the specified coordinates on the board.
    otherValidSolution(coords) {
        let currentValue = this.board[coords.x][coords.y];
        
        let validValues = this.valuesForCoords(coords);
        
        return validValues.length != 1 || validValues[0] != currentValue;
    }

    // Gets all valid values for the provided coordinates.
    valuesForCoords(coords) {
        let values = [];
        
        for(let i = MIN_VALUE; i <= MAX_VALUE; i++) {
            if(this.canValueGoHere(coords, i)) {
                values.push(i);
            }
        }
        
        return values;
    }

    // Determines if a value is valid for a specific coordinate.
    canValueGoHere(coords, value) {
        let copy = new Sudoku(this.board);
        copy.board[coords.x][coords.y] = value;
        
        if(!copy.checkCol(coords.y)) {
            return false;
        }
        
        if(!copy.checkRow(coords.x)) {
            return false;
        }
        
        let boxX = Math.floor(coords.x / BOX_SIZE);
        let boxY = Math.floor(coords.y / BOX_SIZE);
        
        return copy.checkBox(boxX, boxY);
    }

    // Solve a puzzle
    solve(shuffle = false) {
        if(!this.validPuzzleState()) {
            return null;
        }
        
        if(this.solved()) {
            return this;
        }
        
        let emptyCoords = this.firstEmptyCoordinates();
        
        if (emptyCoords == null) {
            return null;
        }
        
        let validValues = this.valuesForCoords(emptyCoords);
        
        if (shuffle) {
            validValues = shuffleArray(validValues);
        }
        
        for(let i = 0; i < validValues.length; i++) {
            let attempt = new Sudoku(this.board);
            attempt.board[emptyCoords.x][emptyCoords.y] = validValues[i];
            
            let result = attempt.solve(shuffle);
            
            if(result != null) {
                return result;
            }
        }
        
        return null;
    }

    // Finds the first empty coordinates on a puzzle.
    firstEmptyCoordinates() {
        let xEmpty = 0;
        let yEmpty = 0;
        let foundEmpty = false;
        
        for(xEmpty = 0; xEmpty < PUZZLE_SIZE; xEmpty++) {
            for(yEmpty = 0; yEmpty < PUZZLE_SIZE; yEmpty++) {
                if(this.board[xEmpty][yEmpty] == EMPTY_VALUE) {
                    foundEmpty = true;
                    break;
                }
            }
            
            if(foundEmpty) {
                break;
            }
        }

        if(foundEmpty) {
            return {
                x: xEmpty,
                y: yEmpty
            };
        }

        return null;
    }

    // Makes sure that the puzzle has the correct structure
    validPuzzleStructure() {
        if (this.board.length != PUZZLE_SIZE) {
            return false;
        }
        
        for (let i = 0; i < PUZZLE_SIZE; i++) {
            if (this.board[i].length != PUZZLE_SIZE) {
                return false;
            }
        }
        
        return true;
    }

    // Checks if all values in the puzzle are valid
    validPuzzleState() {
        if(!this.validPuzzleStructure()) {
            return false;
        }
        
        for (let i = 0; i < PUZZLE_SIZE; i++) {
            if(!this.checkRow(i)) {
                return false;
            }
        }
        
        for(let i = 0; i < PUZZLE_SIZE; i++) {
            if(!this.checkCol(i)) {
                return false;
            }
        }
        
        for(let x = 0; x < BOX_COUNT; x++) {
            for(let y = 0; y < BOX_COUNT; y++) {
                if(!this.checkBox(x, y)) {
                    return false;
                }
            }
        }
        
        return true;
    }

    // Checks if a puzzle is in a valid state and has no empty cells
    solved() {
        if(!this.validPuzzleState()) {
            return false;
        }
        
        for(let x = 0; x < PUZZLE_SIZE; x++) {
            for (let y = 0; y < PUZZLE_SIZE; y++) {
                if(this.board[x][y] == EMPTY_VALUE) {
                    return false;
                }
            }
        }
        
        return true;
    }

    // Checks for duplicate values in a puzzle row
    checkRow(index) {
        let row = this.board[index];

        for(let i = 0; i < (PUZZLE_SIZE - 1); i++) {
            if(row[i] == EMPTY_VALUE) {
                continue;
            }
            
            for(let j = i + 1; j < PUZZLE_SIZE; j++) {
                if(row[j] == EMPTY_VALUE) {
                    continue;
                }
                
                if(row[i] == row[j]) {
                    return false;
                }
            }
        }
        
        return true;
    }

    // Checks for duplicate values in a puzzle column
    checkCol(index) {
        for(let i = 0; i < (PUZZLE_SIZE - 1); i++) {
            if(this.board[i][index] == EMPTY_VALUE) {
                continue;
            }
            
            for(let j = (i + 1); j < PUZZLE_SIZE; j++) {
                if(this.board[j][index] == EMPTY_VALUE) {
                    continue;
                }
                
                if(this.board[i][index] == this.board[j][index]) {
                    return false;
                }
            }
        }
        
        return true;
    }

    // Checks for duplicate values in a puzzle box
    checkBox(x, y) {
        let box = this.getBox(x, y);

        for (let r1 = 0; r1 < BOX_SIZE; r1++) {
            for (let r2 = 0; r2 < BOX_SIZE; r2++) {
                if(!this.compareBoxRows(box[r1], box[r2], r1 == r2)) {
                    return false;
                }
            }
        }
        
        return true;
    }

    // Gets the subset of a puzzle that corresponds to the requested box
    getBox(x, y) {
        let xOffset = BOX_SIZE * x;
        let yOffset = BOX_SIZE * y;

        return [
            [this.board[xOffset][yOffset], this.board[xOffset + 1][yOffset], this.board[xOffset + 2][yOffset]],
            [this.board[xOffset][yOffset + 1], this.board[xOffset + 1][yOffset + 1], this.board[xOffset + 2][yOffset + 1]],
            [this.board[xOffset][yOffset + 2], this.board[xOffset + 1][yOffset + 2], this.board[xOffset + 2][yOffset + 2]]
        ];
    }

    // Checks for duplicate values across two rows in a box
    compareBoxRows(r1, r2, same) {
        for(let i = 0; i < (same ? BOX_SIZE - 1 : BOX_SIZE); i++) {
            if(r1[i] == EMPTY_VALUE) {
                continue;
            }
            
            for(let j = (same ? i + 1 : 0); j < BOX_SIZE; j++) {
                if(r2[j] == EMPTY_VALUE) {
                    continue;
                }
                
                if (r1[i] == r2[j]) {
                    return false;
                }
            }
        }
        
        return true;
    }
}

module.exports = Sudoku;
