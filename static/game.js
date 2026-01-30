class FloatingBackground {
    constructor() {
        this.container = document.getElementById('floating-bg');
        this.shapes = [];
        this.maxShapes = 15;
        this.init();
    }
    
    init() {
        this.spawnShape();
        setInterval(() => this.spawnShape(), 2000);
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
        
        const size = 20 + Math.random() * 80;
        shape.style.width = `${size}px`;
        shape.style.height = `${size}px`;
        shape.style.left = `${Math.random() * 100}%`;
        shape.style.animationDuration = `${15 + Math.random() * 20}s`;
        shape.style.animationDelay = `${Math.random() * 2}s`;
        
        this.container.appendChild(shape);
        this.shapes.push(shape);
        
        setTimeout(() => {
            const index = this.shapes.indexOf(shape);
            if (index > -1) {
                this.shapes.splice(index, 1);
            }
            if (shape.parentNode) {
                shape.parentNode.removeChild(shape);
            }
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
        this.isDragging = false;
        this.dragStartX = 0;
        this.dragStartY = 0;
        this.dragThreshold = 10;
        this.hasDragged = false;
        
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
        setTimeout(() => minesEl.classList.remove('pop'), 300);
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
            setTimeout(() => valueEl.classList.remove('pop'), 200);
            this.updateMinesCount();
        });
        
        heightSlider.addEventListener('input', (e) => {
            this.rows = parseInt(e.target.value);
            const valueEl = document.getElementById('height-value');
            valueEl.textContent = this.rows;
            valueEl.classList.add('pop');
            setTimeout(() => valueEl.classList.remove('pop'), 200);
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
        
        zoomIn.addEventListener('click', () => {
            this.zoom(0.25);
            const levelEl = document.getElementById('zoom-level');
            levelEl.classList.add('pop');
            setTimeout(() => levelEl.classList.remove('pop'), 200);
        });
        
        zoomOut.addEventListener('click', () => {
            this.zoom(-0.25);
            const levelEl = document.getElementById('zoom-level');
            levelEl.classList.add('pop');
            setTimeout(() => levelEl.classList.remove('pop'), 200);
        });
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
        this.clampScroll();
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
        this.setZoom(1);
        this.updateBoardPosition();
        
        this.createBoard();
        this.bindEvents();
        this.setupScrolling();
    }
    
    showMenu() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
        
        document.getElementById('game-screen').classList.add('hidden');
        document.getElementById('menu-screen').classList.remove('hidden');
    }
    
    setupScrolling() {
        const container = document.getElementById('zoom-container');
        const wrapper = document.getElementById('board-wrapper');
        
        let velocityX = 0;
        let velocityY = 0;
        let lastX = 0;
        let lastY = 0;
        let animationId = null;
        
        const applyInertia = () => {
            if (Math.abs(velocityX) > 0.5 || Math.abs(velocityY) > 0.5) {
                this.scrollX += velocityX;
                this.scrollY += velocityY;
                this.clampScroll();
                this.updateBoardPosition();
                
                velocityX *= 0.92;
                velocityY *= 0.92;
                
                animationId = requestAnimationFrame(applyInertia);
            }
        };
        
        container.addEventListener('touchstart', (e) => {
            if (e.touches.length === 1) {
                if (animationId) cancelAnimationFrame(animationId);
                this.isDragging = true;
                this.hasDragged = false;
                this.dragStartX = e.touches[0].clientX;
                this.dragStartY = e.touches[0].clientY;
                lastX = this.dragStartX;
                lastY = this.dragStartY;
                velocityX = 0;
                velocityY = 0;
            }
        }, { passive: true });
        
        container.addEventListener('touchmove', (e) => {
            if (this.isDragging && e.touches.length === 1) {
                const currentX = e.touches[0].clientX;
                const currentY = e.touches[0].clientY;
                
                const deltaX = currentX - lastX;
                const deltaY = currentY - lastY;
                
                const totalDeltaX = Math.abs(currentX - this.dragStartX);
                const totalDeltaY = Math.abs(currentY - this.dragStartY);
                
                if (totalDeltaX > this.dragThreshold || totalDeltaY > this.dragThreshold) {
                    this.hasDragged = true;
                }
                
                if (this.hasDragged) {
                    this.scrollX += deltaX;
                    this.scrollY += deltaY;
                    this.clampScroll();
                    this.updateBoardPosition();
                    
                    velocityX = deltaX;
                    velocityY = deltaY;
                }
                
                lastX = currentX;
                lastY = currentY;
            }
        }, { passive: true });
        
        container.addEventListener('touchend', () => {
            if (this.isDragging && this.hasDragged) {
                applyInertia();
            }
            this.isDragging = false;
        });
        
        container.addEventListener('mousedown', (e) => {
            if (animationId) cancelAnimationFrame(animationId);
            this.isDragging = true;
            this.hasDragged = false;
            this.dragStartX = e.clientX;
            this.dragStartY = e.clientY;
            lastX = this.dragStartX;
            lastY = this.dragStartY;
            velocityX = 0;
            velocityY = 0;
        });
        
        container.addEventListener('mousemove', (e) => {
            if (this.isDragging) {
                const deltaX = e.clientX - lastX;
                const deltaY = e.clientY - lastY;
                
                const totalDeltaX = Math.abs(e.clientX - this.dragStartX);
                const totalDeltaY = Math.abs(e.clientY - this.dragStartY);
                
                if (totalDeltaX > this.dragThreshold || totalDeltaY > this.dragThreshold) {
                    this.hasDragged = true;
                }
                
                if (this.hasDragged) {
                    this.scrollX += deltaX;
                    this.scrollY += deltaY;
                    this.clampScroll();
                    this.updateBoardPosition();
                    
                    velocityX = deltaX;
                    velocityY = deltaY;
                }
                
                lastX = e.clientX;
                lastY = e.clientY;
            }
        });
        
        container.addEventListener('mouseup', () => {
            if (this.isDragging && this.hasDragged) {
                applyInertia();
            }
            this.isDragging = false;
        });
        
        container.addEventListener('mouseleave', () => {
            this.isDragging = false;
        });
    }
    
    clampScroll() {
        const container = document.getElementById('zoom-container');
        const board = document.getElementById('game-board');
        
        const containerRect = container.getBoundingClientRect();
        const boardWidth = board.offsetWidth * this.zoomLevel;
        const boardHeight = board.offsetHeight * this.zoomLevel;
        
        const maxScrollX = Math.max(0, (boardWidth - containerRect.width) / 2 + 50);
        const maxScrollY = Math.max(0, (boardHeight - containerRect.height) / 2 + 50);
        
        const elasticity = 0.3;
        
        if (this.scrollX > maxScrollX) {
            this.scrollX = maxScrollX + (this.scrollX - maxScrollX) * elasticity;
        } else if (this.scrollX < -maxScrollX) {
            this.scrollX = -maxScrollX + (this.scrollX + maxScrollX) * elasticity;
        }
        
        if (this.scrollY > maxScrollY) {
            this.scrollY = maxScrollY + (this.scrollY - maxScrollY) * elasticity;
        } else if (this.scrollY < -maxScrollY) {
            this.scrollY = -maxScrollY + (this.scrollY + maxScrollY) * elasticity;
        }
        
        this.scrollX = Math.max(-maxScrollX * 1.5, Math.min(maxScrollX * 1.5, this.scrollX));
        this.scrollY = Math.max(-maxScrollY * 1.5, Math.min(maxScrollY * 1.5, this.scrollY));
    }
    
    updateBoardPosition() {
        const wrapper = document.getElementById('board-wrapper');
        wrapper.style.transform = `translate(${this.scrollX}px, ${this.scrollY}px)`;
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
                cell.style.animationDelay = `${(i * this.cols + j) * 0.01}s`;
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
        const MOVE_THRESHOLD = 10;
        
        const handlePressStart = (e, x, y) => {
            const cell = e.target.closest('.cell');
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
        
        const handlePressEnd = (e, x, y) => {
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
            handlePressStart(e, e.clientX, e.clientY);
        });
        
        newGameBoard.addEventListener('mouseup', (e) => {
            handlePressEnd(e, e.clientX, e.clientY);
        });
        
        newGameBoard.addEventListener('mouseleave', handlePressCancel);
        
        newGameBoard.addEventListener('touchstart', (e) => {
            if (e.touches.length === 1) {
                handlePressStart(e, e.touches[0].clientX, e.touches[0].clientY);
            }
        }, { passive: true });
        
        newGameBoard.addEventListener('touchend', (e) => {
            if (e.changedTouches.length === 1) {
                e.preventDefault();
                handlePressEnd(e, e.changedTouches[0].clientX, e.changedTouches[0].clientY);
            }
        });
        
        newGameBoard.addEventListener('touchcancel', handlePressCancel);
        
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
                        setTimeout(() => {
                            this.reveal(row + i, col + j);
                        }, 30);
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
            timeEl.classList.add('pulse');
            setTimeout(() => timeEl.classList.remove('pulse'), 200);
        }, 1000);
    }
    
    updateDisplay() {
        const flagCount = this.flagged.flat().filter(f => f).length;
        const remaining = this.mines - flagCount;
        const remainingEl = document.getElementById('remaining');
        remainingEl.textContent = remaining;
        remainingEl.classList.add('pulse');
        setTimeout(() => remainingEl.classList.remove('pulse'), 200);
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
                            cell.classList.add('mine');
                            cell.classList.remove('flagged');
                        }, delay);
                        delay += 50;
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
        }, won ? 500 : 800);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new Minesweeper();
});
