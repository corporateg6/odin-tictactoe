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
        //TODO
        function initialUI() {

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