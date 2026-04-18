/* ── CONSTANTS ──────────────────────────────────────────────── */
const NUM_BOARDS = 8;

/* ── SVG ICONS ───────────────────────────────────────────────── */
const FLAG_SVG = `<svg class="cell-svg-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><polygon points="12,4 20,20 4,20"/></svg>`;
const MINE_SVG = `<svg class="cell-svg-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="7" fill="rgba(255,255,255,0.25)"/><line x1="12" y1="3" x2="12" y2="6" stroke="rgba(255,255,255,0.28)" stroke-width="2" stroke-linecap="round"/><line x1="12" y1="18" x2="12" y2="21" stroke="rgba(255,255,255,0.28)" stroke-width="2" stroke-linecap="round"/><line x1="3" y1="12" x2="6" y2="12" stroke="rgba(255,255,255,0.28)" stroke-width="2" stroke-linecap="round"/><line x1="18" y1="12" x2="21" y2="12" stroke="rgba(255,255,255,0.28)" stroke-width="2" stroke-linecap="round"/><line x1="5.6" y1="5.6" x2="7.8" y2="7.8" stroke="rgba(255,255,255,0.28)" stroke-width="2" stroke-linecap="round"/><line x1="16.2" y1="16.2" x2="18.4" y2="18.4" stroke="rgba(255,255,255,0.28)" stroke-width="2" stroke-linecap="round"/><line x1="5.6" y1="18.4" x2="7.8" y2="16.2" stroke="rgba(255,255,255,0.28)" stroke-width="2" stroke-linecap="round"/><line x1="16.2" y1="7.8" x2="18.4" y2="5.6" stroke="rgba(255,255,255,0.28)" stroke-width="2" stroke-linecap="round"/></svg>`;

const FLOAT_SVGS = {
    circle: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="rgba(100,100,200,0.06)"/></svg>`,
    blob:   `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path d="M50,8 C76,8 92,28 92,50 C92,72 72,92 50,92 C28,92 8,70 8,48 C8,24 25,8 50,8" fill="rgba(200,100,100,0.06)"/></svg>`,
    shard:  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><polygon points="50,10 90,50 50,90 10,50" fill="rgba(150,100,200,0.06)"/></svg>`,
};

const MINE_DOT_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 10 10" style="display:inline-block;vertical-align:middle" aria-hidden="true"><circle cx="5" cy="5" r="4.5" fill="currentColor"/></svg>`;

const BOARD_CONFIGS = {
    easy: [
        { cols:8,  rows:10, mines:10 },
        { cols:9,  rows:10, mines:12 },
        { cols:10, rows:11, mines:15 },
        { cols:10, rows:12, mines:18 },
        { cols:11, rows:12, mines:21 },
        { cols:11, rows:13, mines:24 },
        { cols:12, rows:13, mines:27 },
        { cols:12, rows:14, mines:30 },
    ],
    normal: [
        { cols:12, rows:14, mines:26 },
        { cols:12, rows:15, mines:30 },
        { cols:13, rows:16, mines:35 },
        { cols:13, rows:17, mines:40 },
        { cols:14, rows:18, mines:45 },
        { cols:14, rows:19, mines:51 },
        { cols:15, rows:20, mines:57 },
        { cols:16, rows:22, mines:65 },
    ],
    hard: [
        { cols:16, rows:18, mines:50 },
        { cols:16, rows:20, mines:58 },
        { cols:17, rows:21, mines:67 },
        { cols:17, rows:22, mines:75 },
        { cols:18, rows:23, mines:84 },
        { cols:19, rows:24, mines:94 },
        { cols:20, rows:26, mines:104 },
        { cols:22, rows:28, mines:115 },
    ],
};

const DIFF_COLORS = { easy:'#4CAF50', normal:'#2196F3', hard:'#FF9800' };

const DIFFICULTIES = {
    easy:   { key:'easy',   name:'Easy',   locked:false },
    normal: { key:'normal', name:'Normal', locked:false },
    hard:   { key:'hard',   name:'Hard',   unlockCost:800 },
};

/* ── FLOATING BACKGROUND ────────────────────────────────────── */
class FloatingBackground {
    constructor() {
        this.container = document.getElementById('floating-bg');
        this.shapes = []; this.maxShapes = 12; this.init();
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
        const types = ['circle', 'blob', 'shard'];
        const type = types[Math.floor(Math.random() * 3)];
        shape.className = `floating-shape`;
        const size = 30 + Math.random() * 65;
        shape.style.width = `${size}px`; shape.style.height = `${size}px`;
        shape.style.left = `${Math.random() * 100}%`;
        shape.style.animationDuration = `${18 + Math.random() * 14}s`;
        shape.innerHTML = FLOAT_SVGS[type];
        this.container.appendChild(shape);
        this.shapes.push(shape);
        setTimeout(() => {
            const idx = this.shapes.indexOf(shape);
            if (idx > -1) this.shapes.splice(idx, 1);
            if (shape.parentNode) shape.parentNode.removeChild(shape);
        }, 35000);
    }
}

