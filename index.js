let puzzles = [];
let puzzlesNode = document.getElementById("puzzles");

let Puzzle = (function() {
    //method for shuffling an array. got it from stack overflow.
    function shuffle(grid) {
        let numbersArray = Array.apply(null, Array(Math.pow(grid, 2))).map((item, index) => index + 1);
        numbersArray.splice(-1, 1);
        numbersArray.push(" ");
        let temp;
        let rand;
        for (let i = numbersArray.length-1; i >= 0; i--) {
            rand = parseInt(Math.random() * i);
            temp = numbersArray[i];
            numbersArray[i] = numbersArray[rand];
            numbersArray[rand] = temp;
        }
        return numbersArray;
    }

    //to determine the size of the puzzle container. Can be omitted.
    function styleBoard(tileSize, grid, puzzle) {
        puzzle.style.height = `${tileSize*grid + 2*(grid+1)}px`;
        puzzle.style.width = `${tileSize*grid + 2*(grid+1)}px`;
    }

    //creates an empty 2D matrix for the board.
    function createBoard(grid) {
        let board = [...Array(grid).keys()].map(item => Array(grid));
        return board;
    }

    /*
        Checks if the created board is solvable.
        Equation for determining if the board is solvable:
        if N is odd, inversions should be even.
        if N is even,
            if empty tile position from the bottom is add, inversions should be even.
            if empty tile position from the bottom is even, inversions should be odd.
    */
    function isSolvable(board,grid,emptyPos) {
        //flattens the array.
        let toCheck = board.reduce((acc, curr) => [...acc, ...curr]);
        //changes the empty array element to 0. This is needed for determining the number of array inversions.
        let str = toCheck.indexOf(" ");
        toCheck[str] = 0;
        //number of inversions.
        let count = 0;
        for (let i = 0; i < Math.pow(grid, 2) - 1; i++) {
            for (let j = i + 1; j < Math.pow(grid, 2); j++) {
                if (toCheck[j] && toCheck[i] && toCheck[i] > toCheck[j]) count++;
            }
        }
        if (grid % 2 !== 0) return count % 2 === 0;
        else {
            if (emptyPos % 2 === 0) return count % 2 !== 0;
            else return count % 2 === 0;
        }
    }

    //gets the four tiles adjacent to the current tile.
    function getAdjacentTiles(row, col,id,grid) {
        let arr = [];
        if (row > 0) arr.push(document.getElementById(`${id}-${row-1}-${col}`))
        if (row < grid) arr.push(document.getElementById(`${id}-${row+1}-${col}`))
        if (col > 0) arr.push(document.getElementById(`${id}-${row}-${col-1}`))
        if (col < grid) arr.push(document.getElementById(`${id}-${row}-${col+1}`))
        return arr.filter(item => item !== null);
    }

    //determines what tile among the adjacent tiles is the empty tile.
    function getEmptytile(id,grid) {
        let puzzleId = id.split("-")[0];
        let row = Number(id.split("-")[1]);
        let col = Number(id.split("-")[2]);
        let emptyTile;
        let adjacentTiles = getAdjacentTiles(row, col, puzzleId, grid);
        adjacentTiles.forEach(item => {
            if (item.classList.contains("empty")) emptyTile = item;
        });

        return emptyTile;
    }

    class Puzzle {
        constructor(tileSize, grid, puzzle) {
            this.tileSize = tileSize;
            this.grid = grid;
            this.puzzle = puzzle;
            this.board = [];
            this.emptyPos = 0;
        }

        // checks if the board is solved.
        checkSolution() {
            let lastElem = document.getElementById(`${this.puzzle.id}-${this.grid-1}-${this.grid-1}`);
            if (!lastElem.innerText === " ") return;
            let count = 1;
            for (let i = 0; i < this.grid; i++) {
                for (let j = 0; j < this.grid; j++) {
                    if (count <= Math.pow(this.grid, 2) - 1 && document.getElementById(`${this.puzzle.id}-${i}-${j}`).innerText.toString() !== count.toString()) return;
                    count++;
                }
            }
            alert("You have finished the puzzle! Congratulations!");
            this.puzzle.classList.add("disabled");
            this.puzzle.addEventListener("click", function(e) {
                e.preventDefault();
            })
        }

        //event handler for sliding animation
        slideTile(target) {
            let emptyTile = getEmptytile(target.id, this.grid);
            if (emptyTile) {
                let temp = {
                    style: target.style.cssText,
                    id: target.id
                };
                target.id = emptyTile.id;
                target.style = emptyTile.style.cssText;
                emptyTile.id = temp.id;
                emptyTile.style = temp.style;
                this.checkSolution();
            }
        }

        //creates the board and puts the necessary details needed for each tile of the board.
        renderBoard(board, numbersArray) {
            let self = this;
            let count = 0;
            board.forEach((item, index) => {
                for (let i = 0; i < item.length; i++) {
                    let cell = document.createElement("span");
                    cell.id = `${this.puzzle.id}-${index}-${i}`;
                    cell.classList.add("tile");
                    cell.style.width = `${this.tileSize}px`;
                    cell.style.height = `${this.tileSize}px`;
                    cell.style.lineHeight = `${this.tileSize}px`;
                    cell.style.left = `${i*this.tileSize+2*i+2}px`;
                    cell.style.top = `${index*this.tileSize+2*index+2}px`;
                    cell.innerHTML = numbersArray[count];
                    if (numbersArray[count] === " ") {
                        cell.classList.add("empty");
                        this.emptyPos = Number(this.grid - index);
                    }
                    cell.addEventListener("click", function(e) {
                        let tile = e.target;
                        if (tile.classList.contains("empty")) return false;
                        else self.slideTile(tile);
                    });
                    this.puzzle.appendChild(cell);
                    count++;
                }
            });
        }

        init() {
            //deletes a previous instance of the puzzle.
            while (this.puzzle.firstChild) {
                this.puzzle.removeChild(this.puzzle.firstChild);
            }
            styleBoard(this.tileSize, this.grid, this.puzzle);
            this.board = createBoard(this.grid);
            let randomNumbers = shuffle(this.grid);
            let count = 0;
            this.board.forEach(item => {
                for (let i = 0; i < item.length; i++) {
                    item[i] = randomNumbers[count];
                    count++;
                }
            });
            this.renderBoard(this.board, randomNumbers);
            //recreates the board if the previous one is not solvable.
            if (!isSolvable(this.board,this.grid,this.emptyPos)) this.init();
        }
    }

    return Puzzle;
})();

