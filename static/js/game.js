document.addEventListener('DOMContentLoaded', () => {
    let gameBoard = Array(6).fill().map(() => Array(7).fill(0));
    let isGameOver = false;
    let isPlayerTurn = true;

    const gameBoardEl = document.getElementById('game-board');
    const statusMessage = document.getElementById('status-message');
    const difficultySelect = document.getElementById('difficulty');
    const resetButton = document.getElementById('reset-game');
    const columnButtons = document.querySelectorAll('.column-btn');

    initializeBoard();
    setupEventListeners();

    function initializeBoard() {
        gameBoardEl.innerHTML = '';
        for (let row = 0; row < 6; row++) {
            for (let col = 0; col < 7; col++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.dataset.row = row;
                cell.dataset.col = col;
                gameBoardEl.appendChild(cell);
            }
        }

        document.querySelectorAll('.cell').forEach(cell => {
            cell.classList.remove('player-1', 'player-2', 'falling');
        });

        gameBoard = Array(6).fill().map(() => Array(7).fill(0));
        isGameOver = false;
        isPlayerTurn = true;
        statusMessage.textContent = 'Your turn! Click on a column to drop a disc.';
        columnButtons.forEach(btn => btn.classList.remove('disabled'));
    }

    function setupEventListeners() {
        columnButtons.forEach(btn => {
            btn.removeEventListener('click', columnClickHandler);
            btn.addEventListener('click', columnClickHandler);
        });
        resetButton.addEventListener('click', initializeBoard);
    }

    function columnClickHandler(event) {
        if (isGameOver || !isPlayerTurn) return;
        const column = parseInt(event.target.dataset.column);
        makePlayerMove(column);
    }

    function makePlayerMove(column) {
        if (!isValidMove(column)) return;
        const row = findAvailableRow(column);
        if (row === -1) return;
        gameBoard[row][column] = 1;
        updateCell(row, column, 1, true);
        if (checkForWin(row, column, 1)) return handleGameEnd('win');
        if (isBoardFull()) return handleGameEnd('draw');
        isPlayerTurn = false;
        statusMessage.textContent = 'AI is thinking...';
        setTimeout(makeAIMove, 500);
    }

    async function makeAIMove() {
        const difficulty = difficultySelect.value;
        try {
            const response = await fetch('/api/move', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ board: gameBoard.map(row => [...row]), difficulty })
            });
            const data = await response.json();
            if (data.error) return resetGameState();
            if (data.move === -1) return handleGameEnd(data.win ? 'lose' : 'draw');

            const column = data.move;
            const row = findAvailableRow(column);
            gameBoard = [];
            for (let i = 0; i < 6; i++) {
                gameBoard.push(data.board.slice(i * 7, (i + 1) * 7));
            }
            updateCell(row, column, 2, true);
            if (data.win) return handleGameEnd('lose');
            if (data.draw) return handleGameEnd('draw');
            isPlayerTurn = true;
            statusMessage.textContent = 'Your turn! Click on a column to drop a disc.';
        } catch (error) {
            console.error(error);
            resetGameState();
        }
    }

    function resetGameState() {
        statusMessage.textContent = 'An error occurred. Starting a new game.';
        initializeBoard();
    }

    function isValidMove(column) {
        return gameBoard[0][column] === 0;
    }

    function findAvailableRow(column) {
        for (let row = 5; row >= 0; row--) {
            if (gameBoard[row][column] === 0) return row;
        }
        return -1;
    }

    function updateCell(row, column, player, animate = false) {
        const cell = gameBoardEl.querySelector(`[data-row="${row}"][data-col="${column}"]`);
        cell.classList.remove('player-1', 'player-2', 'falling');
        if (animate) {
            cell.classList.add('falling');
            setTimeout(() => cell.classList.add(`player-${player}`), 50);
            setTimeout(() => cell.classList.remove('falling'), 500);
        } else {
            cell.classList.add(`player-${player}`);
        }
    }

    function checkForWin(row, col, player) {
        let count = 0;
        for (let c = 0; c < 7; c++) {
            count = (gameBoard[row][c] === player) ? count + 1 : 0;
            if (count >= 4) return true;
        }
        count = 0;
        for (let r = 0; r < 6; r++) {
            count = (gameBoard[r][col] === player) ? count + 1 : 0;
            if (count >= 4) return true;
        }
        for (let r = 3; r < 6; r++) {
            for (let c = 0; c < 4; c++) {
                if (gameBoard[r][c] === player &&
                    gameBoard[r-1][c+1] === player &&
                    gameBoard[r-2][c+2] === player &&
                    gameBoard[r-3][c+3] === player) return true;
            }
        }
        for (let r = 0; r < 3; r++) {
            for (let c = 0; c < 4; c++) {
                if (gameBoard[r][c] === player &&
                    gameBoard[r+1][c+1] === player &&
                    gameBoard[r+2][c+2] === player &&
                    gameBoard[r+3][c+3] === player) return true;
            }
        }
        return false;
    }

    function isBoardFull() {
        return !gameBoard[0].includes(0);
    }

    function handleGameEnd(result) {
        isGameOver = true;
        let message = '';
        switch(result) {
            case 'win': message = 'You win! 🎉'; break;
            case 'lose': message = 'AI wins! Better luck next time.'; break;
            case 'draw': message = "It's a draw!"; break;
        }
        statusMessage.textContent = message;
        columnButtons.forEach(btn => btn.classList.add('disabled'));
        showGameOverDialog(message);
    }

    function showGameOverDialog(resultText) {
        const dialog = document.getElementById('game-over-dialog');
        const message = document.getElementById('game-over-message');
        if (dialog && message) {
            message.textContent = resultText;
            dialog.style.display = 'block';
        }
    }
    const okBtn = document.getElementById('dialog-ok');
    if (okBtn) {
        okBtn.addEventListener('click', () => {
            const dialog = document.getElementById('game-over-dialog');
            if (dialog) {
                dialog.style.display = 'none';
            }
        });
    }
    
});