/* ── MINESWEEPER ────────────────────────────────────────────── */
class Minesweeper {
    constructor() {
        /* game board state */
        this.rows = 10; this.cols = 8; this.mines = 10;
        this.board = []; this.revealed = []; this.flagged = [];
        this.gameOver = false; this.firstClick = true;
        this.timer = 0; this.timerInterval = null;
        this.mode = 'dig';
        this.zoomLevel = 1; this.minZoom = 0.5; this.maxZoom = 2.5;
        this.scrollX = 0; this.scrollY = 0;
        this.velocityX = 0; this.velocityY = 0;
        this.isDragging = false; this.hasDragged = false;
        this.dragStartX = 0; this.dragStartY = 0;
        this.lastX = 0; this.lastY = 0;
        this.dragThreshold = 8; this.animationId = null;

        /* meta */
        this.points       = parseInt(localStorage.getItem('ms_points') || '0');
        this.level        = parseInt(localStorage.getItem('ms_level')  || '0');
        this.hardUnlocked = localStorage.getItem('ms_hard_unlocked') === 'true';

        /* roguelike run state */
        this.runState = this._loadRunState();
        /*  runState = { active, difficulty, currentBoard (0-7),
                         unlockedUpTo (0-7), paused, boardState } */

        /* menu UI state */
        this.currentDifficulty = this.runState ? this.runState.difficulty : null;
        this.carouselIndex     = this.runState ? this.runState.currentBoard : 0;

        /* carousel swipe tracking */
        this.cSwipeStartX = 0; this.cSwiping = false;

        this.loadSettings();
        this.bindMenuEvents();
        this.renderDifficultyGrid();
        this.renderLevelBar();
        this.renderCarousel();
        this.refreshMenuButtons();

        new FloatingBackground();
    }

    /* ── RUN STATE ─────────────────────────────────── */
    _loadRunState() {
        try { return JSON.parse(localStorage.getItem('ms_run_state')) || null; }
        catch(e) { return null; }
    }
    _saveRunState() {
        if (this.runState) localStorage.setItem('ms_run_state', JSON.stringify(this.runState));
        else localStorage.removeItem('ms_run_state');
    }
    _clearRunState() {
        this.runState = null;
        localStorage.removeItem('ms_run_state');
    }

    /* ── LEVEL / POINTS ─────────────────────────────── */
    levelUpCost(level) { return 10 * Math.pow(2, level); }
    renderLevelBar() {
        const cost = this.levelUpCost(this.level);
        const pct  = Math.min(1, this.points / cost);
        document.getElementById('level-label').textContent = `LVL ${this.level}`;
        document.getElementById('xp-bar-fill').style.width = `${Math.round(pct * 100)}%`;
        document.getElementById('xp-text').textContent     = `${this.points} / ${cost}`;
        document.getElementById('upgrade-btn').classList.toggle('hidden', this.points < cost);
    }
    awardPoints(n) {
        const earned = n * 10;
        this.points += earned;
        localStorage.setItem('ms_points', this.points);
        this.renderLevelBar();
        return earned;
    }

    /* ── SETTINGS ───────────────────────────────────── */
    loadSettings() {
        const dark = localStorage.getItem('darkMode') === 'true';
        if (dark) { document.body.classList.add('dark-mode'); document.getElementById('dark-mode-toggle').checked = true; }
    }

    /* ── DIFFICULTY GRID ────────────────────────────── */
    renderDifficultyGrid() {
        const hardBox = document.getElementById('diff-hard');
        if (this.hardUnlocked) {
            hardBox.classList.add('hard-unlocked'); hardBox.classList.remove('diff-locked');
        } else {
            hardBox.classList.remove('hard-unlocked'); hardBox.classList.add('diff-locked');
        }
        /* dim grid if run is paused */
        const grid = document.getElementById('difficulty-grid');
        grid.classList.toggle('run-locked', !!(this.runState && this.runState.paused));
    }

    showDiffModal(title, bodyHtml, buttons) {
        document.getElementById('diff-modal-title').textContent = title;
        document.getElementById('diff-modal-body').innerHTML = bodyHtml;
        const wrap = document.getElementById('diff-modal-buttons');
        wrap.innerHTML = '';
        buttons.forEach(b => {
            const btn = document.createElement('button');
            btn.className = `${b.cls} juicy-btn`;
            btn.textContent = b.label;
            btn.onclick = () => { document.getElementById('diff-modal').classList.remove('show'); b.action(); };
            wrap.appendChild(btn);
        });
        document.getElementById('diff-modal').classList.add('show');
    }

    selectDifficulty(key) {
        this.currentDifficulty = key;
        document.querySelectorAll('.diff-box').forEach(b => b.classList.remove('selected'));
        const box = document.getElementById(`diff-${key}`);
        if (box) box.classList.add('selected');
        this.renderCarousel();
        this.refreshMenuButtons();
    }

