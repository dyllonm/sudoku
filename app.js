const express = require('express');
const path = require('path');
const app = express();

// Request Handlers
const indexHandler = function(req, res) {
    let filepath = path.join(__dirname, 'sudoku.html');
    res.sendFile(filepath);
};

const jqueryHandler = function(req, res) {
    let filepath = path.join(__dirname, 'node_modules', 'jquery', 'dist', 'jquery.min.js');
    res.sendFile(filepath);
};

const cssHandler = function(req, res) {
    let filepath = path.join(__dirname, 'content', 'site.css');
    res.sendFile(filepath);
};

const sudokuViewHandler = function(req, res) {
    let filepath = path.join(__dirname, 'scripts', 'sudoku_view.js');
    res.sendFile(filepath);
};

// TODO: This code should become a REST api
const sudokuHandler = function(req, res) {
    let filepath = path.join(__dirname, 'scripts', 'sudoku.js');
    res.sendFile(filepath);
};

// Routes
app.get('/', indexHandler)
app.get('/modules/jquery', jqueryHandler);
app.get('/content/site', cssHandler);
app.get('/scripts/sudoku', sudokuHandler);
app.get('/scripts/sudoku_view', sudokuViewHandler);

// Start Listening
app.listen(4242, () => {
    console.log('Express Server is running...');
});
