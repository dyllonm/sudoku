// The size (both height and width) of a puzzle.
const PUZZLE_SIZE = 9;

// The size (both height and width) of a box within a puzzle.
const BOX_SIZE = 3;

// The value which represents an empty cell in a puzzle.
const EMPTY_VALUE = 0;

// The minimum value in a puzzle.
const MIN_VALUE = 1;

// The maximum value in a puzzle.
const MAX_VALUE = 9;

// A basic empty puzzle board.
const emptyPuzzle = [
	[EMPTY_VALUE, EMPTY_VALUE, EMPTY_VALUE, EMPTY_VALUE, EMPTY_VALUE, EMPTY_VALUE, EMPTY_VALUE, EMPTY_VALUE, EMPTY_VALUE],
	[EMPTY_VALUE, EMPTY_VALUE, EMPTY_VALUE, EMPTY_VALUE, EMPTY_VALUE, EMPTY_VALUE, EMPTY_VALUE, EMPTY_VALUE, EMPTY_VALUE],
	[EMPTY_VALUE, EMPTY_VALUE, EMPTY_VALUE, EMPTY_VALUE, EMPTY_VALUE, EMPTY_VALUE, EMPTY_VALUE, EMPTY_VALUE, EMPTY_VALUE],
	[EMPTY_VALUE, EMPTY_VALUE, EMPTY_VALUE, EMPTY_VALUE, EMPTY_VALUE, EMPTY_VALUE, EMPTY_VALUE, EMPTY_VALUE, EMPTY_VALUE],
	[EMPTY_VALUE, EMPTY_VALUE, EMPTY_VALUE, EMPTY_VALUE, EMPTY_VALUE, EMPTY_VALUE, EMPTY_VALUE, EMPTY_VALUE, EMPTY_VALUE],
	[EMPTY_VALUE, EMPTY_VALUE, EMPTY_VALUE, EMPTY_VALUE, EMPTY_VALUE, EMPTY_VALUE, EMPTY_VALUE, EMPTY_VALUE, EMPTY_VALUE],
	[EMPTY_VALUE, EMPTY_VALUE, EMPTY_VALUE, EMPTY_VALUE, EMPTY_VALUE, EMPTY_VALUE, EMPTY_VALUE, EMPTY_VALUE, EMPTY_VALUE],
	[EMPTY_VALUE, EMPTY_VALUE, EMPTY_VALUE, EMPTY_VALUE, EMPTY_VALUE, EMPTY_VALUE, EMPTY_VALUE, EMPTY_VALUE, EMPTY_VALUE],
	[EMPTY_VALUE, EMPTY_VALUE, EMPTY_VALUE, EMPTY_VALUE, EMPTY_VALUE, EMPTY_VALUE, EMPTY_VALUE, EMPTY_VALUE, EMPTY_VALUE]
];

// Makes several attempts to generate a solveable puzzle.
function generatePuzzle(percentageFilled) {
	const MAX_ATTEMPTS = 25;

	let puzzle;
	let attempts = 0;
	
	do {
		puzzle = generatePuzzleAttempt(percentageFilled);
		attempts++;
	} while (puzzle == null && attempts < MAX_ATTEMPTS);
	
	return puzzle;
}

// An individual attempt to generate a solveable puzzle.
function generatePuzzleAttempt(percentageFilled) {
	if(percentageFilled < 0 || percentageFilled > 100) {
		return null;
	}
	
	// Calculate the target number of full and empty boxes.
	let fullBoxes = (PUZZLE_SIZE * PUZZLE_SIZE) * (percentageFilled / 100);
	let emptyBoxes = (PUZZLE_SIZE * PUZZLE_SIZE) - fullBoxes;
	
	// Start with a copy of the empty puzzle.
	let puzzle = copyPuzzle(emptyPuzzle);
	
	// Start by seeding random values in the empty puzzle
	let retryAttempts = 0;
	let seededCells = 0;
	const MAX_SEED_ATTEMPTS = 5;
	const MAX_SEEDED_CELLS = 8;
	let first = true;
	while(retryAttempts < MAX_SEED_ATTEMPTS && seededCells < MAX_SEEDED_CELLS) {
		let coords = first ? {x: 0, y: 0} : randomCoords();
		first = false;
		
		if(puzzle[coords.x][coords.y] != EMPTY_VALUE) {
			retryAttempts++;
			continue;
		}
		
		let value = randomValueForCoordinates(puzzle, coords);
		
		if(value == null) {
			// We have created an unsolveable puzzle.
			return null;
		}
		
		puzzle[coords.x][coords.y] = value;
		seededCells++;
		retryAttempts = 0;
	}
	
	// Next, attempt to solve the puzzle.
	puzzle = solve(puzzle);
	
	// If the puzzle isn't solveable then this attempt failed.
	if(puzzle == null) {
		return null;
	}
	
	// Next, remove some values from the solved puzzle.
	// TODO: Find a way to remove more values than what is actually getting removed here.
	let removed = 0;
	let notFoundCount = 0;
	const MAX_FIND_ATTEMPTS = 20;
	while (removed < emptyBoxes && notFoundCount < MAX_FIND_ATTEMPTS) {
		let coords = randomCoords();
		
		// Don't remove this value if there is another valid number in this space.
		// This makes it so that the player doesn't have to guess.
		if(otherValidSolution(puzzle, coords)) {
			notFoundCount++;
			continue;
		}
		
		puzzle[coords.x][coords.y] = EMPTY_VALUE;
		removed++;
		notFoundCount = 0;
	}
	
	return puzzle;
}

