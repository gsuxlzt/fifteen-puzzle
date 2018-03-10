let puzzles = [];
let puzzlesNode = document.getElementById('puzzles');

let Puzzle = (function(){
    //method for shuffling an array. got it from stack overflow.
    function shuffle(grid) {
       let numbersArray = Array.apply(null, Array(Math.pow(grid,2))).map((item,index)=>index+1);
        numbersArray.splice(-1,1);
        numbersArray.push(' ');
        for(var j, x, i = numbersArray.length; i; j = parseInt(Math.random() * i), x = numbersArray[--i], numbersArray[i] = numbersArray[j], numbersArray[j] = x);
        return numbersArray;
    };

    function styleBoard(tileSize,grid,puzzle) {
        puzzle.style.height = `${tileSize*grid + 5}px`;
        puzzle.style.width = `${tileSize*grid + 5}px`;
    }

    function createBoard(grid) {
        let board = [...Array(grid).keys()].map(item=>Array(grid));   
        return board;
    }

  
    class Puzzle {
        constructor (tileSize, grid, puzzle) {
            this.tileSize = tileSize;
            this.grid = grid;
            this.puzzle = puzzle;
        }

        getAdjacentTiles(row,col) {
            let arr = [];
            if (row > 0) arr.push(document.getElementById(`${this.puzzle.id}-${row-1}-${col}`))
            if (row < this.grid) arr.push(document.getElementById(`${this.puzzle.id}-${row+1}-${col}`))
            if (col > 0) arr.push(document.getElementById(`${this.puzzle.id}-${row}-${col-1}`))
            if (col < this.grid) arr.push(document.getElementById(`${this.puzzle.id}-${row}-${col+1}`))
            return arr.filter(item=>item !== null);
        }

        getEmptytile(id) {
            let row = Number(id.split('-')[1]);
            let col = Number(id.split('-')[2]);
            let emptyTile;
            let adjacentTiles = this.getAdjacentTiles(row,col);
            adjacentTiles.forEach(item=> {
                if (item.classList.contains('empty')) emptyTile = item;
            });

            return emptyTile;
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
            }
        }
 

        renderBoard(board,numbersArray) {
            var self = this;
            let count = 0;
            board.forEach((item,index)=>{
                for(let i=0; i < item.length;i++) {
                    let cell = document.createElement('span');
                    cell.id = `${this.puzzle.id}-${index}-${i}`;
                    cell.classList.add('tile');
                    cell.style.width = `${this.tileSize}px`;
                    cell.style.height = `${this.tileSize}px`;
                    cell.style.lineHeight = `${this.tileSize}px`;
                    cell.style.left = `${i*this.tileSize+1*i+1}px`;
                    cell.style.top = `${index*this.tileSize+1*index+1}px`;
                    cell.innerHTML = numbersArray[count];
                    if (numbersArray[count] === ' ') {
                        cell.classList.add('empty');
                    }
                    cell.addEventListener('click',function(e){
                        let tile = e.target;
                        if (tile.classList.contains('empty')) return false;
                        else self.slideTile(e.target);
                    });
                    this.puzzle.appendChild(cell);
                    count++;
                };
            });
        }
 
        scramble () {
            styleBoard(this.tileSize, this.grid,this.puzzle);
            let board = createBoard(this.grid);
            let randomNumbers = shuffle(this.grid);
            let count = 0;
            board.forEach(item=>{
                for(let i=0; i < item.length; i++) {
                    item[i] = randomNumbers[count];
                    count++;
                }
            });
            this.renderBoard(board, randomNumbers);
        }
    }
    
    return Puzzle;
})();

let inputs = document.querySelectorAll('input');

for (let i = 0; i < inputs.length; i++) {
    inputs[i].addEventListener('change',function(e) {
        document.getElementById(inputs[i].id).value = e.target.value;
    });
};

let newBoard = document.getElementById('new_board');

newBoard.addEventListener('click', function(){
    let puzzle = document.createElement('div');
    puzzle.id = `puzzle${puzzles.length}`;
    puzzle.classList.add('puzzle');
    puzzle.classList.add('sliding');
    puzzlesNode.appendChild(puzzle);
    let tileSize = Number(document.getElementById('tile_size').value);
    let grid = Number(document.getElementById('grid').value);
    let NewPuzzle = new Puzzle(tileSize,grid,puzzle);
    puzzles.push(NewPuzzle);
    NewPuzzle.scramble();
});

let startOver = document.getElementById('start_over');

startOver.addEventListener('click', function() {
    puzzles.forEach(item => item.scramble());
    
});

document.addEventListener("DOMContentLoaded", function() {
    newBoard.click();
  });