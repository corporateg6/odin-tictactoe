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

    //TODO
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
                updateGameState(); //TODO
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
                    for(let i=0; i<board.length(); i++) {
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

        //TODO
        function getPlayerIndexWithPiece(piece) {

        }

        function randomizeStartingPlayer() {
            currentPlayerTracker = Math.round(Math.random);
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
    // getCurrentPlayer() => Player{name, piece, score}
    // getPlayerAt(index) => Player{name, piece, score}
    // newGame()
    // resetScore()

    const render = (function () {
        
        function initialUI() {
            playerIndicator();
            gameStatus();
            playerInfo();
        }

        //TODO
        function playerIndicator() {

        }

        //TODO
        function gameStatus() {

        }

        //TODO
        function playerInfo() {

        }

        //TODO
        function gameBoard() {

        }

        //TODO
        function win() {

        }

        return {
            initialUI,
            playerIndicator,
            gameStatus,
            playerInfo,
            gameBoard,
            win,
        };
        
    })();
    // initialUI()
    // playerIndicator()
    // gameStatus()
    // playerInfo()
    // gameBoard()
    // win()

    //TODO
    function setInitialState() {
    }

    //TODO
    function addInitialListeners() {
        
        //TODO
        function cellListener() {

        }

        //TODO
        function newGameListener() {

        }

        //TODO
        function resetScoreListener() {
            
        }

    }

    function initialize() {
        setInitialState();
        addInitialListeners();
    }

    initialize();

})();