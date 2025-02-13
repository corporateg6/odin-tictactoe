
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
        let score = 0;
        const getName = () => name;
        const getPiece = () => piece;
        const getScore = () => score;
        const increaseScore = () => score++;
        const resetScore = () => score = 0;
        return { getName, getPiece, getScore, increaseScore, resetScore };
    }

    let player1 = createPlayer("Player 1", "X");
    let player2 = createPlayer("Player 2", "O");
    let players = [player1, player2];
    let gameOver = false;
    let winner = null;
    let winnerIdx = null;
    let winType = null;
    let currentPlayerIndex = 0;

    function newGame() {
        gameBoard.resetBoard();
        gameOver = false;
        winner = null;
        winType = null;
        winnerIdx = null;
        currentPlayerIndex = 0;
        randomizeStartingPlayer();
        // renderGameConsole();
        getGameResult();
        renderGameBoard();
        renderScore();
        renderPlayerIndicator();
        renderGameStatus();
        renderPlayerInfo();
    }

    function resetScores() {
        for(let i=0; i<players.length; i++) {
            players[i].resetScore();
        }
    }

    function renderGameStatus() {
        const gameStatus = document.querySelector(".game-status-message");
        if(!gameOver) {
            gameStatus.textContent = `${getCurrentPlayer().getName()} to move.`;
        } else {
            if (winner) {
                gameStatus.textContent = `${winner.getName()} wins!`;
            } else {
                gameStatus.textContent = `Draw!`;
            }
        }
    }

    function renderPlayerInfo() {
        const p1 = document.getElementById("player1");
        const p2 = document.getElementById("player2");
        p1name = p1.querySelector(".player-name");
        p2name = p2.querySelector(".player-name");
        p1piece = p1.querySelector(".player-piece");
        p2piece = p2.querySelector(".player-piece");

        p1name.textContent = players[0].getName();
        p2name.textContent = players[1].getName();
        p1piece.textContent = players[0].getPiece();
        p2piece.textContent = players[1].getPiece();
    }

    function getPlayerWithPiece(piece) {
        for(let i=0; i<players.length; i++) {
            if (players[i].getPiece() === piece) return players[i];
        }
    }

    function getPlayerIndexWithPiece(piece) {
        for(let i=0; i<players.length; i++) {
            if (players[i].getPiece() === piece) return i;
        }
    }

    function renderGameConsole() {
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
        winnerIdx = getPlayerIndexWithPiece(result.winner);
        winner = players[winnerIdx];
    }

    function randomizeStartingPlayer() {
        currentPlayerIndex = Math.round(Math.random());
    }

    function renderPlayerIndicator() {
        const p1Indicator = document.getElementById("player1-indicator");
        const p2Indicator = document.getElementById("player2-indicator");
        p1Svg = p1Indicator.querySelector("svg");
        p2Svg = p2Indicator.querySelector("svg");
        if(gameOver) {
            p1Svg.style.display = "none";
            p2Svg.style.display = "none";
            return;
        }
        switch(currentPlayerIndex % 2) {
            case 0:
                p1Svg.style.display = "inline";
                p2Svg.style.display = "none";
                break;
            case 1:
                p1Svg.style.display = "none";
                p2Svg.style.display = "inline";
                break;
        }
    }

    function submitMove(index) {
        if(gameOver) {
            // renderGameConsole();
            getGameResult();
            return;
        }
        if(!gameBoard.updateBoard(index, getCurrentPlayer().getPiece())) {
            // console.log("invalid move - try again");
            // renderGameConsole();
            getGameResult();
        } else {
            currentPlayerIndex++;
            // renderGameConsole();
            checkWinner(); //bm
            getGameResult();
        }
    } 

    function getGameResult() {
        if (gameOver) {
            if(winner) {
                updateScore();
                renderWin();
                cleanCells();
                // console.log(`${winner.getName()} is the winner! Start a new game to play again.`);
            } else {
                // console.log(`Game is a draw, start a new game to play again!`);
            }
        } else {
            // console.log(`game in progress, ${getCurrentPlayer().getName()} submit move to continue`);
        }
    }

    function updateScore() {
        players[winnerIdx].increaseScore();
    }

    function renderWin() {
        renderWinBoard(winType);
        renderScore();
    }

    function renderGameBoard() {
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

    function renderScore() {
        const player1 = document.getElementById("player1");
        const player2 = document.getElementById("player2");

        player1.querySelector(".player-win-content").textContent = players[0].getScore();
        player2.querySelector(".player-win-content").textContent = players[1].getScore();
    }

    function renderWinBoard(winType) {
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

    function cleanCells() {
        for(let i = 0; i<9; i++) {
            const cell = document.getElementById(`${i}`)
            cell.removeEventListener("click", triggerCell);
            cell.classList.remove("empty");
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
        renderPlayerIndicator();
        renderGameStatus();
    }

    function resetGame() {
        resetScores();
        newGame();
    }

    function setButtons() {
        const btnNewGame = document.querySelector(".new-game");
        const btnResetGame = document.querySelector(".reset")

        btnNewGame.addEventListener("click", newGame);
        btnResetGame.addEventListener("click", resetGame);
    }

    function init() {
        newGame();
        setButtons();
    }

    init();

    //don't need to expose any external methods currently
    // return {
    //     newGame,
    //     renderGameConsole,
    //     submitMove,
    //     getCurrentPlayer,
    //     getGameResult,
    //     checkWinner,
    // };

})();