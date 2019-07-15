const apiRoutes = require('./apiRoutes.js');
const moduleRoutes = require('./moduleRoutes.js');
const viewRoutes = require('./viewRoutes.js');

// Setup each type of routes.
module.exports.setup = function(app) {
    apiRoutes.setup(app);
    moduleRoutes.setup(app);
    viewRoutes.setup(app);
};
