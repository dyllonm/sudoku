const sudokuApi = require('../api/sudokuApi.js');

module.exports.setup = function(app) {
    app.get('/api/newPuzzle', sudokuApi.GenerateNewPuzzle);
    app.post('/api/checkPuzzle', sudokuApi.CheckPuzzle);
    app.post('/api/solvePuzzle', sudokuApi.SolvePuzzle);
}