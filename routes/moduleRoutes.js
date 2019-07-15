const path = require('path');

const NODE_MODULES_DIR = path.join(__dirname, '..', 'node_modules');

// Setup the routes for anything needed from installed node modules.
module.exports.setup = function(app) { 
    const jqueryHandler = function(req, res) {
        let filepath = path.join(NODE_MODULES_DIR, 'jquery', 'dist', 'jquery.min.js');
        res.sendFile(filepath);
    };

    app.get('/modules/jquery', jqueryHandler);
}