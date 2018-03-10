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

        renderBoard(board,numbersArray) {
            let count = 0;
            board.forEach((item,index)=>{
                for(let i=0; i < item.length;i++) {
                    let cell = document.createElement('span');
                    cell.id = `${index}${i}`;
                    cell.classList.add('tile');
                    cell.style.left = `${i*this.tileSize+1*i+1}px`;
                    cell.style.top = `${index*this.tileSize+1*index+1}px`;
                    cell.innerHTML = numbersArray[count];
                    if (numbersArray[count] === ' ') cell.classList.add('empty');
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
        console.log(inputs[i]);
        document.getElementById(inputs[i].id).value = e.target.value;
    });
};

let newBoard = document.getElementById('new_board');

newBoard.addEventListener('click', function(){
    let puzzle = document.createElement('div');
    puzzle.id = `puzzle${puzzles.length}`;
    puzzle.className = 'puzzle';
    puzzlesNode.appendChild(puzzle);
    let tileSize = Number(document.getElementById('tile_size').value);
    document.documentElement.style.setProperty('--tile-size', `${tileSize}px`);
    tileSize = getComputedStyle(document.body).getPropertyValue('--tile-size').replace(/[^-\d\.]/g, '');
    let grid = Number(document.getElementById('grid').value);
    let MyPuzzle = new Puzzle(tileSize,grid,puzzle);
    puzzles.push(MyPuzzle);
    MyPuzzle.scramble();
});

let startOver = document.getElementById('start_over');

startOver.addEventListener('click', function() {
    puzzles.forEach(item => item.scramble());
    
})
