const path = require('path');
const sudokuApi = require('../api/sudokuApi.js');

module.exports = function(app) {
    app.get('/api/newPuzzle', sudokuApi.GenerateNewPuzzle);
}