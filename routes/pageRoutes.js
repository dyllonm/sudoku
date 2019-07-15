const path = require('path');

module.exports = function(app) {

    const indexHandler = function(req, res) {
        let filepath = path.join(__dirname, '..', 'views', 'sudoku.html');
        res.sendFile(filepath);
    };

    app.get('/', indexHandler);
}
