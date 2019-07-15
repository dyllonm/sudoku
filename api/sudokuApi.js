const SudokuGenerator = require('./sudokuGenerator.js');

module.exports.GenerateNewPuzzle = (req, res) => {
    let puzzle = SudokuGenerator(45);
    res.send(puzzle.board);
};