    onDifficultyClick(key) {
        if (key === 'soon') {
            this.showDiffModal('Coming Soon', 'This difficulty is not available yet.', [
                { label:'OK', cls:'restart-btn', action:() => {} }
            ]); return;
        }
        if (key === 'hard' && !this.hardUnlocked) {
            const canAfford = this.points >= 800;
            this.showDiffModal('Unlock Hard?',
                `Hard difficulty costs <strong>800 points</strong>.<br>You have <strong>${this.points} points</strong>.`,
                [
                    canAfford
                        ? { label:'Unlock', cls:'confirm-btn', action:() => this.unlockHard() }
                        : { label:'Not enough points', cls:'menu-link-btn', action:() => {} },
                    { label:'Cancel', cls:'menu-link-btn', action:() => {} }
                ]); return;
        }
        this.selectDifficulty(key);
    }

    unlockHard() {
        this.points -= 800;
        localStorage.setItem('ms_points', this.points);
        this.hardUnlocked = true;
        localStorage.setItem('ms_hard_unlocked', 'true');
        this.renderLevelBar();
        this.renderDifficultyGrid();
        this.selectDifficulty('hard');
    }

    /* ── CAROUSEL ───────────────────────────────────── */
    getBoardConfig(boardIndex) {
        const diff = this.currentDifficulty || 'easy';
        return BOARD_CONFIGS[diff][boardIndex] || BOARD_CONFIGS.easy[0];
    }

    renderCarousel() {
        const idx        = this.carouselIndex;
        const rs         = this.runState;
        const unlockedUp = rs ? rs.unlockedUpTo : 0;
        const diff       = this.currentDifficulty;
        const diffColor  = diff ? DIFF_COLORS[diff] : '#aaa';

        const makeCard = (boardIdx, slot) => {
            if (boardIdx < 0 || boardIdx >= NUM_BOARDS) return '';
            const cfg       = this.getBoardConfig(boardIdx);
            const isUnlocked = boardIdx <= unlockedUp;
            const isCompleted = rs && boardIdx < rs.currentBoard;
            const isCurrent  = rs && boardIdx === rs.currentBoard && !rs.paused === false;
            const lockedClass = isUnlocked ? (isCompleted ? 'is-completed' : '') : 'is-locked';
            const bandColor   = isCompleted ? '#4CAF50' : (isUnlocked ? diffColor : '#bbb');
            const statusText  = isCompleted ? 'DONE' : (isUnlocked ? (boardIdx === 0 ? 'BOARD 1' : `BOARD ${boardIdx+1}`) : 'LOCKED');
            const numColor    = isUnlocked ? diffColor : '#aaa';

            return `
            <div class="board-card ${lockedClass}">
                <div class="card-band" style="background:${bandColor}">BOARD ${boardIdx+1}</div>
                <div class="card-num" style="color:${isUnlocked ? diffColor : '#aaa'}">${boardIdx+1}</div>
                <div class="card-dims" style="color:${isUnlocked ? '' : 'var(--text-muted)'}">
                    ${isUnlocked ? `${cfg.cols}×${cfg.rows} · ${cfg.mines}${MINE_DOT_SVG}` : 'LOCKED'}
                </div>
            </div>`;
        };

        document.getElementById('slot-left').innerHTML   = makeCard(idx - 1, 'left');
        document.getElementById('slot-center').innerHTML = makeCard(idx, 'center');
        document.getElementById('slot-right').innerHTML  = makeCard(idx + 1, 'right');

        document.getElementById('carousel-counter').textContent = `${idx + 1} / ${NUM_BOARDS}`;

        /* dots */
        const dots = document.getElementById('carousel-dots');
        dots.innerHTML = Array.from({length: NUM_BOARDS}, (_, i) => {
            const isActive    = i === idx;
            const isCompleted = rs && i < rs.currentBoard;
            const isUnlocked  = i <= unlockedUp;
            const cls = isActive ? 'active' : (isCompleted ? 'completed' : (isUnlocked ? 'unlocked' : ''));
            return `<div class="carousel-dot ${cls}" data-dot="${i}"></div>`;
        }).join('');
        dots.querySelectorAll('.carousel-dot').forEach(dot => {
            dot.addEventListener('click', () => {
                this.carouselIndex = parseInt(dot.dataset.dot);
                this.renderCarousel();
                this.updateBoardCounters();
                this.refreshMenuButtons();
            });
        });

        this.updateBoardCounters();
    }

    updateBoardCounters() {
        const cfg = this.getBoardConfig(this.carouselIndex);
        const setVal = (id, val) => {
            const el = document.getElementById(id);
            if (!el) return;
            el.textContent = val;
            el.classList.remove('pop'); void el.offsetWidth; el.classList.add('pop');
            setTimeout(() => el.classList.remove('pop'), 220);
        };
        setVal('cols-value',  cfg.cols);
        setVal('rows-value',  cfg.rows);
        setVal('mines-value', cfg.mines);
    }

