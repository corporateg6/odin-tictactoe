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

        function getBoardAt(i) {
            return board[i];
        }

        function updateBoard(index, value) {
            if(index < 9 && !board[index]) {
                board[index] = value;
                return true; //return true if success //TODO find a better way to handle this?
            } else {
                return false; //return false if failed //should we return the failed move?
            }
        }

        init();
        
        return {
            getBoard,
            getBoardAt,
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
    let winType = null;
    let currentPlayerIndex = 0;

    function newGame() {
        gameBoard.resetBoard();
        gameOver = false;
        winner = null;
        winType = null;
        currentPlayerIndex = 0;
        console.log("new game started");
        renderGame();
        getGameResult();
        renderGameBoardInitial();
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
            
            // moving draw logic to another function
            // if(!nullFound) gameOver = true; //if we didn't find any nulls, then the game is over, regardless if there is a winner
            
            return {
                gameOver,
                winner,
            };
        }

        function checkDraw(board) {
            let draw = true;
            for(let i=0; i<board.length; i++) {
                if(!board[i]) draw = false;
            }
            return draw;
        }
        
        //create different arrays to check for win variations
        const hBoard = gameBoard.getBoard();
        const h1Board = [hBoard[0],hBoard[1],hBoard[2]];
        const h2Board = [hBoard[3],hBoard[4],hBoard[5]];
        const h3Board = [hBoard[6],hBoard[7],hBoard[8]];
        const vBoard = [hBoard[0],hBoard[3],hBoard[6],hBoard[1],hBoard[4],hBoard[7],hBoard[2],hBoard[5],hBoard[8]];
        const v1Board = [vBoard[0],vBoard[1],vBoard[2]];
        const v2Board = [vBoard[3],vBoard[4],vBoard[5]];
        const v3Board = [vBoard[6],vBoard[7],vBoard[8]]; 
        const d1Board = [hBoard[0],hBoard[4],hBoard[8]];
        const d2Board = [hBoard[2],hBoard[4], hBoard[6]];
        let result = null;

        const boards = [h1Board, h2Board, h3Board, v1Board, v2Board, v3Board, d1Board, d2Board];

        for(let i=0; i<boards.length; i++) {
            result = checkWin(boards[i]);
            if(result.gameOver) {
                winType = i;
                break;
            }
        }

        //check if game is over due to draw
        if(!result.gameOver) {
            gameOver = checkDraw(hBoard);
        }
    
        // result = checkWin(hBoard);
        // if(!result.gameOver) {
        //     // console.log(vBoard);
        //     result = checkWin(vBoard);
        // }
        // if(!result.gameOver) {
        //     // console.log(d1Board);
        //     result = checkWin(d1Board);
        // }
        // if(!result.gameOver) {
        //     // console.log(d2Board);
        //     result = checkWin(d2Board);
        // }
    
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
                renderWin(winType);
                console.log(`${winner.getName()} is the winner! Start a new game to play again.`);
            } else {
                console.log(`Game is a draw, start a new game to play again!`);
            }
        } else {
            console.log(`game in progress, ${getCurrentPlayer().getName()} submit move to continue`);
        }
    }

    function renderGameBoardInitial() {
        const gameBoardDOM = document.querySelector(".game-board");
        gameBoardDOM.innerHTML = "";
        for (let i=0; i<9; i++) {
            const cell = document.createElement("div");
            cell.classList.add("cell", "empty");
            cell.id = `${i}`;
            cell.addEventListener("click", triggerCell); //add onclick function to cells
            // I don't need to add the cell content until I fill the cell with content
            // const cellContent = document.createElement("div");
            // cellContent.classList.add("cell-content");
            // cellContent.id = `${i}`;
            // cell.appendChild(cellContent);
            gameBoardDOM.appendChild(cell);
        }
    }

    function renderWin(winType) {
        const h1 = [0,1,2];
        const h2 = [3,4,5];
        const h3 = [6,7,8];
        const v1 = [0,3,6];
        const v2 = [1,4,7];
        const v3 = [2,5,9];
        const d1 = [0,4,8];
        const d2 = [2,4,6];
        const winTypes = [h1, h2, h3, v1, v2, v3, d1, d2];

        const winCells = winTypes[winType];
        for(let i = 0; i < winCells.length; i++) {
            document.getElementById(`${winCells[i]}`).classList.toggle("win");
        }
    }

    //this is the on click function for the cells
    function triggerCell(evt) {
        //update the cell and add cell content according to the board state
        const cell = evt.target;
        submitMove(cell.id);
        cell.classList.remove("empty");
        cell.removeEventListener("click", triggerCell);
        const cellContent = document.createElement("div");
        const piece = gameBoard.getBoardAt(cell.id);
        cellContent.classList.add("cell-content", piece);
        cellContent.textContent = piece;
        cell.appendChild(cellContent);

    }

    function init() {
        newGame();
    }

    init();

    //don't need to expose any external methods currently
    // return {
    //     newGame,
    //     renderGame,
    //     submitMove,
    //     getCurrentPlayer,
    //     getGameResult,
    //     checkWinner,
    // };


    return {renderWin,};
})();