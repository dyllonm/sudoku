const apiRoutes = require('./apiRoutes.js');
const contentRoutes = require('./contentRoutes.js');
const moduleRoutes = require('./moduleRoutes.js');
const pageRoutes = require('./pageRoutes.js');
const scriptRoutes = require('./scriptRoutes.js');

module.exports.setup = function(app) {
    apiRoutes.setup(app);
    contentRoutes.setup(app);
    moduleRoutes.setup(app);
    pageRoutes.setup(app);
    scriptRoutes.setup(app);
};
