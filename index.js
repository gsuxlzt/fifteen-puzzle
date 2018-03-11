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

    function styleBoard(tileSize, grid, puzzle) {
        puzzle.style.height = `${tileSize*grid + 2*(grid+1)}px`;
        puzzle.style.width = `${tileSize*grid + 2*(grid+1)}px`;
    }

    function createBoard(grid) {
        let board = [...Array(grid).keys()].map(item => Array(grid));
        return board;
    }

    class Puzzle {
        constructor(tileSize, grid, puzzle) {
            this.tileSize = tileSize;
            this.grid = grid;
            this.puzzle = puzzle;
            this.board = [];
            this.emptyPos = 0;
        }

        isSolvable() {
            let toCheck = this.board.reduce((acc, curr) => [...acc, ...curr]);
            let str = toCheck.indexOf(" ");
            toCheck[str] = 0;
            let count = 0;
            for (let i = 0; i < Math.pow(this.grid, 2) - 1; i++) {
                for (let j = i + 1; j < Math.pow(this.grid, 2); j++) {
                    if (toCheck[j] && toCheck[i] && toCheck[i] > toCheck[j]) count++;
                }
            }
            if (this.grid % 2 !== 0) return count % 2 === 0;
            else {
                if (this.emptyPos % 2 === 0) return count % 2 !== 0;
                else return count % 2 === 0;
            }
        }

        getAdjacentTiles(row, col) {
            let arr = [];
            if (row > 0) arr.push(document.getElementById(`${this.puzzle.id}-${row-1}-${col}`))
            if (row < this.grid) arr.push(document.getElementById(`${this.puzzle.id}-${row+1}-${col}`))
            if (col > 0) arr.push(document.getElementById(`${this.puzzle.id}-${row}-${col-1}`))
            if (col < this.grid) arr.push(document.getElementById(`${this.puzzle.id}-${row}-${col+1}`))
            return arr.filter(item => item !== null);
        }

        getEmptytile(id) {
            let row = Number(id.split("-")[1]);
            let col = Number(id.split("-")[2]);
            let emptyTile;
            let adjacentTiles = this.getAdjacentTiles(row, col);
            adjacentTiles.forEach(item => {
                if (item.classList.contains("empty")) emptyTile = item;
            });

            return emptyTile;
        }

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

        slideTile(target) {
            let emptyTile = this.getEmptytile(target.id);
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
                        else self.slideTile(e.target);
                    });
                    this.puzzle.appendChild(cell);
                    count++;
                }
            });
        }

        scramble() {
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
            if (!this.isSolvable()) this.scramble();
        }
    }

    return Puzzle;
})();

let inputs = document.querySelectorAll("input");

for (let i = 0; i < inputs.length; i++) {
    inputs[i].addEventListener("change", function(e) {
        document.getElementById(inputs[i].id).value = e.target.value;
    });
}

let newBoard = document.getElementById("new_board");

newBoard.addEventListener("click", function() {
    let grid = Number(document.getElementById("grid").value);
    if (grid > 40) return;
    let tileSize = Number(document.getElementById("tile_size").value);
    let puzzle = document.createElement("div");
    puzzle.id = `puzzle${puzzles.length}`;
    puzzle.classList.add("puzzle");
    puzzle.classList.add("sliding");
    puzzlesNode.appendChild(puzzle);
    let NewPuzzle = new Puzzle(tileSize, grid, puzzle);
    puzzles.push(NewPuzzle);
    NewPuzzle.scramble();
});

let startOver = document.getElementById("start_over");

startOver.addEventListener("click", function() {
    puzzles.forEach(item => {
        item.scramble();
    });
});

document.addEventListener("DOMContentLoaded", function() {
    newBoard.click();
});