const Sudoku = require('./api/sudoku.js');

let puzzle = new Sudoku();
puzzle = puzzle.generatePuzzle(45);
console.log(puzzle);
