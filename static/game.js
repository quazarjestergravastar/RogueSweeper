class FloatingBackground {
    constructor() {
        this.container = document.getElementById('floating-bg');
        this.shapes = [];
        this.maxShapes = 12;
        this.init();
    }
    
    init() {
        for (let i = 0; i < 5; i++) {
            setTimeout(() => this.spawnShape(), i * 400);
        }
        setInterval(() => this.spawnShape(), 2500);
    }
    
    spawnShape() {
        if (this.shapes.length >= this.maxShapes) {
            const oldShape = this.shapes.shift();
            if (oldShape && oldShape.parentNode) {
                oldShape.parentNode.removeChild(oldShape);
            }
        }
        
        const shape = document.createElement('div');
        const types = ['', 'blob', 'shard'];
        const type = types[Math.floor(Math.random() * types.length)];
        
        shape.className = `floating-shape ${type}`;
        
        const size = 30 + Math.random() * 60;
        shape.style.width = `${size}px`;
        shape.style.height = `${size}px`;
        shape.style.left = `${Math.random() * 100}%`;
        shape.style.animationDuration = `${18 + Math.random() * 15}s`;
        
        this.container.appendChild(shape);
        this.shapes.push(shape);
        
        setTimeout(() => {
            const index = this.shapes.indexOf(shape);
            if (index > -1) this.shapes.splice(index, 1);
            if (shape.parentNode) shape.parentNode.removeChild(shape);
        }, 35000);
    }
}

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
        
        this.scrollX = 0;
        this.scrollY = 0;
        this.velocityX = 0;
        this.velocityY = 0;
        this.isDragging = false;
        this.dragStartX = 0;
        this.dragStartY = 0;
        this.lastX = 0;
        this.lastY = 0;
        this.dragThreshold = 8;
        this.hasDragged = false;
        this.animationId = null;
        
        this.loadSettings();
        this.bindMenuEvents();
        this.updateMinesCount();
        
        new FloatingBackground();
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
        const minesEl = document.getElementById('mines-value');
        minesEl.textContent = this.mines;
        minesEl.classList.add('pop');
        setTimeout(() => minesEl.classList.remove('pop'), 250);
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
            const valueEl = document.getElementById('width-value');
            valueEl.textContent = this.cols;
            valueEl.classList.add('pop');
            setTimeout(() => valueEl.classList.remove('pop'), 150);
            this.updateMinesCount();
        });
        
        heightSlider.addEventListener('input', (e) => {
            this.rows = parseInt(e.target.value);
            const valueEl = document.getElementById('height-value');
            valueEl.textContent = this.rows;
            valueEl.classList.add('pop');
            setTimeout(() => valueEl.classList.remove('pop'), 150);
            this.updateMinesCount();
        });
        
        playBtn.addEventListener('click', () => {
            this.saveSettings();
            this.startGame();
        });
        
        backBtn.addEventListener('click', () => this.showMenu());
        
        menuBtn.addEventListener('click', () => {
            document.getElementById('game-over-modal').classList.remove('show');
            this.showMenu();
        });
        
        darkModeToggle.addEventListener('change', (e) => {
            document.body.classList.toggle('dark-mode', e.target.checked);
            localStorage.setItem('darkMode', e.target.checked);
        });
        
        zoomIn.addEventListener('click', () => this.zoom(0.25));
        zoomOut.addEventListener('click', () => this.zoom(-0.25));
    }
    
    zoom(delta) {
        const newZoom = Math.min(this.maxZoom, Math.max(this.minZoom, this.zoomLevel + delta));
        if (newZoom !== this.zoomLevel) {
            this.zoomLevel = newZoom;
            this.applyZoom();
            const levelEl = document.getElementById('zoom-level');
            levelEl.textContent = Math.round(this.zoomLevel * 100) + '%';
            levelEl.classList.add('pop');
            setTimeout(() => levelEl.classList.remove('pop'), 150);
        }
    }
    
    applyZoom() {
        const board = document.getElementById('game-board');
        board.style.transform = `scale(${this.zoomLevel})`;
        this.clampScroll();
        this.updateBoardPosition();
    }
    
    startGame() {
        this.updateMinesCount();
        
        document.getElementById('menu-screen').classList.add('hidden');
        document.getElementById('game-screen').classList.remove('hidden');
        
        const gameBoard = document.getElementById('game-board');
        gameBoard.style.gridTemplateColumns = `repeat(${this.cols}, 1fr)`;
        
        this.zoomLevel = 1;
        this.scrollX = 0;
        this.scrollY = 0;
        this.velocityX = 0;
        this.velocityY = 0;
        
        document.getElementById('zoom-level').textContent = '100%';
        this.applyZoom();
        
        this.createBoard();
        this.bindEvents();
        this.setupScrolling();
    }
    
    showMenu() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
        
        document.getElementById('game-screen').classList.add('hidden');
        document.getElementById('menu-screen').classList.remove('hidden');
    }
    
    setupScrolling() {
        const container = document.getElementById('zoom-container');
        
        const handleStart = (x, y) => {
            if (this.animationId) {
                cancelAnimationFrame(this.animationId);
                this.animationId = null;
            }
            this.isDragging = true;
            this.hasDragged = false;
            this.dragStartX = x;
            this.dragStartY = y;
            this.lastX = x;
            this.lastY = y;
            this.velocityX = 0;
            this.velocityY = 0;
        };
        
        const handleMove = (x, y) => {
            if (!this.isDragging) return;
            
            const deltaX = x - this.lastX;
            const deltaY = y - this.lastY;
            
            const totalDeltaX = Math.abs(x - this.dragStartX);
            const totalDeltaY = Math.abs(y - this.dragStartY);
            
            if (totalDeltaX > this.dragThreshold || totalDeltaY > this.dragThreshold) {
                this.hasDragged = true;
            }
            
            if (this.hasDragged) {
                this.scrollX += deltaX;
                this.scrollY += deltaY;
                this.clampScroll();
                this.updateBoardPosition();
                
                this.velocityX = deltaX * 0.8;
                this.velocityY = deltaY * 0.8;
            }
            
            this.lastX = x;
            this.lastY = y;
        };
        
        const handleEnd = () => {
            if (this.isDragging && this.hasDragged && (Math.abs(this.velocityX) > 1 || Math.abs(this.velocityY) > 1)) {
                this.applyInertia();
            }
            this.isDragging = false;
        };
        
        container.addEventListener('touchstart', (e) => {
            if (e.touches.length === 1) {
                handleStart(e.touches[0].clientX, e.touches[0].clientY);
            }
        }, { passive: true });
        
        container.addEventListener('touchmove', (e) => {
            if (e.touches.length === 1) {
                handleMove(e.touches[0].clientX, e.touches[0].clientY);
            }
        }, { passive: true });
        
        container.addEventListener('touchend', handleEnd, { passive: true });
        container.addEventListener('touchcancel', handleEnd, { passive: true });
        
        container.addEventListener('mousedown', (e) => handleStart(e.clientX, e.clientY));
        container.addEventListener('mousemove', (e) => handleMove(e.clientX, e.clientY));
        container.addEventListener('mouseup', handleEnd);
        container.addEventListener('mouseleave', () => { this.isDragging = false; });
    }
    
    applyInertia() {
        const decay = 0.94;
        const minVelocity = 0.3;
        
        const animate = () => {
            if (Math.abs(this.velocityX) > minVelocity || Math.abs(this.velocityY) > minVelocity) {
                this.scrollX += this.velocityX;
                this.scrollY += this.velocityY;
                this.clampScroll();
                this.updateBoardPosition();
                
                this.velocityX *= decay;
                this.velocityY *= decay;
                
                this.animationId = requestAnimationFrame(animate);
            } else {
                this.animationId = null;
            }
        };
        
        this.animationId = requestAnimationFrame(animate);
    }
    
    clampScroll() {
        const container = document.getElementById('zoom-container');
        const board = document.getElementById('game-board');
        
        const containerRect = container.getBoundingClientRect();
        const boardWidth = board.offsetWidth * this.zoomLevel;
        const boardHeight = board.offsetHeight * this.zoomLevel;
        
        const padding = 30;
        const maxScrollX = Math.max(0, (boardWidth - containerRect.width) / 2 + padding);
        const maxScrollY = Math.max(0, (boardHeight - containerRect.height) / 2 + padding);
        
        this.scrollX = Math.max(-maxScrollX, Math.min(maxScrollX, this.scrollX));
        this.scrollY = Math.max(-maxScrollY, Math.min(maxScrollY, this.scrollY));
    }
    
    updateBoardPosition() {
        const wrapper = document.getElementById('board-wrapper');
        wrapper.style.transform = `translate3d(${this.scrollX}px, ${this.scrollY}px, 0)`;
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
                    if (this.board[newRow][newCol] === -1) count++;
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
        let pressedCell = null;
        let touchStartX = 0;
        let touchStartY = 0;
        const LONG_PRESS_DURATION = 400;
        const MOVE_THRESHOLD = 8;
        
        const handlePressStart = (cell, x, y) => {
            if (!cell) return;
            
            isLongPress = false;
            pressedCell = cell;
            touchStartX = x;
            touchStartY = y;
            
            cell.classList.add('pressed');
            
            const row = parseInt(cell.dataset.row);
            const col = parseInt(cell.dataset.col);
            
            longPressTimer = setTimeout(() => {
                isLongPress = true;
                cell.classList.remove('pressed');
                if (!this.hasDragged) {
                    this.handleLongPress(row, col);
                }
            }, LONG_PRESS_DURATION);
        };
        
        const handlePressEnd = (x, y) => {
            if (longPressTimer) {
                clearTimeout(longPressTimer);
                longPressTimer = null;
            }
            
            if (pressedCell) {
                pressedCell.classList.remove('pressed');
            }
            
            if (!isLongPress && !this.hasDragged && pressedCell) {
                const moveX = Math.abs(x - touchStartX);
                const moveY = Math.abs(y - touchStartY);
                
                if (moveX < MOVE_THRESHOLD && moveY < MOVE_THRESHOLD) {
                    const row = parseInt(pressedCell.dataset.row);
                    const col = parseInt(pressedCell.dataset.col);
                    this.handleClick(row, col);
                }
            }
            
            isLongPress = false;
            pressedCell = null;
        };
        
        const handlePressCancel = () => {
            if (longPressTimer) {
                clearTimeout(longPressTimer);
                longPressTimer = null;
            }
            if (pressedCell) {
                pressedCell.classList.remove('pressed');
            }
            isLongPress = false;
            pressedCell = null;
        };
        
        newGameBoard.addEventListener('mousedown', (e) => {
            const cell = e.target.closest('.cell');
            handlePressStart(cell, e.clientX, e.clientY);
        });
        
        newGameBoard.addEventListener('mouseup', (e) => {
            handlePressEnd(e.clientX, e.clientY);
        });
        
        newGameBoard.addEventListener('mouseleave', handlePressCancel);
        
        newGameBoard.addEventListener('touchstart', (e) => {
            if (e.touches.length === 1) {
                const cell = e.target.closest('.cell');
                handlePressStart(cell, e.touches[0].clientX, e.touches[0].clientY);
            }
        }, { passive: true });
        
        newGameBoard.addEventListener('touchend', (e) => {
            if (e.changedTouches.length === 1) {
                e.preventDefault();
                handlePressEnd(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
            }
        });
        
        newGameBoard.addEventListener('touchcancel', handlePressCancel);
        
        newGameBoard.addEventListener('contextmenu', (e) => e.preventDefault());
        
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
        
        cell.classList.toggle('flagged', this.flagged[row][col]);
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
                        setTimeout(() => this.reveal(row + i, col + j), 20);
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
            const timeEl = document.getElementById('time');
            timeEl.textContent = this.timer.toString().padStart(3, '0');
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
            let delay = 0;
            for (let i = 0; i < this.rows; i++) {
                for (let j = 0; j < this.cols; j++) {
                    if (this.board[i][j] === -1) {
                        setTimeout(() => {
                            const cell = this.getCell(i, j);
                            if (cell) {
                                cell.classList.add('mine');
                                cell.classList.remove('flagged');
                            }
                        }, delay);
                        delay += 40;
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
        }, won ? 400 : 600);
    }
}

document.addEventListener('DOMContentLoaded', () => new Minesweeper());
