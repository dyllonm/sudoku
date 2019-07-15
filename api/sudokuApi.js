const Sudoku = require('./model/sudoku.js');
const SudokuGenerator = require('./sudokuGenerator.js');

const DEFAULT_PERCENTAGE_FULL = 45;

// Generates a new sudoku puzzle.
module.exports.GenerateNewPuzzle = (req, res) => {
    let percentageFull = req.query.percentageFull;

    if (percentageFull == undefined)
    {
        percentageFull = DEFAULT_PERCENTAGE_FULL;
    }

    let puzzle = SudokuGenerator(percentageFull);
    res.send(puzzle.board);
};

// Checks if a sudoku puzzle is solved.
module.exports.CheckPuzzle = (req, res) => {
    let puzzlePost = req.body;
    let puzzle = new Sudoku(puzzlePost);
    res.send(puzzle.solved());
}

// Solves a sudoku puzzle.
module.exports.SolvePuzzle = (req, res) => {
    let puzzlePost = req.body;
    let puzzle = new Sudoku(puzzlePost);

    let solvedPuzzle = puzzle.solve();
    if(solvedPuzzle != null)
    {
        res.send(solvedPuzzle.board)
    }
    else {
        res.send(null);
    }
}
