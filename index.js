let Puzzle = (function(){
    let tileSize = getComputedStyle(document.body).getPropertyValue('--tile-size').replace(/[^-\d\.]/g, '');
    let puzzle = document.getElementById('puzzle');
    let grid = Number(document.getElementById('grid').value);
    let Puzzle = {};

    //method for shuffling an array. got it from stack overflow.
    function shuffle() {
       let numbersArray = Array.apply(null, Array(Math.pow(grid,2))).map((item,index)=>index+1);
        numbersArray.splice(-1,1);
        numbersArray.push(' ');
        for(var j, x, i = numbersArray.length; i; j = parseInt(Math.random() * i), x = numbersArray[--i], numbersArray[i] = numbersArray[j], numbersArray[j] = x);
        return numbersArray;
    };

    function styleBoard() {
        puzzle.style.height = `${tileSize*grid + 5}px`;
        puzzle.style.width = `${tileSize*grid + 5}px`;
    }

    function createBoard() {
        let board = [...Array(grid).keys()].map(item=>Array(grid));   
        return board;
    }

    function renderBoard(board,numbersArray) {
        let count = 0;
        console.log(board);
        console.log(numbersArray);
        board.forEach((item,index)=>{
            for(let i=0; i < item.length;i++) {
                let cell = document.createElement('span');
                cell.id = `${index}${i}`;
                cell.classList.add('tile');
                console.log(tileSize);
                cell.style.top = `${i*tileSize+1*i+1}px`;
                cell.style.left = `${index*tileSize+1*index+1}px`;
                cell.innerHTML = numbersArray[count];
                if (numbersArray[count] === ' ') cell.classList.add('empty');
                puzzle.appendChild(cell);
                count++;
            }
        })
    }
    
    Puzzle.scramble = function() {
        styleBoard();
        let board = createBoard();
        let randomNumbers = shuffle();
        let count = 0;
        board.forEach(item=>{
            for(let i=0; i < item.length; i++) {
                item[i] = randomNumbers[count];
                count++;
            }
        });
        renderBoard(board, randomNumbers);
    }
    return Puzzle;
})();

Puzzle.scramble();
