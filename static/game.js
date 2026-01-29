class Minesweeper {
    constructor() {
        this.rows = 16;
        this.cols = 10;
        this.mines = 24;
        this.board = [];
        this.revealed = [];
        this.flagged = [];
        this.gameOver = false;
        this.gameWon = false;
        this.timer = 0;
        this.timerInterval = null;
        this.mode = 'dig';
        this.firstClick = true;
        this.zoomLevel = 1;
        this.minZoom = 0.5;
        this.maxZoom = 2;
        
        this.loadSettings();
        this.bindMenuEvents();
        this.updateMinesCount();
    }
    
    loadSettings() {
        const darkMode = localStorage.getItem('darkMode') === 'true';
        if (darkMode) {
            document.body.classList.add('dark-mode');
            document.getElementById('dark-mode-toggle').checked = true;
        }
        
        const savedWidth = localStorage.getItem('gridWidth');
        const savedHeight = localStorage.getItem('gridHeight');
        
        if (savedWidth) {
            document.getElementById('width-slider').value = savedWidth;
            document.getElementById('width-value').textContent = savedWidth;
            this.cols = parseInt(savedWidth);
        }
        
        if (savedHeight) {
            document.getElementById('height-slider').value = savedHeight;
            document.getElementById('height-value').textContent = savedHeight;
            this.rows = parseInt(savedHeight);
        }
    }
    
    saveSettings() {
        localStorage.setItem('gridWidth', this.cols);
        localStorage.setItem('gridHeight', this.rows);
    }
    
    calculateMines() {
        const totalCells = this.rows * this.cols;
        return Math.floor(totalCells * 0.15);
    }
    
    updateMinesCount() {
        this.mines = this.calculateMines();
        document.getElementById('mines-value').textContent = this.mines;
    }
    
    bindMenuEvents() {
        const widthSlider = document.getElementById('width-slider');
        const heightSlider = document.getElementById('height-slider');
        const playBtn = document.getElementById('play-btn');
        const backBtn = document.getElementById('back-btn');
        const menuBtn = document.getElementById('menu-btn');
        const darkModeToggle = document.getElementById('dark-mode-toggle');
        const zoomIn = document.getElementById('zoom-in');
        const zoomOut = document.getElementById('zoom-out');
        
        widthSlider.addEventListener('input', (e) => {
            this.cols = parseInt(e.target.value);
            document.getElementById('width-value').textContent = this.cols;
            this.updateMinesCount();
        });
        
        heightSlider.addEventListener('input', (e) => {
            this.rows = parseInt(e.target.value);
            document.getElementById('height-value').textContent = this.rows;
            this.updateMinesCount();
        });
        
        playBtn.addEventListener('click', () => {
            this.saveSettings();
            this.startGame();
        });
        
        backBtn.addEventListener('click', () => {
            this.showMenu();
        });
        
        menuBtn.addEventListener('click', () => {
            document.getElementById('game-over-modal').classList.remove('show');
            this.showMenu();
        });
        
        darkModeToggle.addEventListener('change', (e) => {
            if (e.target.checked) {
                document.body.classList.add('dark-mode');
                localStorage.setItem('darkMode', 'true');
            } else {
                document.body.classList.remove('dark-mode');
                localStorage.setItem('darkMode', 'false');
            }
        });
        
        zoomIn.addEventListener('click', () => this.zoom(0.25));
        zoomOut.addEventListener('click', () => this.zoom(-0.25));
        
        this.setupPinchZoom();
    }
    
    setupPinchZoom() {
        const container = document.getElementById('zoom-container');
        let initialDistance = 0;
        let initialZoom = 1;
        
        container.addEventListener('touchstart', (e) => {
            if (e.touches.length === 2) {
                initialDistance = this.getDistance(e.touches[0], e.touches[1]);
                initialZoom = this.zoomLevel;
            }
        }, { passive: true });
        
        container.addEventListener('touchmove', (e) => {
            if (e.touches.length === 2) {
                const currentDistance = this.getDistance(e.touches[0], e.touches[1]);
                const scale = currentDistance / initialDistance;
                const newZoom = Math.min(this.maxZoom, Math.max(this.minZoom, initialZoom * scale));
                this.setZoom(newZoom);
            }
        }, { passive: true });
    }
    
    getDistance(touch1, touch2) {
        const dx = touch1.clientX - touch2.clientX;
        const dy = touch1.clientY - touch2.clientY;
        return Math.sqrt(dx * dx + dy * dy);
    }
    
    zoom(delta) {
        const newZoom = Math.min(this.maxZoom, Math.max(this.minZoom, this.zoomLevel + delta));
        this.setZoom(newZoom);
    }
    
    setZoom(level) {
        this.zoomLevel = level;
        const gameBoard = document.getElementById('game-board');
        gameBoard.style.transform = `scale(${this.zoomLevel})`;
        document.getElementById('zoom-level').textContent = Math.round(this.zoomLevel * 100) + '%';
    }
    
    startGame() {
        this.updateMinesCount();
        
        document.getElementById('menu-screen').classList.add('hidden');
        document.getElementById('game-screen').classList.remove('hidden');
        
        const gameBoard = document.getElementById('game-board');
        gameBoard.style.gridTemplateColumns = `repeat(${this.cols}, 1fr)`;
        
        this.zoomLevel = 1;
        this.setZoom(1);
        
        this.createBoard();
        this.bindEvents();
    }
    
    showMenu() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
        
        document.getElementById('game-screen').classList.add('hidden');
        document.getElementById('menu-screen').classList.remove('hidden');
    }
    
    createBoard() {
        this.board = [];
        this.revealed = [];
        this.flagged = [];
        this.gameOver = false;
        this.gameWon = false;
        this.firstClick = true;
        this.timer = 0;
        this.mode = 'dig';
        
        const digBtn = document.getElementById('dig-btn');
        const flagBtn = document.getElementById('flag-btn');
        digBtn.classList.add('active');
        flagBtn.classList.remove('active');
        
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
        
        for (let i = 0; i < this.rows; i++) {
            this.board[i] = [];
            this.revealed[i] = [];
            this.flagged[i] = [];
            for (let j = 0; j < this.cols; j++) {
                this.board[i][j] = 0;
                this.revealed[i][j] = false;
                this.flagged[i][j] = false;
            }
        }
        
        this.renderBoard();
        this.updateDisplay();
    }
    
    placeMines(excludeRow, excludeCol) {
        let minesPlaced = 0;
        while (minesPlaced < this.mines) {
            const row = Math.floor(Math.random() * this.rows);
            const col = Math.floor(Math.random() * this.cols);
            
            const isExcluded = Math.abs(row - excludeRow) <= 1 && Math.abs(col - excludeCol) <= 1;
            
            if (this.board[row][col] !== -1 && !isExcluded) {
                this.board[row][col] = -1;
                minesPlaced++;
            }
        }
        
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                if (this.board[i][j] !== -1) {
                    this.board[i][j] = this.countAdjacentMines(i, j);
                }
            }
        }
    }
    
    countAdjacentMines(row, col) {
        let count = 0;
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                const newRow = row + i;
                const newCol = col + j;
                if (newRow >= 0 && newRow < this.rows && newCol >= 0 && newCol < this.cols) {
                    if (this.board[newRow][newCol] === -1) {
                        count++;
                    }
                }
            }
        }
        return count;
    }
    
    renderBoard() {
        const gameBoard = document.getElementById('game-board');
        gameBoard.innerHTML = '';
        
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                const cell = document.createElement('button');
                cell.className = 'cell';
                cell.dataset.row = i;
                cell.dataset.col = j;
                gameBoard.appendChild(cell);
            }
        }
    }
    
    bindEvents() {
        const gameBoard = document.getElementById('game-board');
        const digBtn = document.getElementById('dig-btn');
        const flagBtn = document.getElementById('flag-btn');
        const restartBtn = document.getElementById('restart-btn');
        
        const newGameBoard = gameBoard.cloneNode(true);
        gameBoard.parentNode.replaceChild(newGameBoard, gameBoard);
        
        let longPressTimer = null;
        let isLongPress = false;
        const LONG_PRESS_DURATION = 400;
        
        const handlePressStart = (e) => {
            const cell = e.target.closest('.cell');
            if (!cell) return;
            
            isLongPress = false;
            const row = parseInt(cell.dataset.row);
            const col = parseInt(cell.dataset.col);
            
            longPressTimer = setTimeout(() => {
                isLongPress = true;
                this.handleLongPress(row, col);
            }, LONG_PRESS_DURATION);
        };
        
        const handlePressEnd = (e) => {
            if (longPressTimer) {
                clearTimeout(longPressTimer);
                longPressTimer = null;
            }
            
            if (!isLongPress) {
                const cell = e.target.closest('.cell');
                if (cell) {
                    const row = parseInt(cell.dataset.row);
                    const col = parseInt(cell.dataset.col);
                    this.handleClick(row, col);
                }
            }
            isLongPress = false;
        };
        
        const handlePressCancel = () => {
            if (longPressTimer) {
                clearTimeout(longPressTimer);
                longPressTimer = null;
            }
            isLongPress = false;
        };
        
        newGameBoard.addEventListener('mousedown', handlePressStart);
        newGameBoard.addEventListener('mouseup', handlePressEnd);
        newGameBoard.addEventListener('mouseleave', handlePressCancel);
        
        newGameBoard.addEventListener('touchstart', (e) => {
            if (e.touches.length === 1) {
                handlePressStart(e);
            }
        }, { passive: true });
        
        newGameBoard.addEventListener('touchend', (e) => {
            if (e.changedTouches.length === 1) {
                e.preventDefault();
                handlePressEnd(e.changedTouches[0]);
            }
        });
        
        newGameBoard.addEventListener('touchcancel', handlePressCancel);
        newGameBoard.addEventListener('touchmove', (e) => {
            if (e.touches.length === 1) {
                handlePressCancel();
            }
        });
        
        newGameBoard.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });
        
        digBtn.onclick = () => {
            this.mode = 'dig';
            digBtn.classList.add('active');
            flagBtn.classList.remove('active');
        };
        
        flagBtn.onclick = () => {
            this.mode = 'flag';
            flagBtn.classList.add('active');
            digBtn.classList.remove('active');
        };
        
        restartBtn.onclick = () => {
            document.getElementById('game-over-modal').classList.remove('show');
            this.createBoard();
            this.bindEvents();
        };
    }
    
    handleLongPress(row, col) {
        if (this.gameOver || this.gameWon) return;
        if (this.revealed[row][col]) return;
        
        if (this.mode === 'dig') {
            this.toggleFlag(row, col);
        } else {
            if (this.flagged[row][col]) return;
            
            if (this.firstClick) {
                this.firstClick = false;
                this.placeMines(row, col);
                this.startTimer();
            }
            
            this.reveal(row, col);
        }
        
        this.updateDisplay();
        this.checkWin();
    }
    
    handleClick(row, col) {
        if (this.gameOver || this.gameWon) return;
        if (this.revealed[row][col]) return;
        
        if (this.mode === 'flag') {
            this.toggleFlag(row, col);
        } else {
            if (this.flagged[row][col]) return;
            
            if (this.firstClick) {
                this.firstClick = false;
                this.placeMines(row, col);
                this.startTimer();
            }
            
            this.reveal(row, col);
        }
        
        this.updateDisplay();
        this.checkWin();
    }
    
    toggleFlag(row, col) {
        if (this.revealed[row][col]) return;
        
        this.flagged[row][col] = !this.flagged[row][col];
        const cell = this.getCell(row, col);
        
        if (this.flagged[row][col]) {
            cell.classList.add('flagged');
        } else {
            cell.classList.remove('flagged');
        }
    }
    
    reveal(row, col) {
        if (row < 0 || row >= this.rows || col < 0 || col >= this.cols) return;
        if (this.revealed[row][col] || this.flagged[row][col]) return;
        
        this.revealed[row][col] = true;
        const cell = this.getCell(row, col);
        cell.classList.add('revealed');
        
        if (this.board[row][col] === -1) {
            this.gameOver = true;
            this.endGame(false);
            return;
        }
        
        if (this.board[row][col] > 0) {
            cell.textContent = this.board[row][col];
            cell.classList.add('n' + this.board[row][col]);
        } else {
            for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    if (i !== 0 || j !== 0) {
                        this.reveal(row + i, col + j);
                    }
                }
            }
        }
    }
    
    getCell(row, col) {
        return document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
    }
    
    startTimer() {
        this.timerInterval = setInterval(() => {
            this.timer++;
            document.getElementById('time').textContent = this.timer.toString().padStart(3, '0');
        }, 1000);
    }
    
    updateDisplay() {
        const flagCount = this.flagged.flat().filter(f => f).length;
        const remaining = this.mines - flagCount;
        document.getElementById('remaining').textContent = remaining;
        document.getElementById('time').textContent = this.timer.toString().padStart(3, '0');
    }
    
    checkWin() {
        if (this.gameOver) return;
        
        let revealedCount = 0;
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                if (this.revealed[i][j]) revealedCount++;
            }
        }
        
        if (revealedCount === this.rows * this.cols - this.mines) {
            this.gameWon = true;
            this.endGame(true);
        }
    }
    
    endGame(won) {
        clearInterval(this.timerInterval);
        
        if (!won) {
            for (let i = 0; i < this.rows; i++) {
                for (let j = 0; j < this.cols; j++) {
                    if (this.board[i][j] === -1) {
                        const cell = this.getCell(i, j);
                        cell.classList.add('mine');
                        cell.classList.remove('flagged');
                    }
                }
            }
        }
        
        setTimeout(() => {
            const modal = document.getElementById('game-over-modal');
            const title = document.getElementById('modal-title');
            const message = document.getElementById('modal-message');
            
            if (won) {
                title.textContent = 'You Won!';
                message.textContent = `Completed in ${this.timer} seconds!`;
            } else {
                title.textContent = 'Game Over';
                message.textContent = 'You hit a mine!';
            }
            
            modal.classList.add('show');
        }, 500);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new Minesweeper();
});
