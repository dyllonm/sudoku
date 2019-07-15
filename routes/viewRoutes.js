const path = require('path');

// Setup the routes for the views.
module.exports.setup = function(app) {
    const indexHandler = function(req, res) {
        let filepath = path.join(__dirname, '..', 'views', 'sudoku.html');
        res.sendFile(filepath);
    };

    app.get('/', indexHandler);
}
