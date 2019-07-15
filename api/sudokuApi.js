const Sudoku = require('./model/sudoku.js');
const SudokuGenerator = require('./sudokuGenerator.js');

const DEFAULT_PERCENTAGE_FULL = 45;

module.exports.GenerateNewPuzzle = (req, res) => {
    let percentageFull = req.query.percentageFull;

    if (percentageFull == undefined)
    {
        percentageFull = DEFAULT_PERCENTAGE_FULL;
    }

    let puzzle = SudokuGenerator(percentageFull);
    res.send(puzzle.board);
};

module.exports.CheckPuzzle = (req, res) => {
    let puzzlePost = req.body;
    let puzzle = new Sudoku(puzzlePost);
    res.send(puzzle.solved());
}

module.exports.SolvePuzzle = (req, res) => {
    let puzzlePost = req.body;
    let puzzle = new Sudoku(puzzlePost);
    res.send(puzzle.solve().board);
}
