const express = require('express');
const routeManager = require('./routes/routeManager.js');

// Setup the express app.
const app = express();

// Handle JSON payloads.
app.use(express.json());

// Setup the routes.
routeManager.setup(app);
app.use(express.static('public'));

// Start Listening.
app.listen(4242, () => {
    console.log('Express Server is running...');
});
