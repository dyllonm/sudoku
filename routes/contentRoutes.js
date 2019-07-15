const path = require('path');

module.exports = function(app) {

    const cssHandler = function(req, res) {
        let filepath = path.join(__dirname, '..', 'content', 'site.css');
        res.sendFile(filepath);
    };

    app.get('/content/site', cssHandler);
}