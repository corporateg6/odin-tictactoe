const ttt = (function() {

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
    // getBoard() => []
    // getBoardAt(index) => String
    // updateBoard(index, String) => Boolean
    // resetBoard()

    const game = (function() {

        let players;
        let moveCount;
        let gameOver;
        let currentPlayerTracker;
        let winnerIndex;
        let winType;
        let gameStatusMessage;

        function generatePlayers() {

            function createPlayer (name, piece) {
                let score = 0;
                const getName = () => name;
                const getPiece = () => piece;
                const getScore = () => score;
                const increaseScore = () => score++;
                const resetScore = () => score = 0;
                return { getName, getPiece, getScore, increaseScore, resetScore };
            }

            const player1 = createPlayer("Player 1", "X");
            const player2 = createPlayer("Player 2", "O");

            players = [player1, player2];
        }

        function getGameStatusMessage() {
            return gameStatusMessage;
        }

        function generateStatusMessage() {
            if (gameOver) {
                if (winnerIndex) {
                    gameStatusMessage = `${getPlayerAt(winnerIndex).getName()} wins!`;
                } else {
                    gameStatusMessage = `Game ends in a Tie!`;
                }
            } else {
                gameStatusMessage = `${getCurrentPlayer().getName()} to move.`;
            }
        }

        function submitMove(index) {
            if(gameOver) {
                return;
            }

            if(!gameBoard.updateBoard(index, getCurrentPlayer().getPiece())) {
                gameStatusMessage = "ERROR - failed to update board";
            } else {
                moveCount++;
                currentPlayerTracker++;
                updateGameState();
                generateStatusMessage();
            }
        }

        function getWinTypeArray(winType) {
            let winTypes = [];

            function generateWinTypes() {
                const h1 = [0,1,2];
                const h2 = [3,4,5];
                const h3 = [6,7,8];
                const v1 = [0,3,6];
                const v2 = [1,4,7];
                const v3 = [2,5,9];
                const d1 = [0,4,8];
                const d2 = [2,4,6];
                winTypes = [h1,h2,h3,v1,v2,v3,d1,d2];
            }

            return winTypes[winType];
        }

        function updateGameState() {

            let boards = [];

            function generateBoards() {
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
                boards = [h1Board, h2Board, h3Board, v1Board, v2Board, v3Board, d1Board, d2Board];
            }

            function checkForWinner() {

                function getWinnerPiece(board) {
                    let potentialWinner = null;
                    for(let i=0; i<board.length; i++) {
                        if(board[i] === null) return null;
                        if(board[i] !== potentialWinner && potentialWinner) {
                            return null;
                        } else {
                            potentialWinner = board[i];
                        }
                    }
                    return potentialWinner;
                }

                //check all the possible boards for wins
                for(let i=0; i<boards.length; i++) {
                    if(!gameOver) {
                        const result = getWinnerPiece(boards[i]);
                        if(result) {
                            gameOver = true;
                            winnerIndex = getPlayerIndexWithPiece(result);
                            winType = i;
                        }
                    }
                }
            }

            function checkForDraw() {
                //after checking for a win, check for a draw if 9 moves have been made
                if(!gameOver && moveCount >= 9) {
                    gameOver = true;
                }
            }

            generateBoards();
            checkForWinner();
            checkForDraw();
  
        }

        function isGameOver() {
            return gameOver;
        }

        function getWinner() {
            if(winnerIndex) {
                return getPlayerAt(winnerIndex);
            } else {
                return null;
            }
        }

        function getWinType() {
            return winType;
        }

        function getCurrentPlayer() {
            return players[getCurrentPlayerIndex()];
        }

        function getPlayerAt(index) {
            return players[index];
        }

        function getPlayerIndexWithPiece(piece) {
            for(let i=0; i<players.length; i++) {
                if (players[i].getPiece() === piece) return i;
            }
        }

        function randomizeStartingPlayer() {
            currentPlayerTracker = Math.round(Math.random());
        }

        function getCurrentPlayerIndex() {
            return currentPlayerTracker % 2;
        }

        function newGame() {
            moveCount = 0;
            gameOver = false;
            currentPlayerTracker = 0;
            randomizeStartingPlayer();
            winnerIndex = null;
            winType = null;
            gameStatusMessage = "";
            gameBoard.resetBoard();
        }

        function resetScores() {
            players.forEach(player => {
                player.resetScore();
            });
        }

        function initialize() {
            generatePlayers();
            newGame();
        }

        initialize();

        return {
            submitMove,
            isGameOver,
            getWinner,
            getWinType,
            getWinTypeArray,
            getCurrentPlayer,
            getCurrentPlayerIndex,
            getPlayerAt,
            getGameStatusMessage,
            newGame,
            resetScores,
        };

    })();
    // submitMove(index) => Boolean
    // isGameOver() => Boolean
    // getWinner() => Player{name, piece, score} || null
    // getWinType() => Integer || null
    // getWinTypeArray(winType) => Array
    // getCurrentPlayer() => Player{name, piece, score}
    // getCurrentPlayerIndex() => Integer
    // getPlayerAt(index) => Player{name, piece, score}
    // getGameStatusMessage() => String
    // newGame()
    // resetScore()

    const render = (function() {
        
        function initialUI() {
            playerIndicator();
            gameStatus();
            playerInfo();
        }

        function playerIndicator() {
            const p1Indicator = document.getElementById("player1-indicator");
            const p2Indicator = document.getElementById("player2-indicator");
            p1Svg = p1Indicator.querySelector("svg");
            p2Svg = p2Indicator.querySelector("svg");
            if(isGameOver()) {
                p1Svg.style.display = "none";
                p2Svg.style.display = "none";
                return;
            }
            switch(getCurrentPlayerIndex()) {
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

        function gameStatus() {
            const gameStatus = document.querySelector(".game-status-message");
            gameStatus.textContent = game.getGameStatusMessage();
        }

        function playerInfo() {
            const p1Info = game.getPlayerAt(0);
            const p2Info = game.getPlayerAt(1);
            const p1 = document.getElementById("player1");
            const p2 = document.getElementById("player2");

            p1name = p1.querySelector(".player-name");
            p2name = p2.querySelector(".player-name");
            p1piece = p1.querySelector(".player-piece");
            p2piece = p2.querySelector(".player-piece");
    
            p1name.textContent = p1Info.getName();
            p2name.textContent = p2Info.getName();
            p1piece.textContent = p1Info.getPiece();
            p2piece.textContent = p2Info.getPiece();
        }

        function playerScore() {
            const p1Info = game.getPlayerAt(0);
            const p2Info = game.getPlayerAt(1);
            const p1 = document.getElementById("player1");
            const p2 = document.getElementById("player2");
            const p1Score = p1.querySelector(".player-win-content");
            const p2Score = p2.querySelector(".player-win-content");

            p1Score.textContent = p1Info.getScore();
            p2Score.textContent = p2Info.getSCore();
        }

        function gameBoard() {
            const emptyCells = document.querySelectorAll(".cell.empty");
            cells.forEach((emptyCell) => {
                const cellId = emptyCell.id;
                const cellContent = cell.querySelector(".cell-content");
                const boardData = gameBoard.getBoardAt(cellId);
                if(boardData) {
                    cellContent.textContent = boardData;
                    cellContent.classList.add(`${boardData}`);
                    emptyCell.classList.remove("empty");
                }
            });
        }

        function newGameBoard() {
            const gameBoardDOM = document.querySelector(".game-board");
            gameBoardDOM.innerHTML = "";
            for (let i=0; i<9; i++) {
                const cell = document.createElement("div");
                cell.classList.add("cell", "empty");
                cell.id = `${i}`;
                const cellContent = document.createElement("div");
                cellContent.classList.add("cell-content");
                cell.appendChild(cellContent);
                gameBoardDOM.appendChild(cell);
            }
        }

        function win() {

            const winType = game.getWinType();
            const gameOver = game.isGameOver();

            if(!gameOver || !winType) {
                return;
            }

            const winTypeArray = game.getWinTypeArray(winType);

            winTypeArray.forEach((index) => {
                const cell = document.getElementById(`${index}`);
                cell.classList.add("win");
            });

        }

        return {
            initialUI,
            playerIndicator,
            gameStatus,
            playerInfo,
            playerScore,
            gameBoard,
            newGameBoard,
            win,
        };
        
    })();
    // initialUI()
    // playerIndicator()
    // gameStatus()
    // playerInfo()
    // playerScore()
    // gameBoard()
    // newGameBoard();
    // win()

    function addInitialListeners() {
        
        function addCellListeners() {
            const cells = document.querySelectorAll(".cell");
            cells.forEach((cell) => {
                cell.addEventListener("click", cellListener);
            });
        }

        function cellListener(event) {
            const cell = event.target;
            if(game.submitMove(cell.id)) {
                cell.removeEventListener("click", cellListener);
                render.gameBoard();
                render.playerIndicator();
                render.playerScore();
            }
            render.gameStatus();
        }

        function newGameListener() {
            game.newGame();
            render.newGameBoard();
            addCellListeners();
            render.gameStatus();
            render.playerIndicator();
        }

        function resetScoreListener() {
            game.resetScores();
            render.score();
            newGameListener();
        }

        addCellListeners();

        const btnNewGame = document.querySelector(".new-game");
        const btnResetGame = document.querySelector(".reset")

        btnNewGame.addEventListener("click", newGameListener);
        btnResetGame.addEventListener("click", resetScoreListener);

    }

    function initialize() {
        addInitialListeners();
        render.initialUI();
    }

    initialize();

})();