let inputs = document.querySelectorAll("input");

//add event listener on input elements to change its value on change and to prevent user from putting non-numeric characters.
for (let i = 0; i < inputs.length; i++) {
    inputs[i].addEventListener("change", function(e) {
        document.getElementById(inputs[i].id).value = e.target.value;
    });

    inputs[i].addEventListener("keydown", function(e){
        if ((e.which < 48 || e.which > 57) && e.which !== 8 && e.which !== 46 && (e.which < 37 || e.which > 40)) e.preventDefault();
    });
}

let newBoard = document.getElementById("new_board");

//event listener for adding a new board.
newBoard.addEventListener("click", function() {
    let grid = Number(document.getElementById("grid").value);
    let tileSize = Number(document.getElementById("tile_size").value);

    if (grid > 40 || tileSize > 500) {
        alert('Grid or tile size too big.');
        return;
    }

    if (grid < 2 || tileSize < 20) {
        alert('Grid or tile size too small.');
        return;
    }

    let puzzle = document.createElement("div");
    puzzle.id = `puzzle${puzzles.length}`;
    puzzle.classList.add("puzzle");
    puzzle.classList.add("sliding");
    puzzlesNode.appendChild(puzzle);
    let NewPuzzle = new Puzzle(tileSize, grid, puzzle);
    puzzles.push(NewPuzzle);
    NewPuzzle.init();
});

// shuffles all puzzles.
let startOver = document.getElementById("start_over");

startOver.addEventListener("click", function() {
    puzzles.forEach(item => {
        if (item.puzzle.classList.contains('disabled')) return;
        item.init();
    });
});

document.addEventListener("DOMContentLoaded", function() {
    // instantiate a puzzle onload.
    newBoard.click();
});