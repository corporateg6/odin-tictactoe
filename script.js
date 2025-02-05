const gameBoard = (function() {
    const board = [];
    const moveHistory = [];

    function init() {
        resetBoard();
    }

    function getBoard() {
        return board;
    }

    function resetBoard() {
        for (let i = 0; i<9; i++) { board[i] = null; } //fill board with null
        return board;
    }

    function updateBoard(index, value) {
        if(index < 9 && !board[index]) {
            board[index] = value;
            return true; //return true if success //TODO find a better way to handle this
        } else {
            return false; //return false if failed //should we return the failed move?
        }
    }

    init();

    return {
        getBoard,  //returns board state
        resetBoard, //resets board to [null... 9x] and returns board
        updateBoard, //(index, value) updates board @ index with value 
    }

})();

const game = (function() {

    function createPlayer (name, piece) {
        const getName = () => name;
        const getPiece = () => piece;
        return { getName, getPiece };
    }

    const player1 = createPlayer("player1", "X");
    const player2 = createPlayer("player2", "O");
    const players = [player1, player2];
    let gameOver = false;
    let winner = null;
    let currentPlayerIndex = 0;

    function init() {
        gameBoard.resetBoard();
        winner = null;
        gameOver = false;
        currentPlayerIndex = 0;
    }

    function checkWinner() {
        //create different arrays to check for win variations
        const hBoard = gameBoard.getBoard();
        const vBoard = [hBoard[0],hBoard[3],hBoard[6],hBoard[1],hBoard[4],hBoard[7],hBoard[2],hBoard[5],hBoard[8]];
        const d1Board = [hBoard[0],hBoard[4],hBoard[8]];
        const d2Board = [hBoard[2],hBoard[4], hBoard[6]];
        let potentialWinner = null;


        function checkWin(board) {
            let pCount = 0;
            let pWin = null;
            for(let i = 0; i < board.length; i++) {
                if(pWin === null) {
                    pWin = board[i];
                } else if (pWin === board[i]) {
                    pCount++;
                } else {
                    pCount = 0;
                    pWin = board[i];
                }
                if (pCount === 3) {
                    winner = pWin;
                    gameOver = true;
                }
            }
        }

        checkWin(hBoard);
        if(!gameOver) {
            checkWin(vBoard);
        }
        if(!gameOver) {
            checkWin(d1Board);
        }
        if(!gameOver) {
            checkWin(d2Board);
        }
    }

    function getCurrentPlayer() {
        return players[currentPlayerIndex % players.length];
    }

    function submitMove(index) {
        return gameUpdate = gameBoard.updateBoard(index, getCurrentPlayer().getPiece());
        // if(gameUpdate) {
        //     currentPlayerIndex++;
        // }
        // return gameUpdate;
    }

    //TODO: return true if game is over, false if not
    function isGameOver() {
        return gameOver;
    }

    function nextMove(index) {
        if(gameOver) {
            console.log("Game is already over, reset game to start again.")
            return;
        }
        if(!submitMove(index)) {
            console.log("Illegal move, try another move!");
            return;
        }
        checkWinner(); //this is too convoluted, I will start again from fresh.
    }

    init();

    return {
        getCurrentPlayer,
        nextMove,
        isGameOver,
    }

})();