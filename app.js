const express = require('express');
const routeManager = require('./routes/routeManager.js');

const app = express();

routeManager(app);

// Start Listening
app.listen(4242, () => {
    console.log('Express Server is running...');
});