// Gets a random coordinate within the game board.
function randomCoords() {
	return {
		x: Math.floor(Math.random() * (PUZZLE_SIZE - 0.1)),
		y: Math.floor(Math.random() * (PUZZLE_SIZE - 0.1))
	};
}

// Gets a random value to place on the game board.
function randomValueForCoordinates(p, coords) {
	var allValues = valuesForCoords(p, coords);
	if(allValues.length > 0) {
		var index = Math.floor(Math.random() * allValues.length);
		return allValues[index];
	}
	
	return null;
}

// Check if there is any other valid value in the specified coordinates on the board.
function otherValidSolution(p, coords) {
	let currentValue = p[coords.x][coords.y];
	
	let validValues = valuesForCoords(p, coords);
	
	return validValues.length != 1 || validValues[0] != currentValue;
}

// Gets all valid values for the provided coordinates.
function valuesForCoords(p, coords) {
	let values = [];
	
	for(let i = MIN_VALUE; i <= MAX_VALUE; i++) {
		if(canValueGoHere(p, coords, i)) {
			values.push(i);
		}
	}
	
	return values;
}

// Determines if a value is valid for a specific coordinate.
function canValueGoHere(p, coords, value) {
	let copy = copyPuzzle(p);
	copy[coords.x][coords.y] = value;
	
	if(!checkCol(copy, coords.x)) {
		return false;
	}
	
	if(!checkRow(copy, coords.y)) {
		return false;
	}
	
	let boxX = Math.floor(coords.x / BOX_SIZE);
	let boxY = Math.floor(coords.y / BOX_SIZE);
	
	return checkBox(copy, boxX, boxY);
}

// Solve a puzzle
function solve(p) {
	if(!validPuzzleState(p)) {
		return null;
	}
	
	if(solved(p)) {
		return p;
	}
	
	let emptyCoords = firstEmptyCoordinates(p);
	
	if (emptyCoords == null) {
		return null;
	}
	
	let validValues = valuesForCoords(p, emptyCoords);
	
	for(let i = 0; i < validValues.length; i++) {
		let attempt = copyPuzzle(p);
		attempt[emptyCoords.x][emptyCoords.y] = validValues[i];
		
		let result = solve(attempt);
		
		if(result != null) {
			return result;
		}
	}
	
	return null;
}

// Finds the first empty coordinates on a puzzle.
function firstEmptyCoordinates(p) {
	let xEmpty = 0;
	let yEmpty = 0;
	let foundEmpty = false;
	
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

	if(foundEmpty) {
		return {
			x: xEmpty,
			y: yEmpty
		};
	}

	return null;
}

