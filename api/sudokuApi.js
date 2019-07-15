const Sudoku = require("./sudoku.js");

// The size (both height and width) of a puzzle.
const PUZZLE_SIZE = 9;

// The value which represents an empty cell in a puzzle.
const EMPTY_VALUE = 0;

// Gets a random coordinate within the game board.
function randomCoords() {
    return {
        x: Math.floor(Math.random() * (PUZZLE_SIZE - 0.1)),
        y: Math.floor(Math.random() * (PUZZLE_SIZE - 0.1))
    };
}

// An individual attempt to generate a solveable puzzle.
function generatePuzzle(percentageFilled) {
    if(percentageFilled < 0 || percentageFilled > 100) {
        return null;
    }
    
    // Calculate the target number of full and empty boxes.
    let fullBoxes = (PUZZLE_SIZE * PUZZLE_SIZE) * (percentageFilled / 100);
    let emptyBoxes = (PUZZLE_SIZE * PUZZLE_SIZE) - fullBoxes;
    
    // Start with a copy of the empty puzzle.
    let puzzle = new Sudoku();
    
    // Next, attempt to solve the puzzle.
    puzzle = puzzle.solve(true);
    
    // If the puzzle isn't solveable then this attempt failed.
    if(puzzle == null) {
        return null;
    }
    
    // Next, remove some values from the solved puzzle.
    let removed = 0;
    let notFoundCount = 0;
    const MAX_FIND_ATTEMPTS = 20;
    while (removed < emptyBoxes && notFoundCount < MAX_FIND_ATTEMPTS) {
        let coords = randomCoords();
        
        // Don't remove this value if there are more than 2 other valid numbers in this space.
        // This makes it so that the player doesn't have to guess (too much).
        const MAX_POSSIBLE_VALUES = 2;
        if(puzzle.valuesForCoords(coords).length > MAX_POSSIBLE_VALUES){
            notFoundCount++;
            continue;
        }
        
        puzzle.board[coords.x][coords.y] = EMPTY_VALUE;
        removed++;
        notFoundCount = 0;
    }
    
    return puzzle;
}

module.exports.GenerateNewPuzzle = (req, res) => {
    let puzzle = generatePuzzle(45);
    res.send(puzzle.board);
};