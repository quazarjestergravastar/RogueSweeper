const DIFFICULTIES = {
    easy:   { key:'easy',   name:'Easy',   rows:12, cols:10, mines:15,  color:'#4CAF50', locked:false },
    normal: { key:'normal', name:'Normal', rows:20, cols:12, mines:30,  color:'#2196F3', locked:false },
    hard:   { key:'hard',   name:'Hard',   rows:28, cols:16, mines:55,  color:'#FF9800', unlockCost:800 },
};

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
        this.rows = 12; this.cols = 10; this.mines = 15;
        this.currentDifficulty = null;
        this.board = []; this.revealed = []; this.flagged = [];
        this.gameOver = false;
        this.timer = 0; this.timerInterval = null;
        this.mode = 'dig'; this.firstClick = true;
        this.zoomLevel = 1; this.minZoom = 0.5; this.maxZoom = 2.5;

        this.scrollX = 0; this.scrollY = 0;
        this.velocityX = 0; this.velocityY = 0;
        this.isDragging = false; this.hasDragged = false;
        this.dragStartX = 0; this.dragStartY = 0;
        this.lastX = 0; this.lastY = 0;
        this.dragThreshold = 8; this.animationId = null;

        this.points = parseInt(localStorage.getItem('ms_points') || '0');
        this.level  = parseInt(localStorage.getItem('ms_level')  || '0');
        this.hardUnlocked = localStorage.getItem('ms_hard_unlocked') === 'true';

        this.loadSettings();
        this.bindMenuEvents();
        this.renderDifficultyGrid();
        this.renderLevelBar();
        this.checkSavedGame();

        new FloatingBackground();
    }

    /* ── LEVEL / POINTS ── */
    levelUpCost(level) { return 10 * Math.pow(2, level); }

    renderLevelBar() {
        const cost = this.levelUpCost(this.level);
        const pct  = Math.min(1, this.points / cost);
        document.getElementById('level-label').textContent  = `LVL ${this.level}`;
        document.getElementById('xp-bar-fill').style.width  = `${Math.round(pct * 100)}%`;
        document.getElementById('xp-text').textContent      = `${this.points} / ${cost}`;
        document.getElementById('upgrade-btn').classList.toggle('hidden', this.points < cost);
    }

    awardPoints(correctFlags) {
        const earned = correctFlags * 10;
        this.points += earned;
        localStorage.setItem('ms_points', this.points);
        this.renderLevelBar();
        return earned;
    }

    /* ── SETTINGS ── */
    loadSettings() {
        const darkMode = localStorage.getItem('darkMode') === 'true';
        if (darkMode) {
            document.body.classList.add('dark-mode');
            document.getElementById('dark-mode-toggle').checked = true;
        }
    }

    /* ── SAVE / LOAD ── */
    saveGameState() {
        if (this.gameOver || this.firstClick) return;
        localStorage.setItem('ms_saved_game', JSON.stringify({
            rows: this.rows, cols: this.cols, mines: this.mines,
            difficulty: this.currentDifficulty,
            board: this.board, revealed: this.revealed, flagged: this.flagged,
            timer: this.timer, mode: this.mode, firstClick: this.firstClick
        }));
    }

    clearSavedGame() {
        localStorage.removeItem('ms_saved_game');
        this.updatePlayButtons();
    }

    checkSavedGame() {
        try {
            const s = JSON.parse(localStorage.getItem('ms_saved_game'));
            if (s && s.board && !s.gameOver) {
                document.getElementById('continue-btn').classList.remove('hidden');
                return;
            }
        } catch(e) {}
        document.getElementById('continue-btn').classList.add('hidden');
    }

    loadSavedGame() {
        try {
            const s = JSON.parse(localStorage.getItem('ms_saved_game'));
            if (!s) return false;
            this.rows = s.rows; this.cols = s.cols; this.mines = s.mines;
            this.currentDifficulty = s.difficulty || null;
            this.board = s.board; this.revealed = s.revealed; this.flagged = s.flagged;
            this.timer = s.timer; this.mode = s.mode; this.firstClick = s.firstClick;
            this.gameOver = false;
            return true;
        } catch(e) { return false; }
    }

    updatePlayButtons() {
        this.checkSavedGame();
    }

    /* ── DIFFICULTY GRID ── */
    renderDifficultyGrid() {
        const hardBox = document.getElementById('diff-hard');
        if (this.hardUnlocked) {
            hardBox.classList.add('hard-unlocked');
            hardBox.classList.remove('diff-locked');
        } else {
            hardBox.classList.remove('hard-unlocked');
            hardBox.classList.add('diff-locked');
        }
    }

    showDiffModal(title, bodyHtml, buttons) {
        document.getElementById('diff-modal-title').textContent = title;
        document.getElementById('diff-modal-body').innerHTML = bodyHtml;
        const btnWrap = document.getElementById('diff-modal-buttons');
        btnWrap.innerHTML = '';
        buttons.forEach(b => {
            const btn = document.createElement('button');
            btn.className = `${b.cls} juicy-btn`;
            btn.textContent = b.label;
            btn.onclick = () => {
                document.getElementById('diff-modal').classList.remove('show');
                b.action();
            };
            btnWrap.appendChild(btn);
        });
        document.getElementById('diff-modal').classList.add('show');
    }

    hideDiffModal() {
        document.getElementById('diff-modal').classList.remove('show');
    }

    onDifficultyClick(key) {
        if (key === 'soon') {
            this.showDiffModal('Coming Soon', 'This difficulty is not available yet.', [
                { label:'OK', cls:'restart-btn', action:() => {} }
            ]);
            return;
        }

        const diff = DIFFICULTIES[key];

        if (key === 'hard' && !this.hardUnlocked) {
            const canAfford = this.points >= diff.unlockCost;
            this.showDiffModal(
                '🔒 Unlock Hard?',
                `Hard difficulty costs <strong>${diff.unlockCost} points</strong>.<br>You have <strong>${this.points} points</strong>.`,
                [
                    canAfford
                        ? { label:'Unlock', cls:'confirm-btn', action:() => this.unlockHard() }
                        : { label:'Not Enough Points', cls:'menu-link-btn', action:() => {} },
                    { label:'Cancel', cls:'menu-link-btn', action:() => {} }
                ]
            );
            return;
        }

        this.showDiffModal(
            diff.name,
            `${diff.rows}×${diff.cols} board · <strong>${diff.mines} mines</strong>`,
            [
                { label:'Play', cls:'restart-btn', action:() => this.startDifficulty(key) },
                { label:'Cancel', cls:'menu-link-btn', action:() => {} }
            ]
        );

        document.getElementById('mines-value').textContent = diff.mines;
        document.getElementById('play-btn').dataset.diff = key;
        document.getElementById('play-btn').classList.remove('hidden');
    }

    unlockHard() {
        const diff = DIFFICULTIES.hard;
        this.points -= diff.unlockCost;
        localStorage.setItem('ms_points', this.points);
        this.hardUnlocked = true;
        localStorage.setItem('ms_hard_unlocked', 'true');
        this.renderLevelBar();
        this.renderDifficultyGrid();
        this.showDiffModal(
            'Hard Unlocked! 🎉',
            `${diff.rows}×${diff.cols} board · <strong>${diff.mines} mines</strong>`,
            [
                { label:'Play Now', cls:'confirm-btn', action:() => this.startDifficulty('hard') },
                { label:'Later',    cls:'menu-link-btn', action:() => {} }
            ]
        );
    }

    startDifficulty(key) {
        const diff = DIFFICULTIES[key];
        this.currentDifficulty = key;
        this.rows  = diff.rows;
        this.cols  = diff.cols;
        this.mines = diff.mines;
        document.getElementById('mines-value').textContent = diff.mines;
        this.clearSavedGame();
        this.transitionToGame(() => {
            this.createFreshBoard();
            this.bindGameEvents();
            this.setupScrolling();
        });
    }

    /* ── TRANSITIONS ── */
    transitionToGame(callback) {
        const overlay = document.getElementById('screen-transition');
        overlay.className = 'screen-transition';
        requestAnimationFrame(() => requestAnimationFrame(() => {
            overlay.classList.add('slide-down');
            setTimeout(() => {
                document.getElementById('menu-screen').classList.add('hidden');
                document.getElementById('game-screen').classList.remove('hidden');
                callback();
                overlay.classList.remove('slide-down');
                overlay.classList.add('slide-up');
                setTimeout(() => { overlay.className = 'screen-transition'; }, 420);
            }, 380);
        }));
    }

    /* ── MENU EVENTS ── */
    bindMenuEvents() {
        document.getElementById('diff-easy')  .addEventListener('click', () => this.onDifficultyClick('easy'));
        document.getElementById('diff-normal') .addEventListener('click', () => this.onDifficultyClick('normal'));
        document.getElementById('diff-hard')  .addEventListener('click', () => this.onDifficultyClick('hard'));
        document.getElementById('diff-cs1')   .addEventListener('click', () => this.onDifficultyClick('soon'));
        document.getElementById('diff-cs2')   .addEventListener('click', () => this.onDifficultyClick('soon'));
        document.getElementById('diff-cs3')   .addEventListener('click', () => this.onDifficultyClick('soon'));

        document.getElementById('play-btn').addEventListener('click', () => {
            const key = document.getElementById('play-btn').dataset.diff;
            if (key) this.startDifficulty(key);
        });

        document.getElementById('continue-btn').addEventListener('click', () => {
            if (this.loadSavedGame()) {
                this.transitionToGame(() => {
                    const gb = document.getElementById('game-board');
                    gb.style.gridTemplateColumns = `repeat(${this.cols}, 1fr)`;
                    gb.style.transform = 'scale(1)';
                    this.zoomLevel = 1;
                    document.getElementById('zoom-level').textContent = '100%';
                    this.scrollX = 0; this.scrollY = 0;
                    this.updateBoardPosition();
                    this.renderBoard();
                    this.renderSavedState();
                    this.updateDisplay();
                    this.bindGameEvents();
                    this.setupScrolling();
                    if (!this.firstClick) {
                        if (this.timerInterval) clearInterval(this.timerInterval);
                        this.startTimer();
                    }
                });
            }
        });

        document.getElementById('back-btn').addEventListener('click', () => this.showMenu());

        document.getElementById('menu-btn').addEventListener('click', () => {
            document.getElementById('game-over-modal').classList.remove('show');
            document.getElementById('modal-restore-btn').classList.add('hidden');
            this.showMenu();
        });
        document.getElementById('restart-btn').addEventListener('click', () => {
            document.getElementById('game-over-modal').classList.remove('show');
            document.getElementById('modal-restore-btn').classList.add('hidden');
            this.clearSavedGame();
            if (this.currentDifficulty) {
                this.startDifficulty(this.currentDifficulty);
            } else {
                this.createFreshBoard();
                this.bindGameEvents();
            }
        });
        document.getElementById('modal-hide-btn').addEventListener('click', () => {
            document.getElementById('game-over-modal').classList.remove('show');
            document.getElementById('modal-restore-btn').classList.remove('hidden');
        });
        document.getElementById('modal-restore-btn').addEventListener('click', () => {
            document.getElementById('game-over-modal').classList.add('show');
            document.getElementById('modal-restore-btn').classList.add('hidden');
        });

        document.getElementById('zoom-in') .addEventListener('click', () => this.zoom(0.25));
        document.getElementById('zoom-out').addEventListener('click', () => this.zoom(-0.25));

        document.getElementById('settings-open-btn').addEventListener('click', () =>
            document.getElementById('settings-modal').classList.add('show'));
        document.getElementById('settings-close-btn').addEventListener('click', () =>
            document.getElementById('settings-modal').classList.remove('show'));
        document.getElementById('settings-modal').addEventListener('click', (e) => {
            if (e.target === document.getElementById('settings-modal'))
                document.getElementById('settings-modal').classList.remove('show');
        });

        document.getElementById('dark-mode-toggle').addEventListener('change', (e) => {
            document.body.classList.toggle('dark-mode', e.target.checked);
            localStorage.setItem('darkMode', e.target.checked);
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

    /* ── ZOOM ── */
    zoom(delta) {
        const newZoom = Math.min(this.maxZoom, Math.max(this.minZoom, this.zoomLevel + delta));
        if (newZoom === this.zoomLevel) return;
        this.zoomLevel = newZoom;
        document.getElementById('game-board').style.transform = `scale(${this.zoomLevel})`;
        const el = document.getElementById('zoom-level');
        el.textContent = Math.round(this.zoomLevel * 100) + '%';
        el.classList.add('pop');
        setTimeout(() => el.classList.remove('pop'), 140);
        this.clampScroll();
        this.updateBoardPosition();
    }

    /* ── SHOW MENU ── */
    showMenu() {
        if (this.timerInterval) { clearInterval(this.timerInterval); this.timerInterval = null; }
        if (this.animationId)   { cancelAnimationFrame(this.animationId); this.animationId = null; }
        this.saveGameState();
        document.getElementById('game-screen').classList.add('hidden');
        document.getElementById('menu-screen').classList.remove('hidden');
        this.checkSavedGame();
        this.renderLevelBar();
    }

    /* ── SCROLLING ── */
    setupScrolling() {
        const container = document.getElementById('zoom-container');
        const newContainer = container.cloneNode(false);
        const wrapper = document.getElementById('board-wrapper');
        newContainer.appendChild(wrapper);
        container.parentNode.replaceChild(newContainer, container);

        const handleStart = (x, y) => {
            if (this.animationId) { cancelAnimationFrame(this.animationId); this.animationId = null; }
            this.isDragging = true; this.hasDragged = false;
            this.dragStartX = x; this.dragStartY = y;
            this.lastX = x; this.lastY = y;
            this.velocityX = 0; this.velocityY = 0;
        };
        const handleMove = (x, y) => {
            if (!this.isDragging) return;
            const dx = x - this.lastX, dy = y - this.lastY;
            if (Math.abs(x - this.dragStartX) > this.dragThreshold ||
                Math.abs(y - this.dragStartY) > this.dragThreshold) this.hasDragged = true;
            if (this.hasDragged) {
                this.scrollX += dx; this.scrollY += dy;
                this.clampScroll(); this.updateBoardPosition();
                this.velocityX = dx * 0.8; this.velocityY = dy * 0.8;
            }
            this.lastX = x; this.lastY = y;
        };
        const handleEnd = () => {
            if (this.isDragging && this.hasDragged &&
                (Math.abs(this.velocityX) > 1 || Math.abs(this.velocityY) > 1))
                this.applyInertia();
            this.isDragging = false;
        };

        newContainer.addEventListener('touchstart', (e) => {
            if (e.touches.length === 1) handleStart(e.touches[0].clientX, e.touches[0].clientY);
        }, { passive:true });
        newContainer.addEventListener('touchmove', (e) => {
            if (e.touches.length === 1) handleMove(e.touches[0].clientX, e.touches[0].clientY);
        }, { passive:true });
        newContainer.addEventListener('touchend',   handleEnd, { passive:true });
        newContainer.addEventListener('touchcancel',handleEnd, { passive:true });
        newContainer.addEventListener('mousedown',  (e) => handleStart(e.clientX, e.clientY));
        newContainer.addEventListener('mousemove',  (e) => handleMove(e.clientX, e.clientY));
        newContainer.addEventListener('mouseup',    handleEnd);
        newContainer.addEventListener('mouseleave', () => { this.isDragging = false; });
    }

    applyInertia() {
        const decay = 0.92;
        const animate = () => {
            if (Math.abs(this.velocityX) > 0.3 || Math.abs(this.velocityY) > 0.3) {
                this.scrollX += this.velocityX; this.scrollY += this.velocityY;
                this.clampScroll(); this.updateBoardPosition();
                this.velocityX *= decay; this.velocityY *= decay;
                this.animationId = requestAnimationFrame(animate);
            } else { this.animationId = null; }
        };
        this.animationId = requestAnimationFrame(animate);
    }

    /* KEY FIX: board uses transform-origin:top left so visual top IS DOM top.
       scrollX=0 → see left edge; scrollX negative → see right.
       scrollY=0 → see top edge;  scrollY negative → see bottom.           */
    clampScroll() {
        const container = document.getElementById('zoom-container');
        const board     = document.getElementById('game-board');
        if (!container || !board) return;

        const cw = container.clientWidth;
        const ch = container.clientHeight;
        const bw = board.offsetWidth  * this.zoomLevel;
        const bh = board.offsetHeight * this.zoomLevel;
        const pad = 40;

        const overflowX = Math.max(0, bw - cw);
        const overflowY = Math.max(0, bh - ch);

        this.scrollX = Math.max(-(overflowX + pad), Math.min(pad, this.scrollX));
        this.scrollY = Math.max(-(overflowY + pad), Math.min(pad, this.scrollY));
    }

    updateBoardPosition() {
        const wrapper = document.getElementById('board-wrapper');
        if (wrapper) wrapper.style.transform = `translate3d(${this.scrollX}px,${this.scrollY}px,0)`;
    }

    /* ── BOARD SETUP ── */
    createFreshBoard() {
        this.board = []; this.revealed = []; this.flagged = [];
        this.gameOver = false; this.firstClick = true;
        this.timer = 0; this.mode = 'dig';
        this.scrollX = 0; this.scrollY = 0; this.zoomLevel = 1;

        if (this.timerInterval) { clearInterval(this.timerInterval); this.timerInterval = null; }

        for (let i = 0; i < this.rows; i++) {
            this.board[i] = []; this.revealed[i] = []; this.flagged[i] = [];
            for (let j = 0; j < this.cols; j++) {
                this.board[i][j] = 0; this.revealed[i][j] = false; this.flagged[i][j] = false;
            }
        }

        const gb = document.getElementById('game-board');
        gb.style.gridTemplateColumns = `repeat(${this.cols}, 1fr)`;
        gb.style.transform = 'scale(1)';
        document.getElementById('zoom-level').textContent = '100%';
        this.updateBoardPosition();
        document.getElementById('dig-btn').classList.add('active');
        document.getElementById('flag-btn').classList.remove('active');

        this.renderBoard();
        this.updateDisplay();

        requestAnimationFrame(() => this.clampScroll());
    }

    renderBoard() {
        const gb = document.getElementById('game-board');
        gb.innerHTML = '';
        for (let i = 0; i < this.rows; i++)
            for (let j = 0; j < this.cols; j++) {
                const cell = document.createElement('button');
                cell.className = 'cell';
                cell.dataset.row = i; cell.dataset.col = j;
                gb.appendChild(cell);
            }
    }

    renderSavedState() {
        for (let i = 0; i < this.rows; i++)
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
        const dig  = document.getElementById('dig-btn');
        const flag = document.getElementById('flag-btn');
        if (this.mode === 'dig') { dig.classList.add('active'); flag.classList.remove('active'); }
        else                     { flag.classList.add('active'); dig.classList.remove('active'); }
    }

    /* ── GAME EVENTS ── */
    bindGameEvents() {
        const gb = document.getElementById('game-board');
        const newGb = gb.cloneNode(true);
        gb.parentNode.replaceChild(newGb, gb);

        let longPressTimer = null, isLongPress = false, pressedCell = null;
        let touchStartX = 0, touchStartY = 0;
        const LONG_PRESS = 400, MOVE_THR = 8;

        const onStart = (cell, x, y) => {
            if (!cell) return;
            isLongPress = false; pressedCell = cell;
            touchStartX = x; touchStartY = y;
            cell.classList.add('pressed');
            const row = parseInt(cell.dataset.row), col = parseInt(cell.dataset.col);
            longPressTimer = setTimeout(() => {
                isLongPress = true;
                cell.classList.remove('pressed');
                if (!this.hasDragged) this.handleLongPress(row, col);
            }, LONG_PRESS);
        };
        const onEnd = (x, y) => {
            if (longPressTimer) { clearTimeout(longPressTimer); longPressTimer = null; }
            if (pressedCell) pressedCell.classList.remove('pressed');
            if (!isLongPress && !this.hasDragged && pressedCell &&
                Math.abs(x - touchStartX) < MOVE_THR && Math.abs(y - touchStartY) < MOVE_THR) {
                this.handleCellTap(parseInt(pressedCell.dataset.row), parseInt(pressedCell.dataset.col));
            }
            isLongPress = false; pressedCell = null;
        };
        const onCancel = () => {
            if (longPressTimer) { clearTimeout(longPressTimer); longPressTimer = null; }
            if (pressedCell) pressedCell.classList.remove('pressed');
            isLongPress = false; pressedCell = null;
        };

        newGb.addEventListener('mousedown',  (e) => onStart(e.target.closest('.cell'), e.clientX, e.clientY));
        newGb.addEventListener('mouseup',    (e) => onEnd(e.clientX, e.clientY));
        newGb.addEventListener('mouseleave', onCancel);
        newGb.addEventListener('touchstart', (e) => {
            if (e.touches.length === 1) onStart(e.target.closest('.cell'), e.touches[0].clientX, e.touches[0].clientY);
        }, { passive:true });
        newGb.addEventListener('touchend', (e) => {
            if (e.changedTouches.length === 1) {
                e.preventDefault();
                onEnd(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
            }
        });
        newGb.addEventListener('touchcancel', onCancel);
        newGb.addEventListener('contextmenu', (e) => e.preventDefault());

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
        if (this.gameOver || this.revealed[row][col]) return;
        if (this.mode === 'dig') this.toggleFlag(row, col);
        else { if (!this.flagged[row][col]) this.digCell(row, col); }
        this.updateDisplay(); this.saveGameState();
    }

    handleCellTap(row, col) {
        if (this.gameOver || this.revealed[row][col]) return;
        if (this.mode === 'dig') {
            if (this.flagged[row][col]) this.toggleFlag(row, col);
            else this.digCell(row, col);
        } else {
            this.toggleFlag(row, col);
        }
        this.updateDisplay(); this.saveGameState();
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

    placeMines(exR, exC) {
        let placed = 0;
        while (placed < this.mines) {
            const r = Math.floor(Math.random() * this.rows);
            const c = Math.floor(Math.random() * this.cols);
            if (this.board[r][c] !== -1 &&
                !(Math.abs(r - exR) <= 1 && Math.abs(c - exC) <= 1)) {
                this.board[r][c] = -1; placed++;
            }
        }
        for (let i = 0; i < this.rows; i++)
            for (let j = 0; j < this.cols; j++)
                if (this.board[i][j] !== -1)
                    this.board[i][j] = this.countAdjacentMines(i, j);
    }

    countAdjacentMines(row, col) {
        let n = 0;
        for (let i = -1; i <= 1; i++) for (let j = -1; j <= 1; j++) {
            const r = row+i, c = col+j;
            if (r>=0 && r<this.rows && c>=0 && c<this.cols && this.board[r][c]===-1) n++;
        }
        return n;
    }

    reveal(row, col) {
        if (row<0||row>=this.rows||col<0||col>=this.cols) return;
        if (this.revealed[row][col]||this.flagged[row][col]) return;
        this.revealed[row][col] = true;
        const cell = this.getCell(row, col);
        if (cell) cell.classList.add('revealed');
        if (this.board[row][col] === -1) { this.gameOver = true; this.endGame(); return; }
        if (this.board[row][col] > 0) {
            if (cell) { cell.textContent = this.board[row][col]; cell.classList.add('n'+this.board[row][col]); }
        } else {
            for (let i=-1;i<=1;i++) for (let j=-1;j<=1;j++)
                if (i!==0||j!==0) setTimeout(()=>this.reveal(row+i,col+j), 18);
        }
    }

    getCell(row, col) {
        return document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
    }

    startTimer() {
        if (this.timerInterval) clearInterval(this.timerInterval);
        this.timerInterval = setInterval(() => {
            this.timer++;
            document.getElementById('time').textContent = this.timer.toString().padStart(3,'0');
        }, 1000);
    }

    updateDisplay() {
        const flagCount = this.flagged.flat().filter(Boolean).length;
        document.getElementById('remaining').textContent = this.mines - flagCount;
        document.getElementById('time').textContent = this.timer.toString().padStart(3,'0');
    }

    endGame() {
        clearInterval(this.timerInterval); this.timerInterval = null;
        this.clearSavedGame();

        let correctFlags = 0, delay = 0;
        for (let i = 0; i < this.rows; i++) for (let j = 0; j < this.cols; j++) {
            const mine = this.board[i][j] === -1;
            const flag = this.flagged[i][j];
            if (mine && flag) {
                correctFlags++;
            } else if (mine && !flag) {
                const d = delay;
                setTimeout(() => {
                    const c = this.getCell(i, j);
                    if (c) { c.classList.add('mine'); c.classList.remove('flagged'); }
                }, d);
                delay += 35;
            } else if (!mine && flag) {
                const d = delay;
                setTimeout(() => {
                    const c = this.getCell(i, j);
                    if (c) c.classList.add('flag-wrong');
                }, d);
                delay += 25;
            }
        }
        const earned = this.awardPoints(correctFlags);
        setTimeout(() => {
            const flagMsg = correctFlags === 1 ? '1 correct flag' : `${correctFlags} correct flags`;
            document.getElementById('modal-title').textContent = 'Game Over';
            document.getElementById('modal-message').textContent = `${flagMsg} · ${this.timer}s survived`;
            document.getElementById('points-earned').textContent = earned > 0 ? `+${earned} points` : 'No points earned';
            document.getElementById('game-over-modal').classList.add('show');
            document.getElementById('modal-restore-btn').classList.add('hidden');
        }, Math.min(delay + 300, 1400));
    }
}

document.addEventListener('DOMContentLoaded', () => new Minesweeper());
