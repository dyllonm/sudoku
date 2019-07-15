// The size (both height and width) of a puzzle.
var PUZZLE_SIZE = 9;

// The value which represents an empty cell in a puzzle.
var EMPTY_VALUE = 0;

// The default percentage of cells that are filled when a new game is generated.
var DEFAULT_FILLED_PERCENTAGE = 45;

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

function bakeBoard() {
    $(".SudokuCell").each(function(index, obj) {
    var cell = $(obj);
        var value = parseInt(cell.val()) || EMPTY_VALUE;
        if(value != EMPTY_VALUE) {
            cell.attr('readonly', true);
        }
    });				
}

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

function solveBoard() {
    var currentPuzzle = boardToPuzzle();

    solvePuzzle(currentPuzzle, function(solvedPuzzle) {
        if(solvedPuzzle != null) {
            puzzleToBoard(solvedPuzzle);
        }
        
        cellChanged(null);
    });
}

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

function generatePuzzle(percentageFull, callback) {
    $.ajax({
        url: '/api/generatePuzzle?percentageFull=' + percentageFull,
        method: 'GET'
    }).done(callback);
}

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