    navigateCarousel(dir) {
        const newIdx = this.carouselIndex + dir;
        if (newIdx < 0 || newIdx >= NUM_BOARDS) return;
        this.carouselIndex = newIdx;
        this.renderCarousel();
        this.refreshMenuButtons();
    }

    bindCarouselSwipe() {
        const wrapper = document.getElementById('carousel-wrapper');
        let startX = 0, moved = false;
        const onStart = x => { startX = x; moved = false; };
        const onMove  = x => { if (Math.abs(x - startX) > 10) moved = true; };
        const onEnd   = x => {
            if (!moved) return;
            const diff = x - startX;
            if (diff < -50) this.navigateCarousel(1);
            else if (diff > 50) this.navigateCarousel(-1);
        };
        wrapper.addEventListener('touchstart',  e => onStart(e.touches[0].clientX), {passive:true});
        wrapper.addEventListener('touchmove',   e => onMove(e.touches[0].clientX),  {passive:true});
        wrapper.addEventListener('touchend',    e => onEnd(e.changedTouches[0].clientX), {passive:true});
        wrapper.addEventListener('mousedown',   e => onStart(e.clientX));
        wrapper.addEventListener('mousemove',   e => { if (e.buttons) onMove(e.clientX); });
        wrapper.addEventListener('mouseup',     e => onEnd(e.clientX));
    }

    /* ── MENU BUTTON STATE ──────────────────────────── */
    refreshMenuButtons() {
        const rs         = this.runState;
        const hasPaused  = !!(rs && rs.paused);
        const diff       = this.currentDifficulty;
        const unlockedUp = rs ? rs.unlockedUpTo : 0;
        const isUnlocked = this.carouselIndex <= unlockedUp;

        const playBtn     = document.getElementById('play-btn');
        const continueBtn = document.getElementById('continue-btn');
        const abortBtn    = document.getElementById('abort-btn');

        if (hasPaused) {
            /* run is paused: show Continue + Abort */
            playBtn.classList.add('hidden');
            continueBtn.classList.remove('hidden');
            abortBtn.classList.remove('hidden');
        } else {
            /* no active run: show Start */
            continueBtn.classList.add('hidden');
            abortBtn.classList.add('hidden');
            if (diff && !['cs1','cs2','cs3'].includes(diff)) {
                playBtn.classList.remove('hidden');
                playBtn.classList.toggle('greyed', !isUnlocked);
            } else {
                playBtn.classList.add('hidden');
            }
        }
    }

    /* ── RUN FLOW ───────────────────────────────────── */
    startRun() {
        if (!this.currentDifficulty) return;
        const boardIdx = this.carouselIndex;
        const cfg      = this.getBoardConfig(boardIdx);
        this.runState  = {
            active: true, difficulty: this.currentDifficulty,
            currentBoard: boardIdx, unlockedUpTo: boardIdx,
            paused: false, boardState: null
        };
        this._saveRunState();
        this.rows  = cfg.rows; this.cols = cfg.cols; this.mines = cfg.mines;
        this.transitionToGame(() => {
            this.createFreshBoard();
            this.bindGameEvents();
            this.setupScrolling();
            this.updateBoardIndicator();
        });
    }

    continueRun() {
        if (!this.runState) return;
        const rs = this.runState;
        rs.paused = false;
        this._saveRunState();
        const cfg = this.getBoardConfig(rs.currentBoard);
        this.rows = cfg.rows; this.cols = cfg.cols; this.mines = cfg.mines;
        this.transitionToGame(() => {
            if (rs.boardState) {
                const s = rs.boardState;
                this.rows = s.rows; this.cols = s.cols; this.mines = s.mines;
                this.board = s.board; this.revealed = s.revealed; this.flagged = s.flagged;
                this.timer = s.timer; this.mode = s.mode; this.firstClick = s.firstClick;
                this.gameOver = false;
                const gb = document.getElementById('game-board');
                gb.style.gridTemplateColumns = `repeat(${this.cols}, 1fr)`;
                gb.style.transform = 'scale(1)';
                this.zoomLevel = 1; this.scrollX = 0; this.scrollY = 0;
                document.getElementById('zoom-level').textContent = '100%';
                this.updateBoardPosition();
                this.renderBoard();
                this.renderSavedState();
                this.updateDisplay();
                this.bindGameEvents();
                this.setupScrolling();
                if (!this.firstClick) { if (this.timerInterval) clearInterval(this.timerInterval); this.startTimer(); }
            } else {
                this.createFreshBoard();
                this.bindGameEvents();
                this.setupScrolling();
            }
            this.updateBoardIndicator();
        });
    }

    abortRun() {
        if (this.timerInterval) { clearInterval(this.timerInterval); this.timerInterval = null; }
        this._clearRunState();
        this.runState = null;
        this.carouselIndex = 0;
        this.renderDifficultyGrid();
        this.renderCarousel();
        this.refreshMenuButtons();
    }

