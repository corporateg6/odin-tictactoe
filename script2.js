const game = (function() {

    const gameBoard = (function() {
        let board = [];

        function init() {
            resetBoard();
        }

        function resetBoard() {
            for (let i = 0; i<9; i++) { board[i] = null; } //fill board with null
        }

        function getBoard() {
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
            getBoard,
            updateBoard,
            resetBoard,
        };
    })();

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

    function newGame() {
        gameBoard.resetBoard();
        gameOver = false;
        winner = null;
        currentPlayerIndex = 0;
        console.log("new game started");
        renderGame();
        getGameResult();
    }

    function getPlayerWithPiece(piece) {
        for(let i=0; i<players.length; i++) {
            if (players[i].getPiece() === piece) return players[i];
        }
    }

    function renderGame() {
        const board = gameBoard.getBoard().map((item) => item === null ? '_' : item);
        console.log(`${board[0]}|${board[1]}|${board[2]}`);
        //console.log(`_____`);
        console.log(`${board[3]}|${board[4]}|${board[5]}`);
        //console.log(`_____`);
        console.log(`${board[6]}|${board[7]}|${board[8]}`);

        //TODO update this to render game on DOM
    }

    function getCurrentPlayer() {
        return players[currentPlayerIndex % players.length];
    }

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
        winner = getPlayerWithPiece(result.winner);
    
    }

    function submitMove(index) {
        if(gameOver) {
            renderGame();
            getGameResult();
            return;
        }
        if(!gameBoard.updateBoard(index, getCurrentPlayer().getPiece())) {
            console.log("invalid move - try again");
            renderGame();
            getGameResult();
        } else {
            currentPlayerIndex++;
            renderGame();
            checkWinner(); //bm
            getGameResult();
        }
    } 

    function getGameResult() {
        if (gameOver) {
            if(winner) {
                console.log(`${winner.getName()} is the winner! Start a new game to play again.`);
            } else {
                console.log(`Game is a draw, start a new game to play again!`);
            }
        } else {
            console.log(`game in progress, ${getCurrentPlayer().getName()} submit move to continue`);
        }
    }

    function init() {
        newGame();
    }

    init();

    return {
        newGame,
        renderGame,
        submitMove,
        getCurrentPlayer,
        getGameResult,
        checkWinner,
    };

})();