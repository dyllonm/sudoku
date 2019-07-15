const apiRoutes = require('./apiRoutes.js');
const moduleRoutes = require('./moduleRoutes.js');
const viewRoutes = require('./viewRoutes.js');

module.exports.setup = function(app) {
    apiRoutes.setup(app);
    moduleRoutes.setup(app);
    viewRoutes.setup(app);
};
