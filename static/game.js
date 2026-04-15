class FloatingBackground {
    constructor() {
        this.container = document.getElementById('floating-bg');
        this.shapes = [];
        this.maxShapes = 12;
        this.init();
    }
    init() {
        for (let i = 0; i < 5; i++) setTimeout(() => this.spawnShape(), i * 500);
        setInterval(() => this.spawnShape(), 2800);
    }
    spawnShape() {
        if (this.shapes.length >= this.maxShapes) {
            const old = this.shapes.shift();
            if (old && old.parentNode) old.parentNode.removeChild(old);
        }
        const shape = document.createElement('div');
        const types = ['', 'blob', 'shard'];
        shape.className = `floating-shape ${types[Math.floor(Math.random() * 3)]}`;
        const size = 30 + Math.random() * 65;
        shape.style.width = `${size}px`;
        shape.style.height = `${size}px`;
        shape.style.left = `${Math.random() * 100}%`;
        shape.style.animationDuration = `${18 + Math.random() * 14}s`;
        this.container.appendChild(shape);
        this.shapes.push(shape);
        setTimeout(() => {
            const idx = this.shapes.indexOf(shape);
            if (idx > -1) this.shapes.splice(idx, 1);
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
        this.timer = 0;
        this.timerInterval = null;
        this.mode = 'dig';
        this.firstClick = true;
        this.zoomLevel = 1;
        this.minZoom = 0.5;
        this.maxZoom = 2.5;

        this.scrollX = 0;
        this.scrollY = 0;
        this.velocityX = 0;
        this.velocityY = 0;
        this.isDragging = false;
        this.hasDragged = false;
        this.dragStartX = 0;
        this.dragStartY = 0;
        this.lastX = 0;
        this.lastY = 0;
        this.dragThreshold = 8;
        this.animationId = null;

        this.points = parseInt(localStorage.getItem('ms_points') || '0');
        this.level = parseInt(localStorage.getItem('ms_level') || '0');

        this.loadSettings();
        this.bindMenuEvents();
        this.updateMinesCount();
        this.renderLevelBar();
        this.checkSavedGame();

        new FloatingBackground();
    }

    levelUpCost(level) {
        return 10 * Math.pow(2, level);
    }

    renderLevelBar() {
        const cost = this.levelUpCost(this.level);
        const pct = Math.min(1, this.points / cost);
        document.getElementById('level-label').textContent = `LVL ${this.level}`;
        document.getElementById('xp-bar-fill').style.width = `${Math.round(pct * 100)}%`;
        document.getElementById('xp-text').textContent = `${this.points} / ${cost}`;

        const upgradeBtn = document.getElementById('upgrade-btn');
        if (this.points >= cost) {
            upgradeBtn.classList.remove('hidden');
        } else {
            upgradeBtn.classList.add('hidden');
        }
    }

    awardPoints(minesHit) {
        const earned = minesHit * 10;
        this.points += earned;
        localStorage.setItem('ms_points', this.points);
        this.renderLevelBar();
        return earned;
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

    saveGameState() {
        if (this.gameOver || this.firstClick) return;
        const state = {
            rows: this.rows,
            cols: this.cols,
            mines: this.mines,
            board: this.board,
            revealed: this.revealed,
            flagged: this.flagged,
            timer: this.timer,
            mode: this.mode,
            firstClick: this.firstClick
        };
        localStorage.setItem('ms_saved_game', JSON.stringify(state));
    }

    clearSavedGame() {
        localStorage.removeItem('ms_saved_game');
        document.getElementById('continue-btn').classList.add('hidden');
    }

    checkSavedGame() {
        const raw = localStorage.getItem('ms_saved_game');
        if (!raw) return;
        try {
            const state = JSON.parse(raw);
            if (state && state.board && !state.gameOver) {
                document.getElementById('continue-btn').classList.remove('hidden');
            }
        } catch(e) {
            this.clearSavedGame();
        }
    }

    loadSavedGame() {
        const raw = localStorage.getItem('ms_saved_game');
        if (!raw) return false;
        try {
            const state = JSON.parse(raw);
            this.rows = state.rows;
            this.cols = state.cols;
            this.mines = state.mines;
            this.board = state.board;
            this.revealed = state.revealed;
            this.flagged = state.flagged;
            this.timer = state.timer;
            this.mode = state.mode;
            this.firstClick = state.firstClick;
            this.gameOver = false;
            return true;
        } catch(e) {
            return false;
        }
    }

    calculateMines() {
        return Math.floor(this.rows * this.cols * 0.15);
    }

    updateMinesCount() {
        this.mines = this.calculateMines();
        const el = document.getElementById('mines-value');
        el.textContent = this.mines;
        el.classList.add('pop');
        setTimeout(() => el.classList.remove('pop'), 220);
    }

    bindMenuEvents() {
        document.getElementById('width-slider').addEventListener('input', (e) => {
            this.cols = parseInt(e.target.value);
            const el = document.getElementById('width-value');
            el.textContent = this.cols;
            el.classList.add('pop');
            setTimeout(() => el.classList.remove('pop'), 140);
            this.updateMinesCount();
        });

        document.getElementById('height-slider').addEventListener('input', (e) => {
            this.rows = parseInt(e.target.value);
            const el = document.getElementById('height-value');
            el.textContent = this.rows;
            el.classList.add('pop');
            setTimeout(() => el.classList.remove('pop'), 140);
            this.updateMinesCount();
        });

        document.getElementById('play-btn').addEventListener('click', () => {
            this.saveSettings();
            this.clearSavedGame();
            this.transitionToGame(() => {
                this.createFreshBoard();
                this.bindGameEvents();
                this.setupScrolling();
            });
        });

        document.getElementById('continue-btn').addEventListener('click', () => {
            if (this.loadSavedGame()) {
                this.transitionToGame(() => {
                    this.renderBoard();
                    this.renderSavedState();
                    this.updateDisplay();
                    this.bindGameEvents();
                    this.setupScrolling();
                    const gameBoard = document.getElementById('game-board');
                    gameBoard.style.gridTemplateColumns = `repeat(${this.cols}, 1fr)`;
                    if (!this.firstClick) this.startTimer();
                });
            }
        });

        document.getElementById('back-btn').addEventListener('click', () => this.showMenu());

        document.getElementById('menu-btn').addEventListener('click', () => {
            document.getElementById('game-over-modal').classList.remove('show');
            this.showMenu();
        });

        document.getElementById('restart-btn').addEventListener('click', () => {
            document.getElementById('game-over-modal').classList.remove('show');
            this.clearSavedGame();
            this.createFreshBoard();
            this.bindGameEvents();
        });

        document.getElementById('dark-mode-toggle').addEventListener('change', (e) => {
            document.body.classList.toggle('dark-mode', e.target.checked);
            localStorage.setItem('darkMode', e.target.checked);
        });

        document.getElementById('zoom-in').addEventListener('click', () => this.zoom(0.25));
        document.getElementById('zoom-out').addEventListener('click', () => this.zoom(-0.25));

        document.getElementById('settings-open-btn').addEventListener('click', () => {
            document.getElementById('settings-modal').classList.add('show');
        });
        document.getElementById('settings-close-btn').addEventListener('click', () => {
            document.getElementById('settings-modal').classList.remove('show');
        });
        document.getElementById('settings-modal').addEventListener('click', (e) => {
            if (e.target === document.getElementById('settings-modal'))
                document.getElementById('settings-modal').classList.remove('show');
        });

        document.getElementById('upgrade-btn').addEventListener('click', () => {
            const cost = this.levelUpCost(this.level);
            if (this.points >= cost) {
                this.points -= cost;
                this.level++;
                localStorage.setItem('ms_points', this.points);
                localStorage.setItem('ms_level', this.level);
                this.renderLevelBar();
            }
        });
    }

    transitionToGame(callback) {
        const overlay = document.getElementById('screen-transition');
        overlay.className = 'screen-transition';
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                overlay.classList.add('slide-down');
                setTimeout(() => {
                    document.getElementById('menu-screen').classList.add('hidden');
                    document.getElementById('game-screen').classList.remove('hidden');
                    callback();
                    overlay.classList.remove('slide-down');
                    overlay.classList.add('slide-up');
                    setTimeout(() => {
                        overlay.className = 'screen-transition';
                    }, 420);
                }, 380);
            });
        });
    }

    zoom(delta) {
        const newZoom = Math.min(this.maxZoom, Math.max(this.minZoom, this.zoomLevel + delta));
        if (newZoom !== this.zoomLevel) {
            this.zoomLevel = newZoom;
            document.getElementById('game-board').style.transform = `scale(${this.zoomLevel})`;
            const el = document.getElementById('zoom-level');
            el.textContent = Math.round(this.zoomLevel * 100) + '%';
            el.classList.add('pop');
            setTimeout(() => el.classList.remove('pop'), 140);
            this.clampScroll();
            this.updateBoardPosition();
        }
    }

    showMenu() {
        if (this.timerInterval) { clearInterval(this.timerInterval); this.timerInterval = null; }
        if (this.animationId) { cancelAnimationFrame(this.animationId); this.animationId = null; }
        document.getElementById('game-screen').classList.add('hidden');
        document.getElementById('menu-screen').classList.remove('hidden');
        this.checkSavedGame();
        this.renderLevelBar();
    }

    setupScrolling() {
        const container = document.getElementById('zoom-container');

        const clone = container.cloneNode(false);
        const board = document.getElementById('board-wrapper');
        while (container.firstChild) clone.appendChild(container.firstChild);
        container.parentNode.replaceChild(clone, container);
        clone.appendChild(board);

        const handleStart = (x, y) => {
            if (this.animationId) { cancelAnimationFrame(this.animationId); this.animationId = null; }
            this.isDragging = true;
            this.hasDragged = false;
            this.dragStartX = x; this.dragStartY = y;
            this.lastX = x; this.lastY = y;
            this.velocityX = 0; this.velocityY = 0;
        };

        const handleMove = (x, y) => {
            if (!this.isDragging) return;
            const dx = x - this.lastX;
            const dy = y - this.lastY;
            const tdx = Math.abs(x - this.dragStartX);
            const tdy = Math.abs(y - this.dragStartY);
            if (tdx > this.dragThreshold || tdy > this.dragThreshold) this.hasDragged = true;
            if (this.hasDragged) {
                this.scrollX += dx;
                this.scrollY += dy;
                this.clampScroll();
                this.updateBoardPosition();
                this.velocityX = dx * 0.8;
                this.velocityY = dy * 0.8;
            }
            this.lastX = x; this.lastY = y;
        };

        const handleEnd = () => {
            if (this.isDragging && this.hasDragged &&
                (Math.abs(this.velocityX) > 1 || Math.abs(this.velocityY) > 1)) {
                this.applyInertia();
            }
            this.isDragging = false;
        };

        clone.addEventListener('touchstart', (e) => {
            if (e.touches.length === 1) handleStart(e.touches[0].clientX, e.touches[0].clientY);
        }, { passive: true });
        clone.addEventListener('touchmove', (e) => {
            if (e.touches.length === 1) handleMove(e.touches[0].clientX, e.touches[0].clientY);
        }, { passive: true });
        clone.addEventListener('touchend', handleEnd, { passive: true });
        clone.addEventListener('touchcancel', handleEnd, { passive: true });
        clone.addEventListener('mousedown', (e) => handleStart(e.clientX, e.clientY));
        clone.addEventListener('mousemove', (e) => handleMove(e.clientX, e.clientY));
        clone.addEventListener('mouseup', handleEnd);
        clone.addEventListener('mouseleave', () => { this.isDragging = false; });
    }

    applyInertia() {
        const decay = 0.92;
        const animate = () => {
            if (Math.abs(this.velocityX) > 0.3 || Math.abs(this.velocityY) > 0.3) {
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
        if (!container || !board) return;
        const cw = container.clientWidth;
        const ch = container.clientHeight;
        const bw = board.offsetWidth * this.zoomLevel;
        const bh = board.offsetHeight * this.zoomLevel;
        const pad = 30;
        const maxX = Math.max(0, (bw - cw) / 2 + pad);
        const maxY = Math.max(0, (bh - ch) / 2 + pad);
        this.scrollX = Math.max(-maxX, Math.min(maxX, this.scrollX));
        this.scrollY = Math.max(-maxY, Math.min(maxY, this.scrollY));
    }

    updateBoardPosition() {
        const wrapper = document.getElementById('board-wrapper');
        if (wrapper) wrapper.style.transform = `translate3d(${this.scrollX}px,${this.scrollY}px,0)`;
    }

    createFreshBoard() {
        this.board = [];
        this.revealed = [];
        this.flagged = [];
        this.gameOver = false;
        this.firstClick = true;
        this.timer = 0;
        this.mode = 'dig';
        this.scrollX = 0; this.scrollY = 0;
        this.zoomLevel = 1;

        if (this.timerInterval) { clearInterval(this.timerInterval); this.timerInterval = null; }

        for (let i = 0; i < this.rows; i++) {
            this.board[i] = []; this.revealed[i] = []; this.flagged[i] = [];
            for (let j = 0; j < this.cols; j++) {
                this.board[i][j] = 0;
                this.revealed[i][j] = false;
                this.flagged[i][j] = false;
            }
        }

        const gameBoard = document.getElementById('game-board');
        gameBoard.style.gridTemplateColumns = `repeat(${this.cols}, 1fr)`;
        gameBoard.style.transform = `scale(1)`;
        document.getElementById('zoom-level').textContent = '100%';
        this.updateBoardPosition();

        document.getElementById('dig-btn').classList.add('active');
        document.getElementById('flag-btn').classList.remove('active');

        this.renderBoard();
        this.updateDisplay();
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

    renderSavedState() {
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                const cell = this.getCell(i, j);
                if (!cell) continue;
                if (this.revealed[i][j]) {
                    cell.classList.add('revealed');
                    if (this.board[i][j] > 0) {
                        cell.textContent = this.board[i][j];
                        cell.classList.add('n' + this.board[i][j]);
                    }
                } else if (this.flagged[i][j]) {
                    cell.classList.add('flagged');
                }
            }
        }
        const modeBtn = this.mode === 'dig' ? document.getElementById('dig-btn') : document.getElementById('flag-btn');
        const otherBtn = this.mode === 'dig' ? document.getElementById('flag-btn') : document.getElementById('dig-btn');
        modeBtn.classList.add('active');
        otherBtn.classList.remove('active');
    }

    bindGameEvents() {
        const gameBoard = document.getElementById('game-board');
        const newGameBoard = gameBoard.cloneNode(true);
        gameBoard.parentNode.replaceChild(newGameBoard, gameBoard);

        let longPressTimer = null;
        let isLongPress = false;
        let pressedCell = null;
        let touchStartX = 0;
        let touchStartY = 0;
        const LONG_PRESS = 400;
        const MOVE_THR = 8;

        const onPressStart = (cell, x, y) => {
            if (!cell) return;
            isLongPress = false;
            pressedCell = cell;
            touchStartX = x; touchStartY = y;
            cell.classList.add('pressed');
            const row = parseInt(cell.dataset.row);
            const col = parseInt(cell.dataset.col);
            longPressTimer = setTimeout(() => {
                isLongPress = true;
                cell.classList.remove('pressed');
                if (!this.hasDragged) this.handleLongPress(row, col);
            }, LONG_PRESS);
        };

        const onPressEnd = (x, y) => {
            if (longPressTimer) { clearTimeout(longPressTimer); longPressTimer = null; }
            if (pressedCell) pressedCell.classList.remove('pressed');
            if (!isLongPress && !this.hasDragged && pressedCell) {
                if (Math.abs(x - touchStartX) < MOVE_THR && Math.abs(y - touchStartY) < MOVE_THR) {
                    const row = parseInt(pressedCell.dataset.row);
                    const col = parseInt(pressedCell.dataset.col);
                    this.handleCellTap(row, col);
                }
            }
            isLongPress = false;
            pressedCell = null;
        };

        const onPressCancel = () => {
            if (longPressTimer) { clearTimeout(longPressTimer); longPressTimer = null; }
            if (pressedCell) pressedCell.classList.remove('pressed');
            isLongPress = false;
            pressedCell = null;
        };

        newGameBoard.addEventListener('mousedown', (e) => {
            onPressStart(e.target.closest('.cell'), e.clientX, e.clientY);
        });
        newGameBoard.addEventListener('mouseup', (e) => onPressEnd(e.clientX, e.clientY));
        newGameBoard.addEventListener('mouseleave', onPressCancel);
        newGameBoard.addEventListener('touchstart', (e) => {
            if (e.touches.length === 1)
                onPressStart(e.target.closest('.cell'), e.touches[0].clientX, e.touches[0].clientY);
        }, { passive: true });
        newGameBoard.addEventListener('touchend', (e) => {
            if (e.changedTouches.length === 1) {
                e.preventDefault();
                onPressEnd(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
            }
        });
        newGameBoard.addEventListener('touchcancel', onPressCancel);
        newGameBoard.addEventListener('contextmenu', (e) => e.preventDefault());

        document.getElementById('dig-btn').onclick = () => {
            this.mode = 'dig';
            document.getElementById('dig-btn').classList.add('active');
            document.getElementById('flag-btn').classList.remove('active');
        };
        document.getElementById('flag-btn').onclick = () => {
            this.mode = 'flag';
            document.getElementById('flag-btn').classList.add('active');
            document.getElementById('dig-btn').classList.remove('active');
        };
    }

    handleLongPress(row, col) {
        if (this.gameOver) return;
        if (this.revealed[row][col]) return;
        if (this.mode === 'dig') {
            this.toggleFlag(row, col);
        } else {
            if (this.flagged[row][col]) return;
            this.digCell(row, col);
        }
        this.updateDisplay();
        this.saveGameState();
    }

    handleCellTap(row, col) {
        if (this.gameOver) return;
        if (this.revealed[row][col]) return;

        if (this.mode === 'dig') {
            if (this.flagged[row][col]) {
                this.toggleFlag(row, col);
            } else {
                this.digCell(row, col);
            }
        } else {
            this.toggleFlag(row, col);
        }

        this.updateDisplay();
        this.saveGameState();
    }

    digCell(row, col) {
        if (this.flagged[row][col]) return;

        if (this.firstClick) {
            this.firstClick = false;
            this.placeMines(row, col);
            this.startTimer();
        }

        this.reveal(row, col);
    }

    toggleFlag(row, col) {
        if (this.revealed[row][col]) return;
        this.flagged[row][col] = !this.flagged[row][col];
        const cell = this.getCell(row, col);
        if (cell) cell.classList.toggle('flagged', this.flagged[row][col]);
    }

    placeMines(excludeRow, excludeCol) {
        let placed = 0;
        while (placed < this.mines) {
            const r = Math.floor(Math.random() * this.rows);
            const c = Math.floor(Math.random() * this.cols);
            if (this.board[r][c] !== -1 &&
                !(Math.abs(r - excludeRow) <= 1 && Math.abs(c - excludeCol) <= 1)) {
                this.board[r][c] = -1;
                placed++;
            }
        }
        for (let i = 0; i < this.rows; i++)
            for (let j = 0; j < this.cols; j++)
                if (this.board[i][j] !== -1)
                    this.board[i][j] = this.countAdjacentMines(i, j);
    }

    countAdjacentMines(row, col) {
        let count = 0;
        for (let i = -1; i <= 1; i++)
            for (let j = -1; j <= 1; j++) {
                const r = row + i, c = col + j;
                if (r >= 0 && r < this.rows && c >= 0 && c < this.cols && this.board[r][c] === -1)
                    count++;
            }
        return count;
    }

    reveal(row, col) {
        if (row < 0 || row >= this.rows || col < 0 || col >= this.cols) return;
        if (this.revealed[row][col] || this.flagged[row][col]) return;

        this.revealed[row][col] = true;
        const cell = this.getCell(row, col);
        if (cell) cell.classList.add('revealed');

        if (this.board[row][col] === -1) {
            this.gameOver = true;
            this.endGame();
            return;
        }

        if (this.board[row][col] > 0) {
            if (cell) { cell.textContent = this.board[row][col]; cell.classList.add('n' + this.board[row][col]); }
        } else {
            for (let i = -1; i <= 1; i++)
                for (let j = -1; j <= 1; j++)
                    if (i !== 0 || j !== 0)
                        setTimeout(() => this.reveal(row + i, col + j), 18);
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
        const flagCount = this.flagged.flat().filter(Boolean).length;
        document.getElementById('remaining').textContent = this.mines - flagCount;
        document.getElementById('time').textContent = this.timer.toString().padStart(3, '0');
    }

    endGame() {
        clearInterval(this.timerInterval);
        this.timerInterval = null;
        this.clearSavedGame();

        let minesHit = 0;
        let delay = 0;
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                if (this.board[i][j] === -1) {
                    minesHit++;
                    const d = delay;
                    setTimeout(() => {
                        const cell = this.getCell(i, j);
                        if (cell) { cell.classList.add('mine'); cell.classList.remove('flagged'); }
                    }, d);
                    delay += 35;
                }
            }
        }

        const earned = this.awardPoints(1);

        setTimeout(() => {
            document.getElementById('modal-title').textContent = 'Game Over';
            document.getElementById('modal-message').textContent = `You survived ${this.timer}s and opened 1 mine.`;
            document.getElementById('points-earned').textContent = `+${earned} points`;
            document.getElementById('game-over-modal').classList.add('show');
        }, Math.min(delay + 200, 1200));
    }
}

document.addEventListener('DOMContentLoaded', () => new Minesweeper());