// Makes a copy of a puzzle
function copyPuzzle(p) {
	let copy = [
		[EMPTY_VALUE, EMPTY_VALUE, EMPTY_VALUE, EMPTY_VALUE, EMPTY_VALUE, EMPTY_VALUE, EMPTY_VALUE, EMPTY_VALUE, EMPTY_VALUE],
		[EMPTY_VALUE, EMPTY_VALUE, EMPTY_VALUE, EMPTY_VALUE, EMPTY_VALUE, EMPTY_VALUE, EMPTY_VALUE, EMPTY_VALUE, EMPTY_VALUE],
		[EMPTY_VALUE, EMPTY_VALUE, EMPTY_VALUE, EMPTY_VALUE, EMPTY_VALUE, EMPTY_VALUE, EMPTY_VALUE, EMPTY_VALUE, EMPTY_VALUE],
		[EMPTY_VALUE, EMPTY_VALUE, EMPTY_VALUE, EMPTY_VALUE, EMPTY_VALUE, EMPTY_VALUE, EMPTY_VALUE, EMPTY_VALUE, EMPTY_VALUE],
		[EMPTY_VALUE, EMPTY_VALUE, EMPTY_VALUE, EMPTY_VALUE, EMPTY_VALUE, EMPTY_VALUE, EMPTY_VALUE, EMPTY_VALUE, EMPTY_VALUE],
		[EMPTY_VALUE, EMPTY_VALUE, EMPTY_VALUE, EMPTY_VALUE, EMPTY_VALUE, EMPTY_VALUE, EMPTY_VALUE, EMPTY_VALUE, EMPTY_VALUE],
		[EMPTY_VALUE, EMPTY_VALUE, EMPTY_VALUE, EMPTY_VALUE, EMPTY_VALUE, EMPTY_VALUE, EMPTY_VALUE, EMPTY_VALUE, EMPTY_VALUE],
		[EMPTY_VALUE, EMPTY_VALUE, EMPTY_VALUE, EMPTY_VALUE, EMPTY_VALUE, EMPTY_VALUE, EMPTY_VALUE, EMPTY_VALUE, EMPTY_VALUE],
		[EMPTY_VALUE, EMPTY_VALUE, EMPTY_VALUE, EMPTY_VALUE, EMPTY_VALUE, EMPTY_VALUE, EMPTY_VALUE, EMPTY_VALUE, EMPTY_VALUE]
	];
	
	for(let x = 0; x < PUZZLE_SIZE; x++) {
		for(let y = 0; y < PUZZLE_SIZE; y++) {
			copy[x][y] = p[x][y];
		}
	}
	
	return copy;
}

// Makes sure that the puzzle has the correct structure
function validPuzzleStructure(p) {
	if (p.length != PUZZLE_SIZE) {
		return false;
	}
	
	for (let i = 0; i < PUZZLE_SIZE; i++) {
		if (p[i].length != PUZZLE_SIZE) {
			return false;
		}
	}
	
	return true;
}

// Checks if all values in the puzzle are valid
function validPuzzleState(p) {
	if(!validPuzzleStructure(p)) {
		return false;
	}
	
	for (let i = 0; i < PUZZLE_SIZE; i++) {
		if(!checkRow(p[i])) {
			return false;
		}
	}
	
	for(let i = 0; i < PUZZLE_SIZE; i++) {
		if(!checkCol(p, i)) {
			return false;
		}
	}
	
	for(let x = 0; x < BOX_SIZE; x++) {
		for(let y = 0; y < BOX_SIZE; y++) {
			if(!checkBox(p, x, y)) {
				return false;
			}
		}
	}
	
	return true;
}

// Checks if a puzzle is in a valid state and has no empty cells
function solved(p) {
	if(!validPuzzleState(p)) {
		return false;
	}
	
	for(let x = 0; x < PUZZLE_SIZE; x++) {
		for (let y = 0; y < PUZZLE_SIZE; y++) {
			if(p[x][y] == EMPTY_VALUE) {
				return false;
			}
		}
	}
	
	return true;
}

// Checks for duplicate values in a puzzle row
function checkRow(r) {
	for(let i = 0; i < (PUZZLE_SIZE - 1); i++) {
		if(r[i] == EMPTY_VALUE) {
			continue;
		}
		
		for(let j = i + 1; j < PUZZLE_SIZE; j++) {
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

// Checks for duplicate values in a puzzle column
function checkCol(p, index) {
	for(let i = 0; i < (PUZZLE_SIZE - 1); i++) {
		if(p[i][index] == EMPTY_VALUE) {
			continue;
		}
		
		for(let j = (i + 1); j < PUZZLE_SIZE; j++) {
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

// Checks for duplicate values in a puzzle box
function checkBox(p, x, y) {
	let box = getBox(p, x, y);

	for (let r1 = 0; r1 < BOX_SIZE; r1++) {
		for (let r2 = 0; r2 < BOX_SIZE; r2++) {
			if(!compareBoxRows(box[r1], box[r2], r1 == r2)) {
				return false;
			}
		}
	}
	
	return true;
}

// Gets the subset of a puzzle that corresponds to the requested box
function getBox(p, x, y) {
	let xOffset = BOX_SIZE * x;
	let yOffset = BOX_SIZE * y;

	return [
		[p[xOffset][yOffset], p[xOffset + 1][yOffset], p[xOffset + 2][yOffset]],
		[p[xOffset][yOffset + 1], p[xOffset + 1][yOffset + 1], p[xOffset + 2][yOffset + 1]],
		[p[xOffset][yOffset + 2], p[xOffset + 1][yOffset + 2], p[xOffset + 2][yOffset + 2]]
	];
}

// Checks for duplicate values across two rows in a box
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
