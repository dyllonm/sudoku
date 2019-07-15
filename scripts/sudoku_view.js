function buildBoard() {
    $("#SudokuBoard").empty();

    for(var i = 0; i < PUZZLE_SIZE; i++) {
        $("#SudokuBoard").append('<tr class="SudokuRow" />');
    }
    
    for(var i = 0; i < PUZZLE_SIZE; i++) {
        $(".SudokuRow").append('<td><input type="text" maxLength="1" class="SudokuCell" onChange="cellChanged(this)" /></td>');
    }
    
    var puzzle = generatePuzzle(45);
    if(puzzle != null)
    {
        puzzleToBoard(puzzle);
        bakeBoard();
        cellChanged(null);
    }
}

function bakeBoard() {
    $(".SudokuCell").each(function(index, obj) {
    var cell = $(obj);
        var value = parseInt(cell.val()) || 0;
        if(value > 0) {
            cell.attr('readonly', true);
        }
    });				
}

function checkBoard() {
    var puzzle = boardToPuzzle();
    if(solved(puzzle)) {
        $("#SolvedLabel").show();
    } else {
        $("#SolvedLabel").hide();
    }
}

function solveBoard() {
    var puzzle = boardToPuzzle();
    puzzle = solve(puzzle);
    if(puzzle != null) {
        puzzleToBoard(puzzle);
    }
    
    cellChanged(null);
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

function boardToPuzzle() {
    var puzzle = copyPuzzle(emptyPuzzle);

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
    var puzzle = boardToPuzzle();
    
    if(solve(puzzle) != null) {
        $(".InvalidCell").removeClass("InvalidCell");
    }
    else {
        $(cell).addClass("InvalidCell");
    }
    
    checkBoard();
}

$(document).ready(buildBoard);
