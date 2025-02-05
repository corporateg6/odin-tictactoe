function checkWinner() {
    
    function checkWin(board) {
        let gameOver = false;
        let winner = null;
        let nullFound = false;
        let potentialWinner = null;
        let consecutive = 0;
        
        for (let i = 0; i<board.length; i++) {
            // console.log(`board[i]: ${board[i]}`);
            // console.log(`pwin: ${potentialWinner}`);
            // console.log(`gameover: ${gameOver}`);
            // console.log(`nullfound: ${nullFound}`);
            
            if(!board[i]) {
                nullFound = true;
                consecutive = 0;
            } else if (board[i] === potentialWinner) { //pot = 'X' board[i] = 'X'
                consecutive++;
                // console.log(`consecutive: ${consecutive}`);
                if(consecutive == 2) {
                    gameOver = true;
                    winner = potentialWinner;
                    // console.log(`winner found: ${winner} pot: ${potentialWinner}`);
                    break;
                }
            } else {
                consecutive = 0;
                potentialWinner = board[i];
            }
        }
        
        if(!nullFound) gameOver = true; //if we didn't find any nulls, then the game is over, regardless if there is a winner
        
        return {
            gameOver,
            winner,
        };
    }
    
    //create different arrays to check for win variations
    const hBoard = gameBoard.getBoard();
    const vBoard = [hBoard[0],hBoard[3],hBoard[6],hBoard[1],hBoard[4],hBoard[7],hBoard[2],hBoard[5],hBoard[8]];
    const d1Board = [hBoard[0],hBoard[4],hBoard[8]];
    const d2Board = [hBoard[2],hBoard[4], hBoard[6]];
    let result = null;

    result = checkWin(hBoard);
    if(!result.gameOver) {
        // console.log(vBoard);
        result = checkWin(vBoard);
    }
    if(!result.gameOver) {
        // console.log(d1Board);
        result = checkWin(d1Board);
    }
    if(!result.gameOver) {
        // console.log(d2Board);
        result = checkWin(d2Board);
    }

    gameOver = result.gameOver;
    winner = result.winner;

}

// (board) => {gameOver: Boolean,
//             winner: null or String,
// }

// gameOver: false, winner: null
// gameOver: true, winner: null
// gameOver: true, winner: somePiece (for each piece eg X or O)

//as we iterate through the board array, if we get 3 consecutive non null values that match:
// return gameOver: true, and set winner to somePiece,

//if we get no nulls in the array we should return gameOver true, 

//if we don't meet those conditions return gameOver false and winner null


//confirm working code!!!


// //tests
// //simple boards
// //winner X
// const simpleWinX = ["X", "X", "X"];
// //winner y
// const simpleWinO = ["O", "O", "O"];
// //draw
// const simpleDraw = ["X", "O", "X"];
// //game in progress
// const simpleProgress = [null, "X", "O"];
// const simpleProgress2 = [null, null, "O"];

// // console.table(checkWin(simpleWinX));
// // console.table(checkWin(simpleWinO));
// // console.table(checkWin(simpleDraw));
// // console.table(checkWin(simpleProgress));
// // console.table(checkWin(simpleProgress2));

// const winX = ["O", null, "O", "X", "X","O","X","X","X"];
// const winO = ["O", "O", "O", "X", "X", "X", "X", "X","X"];
// const draw = ["X", "O", "X", "O", "X", "O", "X", "X", "O"];
// const inProgress = ["X", "O", "X", "O", null, "O", "X", "X", "O"];

// console.table(checkWin(winX));
// console.table(checkWin(winO));
// console.table(checkWin(draw));
// console.table(checkWin(inProgress));
