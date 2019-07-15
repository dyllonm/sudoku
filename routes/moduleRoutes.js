const path = require('path');

module.exports.setup = function(app) { 
    const jqueryHandler = function(req, res) {
        let filepath = path.join(__dirname, '..', 'node_modules', 'jquery', 'dist', 'jquery.min.js');
        res.sendFile(filepath);
    };

    app.get('/modules/jquery', jqueryHandler);
}