    pauseRun() {
        /* save current board state into run state and go to menu */
        if (!this.runState) return;
        const state = {
            rows: this.rows, cols: this.cols, mines: this.mines,
            board: this.board, revealed: this.revealed, flagged: this.flagged,
            timer: this.timer, mode: this.mode, firstClick: this.firstClick
        };
        this.runState.paused = true;
        this.runState.boardState = state;
        this._saveRunState();
    }

    boardComplete() {
        /* called when all non-mine cells are revealed */
        if (this.timerInterval) { clearInterval(this.timerInterval); this.timerInterval = null; }
        const rs       = this.runState;
        const boardNum = rs ? rs.currentBoard + 1 : 1;
        const isLast   = rs && rs.currentBoard === NUM_BOARDS - 1;

        /* count correct flags and award points */
        let correctFlags = 0;
        for (let i = 0; i < this.rows; i++)
            for (let j = 0; j < this.cols; j++)
                if (this.board[i][j] === -1 && this.flagged[i][j]) correctFlags++;
        const earned = this.awardPoints(correctFlags);

        if (isLast) {
            /* run complete */
            this._clearRunState();
            this.runState = null;
            const el = document.getElementById('board-finished-modal');
            document.getElementById('bf-title').textContent = 'Run Complete!';
            document.getElementById('bf-message').textContent = 'All 8 boards cleared! Progression resets.';
            document.getElementById('bf-points').textContent  = earned > 0 ? `+${earned} points` : '';
            document.getElementById('bf-continue-btn').classList.add('hidden');
            document.getElementById('bf-menu-btn').textContent = 'Back to Menu';
            el.classList.add('show');
        } else {
            /* board complete, continue to next */
            if (rs) {
                rs.currentBoard++;
                rs.unlockedUpTo = Math.max(rs.unlockedUpTo, rs.currentBoard);
                rs.boardState = null;
                this._saveRunState();
            }
            const el = document.getElementById('board-finished-modal');
            document.getElementById('bf-title').textContent    = `Board ${boardNum} Complete!`;
            document.getElementById('bf-message').textContent  = `Board ${boardNum} of 8 cleared!`;
            document.getElementById('bf-points').textContent   = earned > 0 ? `+${earned} points` : '';
            document.getElementById('bf-continue-btn').classList.remove('hidden');
            document.getElementById('bf-menu-btn').textContent = 'Menu';
            el.classList.add('show');
        }
    }

    checkWin() {
        for (let i = 0; i < this.rows; i++)
            for (let j = 0; j < this.cols; j++)
                if (!this.revealed[i][j] && this.board[i][j] !== -1) return false;
        return true;
    }

    startNextBoard() {
        document.getElementById('board-finished-modal').classList.remove('show');
        if (!this.runState) { this.showMenu(); return; }
        const cfg = this.getBoardConfig(this.runState.currentBoard);
        this.rows = cfg.rows; this.cols = cfg.cols; this.mines = cfg.mines;
        this.createFreshBoard();
        this.bindGameEvents();
        this.setupScrolling();
        this.updateBoardIndicator();
    }

    updateBoardIndicator() {
        const el = document.getElementById('board-indicator');
        if (!el) return;
        const n = this.runState ? this.runState.currentBoard + 1 : 1;
        el.textContent = `${n}/8`;
    }

    /* ── TRANSITIONS ────────────────────────────────── */
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

    showMenu() {
        if (this.timerInterval) { clearInterval(this.timerInterval); this.timerInterval = null; }
        if (this.animationId)   { cancelAnimationFrame(this.animationId); this.animationId = null; }
        document.getElementById('game-screen').classList.add('hidden');
        document.getElementById('menu-screen').classList.remove('hidden');
        this.carouselIndex = this.runState ? this.runState.currentBoard : 0;
        if (this.runState && this.currentDifficulty) {
            document.querySelectorAll('.diff-box').forEach(b => b.classList.remove('selected'));
            const box = document.getElementById(`diff-${this.currentDifficulty}`);
            if (box) box.classList.add('selected');
        }
        this.renderDifficultyGrid();
        this.renderCarousel();
        this.renderLevelBar();
        this.refreshMenuButtons();
    }

