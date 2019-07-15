const path = require('path');

module.exports.setup = function(app) {
    const sudokuViewHandler = function(req, res) {
        let filepath = path.join(__dirname, '..', 'scripts', 'sudoku_view.js');
        res.sendFile(filepath);
    };
    
    app.get('/scripts/sudoku_view', sudokuViewHandler);
}
