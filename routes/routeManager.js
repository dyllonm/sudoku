const apiRoutes = require('./apiRoutes.js');
const contentRoutes = require('./contentRoutes.js');
const moduleRoutes = require('./moduleRoutes.js');
const pageRoutes = require('./pageRoutes.js');
const scriptRoutes = require('./scriptRoutes.js');

module.exports = function(app) {
    apiRoutes(app);
    contentRoutes(app);
    moduleRoutes(app);
    pageRoutes(app);
    scriptRoutes(app);
};
