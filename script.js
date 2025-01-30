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