    /* ── MENU EVENTS ────────────────────────────────── */
    bindMenuEvents() {
        /* difficulty boxes */
        document.getElementById('diff-easy')  .addEventListener('click', () => this.onDifficultyClick('easy'));
        document.getElementById('diff-normal').addEventListener('click', () => this.onDifficultyClick('normal'));
        document.getElementById('diff-hard')  .addEventListener('click', () => this.onDifficultyClick('hard'));
        document.getElementById('diff-cs1')   .addEventListener('click', () => this.onDifficultyClick('soon'));
        document.getElementById('diff-cs2')   .addEventListener('click', () => this.onDifficultyClick('soon'));
        document.getElementById('diff-cs3')   .addEventListener('click', () => this.onDifficultyClick('soon'));

        /* play / continue / abort */
        document.getElementById('play-btn').addEventListener('click', () => {
            if (!document.getElementById('play-btn').classList.contains('greyed')) this.startRun();
        });
        document.getElementById('continue-btn').addEventListener('click', () => this.continueRun());
        document.getElementById('abort-btn').addEventListener('click', () => this.abortRun());

        /* extra / feats */
        document.getElementById('extra-btn').addEventListener('click', () =>
            this.showDiffModal('Extra', 'Coming soon.', [{ label:'OK', cls:'restart-btn', action:() => {} }]));
        document.getElementById('feats-btn').addEventListener('click', () =>
            this.showDiffModal('Feats', 'Coming soon.', [{ label:'OK', cls:'restart-btn', action:() => {} }]));

        /* board finished modal */
        document.getElementById('bf-continue-btn').addEventListener('click', () => this.startNextBoard());
        document.getElementById('bf-menu-btn').addEventListener('click', () => {
            document.getElementById('board-finished-modal').classList.remove('show');
            this.showMenu();
        });

        /* game over modal */
        document.getElementById('menu-btn').addEventListener('click', () => {
            document.getElementById('game-over-modal').classList.remove('show');
            document.getElementById('modal-restore-btn').classList.add('hidden');
            this._clearRunState(); this.runState = null;
            this.showMenu();
        });
        document.getElementById('restart-btn').addEventListener('click', () => {
            document.getElementById('game-over-modal').classList.remove('show');
            document.getElementById('modal-restore-btn').classList.add('hidden');
            this._clearRunState(); this.runState = null;
            this.showMenu();
        });
        document.getElementById('modal-hide-btn').addEventListener('click', () => {
            document.getElementById('game-over-modal').classList.remove('show');
            document.getElementById('modal-restore-btn').classList.remove('hidden');
        });
        document.getElementById('modal-restore-btn').addEventListener('click', () => {
            document.getElementById('game-over-modal').classList.add('show');
            document.getElementById('modal-restore-btn').classList.add('hidden');
        });

        /* back button (in game) */
        document.getElementById('back-btn').addEventListener('click', () => {
            this.pauseRun();
            this.showMenu();
        });

        /* zoom */
        document.getElementById('zoom-in') .addEventListener('click', () => this.zoom(0.25));
        document.getElementById('zoom-out').addEventListener('click', () => this.zoom(-0.25));

        /* settings */
        document.getElementById('settings-open-btn').addEventListener('click', () =>
            document.getElementById('settings-modal').classList.add('show'));
        document.getElementById('settings-close-btn').addEventListener('click', () =>
            document.getElementById('settings-modal').classList.remove('show'));
        document.getElementById('settings-modal').addEventListener('click', e => {
            if (e.target === document.getElementById('settings-modal'))
                document.getElementById('settings-modal').classList.remove('show');
        });
        document.getElementById('dark-mode-toggle').addEventListener('change', e => {
            document.body.classList.toggle('dark-mode', e.target.checked);
            localStorage.setItem('darkMode', e.target.checked);
        });

        /* level up */
        document.getElementById('upgrade-btn').addEventListener('click', () => {
            const cost = this.levelUpCost(this.level);
            if (this.points >= cost) {
                this.points -= cost; this.level++;
                localStorage.setItem('ms_points', this.points);
                localStorage.setItem('ms_level', this.level);
                this.renderLevelBar();
            }
        });

        /* carousel swipe */
        this.bindCarouselSwipe();
    }

    /* ── ZOOM ───────────────────────────────────────── */
    zoom(delta) {
        const newZoom = Math.min(this.maxZoom, Math.max(this.minZoom, this.zoomLevel + delta));
        if (newZoom === this.zoomLevel) return;
        this.zoomLevel = newZoom;
        document.getElementById('game-board').style.transform = `scale(${this.zoomLevel})`;
        const el = document.getElementById('zoom-level');
        el.textContent = Math.round(this.zoomLevel * 100) + '%';
        el.classList.add('pop'); setTimeout(() => el.classList.remove('pop'), 140);
        this.clampScroll(); this.updateBoardPosition();
    }

    /* ── BOARD SCROLLING ────────────────────────────── */
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
        newContainer.addEventListener('touchstart', e => { if (e.touches.length===1) handleStart(e.touches[0].clientX, e.touches[0].clientY); }, {passive:true});
        newContainer.addEventListener('touchmove',  e => { if (e.touches.length===1) handleMove(e.touches[0].clientX, e.touches[0].clientY); }, {passive:true});
        newContainer.addEventListener('touchend',   handleEnd, {passive:true});
        newContainer.addEventListener('touchcancel',handleEnd, {passive:true});
        newContainer.addEventListener('mousedown',  e => handleStart(e.clientX, e.clientY));
        newContainer.addEventListener('mousemove',  e => handleMove(e.clientX, e.clientY));
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

    clampScroll() {
        const container = document.getElementById('zoom-container');
        const board     = document.getElementById('game-board');
        if (!container || !board) return;
        const cw = container.clientWidth, ch = container.clientHeight;
        const bw = board.offsetWidth * this.zoomLevel;
        const bh = board.offsetHeight * this.zoomLevel;
        const pad = 40;
        this.scrollX = Math.max(-(Math.max(0, bw - cw) + pad), Math.min(pad, this.scrollX));
        this.scrollY = Math.max(-(Math.max(0, bh - ch) + pad), Math.min(pad, this.scrollY));
    }

