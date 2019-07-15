// The size (both height and width) of a puzzle.
var PUZZLE_SIZE = 9;

// The value which represents an empty cell in a puzzle.
var EMPTY_VALUE = 0;

// The default percentage of cells that are filled when a new game is generated.
var DEFAULT_FILLED_PERCENTAGE = 45;

// Generate a random puzzle and setup the game board.
function buildBoard() {
    $("#SudokuBoard").empty();

    for(var i = 0; i < PUZZLE_SIZE; i++) {
        $("#SudokuBoard").append('<tr class="SudokuRow" />');
    }
    
    for(var i = 0; i < PUZZLE_SIZE; i++) {
        $(".SudokuRow").append('<td><input type="text" maxLength="1" class="SudokuCell" onChange="cellChanged(this)" /></td>');
    }
    
    generatePuzzle(DEFAULT_FILLED_PERCENTAGE, function(puzzle) {
        if(puzzle != null)
        {
            puzzleToBoard(puzzle);
            bakeBoard();
            cellChanged(null);
        }
    });
}

// Bake any non-empty values into the game board.
function bakeBoard() {
    $(".SudokuCell").each(function(index, obj) {
    var cell = $(obj);
        var value = parseInt(cell.val()) || EMPTY_VALUE;
        if(value != EMPTY_VALUE) {
            cell.attr('readonly', true);
        }
    });				
}

// Check if the puzzle is solved.
function checkBoard() {
    var puzzle = boardToPuzzle();
    
    checkPuzzle(puzzle, function(solved) {
        if(solved) {
            $("#SolvedLabel").show();
        } else {
            $("#SolvedLabel").hide();
        }
    });
}

// Solve the board.
function solveBoard() {
    var currentPuzzle = boardToPuzzle();

    solvePuzzle(currentPuzzle, function(solvedPuzzle) {
        if(solvedPuzzle != null) {
            puzzleToBoard(solvedPuzzle);
        }
        
        cellChanged(null);
    });
}

// Set the contents of the board based on the provided puzzle array.
function puzzleToBoard(p) {
    for(var x = 0; x < PUZZLE_SIZE; x++) {
        for (y = 0; y < PUZZLE_SIZE; y++) {
            var index = (x * PUZZLE_SIZE) + y;
            var value = p[x][y];
            
            if(value > 0 && value < 10) {
                $(".SudokuCell").eq(index).val(p[x][y]);
            }
        }
    }
}

// Generate an empty puzzle array.
function generateEmptyPuzzle() {
    var puzzle = [];
    for(var x = 0; x < PUZZLE_SIZE; x++) {
        puzzle.push([]);

        for (var y = 0; y < PUZZLE_SIZE; y++) {
            puzzle[x].push(EMPTY_VALUE);
        }
    }

    return puzzle;
}

// Generate a puzzle array based on the contents of the game board.
function boardToPuzzle() {
    var puzzle = generateEmptyPuzzle();

    for(var x = 0; x < PUZZLE_SIZE; x++) {
        for (var y = 0; y < PUZZLE_SIZE; y++) {
            var index = (x * PUZZLE_SIZE) + y;
            var value = parseInt($(".SudokuCell").eq(index).val()) || 0;
            puzzle[x][y] = value;
        }
    }
    
    return puzzle;
}

// Handles the event when a cell is changed.
function cellChanged(cell) {
    var currentPuzzle = boardToPuzzle();
    
    solvePuzzle(currentPuzzle, function(solvedPuzzle) {
        if(solvedPuzzle != null) {
            $(".InvalidCell").removeClass("InvalidCell");
        }
        else {
            $(cell).addClass("InvalidCell");
        }

        checkBoard();
    });
}

// Make the REST call to generate a puzzle.
function generatePuzzle(percentageFull, callback) {
    $.ajax({
        url: '/api/generatePuzzle?percentageFull=' + percentageFull,
        method: 'GET'
    }).done(callback);
}

// Make the REST call to check if a puzzle is solved.
function checkPuzzle(puzzle, callback) {
    $.ajax({
        url: '/api/checkPuzzle',
        method: 'POST',
        dataType: 'json',
        contentType: 'application/json',
        processData: false,
        data: JSON.stringify(puzzle)
    }).done(callback);
}

// Make the REST call to solve a puzzle.
function solvePuzzle(puzzle, callback) {
    $.ajax({
        url: '/api/solvePuzzle',
        method: 'POST',
        dataType: 'json',
        contentType: 'application/json',
        processData: false,
        data: JSON.stringify(puzzle)
    }).done(callback);
}

$(document).ready(buildBoard);
