const sudokuApi = require('../api/sudokuApi.js');

// Setup up the routes for the api.
module.exports.setup = function(app) {
    app.get('/api/generatePuzzle', sudokuApi.GenerateNewPuzzle);
    app.post('/api/checkPuzzle', sudokuApi.CheckPuzzle);
    app.post('/api/solvePuzzle', sudokuApi.SolvePuzzle);
}