const PUZZLE_SIZE = 9;
const BOX_SIZE = 3;
const EMPTY_VALUE = 0;

const emptyPuzzle = [
	[0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0]
];

function generatePuzzle(percentageFilled) {
	var puzzle;
	var attempts = 0;
	
	do {
		puzzle = generatePuzzleAttempt(percentageFilled);
		attempts++;
	} while (puzzle == null && attempts < 25);
	
	return puzzle;
}

function generatePuzzleAttempt(percentageFilled) {
	if(percentageFilled < 0 || percentageFilled > 100) {
		return null;
	}
	
	var fullBoxes = (PUZZLE_SIZE * PUZZLE_SIZE) * (percentageFilled / 100);
	var emptyBoxes = (PUZZLE_SIZE * PUZZLE_SIZE) - fullBoxes;
	
	var puzzle = copyPuzzle(emptyPuzzle);
	
	var seedBoxes = 5;
	
	while(seedBoxes > 0) {
		
		var x = Math.floor(Math.random() * (PUZZLE_SIZE - 0.1));
		var y = Math.floor(Math.random() * (PUZZLE_SIZE - 0.1));
		
		if(puzzle[x][y] != 0) {
			continue;
		}
		
		puzzle[x][y] = Math.floor(Math.random() * (PUZZLE_SIZE - 0.1)) + 1;
		
		if(!validPuzzleState(puzzle)) {
			puzzle[x][y] = 0;
			continue;
		}
		
		seedBoxes--;
	}
	
	puzzle = solve(puzzle);
	
	if(puzzle == null) {
		return null;
	}
	
	var removed = 0;
	var notFoundCount = 0;
	
	while (removed < emptyBoxes) {
		var x = Math.floor(Math.random() * Math.floor(PUZZLE_SIZE));
		var y = Math.floor(Math.random() * Math.floor(PUZZLE_SIZE));
		
		if(otherValidSolution(puzzle, x, y)) {
			notFoundCount++;
			
			if(notFoundCount > 10) {
				break;
			}
			
			continue;
		}
		
		puzzle[x][y] = 0;
		removed++;
		notFoundCount = 0;
	}
	
	return puzzle;
}

function otherValidSolution(p, x, y) {
	var currentValue = p[x][y];
	
	for(var i = 1; i <= 9; i++) {
		if(i == currentValue) {
			continue;
		}
		
		var attempt = copyPuzzle(p);
		attempt[x][y] = i;
		
		if(solve(attempt) != null) {
			return true;
		}
	}
	
	return false;
}

function solve(p) {
	if(!validPuzzleState(p)) {
		return null;
	}
	
	if(solved(p)) {
		return p;
	}
	
	var xEmpty = 0;
	var yEmpty = 0;
	var foundEmpty = false;
	
	for(xEmpty = 0; xEmpty < PUZZLE_SIZE; xEmpty++) {
		for(yEmpty = 0; yEmpty < PUZZLE_SIZE; yEmpty++) {
			if(p[xEmpty][yEmpty] == EMPTY_VALUE) {
				foundEmpty = true;
				break;
			}
		}
		
		if(foundEmpty) {
			break;
		}
	}
	
	if (!foundEmpty) {
		return null;
	}
	
	for (var value = 1; value <= 9; value++) {
		var attempt = copyPuzzle(p);
		attempt[xEmpty][yEmpty] = value;
		
		var result = solve(attempt);
		
		if(result != null) {
			return result;
		}
	}
	
	return null;
}

function copyPuzzle(p) {
	var copy = [
		[0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0]
	];
	
	for(var x = 0; x < PUZZLE_SIZE; x++) {
		for(var y = 0; y < PUZZLE_SIZE; y++) {
			copy[x][y] = p[x][y];
		}
	}
	
	return copy;
}

function validPuzzleStructure(p) {
	if (p.length != PUZZLE_SIZE) {
		return false;
	}
	
	for (var i = 0; i < PUZZLE_SIZE; i++) {
		if (p[i].length != PUZZLE_SIZE) {
			return false;
		}
	}
	
	return true;
}

function validPuzzleState(p) {
	if(!validPuzzleStructure(p)) {
		return false;
	}
	
	for (var i = 0; i < PUZZLE_SIZE; i++) {
		if(!checkRow(p[i])) {
			return false;
		}
	}
	
	for(var i = 0; i < PUZZLE_SIZE; i++) {
		if(!checkCol(p, i)) {
			return false;
		}
	}
	
	for(var x = 0; x < BOX_SIZE; x++) {
		for(var y = 0; y < BOX_SIZE; y++) {
			if(!checkBox(p, x, y)) {
				return false;
			}
		}
	}
	
	return true;
}

function solved(p) {
	if(!validPuzzleState(p)) {
		return false;
	}
	
	for(var x = 0; x < PUZZLE_SIZE; x++) {
		for (var y = 0; y < PUZZLE_SIZE; y++) {
			if(p[x][y] == 0) {
				return false;
			}
		}
	}
	
	return true;
}

function checkRow(r) {
	for(var i = 0; i < (PUZZLE_SIZE - 1); i++) {
		if(r[i] == EMPTY_VALUE) {
			continue;
		}
		
		for(var j = i + 1; j < PUZZLE_SIZE; j++) {
			if(r[j] == EMPTY_VALUE) {
				continue;
			}
			
			if(r[i] == r[j]) {
				return false;
			}
		}
	}
	
	return true;
}

function checkCol(p, index) {
	for(var i = 0; i < (PUZZLE_SIZE - 1); i++) {
		if(p[i][index] == EMPTY_VALUE) {
			continue;
		}
		
		for(var j = (i + 1); j < PUZZLE_SIZE; j++) {
			if(p[j][index] == EMPTY_VALUE) {
				continue;
			}
			
			if(p[i][index] == p[j][index]) {
				return false;
			}
		}
	}
	
	return true;
}

function checkBox(p, x, y) {
	var box = getBox(p, x, y);

	for (var r1 = 0; r1 < BOX_SIZE; r1++) {
		for (var r2 = 0; r2 < BOX_SIZE; r2++) {
			if(!compareBoxRows(box[r1], box[r2], r1 == r2)) {
				return false;
			}
		}
	}
	
	return true;
}

function getBox(p, x, y) {
	var xOffset = BOX_SIZE * x;
	var yOffset = BOX_SIZE * y;

	return [
		[p[xOffset][yOffset], p[xOffset + 1][yOffset], p[xOffset + 2][yOffset]],
		[p[xOffset][yOffset + 1], p[xOffset + 1][yOffset + 1], p[xOffset + 2][yOffset + 1]],
		[p[xOffset][yOffset + 2], p[xOffset + 1][yOffset + 2], p[xOffset + 2][yOffset + 2]]
	];
}

function compareBoxRows(r1, r2, same) {
	for(i = 0; i < (same ? BOX_SIZE - 1 : BOX_SIZE); i++) {
		if(r1[i] == EMPTY_VALUE) {
			continue;
		}
		
		for(j = (same ? i + 1 : 0); j < BOX_SIZE; j++) {
			if(r2[j] == EMPTY_VALUE) {
				continue;
			}
			
			if (r1[i] == r2[j]) {
				return false;
			}
		}
	}
	
	return true;
}