    updateBoardPosition() {
        const wrapper = document.getElementById('board-wrapper');
        if (wrapper) wrapper.style.transform = `translate3d(${this.scrollX}px,${this.scrollY}px,0)`;
    }

    /* ── BOARD SETUP ────────────────────────────────── */
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
        this.renderBoard(); this.updateDisplay();
        requestAnimationFrame(() => this.clampScroll());
    }

    renderBoard() {
        const gb = document.getElementById('game-board');
        gb.innerHTML = '';
        for (let i = 0; i < this.rows; i++)
            for (let j = 0; j < this.cols; j++) {
                const cell = document.createElement('button');
                cell.className = 'cell'; cell.dataset.row = i; cell.dataset.col = j;
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
                    if (this.board[i][j] > 0) { cell.textContent = this.board[i][j]; cell.classList.add('n' + this.board[i][j]); }
                } else if (this.flagged[i][j]) { cell.classList.add('flagged'); cell.insertAdjacentHTML('beforeend', FLAG_SVG); }
            }
        const dig = document.getElementById('dig-btn'), flag = document.getElementById('flag-btn');
        if (this.mode === 'dig') { dig.classList.add('active'); flag.classList.remove('active'); }
        else                     { flag.classList.add('active'); dig.classList.remove('active'); }
    }

    /* ── GAME EVENTS ────────────────────────────────── */
    bindGameEvents() {
        const gb = document.getElementById('game-board');
        const newGb = gb.cloneNode(true);
        gb.parentNode.replaceChild(newGb, gb);

        let longPressTimer = null, isLongPress = false, pressedCell = null;
        let touchStartX = 0, touchStartY = 0;
        const LONG = 400, THR = 8;

        const onStart = (cell, x, y) => {
            if (!cell) return;
            isLongPress = false; pressedCell = cell; touchStartX = x; touchStartY = y;
            cell.classList.add('pressed');
            const r = parseInt(cell.dataset.row), c = parseInt(cell.dataset.col);
            longPressTimer = setTimeout(() => {
                isLongPress = true; cell.classList.remove('pressed');
                if (!this.hasDragged) this.handleLongPress(r, c);
            }, LONG);
        };
        const onEnd = (x, y) => {
            if (longPressTimer) { clearTimeout(longPressTimer); longPressTimer = null; }
            if (pressedCell) pressedCell.classList.remove('pressed');
            if (!isLongPress && !this.hasDragged && pressedCell &&
                Math.abs(x - touchStartX) < THR && Math.abs(y - touchStartY) < THR)
                this.handleCellTap(parseInt(pressedCell.dataset.row), parseInt(pressedCell.dataset.col));
            isLongPress = false; pressedCell = null;
        };
        const onCancel = () => {
            if (longPressTimer) { clearTimeout(longPressTimer); longPressTimer = null; }
            if (pressedCell) pressedCell.classList.remove('pressed');
            isLongPress = false; pressedCell = null;
        };

        newGb.addEventListener('mousedown',  e => onStart(e.target.closest('.cell'), e.clientX, e.clientY));
        newGb.addEventListener('mouseup',    e => onEnd(e.clientX, e.clientY));
        newGb.addEventListener('mouseleave', onCancel);
        newGb.addEventListener('touchstart', e => { if (e.touches.length===1) onStart(e.target.closest('.cell'), e.touches[0].clientX, e.touches[0].clientY); }, {passive:true});
        newGb.addEventListener('touchend',   e => { if (e.changedTouches.length===1) { e.preventDefault(); onEnd(e.changedTouches[0].clientX, e.changedTouches[0].clientY); } });
        newGb.addEventListener('touchcancel',onCancel);
        newGb.addEventListener('contextmenu',e => e.preventDefault());

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

    handleLongPress(r, c) {
        if (this.gameOver || this.revealed[r][c]) return;
        if (this.mode === 'dig') this.toggleFlag(r, c);
        else if (!this.flagged[r][c]) { this.digCell(r, c); if (!this.gameOver && this.checkWin()) this.boardComplete(); }
        this.updateDisplay();
        this.saveCurrentBoardToRun();
    }

    handleCellTap(r, c) {
        if (this.gameOver || this.revealed[r][c]) return;
        if (this.mode === 'dig') {
            if (this.flagged[r][c]) this.toggleFlag(r, c);
            else { this.digCell(r, c); if (!this.gameOver && this.checkWin()) this.boardComplete(); }
        } else { this.toggleFlag(r, c); }
        this.updateDisplay();
        this.saveCurrentBoardToRun();
    }

    saveCurrentBoardToRun() {
        if (!this.runState || this.firstClick || this.gameOver) return;
        this.runState.boardState = {
            rows: this.rows, cols: this.cols, mines: this.mines,
            board: this.board, revealed: this.revealed, flagged: this.flagged,
            timer: this.timer, mode: this.mode, firstClick: this.firstClick
        };
        this._saveRunState();
    }

    digCell(r, c) {
        if (this.flagged[r][c]) return;
        if (this.firstClick) { this.firstClick = false; this.placeMines(r, c); this.startTimer(); }
        this.reveal(r, c);
    }

    toggleFlag(r, c) {
        if (this.revealed[r][c]) return;
        this.flagged[r][c] = !this.flagged[r][c];
        const cell = this.getCell(r, c);
        if (cell) {
            cell.classList.toggle('flagged', this.flagged[r][c]);
            const existing = cell.querySelector('.cell-svg-icon');
            if (existing) existing.remove();
            if (this.flagged[r][c]) cell.insertAdjacentHTML('beforeend', FLAG_SVG);
        }
    }

    placeMines(exR, exC) {
        let placed = 0;
        while (placed < this.mines) {
            const r = Math.floor(Math.random() * this.rows);
            const c = Math.floor(Math.random() * this.cols);
            if (this.board[r][c] !== -1 && !(Math.abs(r-exR)<=1 && Math.abs(c-exC)<=1)) {
                this.board[r][c] = -1; placed++;
            }
        }
        for (let i = 0; i < this.rows; i++)
            for (let j = 0; j < this.cols; j++)
                if (this.board[i][j] !== -1)
                    this.board[i][j] = this.countAdjacent(i, j);
    }

    countAdjacent(r, c) {
        let n = 0;
        for (let di = -1; di <= 1; di++) for (let dj = -1; dj <= 1; dj++) {
            const nr = r+di, nc = c+dj;
            if (nr>=0 && nr<this.rows && nc>=0 && nc<this.cols && this.board[nr][nc]===-1) n++;
        }
        return n;
    }

    reveal(r, c) {
        if (r<0||r>=this.rows||c<0||c>=this.cols) return;
        if (this.revealed[r][c]||this.flagged[r][c]) return;
        this.revealed[r][c] = true;
        const cell = this.getCell(r, c);
        if (cell) cell.classList.add('revealed');
        if (this.board[r][c] === -1) { this.gameOver = true; this.endGame(); return; }
        if (this.board[r][c] > 0) {
            if (cell) { cell.textContent = this.board[r][c]; cell.classList.add('n' + this.board[r][c]); }
        } else {
            for (let di=-1;di<=1;di++) for (let dj=-1;dj<=1;dj++)
                if (di!==0||dj!==0) setTimeout(()=>this.reveal(r+di,c+dj),18);
        }
    }

    getCell(r, c) { return document.querySelector(`.cell[data-row="${r}"][data-col="${c}"]`); }

    startTimer() {
        if (this.timerInterval) clearInterval(this.timerInterval);
        this.timerInterval = setInterval(() => {
            this.timer++;
            document.getElementById('time').textContent = this.timer.toString().padStart(3,'0');
        }, 1000);
    }

    updateDisplay() {
        const flags = this.flagged.flat().filter(Boolean).length;
        document.getElementById('remaining').textContent = this.mines - flags;
        document.getElementById('time').textContent = this.timer.toString().padStart(3,'0');
    }

    endGame() {
        clearInterval(this.timerInterval); this.timerInterval = null;
        /* reveal mines + wrong flags */
        let correctFlags = 0, delay = 0;
        for (let i = 0; i < this.rows; i++) for (let j = 0; j < this.cols; j++) {
            const mine = this.board[i][j] === -1, flag = this.flagged[i][j];
            if (mine && flag) { correctFlags++; }
            else if (mine && !flag) {
                const d = delay;
                setTimeout(() => {
                    const c = this.getCell(i,j);
                    if (c) {
                        c.classList.add('mine'); c.classList.remove('flagged');
                        const ex = c.querySelector('.cell-svg-icon'); if (ex) ex.remove();
                        c.insertAdjacentHTML('beforeend', MINE_SVG);
                    }
                }, d);
                delay += 35;
            } else if (!mine && flag) {
                const d = delay;
                setTimeout(() => { const c = this.getCell(i,j); if(c) c.classList.add('flag-wrong'); }, d);
                delay += 25;
            }
        }
        /* clear run state — run over means fresh start */
        this._clearRunState(); this.runState = null;
        const earned = this.awardPoints(correctFlags);
        setTimeout(() => {
            document.getElementById('modal-title').textContent    = 'Run Over';
            document.getElementById('modal-message').textContent  =
                `${correctFlags} correct flag${correctFlags!==1?'s':''} · ${this.timer}s survived`;
            document.getElementById('points-earned').textContent  = earned > 0 ? `+${earned} points` : 'No points earned';
            document.getElementById('game-over-modal').classList.add('show');
            document.getElementById('modal-restore-btn').classList.add('hidden');
        }, Math.min(delay + 300, 1400));
    }
}

document.addEventListener('DOMContentLoaded', () => new Minesweeper());
