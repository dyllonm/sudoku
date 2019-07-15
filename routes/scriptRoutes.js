const path = require('path');

module.exports = function(app) {
  
    const sudokuViewHandler = function(req, res) {
        let filepath = path.join(__dirname, '..', 'scripts', 'sudoku_view.js');
        res.sendFile(filepath);
    };
    
    // TODO: This code should become a REST api
    const sudokuHandler = function(req, res) {
        let filepath = path.join(__dirname, '..', 'scripts', 'sudoku.js');
        res.sendFile(filepath);
    };
    
    
    app.get('/scripts/sudoku', sudokuHandler);
    app.get('/scripts/sudoku_view', sudokuViewHandler);
}
