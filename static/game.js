/* ── CONSTANTS ──────────────────────────────────────────────── */
const NUM_BOARDS = 8;

/* ── SVG ICONS ───────────────────────────────────────────────── */
const FLAG_SVG = `<svg class="cell-svg-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="10" y="3" width="2" height="18" rx="1"/><path d="M12 4 Q18 7 16 11 Q14 15 12 12 Z" rx="2"/></svg>`;
const MINE_SVG = `<svg class="cell-svg-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="6" fill="rgba(255,255,255,0.28)"/><line x1="12" y1="4" x2="12" y2="7" stroke="rgba(255,255,255,0.3)" stroke-width="2" stroke-linecap="round"/><line x1="12" y1="17" x2="12" y2="20" stroke="rgba(255,255,255,0.3)" stroke-width="2" stroke-linecap="round"/><line x1="4" y1="12" x2="7" y2="12" stroke="rgba(255,255,255,0.3)" stroke-width="2" stroke-linecap="round"/><line x1="17" y1="12" x2="20" y2="12" stroke="rgba(255,255,255,0.3)" stroke-width="2" stroke-linecap="round"/><line x1="6.3" y1="6.3" x2="8.5" y2="8.5" stroke="rgba(255,255,255,0.3)" stroke-width="2" stroke-linecap="round"/><line x1="15.5" y1="15.5" x2="17.7" y2="17.7" stroke="rgba(255,255,255,0.3)" stroke-width="2" stroke-linecap="round"/><line x1="6.3" y1="17.7" x2="8.5" y2="15.5" stroke="rgba(255,255,255,0.3)" stroke-width="2" stroke-linecap="round"/><line x1="15.5" y1="8.5" x2="17.7" y2="6.3" stroke="rgba(255,255,255,0.3)" stroke-width="2" stroke-linecap="round"/></svg>`;

/* ── FLOATING BACKGROUND SVGs ────────────────────────────────── */
const FLOAT_SVGS = {
    circle:  (c) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="44" fill="none" stroke="${c}" stroke-width="6"/></svg>`,
    blob:    (c) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path d="M50,10 C72,10 90,28 90,50 C90,72 70,92 48,90 C26,88 8,70 10,48 C12,26 28,10 50,10" fill="${c}"/></svg>`,
    shard:   (c) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><polygon points="50,12 88,50 50,88 12,50" fill="${c}"/></svg>`,
    ring:    (c) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="36" fill="none" stroke="${c}" stroke-width="10" stroke-linecap="round" stroke-dasharray="60 40"/></svg>`,
    roundsq: (c) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect x="12" y="12" width="76" height="76" rx="20" fill="${c}"/></svg>`,
    cross:   (c) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect x="38" y="10" width="24" height="80" rx="10" fill="${c}"/><rect x="10" y="38" width="80" height="24" rx="10" fill="${c}"/></svg>`,
    tri:     (c) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path d="M50,15 L88,82 Q88,88 82,88 L18,88 Q12,88 12,82 Z" fill="${c}"/></svg>`,
    dot:     (c) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="28" fill="${c}"/></svg>`,
};

const MINE_DOT_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 10 10" style="display:inline-block;vertical-align:middle" aria-hidden="true"><circle cx="5" cy="5" r="4.5" fill="currentColor"/></svg>`;

/* ── SVG ICONS FOR FEATS ──────────────────────────────────── */
const FEAT_ICONS_SVG = {
    board:     `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="4"/><polyline points="9,12 11,14 15,10"/></svg>`,
    streak:    `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2 L4 14 h7 l-1 8 9-12h-7z"/></svg>`,
    collector: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r="9"/></svg>`,
    score:     `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="12,3 15.1,8.3 21,9.3 16.5,13.6 17.6,19.5 12,16.5 6.4,19.5 7.5,13.6 3,9.3 8.9,8.3"/></svg>`,
    score_hi:  `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="12,2 15.1,7.3 21,8.3 16.5,12.6 17.6,18.5 12,15.5 6.4,18.5 7.5,12.6 3,8.3 8.9,7.3"/><circle cx="12" cy="10" r="2" fill="currentColor" stroke="none"/></svg>`,
    level:     `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="22,12 18,12 15,21 9,3 6,12 2,12"/></svg>`,
    level_hi:  `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2 L14 8 L20 8 L15 12 L17 18 L12 14 L7 18 L9 12 L4 8 L10 8 Z"/><line x1="12" y1="2" x2="12" y2="22" stroke-opacity="0"/><line x1="4" y1="22" x2="20" y2="22"/></svg>`,
    lock:      `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="11" width="14" height="10" rx="3"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>`,
};

/* ── BOARD CONFIGS ──────────────────────────────────────────── */
const BOARD_CONFIGS = {
    easy: [
        { cols:8,  rows:10, mines:10 }, { cols:9,  rows:10, mines:12 },
        { cols:10, rows:11, mines:15 }, { cols:10, rows:12, mines:18 },
        { cols:11, rows:12, mines:21 }, { cols:11, rows:13, mines:24 },
        { cols:12, rows:13, mines:27 }, { cols:12, rows:14, mines:30 },
    ],
    normal: [
        { cols:12, rows:14, mines:26 }, { cols:12, rows:15, mines:30 },
        { cols:13, rows:16, mines:35 }, { cols:13, rows:17, mines:40 },
        { cols:14, rows:18, mines:45 }, { cols:14, rows:19, mines:51 },
        { cols:15, rows:20, mines:57 }, { cols:16, rows:22, mines:65 },
    ],
    hard: [
        { cols:16, rows:18, mines:50 }, { cols:16, rows:20, mines:58 },
        { cols:17, rows:21, mines:67 }, { cols:17, rows:22, mines:75 },
        { cols:18, rows:23, mines:84 }, { cols:19, rows:24, mines:94 },
        { cols:20, rows:26, mines:104 },{ cols:22, rows:28, mines:115 },
    ],
};

const DIFF_COLORS = { easy:'#4CAF50', normal:'#2196F3', hard:'#FF9800' };
const DIFFICULTIES = {
    easy:   { key:'easy',   name:'Easy',   locked:false },
    normal: { key:'normal', name:'Normal', locked:false },
    hard:   { key:'hard',   name:'Hard',   unlockCost:800 },
};

/* ── THEMES ─────────────────────────────────────────────────── */
const THEMES = {
    green:  { name:'Green Theme',  accent:'#4CAF50', cost:0 },
    red:    { name:'Red Theme',    accent:'#F44336', cost:150 },
    blue:   { name:'Blue Theme',   accent:'#2196F3', cost:150 },
    yellow: { name:'Yellow Theme', accent:'#FFC107', cost:150 },
    purple: { name:'Purple Theme', accent:'#9C27B0', cost:150 },
};

/* ── FEATS DEFINITIONS ───────────────────────────────────────── */
const FEAT_DEFS = [
    { id:'boards_5',   cat:'board',     name:'Board Clearer I',   desc:'Clear 5 boards total',                iconKey:'board' },
    { id:'boards_10',  cat:'board',     name:'Board Clearer II',  desc:'Clear 10 boards total',               iconKey:'board' },
    { id:'boards_20',  cat:'board',     name:'Board Clearer III', desc:'Clear 20 boards total',               iconKey:'board' },
    { id:'boards_25',  cat:'board',     name:'Board Clearer IV',  desc:'Clear 25 boards total',               iconKey:'board' },
    { id:'consec_10',  cat:'board',     name:'Streak I',          desc:'Clear 10 consecutive boards',         iconKey:'streak' },
    { id:'consec_20',  cat:'board',     name:'Streak II',         desc:'Clear 20 consecutive boards',         iconKey:'streak' },
    { id:'consec_25',  cat:'board',     name:'Streak III',        desc:'Clear 25 consecutive boards',         iconKey:'streak' },
    { id:'score_500',  cat:'score',     name:'500 Points',        desc:'Earn 500 total points',               iconKey:'score' },
    { id:'score_1k',   cat:'score',     name:'1,000 Points',      desc:'Earn 1,000 total points',             iconKey:'score' },
    { id:'score_5k',   cat:'score',     name:'5,000 Points',      desc:'Earn 5,000 total points',             iconKey:'score_hi' },
    { id:'score_10k',  cat:'score',     name:'10,000 Points',     desc:'Earn 10,000 total points',            iconKey:'score_hi' },
    { id:'score_15k',  cat:'score',     name:'15,000 Points',     desc:'Earn 15,000 total points',            iconKey:'score_hi' },
    { id:'level_10',   cat:'level',     name:'Level 10',          desc:'Reach level 10',                      iconKey:'level' },
    { id:'level_15',   cat:'level',     name:'Level 15',          desc:'Reach level 15',                      iconKey:'level' },
    { id:'level_20',   cat:'level',     name:'Level 20',          desc:'Reach level 20',                      iconKey:'level' },
    { id:'level_100',  cat:'level',     name:'Level 100',         desc:'Reach level 100',                     iconKey:'level_hi' },
    { id:'level_250',  cat:'level',     name:'Level 250',         desc:'Reach level 250',                     iconKey:'level_hi' },
    { id:'level_500',  cat:'level',     name:'Level 500',         desc:'Reach level 500',                     iconKey:'level_hi' },
    { id:'all_themes', cat:'collector', name:'Color Collector',   desc:'Purchase all available themes',       iconKey:'collector' },
];

/* ── SOUND ENGINE ───────────────────────────────────────────── */
class SoundEngine {
    constructor() { this.ctx = null; this.muted = false; this.sfxVolume = 0.8; }
    _ctx() {
        try {
            if (!this.ctx) this.ctx = new (window.AudioContext || window.webkitAudioContext)();
            if (this.ctx.state === 'suspended') this.ctx.resume();
            return this.ctx;
        } catch(e) { return null; }
    }
    _tone(freq, type, t0, attack, decay, vol) {
        try {
            const ctx = this._ctx(); if (!ctx) return;
            const v = vol * this.sfxVolume;
            const osc = ctx.createOscillator(), gain = ctx.createGain();
            osc.connect(gain); gain.connect(ctx.destination);
            osc.type = type; osc.frequency.value = freq;
            gain.gain.setValueAtTime(0, t0);
            gain.gain.linearRampToValueAtTime(v, t0 + attack);
            gain.gain.exponentialRampToValueAtTime(0.001, t0 + attack + decay);
            osc.start(t0); osc.stop(t0 + attack + decay + 0.05);
        } catch(e) {}
    }
    _noise(dur) {
        try {
            const ctx = this._ctx(); if (!ctx) return;
            const sr = ctx.sampleRate, n = Math.floor(sr * dur);
            const buf = ctx.createBuffer(1, n, sr), d = buf.getChannelData(0);
            for (let i = 0; i < n; i++) d[i] = (Math.random()*2-1) * Math.pow(1-i/n, 2.2);
            const src = ctx.createBufferSource(), gain = ctx.createGain();
            src.buffer = buf; src.connect(gain); gain.connect(ctx.destination);
            gain.gain.value = 0.35 * this.sfxVolume; src.start(); src.stop(ctx.currentTime + dur);
        } catch(e) {}
    }
    play(sound) {
        if (this.muted || this.sfxVolume === 0) return;
        try {
            const ctx = this._ctx(); if (!ctx) return;
            const t = ctx.currentTime;
            switch(sound) {
                case 'dig':      this._tone(900,'sine',t,0.004,0.06,0.1); break;
                case 'reveal':   this._tone(380,'sine',t,0.002,0.035,0.06); break;
                case 'flag':     this._tone(680,'triangle',t,0.005,0.1,0.09); this._tone(980,'sine',t+0.04,0.003,0.07,0.06); break;
                case 'unflag':   this._tone(420,'sine',t,0.004,0.07,0.07); break;
                case 'mine':     this._noise(0.32); break;
                case 'btn':      this._tone(460,'sine',t,0.003,0.045,0.06); break;
                case 'complete': [523,659,784].forEach((f,i) => this._tone(f,'triangle',t+i*0.1,0.015,0.26,0.13)); break;
                case 'lvlup':    [523,659,784,1047].forEach((f,i) => this._tone(f,'triangle',t+i*0.07,0.012,0.2,0.11)); break;
                case 'purchase': this._tone(1047,'sine',t,0.005,0.16,0.1); this._tone(1319,'sine',t+0.06,0.004,0.16,0.08); break;
                case 'error':    this._tone(180,'sawtooth',t,0.005,0.14,0.08); break;
                case 'redeem':   this._tone(880,'sine',t,0.005,0.1,0.09); this._tone(1100,'sine',t+0.08,0.004,0.12,0.09); this._tone(1320,'sine',t+0.16,0.004,0.18,0.1); break;
                case 'modal':    this._tone(520,'sine',t,0.004,0.08,0.07); break;
                case 'tab':      this._tone(600,'sine',t,0.003,0.05,0.06); break;
            }
        } catch(e) {}
    }
}

/* ── FLOATING BACKGROUND ────────────────────────────────────── */
class FloatingBackground {
    constructor() {
        this.container = document.getElementById('floating-bg');
        this.shapes = []; this.maxShapes = 14; this.init();
    }
    _getThemeColor() {
        const accent = getComputedStyle(document.documentElement)
            .getPropertyValue('--accent').trim() || '#4CAF50';
        return accent;
    }
    _hexToRgb(hex) {
        const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i, '#$1$1$2$2$3$3'));
        return r ? { r: parseInt(r[1],16), g: parseInt(r[2],16), b: parseInt(r[3],16) } : { r:100, g:160, b:200 };
    }
    _makeColor(opacity) {
        const hex = this._getThemeColor();
        const { r, g, b } = this._hexToRgb(hex);
        return `rgba(${r},${g},${b},${opacity})`;
    }
    init() {
        for (let i = 0; i < 6; i++) setTimeout(() => this.spawnShape(), i * 400);
        setInterval(() => this.spawnShape(), 2400);
    }
    spawnShape() {
        if (this.shapes.length >= this.maxShapes) {
            const old = this.shapes.shift();
            if (old && old.parentNode) old.parentNode.removeChild(old);
        }
        const shape = document.createElement('div');
        const keys = Object.keys(FLOAT_SVGS);
        const type = keys[Math.floor(Math.random() * keys.length)];
        shape.className = 'floating-shape';
        const size = 28 + Math.random() * 60;
        shape.style.width = `${size}px`; shape.style.height = `${size}px`;
        shape.style.left = `${Math.random() * 100}%`;
        shape.style.animationDuration = `${16 + Math.random() * 16}s`;
        const opacity = 0.04 + Math.random() * 0.06;
        shape.innerHTML = FLOAT_SVGS[type](this._makeColor(opacity));
        this.container.appendChild(shape);
        this.shapes.push(shape);
        setTimeout(() => {
            const idx = this.shapes.indexOf(shape);
            if (idx > -1) this.shapes.splice(idx, 1);
            if (shape.parentNode) shape.parentNode.removeChild(shape);
        }, 38000);
    }
}

/* ── MINESWEEPER ────────────────────────────────────────────── */
class Minesweeper {
    constructor() {
        /* ── sound ── */
        this.sfx = new SoundEngine();

        /* ── game board state ── */
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

        /* ── save slot ── */
        this.currentSlot = parseInt(localStorage.getItem('ms_save_slot') || '0');

        /* ── meta ── */
        this.points       = parseInt(localStorage.getItem('ms_points') || '0');
        this.level        = parseInt(localStorage.getItem('ms_level')  || '0');
        this.hardUnlocked = localStorage.getItem('ms_hard_unlocked') === 'true';
        this.infiniteCoins = localStorage.getItem('ms_infinite_coins') === 'true';

        /* ── themes ── */
        this.ownedThemes  = JSON.parse(localStorage.getItem('ms_owned_themes') || '["green"]');
        this.activeTheme  = localStorage.getItem('ms_active_theme') || 'green';
        this._previewTheme = null;

        /* ── feats ── */
        this.feats = this._loadFeats();

        /* ── roguelike run state ── */
        this.runState = this._loadRunState();

        /* ── menu UI state ── */
        this.currentDifficulty = this.runState ? this.runState.difficulty : null;
        this.carouselIndex     = this.runState ? this.runState.currentBoard : 0;

        /* ── store / feats tab state ── */
        this.storeTab = 'themes';
        this.featsTab = 'board';

        /* ── carousel swipe ── */
        this.cSwipeStartX = 0; this.cSwiping = false;

        this.applyTheme(this.activeTheme);
        this.loadSettings();
        this.bindMenuEvents();
        this.renderDifficultyGrid();
        this.renderLevelBar();
        this.renderCarousel();
        this.refreshMenuButtons();

        new FloatingBackground();
    }

    /* ══ RUN STATE ═════════════════════════════════════════════ */
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

    /* ══ FEATS ═════════════════════════════════════════════════ */
    _loadFeats() {
        const d = { boardsCleared:0, currentConsecutive:0, bestConsecutive:0, totalEarned:0, completed:{} };
        try {
            const s = localStorage.getItem('ms_feats');
            return s ? { ...d, ...JSON.parse(s) } : d;
        } catch(e) { return d; }
    }
    _saveFeats() { localStorage.setItem('ms_feats', JSON.stringify(this.feats)); }

    _isFeatDone(id) {
        const f = this.feats;
        switch(id) {
            case 'boards_5':   return f.boardsCleared >= 5;
            case 'boards_10':  return f.boardsCleared >= 10;
            case 'boards_20':  return f.boardsCleared >= 20;
            case 'boards_25':  return f.boardsCleared >= 25;
            case 'consec_10':  return f.bestConsecutive >= 10;
            case 'consec_20':  return f.bestConsecutive >= 20;
            case 'consec_25':  return f.bestConsecutive >= 25;
            case 'all_themes': return Object.keys(THEMES).every(k => this.ownedThemes.includes(k));
            case 'score_500':  return f.totalEarned >= 500;
            case 'score_1k':   return f.totalEarned >= 1000;
            case 'score_5k':   return f.totalEarned >= 5000;
            case 'score_10k':  return f.totalEarned >= 10000;
            case 'score_15k':  return f.totalEarned >= 15000;
            case 'level_10':   return this.level >= 10;
            case 'level_15':   return this.level >= 15;
            case 'level_20':   return this.level >= 20;
            case 'level_100':  return this.level >= 100;
            case 'level_250':  return this.level >= 250;
            case 'level_500':  return this.level >= 500;
        }
        return false;
    }

    checkFeats() {
        let anyNew = false;
        for (const def of FEAT_DEFS) {
            if (!this.feats.completed[def.id] && this._isFeatDone(def.id)) {
                this.feats.completed[def.id] = true; anyNew = true;
            }
        }
        if (anyNew) this._saveFeats();
    }

    /* ══ SAVE SYSTEM ══════════════════════════════════════════ */
    _buildSaveData() {
        return {
            points: this.points, level: this.level, hardUnlocked: this.hardUnlocked,
            runState: this.runState, feats: this.feats,
            ownedThemes: this.ownedThemes, activeTheme: this.activeTheme,
            infiniteCoins: this.infiniteCoins,
            darkMode: document.body.classList.contains('dark-mode'),
            timestamp: Date.now()
        };
    }
    saveCurrentToSlot(n) {
        localStorage.setItem(`ms_save_${n}`, JSON.stringify(this._buildSaveData()));
    }
    getSlotData(n) {
        try { return JSON.parse(localStorage.getItem(`ms_save_${n}`)) || null; }
        catch(e) { return null; }
    }
    switchSlot(n) {
        if (n === this.currentSlot) { document.getElementById('saves-modal').classList.remove('show'); return; }
        this.saveCurrentToSlot(this.currentSlot);
        this.currentSlot = n;
        localStorage.setItem('ms_save_slot', n);
        const d = this.getSlotData(n);
        if (d) {
            this.points = d.points || 0;
            this.level  = d.level || 0;
            this.hardUnlocked = d.hardUnlocked || false;
            this.runState = d.runState || null;
            this.feats = { boardsCleared:0, currentConsecutive:0, bestConsecutive:0, totalEarned:0, completed:{}, ...(d.feats||{}) };
            this.ownedThemes = d.ownedThemes || ['green'];
            this.activeTheme = d.activeTheme || 'green';
            this.infiniteCoins = d.infiniteCoins === true;
            if (d.darkMode !== undefined) {
                document.body.classList.toggle('dark-mode', d.darkMode);
                const tog = document.getElementById('dark-mode-toggle');
                if (tog) tog.checked = d.darkMode;
                localStorage.setItem('darkMode', d.darkMode);
            }
        } else {
            this.points = 0; this.level = 0; this.hardUnlocked = false;
            this.runState = null;
            this.feats = { boardsCleared:0, currentConsecutive:0, bestConsecutive:0, totalEarned:0, completed:{} };
            this.ownedThemes = ['green']; this.activeTheme = 'green'; this.infiniteCoins = false;
        }
        localStorage.setItem('ms_points', this.points);
        localStorage.setItem('ms_level', this.level);
        localStorage.setItem('ms_hard_unlocked', this.hardUnlocked);
        localStorage.setItem('ms_owned_themes', JSON.stringify(this.ownedThemes));
        localStorage.setItem('ms_active_theme', this.activeTheme);
        localStorage.setItem('ms_infinite_coins', this.infiniteCoins);
        this.applyTheme(this.activeTheme);
        this.currentDifficulty = this.runState ? this.runState.difficulty : null;
        this.carouselIndex = this.runState ? this.runState.currentBoard : 0;
        this.renderDifficultyGrid();
        this.renderLevelBar();
        this.renderCarousel();
        this.refreshMenuButtons();
        if (this.currentDifficulty) {
            document.querySelectorAll('.diff-box').forEach(b => b.classList.remove('selected'));
            const box = document.getElementById(`diff-${this.currentDifficulty}`);
            if (box) box.classList.add('selected');
        }
        document.getElementById('saves-modal').classList.remove('show');
        this.sfx.play('btn');
    }
    renderSavesModal() {
        const wrap = document.getElementById('save-slots');
        if (!wrap) return;
        wrap.innerHTML = '';
        for (let i = 0; i < 3; i++) {
            const d = this.getSlotData(i);
            const isActive = i === this.currentSlot;
            const isEmpty  = !d;
            const div = document.createElement('div');
            div.className = `save-slot${isActive ? ' active-slot' : ''}${isEmpty ? ' empty-slot' : ''}`;
            if (isEmpty) {
                div.innerHTML = `
                    <div class="save-slot-header">
                        <span class="save-slot-name">Slot ${i+1}</span>
                        <span class="save-slot-badge" style="background:var(--border);color:var(--text-muted)">Empty</span>
                    </div>
                    <span class="save-slot-info">No data yet — click to start fresh</span>`;
            } else {
                const ago = this._timeAgo(d.timestamp);
                const lvl = d.level || 0;
                const pts = d.points || 0;
                const cost = this.levelUpCost(lvl);
                const pct = Math.min(100, Math.round((pts / cost) * 100));
                div.innerHTML = `
                    <div class="save-slot-header">
                        <span class="save-slot-name">Slot ${i+1}</span>
                        ${isActive ? '<span class="save-slot-badge">Active</span>' : ''}
                    </div>
                    <span class="save-slot-info">${(pts).toLocaleString()} pts · ${ago}</span>
                    <div class="save-slot-bar-row">
                        <span class="save-slot-bar-label">LVL ${lvl}</span>
                        <div class="save-slot-bar-wrap">
                            <div class="save-slot-bar-fill" style="width:${pct}%"></div>
                        </div>
                        <span class="save-slot-bar-pts">${pct}%</span>
                    </div>`;
            }
            div.addEventListener('click', () => { this.sfx.play('btn'); this.switchSlot(i); });
            wrap.appendChild(div);
        }
    }
    _timeAgo(ts) {
        if (!ts) return '';
        const s = Math.floor((Date.now() - ts) / 1000);
        if (s < 60) return 'just now';
        if (s < 3600) return `${Math.floor(s/60)}m ago`;
        if (s < 86400) return `${Math.floor(s/3600)}h ago`;
        return `${Math.floor(s/86400)}d ago`;
    }

    /* ══ THEMES ════════════════════════════════════════════════ */
    applyTheme(key) {
        const t = THEMES[key]; if (!t) return;
        document.documentElement.style.setProperty('--accent', t.accent);
    }
    previewTheme(key) {
        this._previewTheme = key;
        const t = THEMES[key]; if (!t) return;
        document.documentElement.style.setProperty('--accent', t.accent);
    }
    revertPreview() {
        this._previewTheme = null;
        this.applyTheme(this.activeTheme);
    }
    selectTheme(key) {
        if (!this.ownedThemes.includes(key)) return;
        this.activeTheme = key;
        localStorage.setItem('ms_active_theme', key);
        this.applyTheme(key);
        this.renderStoreThemes();
    }
    purchaseTheme(key, onDone) {
        const t = THEMES[key]; if (!t) return;
        if (this.ownedThemes.includes(key)) { this.selectTheme(key); if (onDone) onDone(); return; }
        const cost = t.cost;
        if (!this.infiniteCoins && this.points < cost) {
            this.sfx.play('error');
            this.showDiffModal('Not enough points',
                `<span style="color:var(--text2)">${t.name} costs <strong>${cost} points</strong>. You have <strong>${this.points} points</strong>.</span>`,
                [{ label:'OK', cls:'restart-btn', action:()=>{} }]);
            return;
        }
        document.getElementById('purchase-title').textContent = `Buy ${t.name}?`;
        document.getElementById('purchase-body').textContent  = this.infiniteCoins
            ? `You have infinite coins — this is free!`
            : `Cost: ${cost} points · You have: ${this.points} points`;
        document.getElementById('purchase-modal').classList.add('show');
        document.getElementById('purchase-confirm-btn').onclick = () => {
            document.getElementById('purchase-modal').classList.remove('show');
            if (!this.infiniteCoins) { this.points -= cost; localStorage.setItem('ms_points', this.points); }
            this.ownedThemes.push(key);
            localStorage.setItem('ms_owned_themes', JSON.stringify(this.ownedThemes));
            this.selectTheme(key);
            this.renderLevelBar();
            this.checkFeats();
            this.sfx.play('purchase');
            if (onDone) onDone();
        };
        document.getElementById('purchase-cancel-btn').onclick = () => {
            document.getElementById('purchase-modal').classList.remove('show');
            this.sfx.play('btn');
        };
        this.sfx.play('modal');
    }
    renderStoreThemes() {
        const panel = document.getElementById('store-panel-themes');
        if (!panel) return;
        const isDark = document.body.classList.contains('dark-mode');
        /* Use theme-appropriate tones for dark mode swatches */
        const s1 = isDark ? '#1e1e1e' : '#3a3a3a';
        const s2 = isDark ? '#333333' : '#666666';
        const s3 = isDark ? '#4a4a4a' : '#999999';
        panel.innerHTML = `<div class="themes-grid">${Object.entries(THEMES).map(([key, t]) => {
            const owned  = this.ownedThemes.includes(key);
            const active = key === this.activeTheme;
            const pill   = active ? `<span class="theme-cost-pill pill-active">Active</span>`
                         : owned  ? `<span class="theme-cost-pill pill-owned">Owned</span>`
                         :          `<span class="theme-cost-pill">${t.cost} pts</span>`;
            /* Slightly lighten very dark swatches so they're visible against card background */
            const adjustColor = (hex) => {
                if (!isDark) return hex;
                const r = parseInt(hex.slice(1,3),16);
                const g = parseInt(hex.slice(3,5),16);
                const b = parseInt(hex.slice(5,7),16);
                const lum = (r*299+g*587+b*114)/1000;
                if (lum < 25) {
                    const boost = 35;
                    return `rgb(${Math.min(255,r+boost)},${Math.min(255,g+boost)},${Math.min(255,b+boost)})`;
                }
                return hex;
            };
            return `<div class="theme-card${active ? ' theme-active-card' : ''}" data-theme-key="${key}" style="${active ? `border-color:${t.accent};box-shadow:0 0 0 2px ${t.accent}` : ''}">
                <div class="theme-swatches">
                    <div class="swatch" style="background:${adjustColor(s1)}"></div>
                    <div class="swatch" style="background:${adjustColor(s2)}"></div>
                    <div class="swatch" style="background:${adjustColor(s3)}"></div>
                    <div class="swatch" style="background:${t.accent}"></div>
                </div>
                <span class="theme-card-name">${t.name}</span>
                ${pill}
            </div>`;
        }).join('')}</div>`;

        panel.querySelectorAll('.theme-card').forEach(card => {
            const key = card.dataset.themeKey;
            let pressTimer = null, isPreviewing = false;

            const startPress = () => {
                pressTimer = setTimeout(() => {
                    isPreviewing = true;
                    this.previewTheme(key);
                    card.style.boxShadow = `0 0 0 3px ${THEMES[key].accent}`;
                }, 180);
            };
            const endPress = (wasClick) => {
                clearTimeout(pressTimer);
                if (isPreviewing) {
                    this.revertPreview();
                    card.style.boxShadow = '';
                    isPreviewing = false;
                } else if (wasClick) {
                    const owned = this.ownedThemes.includes(key);
                    if (owned) { this.selectTheme(key); this.sfx.play('btn'); }
                    else { this.purchaseTheme(key, null); }
                }
            };

            card.addEventListener('pointerdown', () => { startPress(); });
            card.addEventListener('pointerup',   () => { endPress(true); });
            card.addEventListener('pointerleave',() => { endPress(false); });
            card.addEventListener('contextmenu', e => e.preventDefault());
        });
    }

    /* ══ FEATS UI ══════════════════════════════════════════════ */
    renderFeatsPanel(tab) {
        const list = document.getElementById('feats-list');
        if (!list) return;
        const defs = FEAT_DEFS.filter(d => d.cat === tab);
        list.innerHTML = defs.map(d => {
            const done = !!(this.feats.completed && this.feats.completed[d.id]) || this._isFeatDone(d.id);
            const iconSvg = done
                ? (FEAT_ICONS_SVG[d.iconKey] || FEAT_ICONS_SVG.board)
                : FEAT_ICONS_SVG.lock;
            return `<div class="feat-item ${done ? 'feat-done' : 'feat-locked'}">
                <div class="feat-icon">${iconSvg}</div>
                <div class="feat-text">
                    <span class="feat-name">${d.name}</span>
                    <span class="feat-desc">${d.desc}</span>
                </div>
            </div>`;
        }).join('');
    }

    /* ══ LEVEL / POINTS ════════════════════════════════════════ */
    /* Gradually scaling: starts at 100, increases smoothly */
    levelUpCost(level) {
        return Math.round(100 + level * 30 + level * level * 3);
    }
    renderLevelBar() {
        const cost = this.levelUpCost(this.level);
        const pct  = this.infiniteCoins ? 1 : Math.min(1, this.points / cost);
        document.getElementById('level-label').textContent = `LVL ${this.level}`;
        document.getElementById('xp-bar-fill').style.width = `${Math.round(pct * 100)}%`;
        if (this.infiniteCoins) {
            document.getElementById('xp-text').textContent = `∞ / ${cost}`;
        } else {
            document.getElementById('xp-text').textContent = `${this.points} / ${cost}`;
        }
        document.getElementById('upgrade-btn').classList.toggle('hidden',
            this.infiniteCoins ? false : this.points < cost);
        const pd = document.getElementById('points-display');
        if (pd) pd.textContent = this.infiniteCoins ? '∞' : this.points.toLocaleString();
    }
    awardPoints(n) {
        const earned = n * 10;
        if (!this.infiniteCoins) {
            this.points += earned;
            localStorage.setItem('ms_points', this.points);
        }
        this.feats.totalEarned += earned;
        this._saveFeats();
        this.renderLevelBar();
        this.checkFeats();
        return earned;
    }

    /* ══ SETTINGS ══════════════════════════════════════════════ */
    loadSettings() {
        const dark = localStorage.getItem('darkMode') === 'true';
        if (dark) { document.body.classList.add('dark-mode'); document.getElementById('dark-mode-toggle').checked = true; }
        const vol = parseFloat(localStorage.getItem('ms_sfx_volume') ?? '0.8');
        this.sfx.sfxVolume = vol;
        const slider = document.getElementById('sfx-volume-slider');
        const display = document.getElementById('sfx-vol-display');
        if (slider) slider.value = Math.round(vol * 100);
        if (display) display.textContent = `${Math.round(vol * 100)}%`;
    }

    /* ══ DIFFICULTY GRID ═══════════════════════════════════════ */
    renderDifficultyGrid() {
        const hardBox = document.getElementById('diff-hard');
        if (this.hardUnlocked) {
            hardBox.classList.add('hard-unlocked'); hardBox.classList.remove('diff-locked');
        } else {
            hardBox.classList.remove('hard-unlocked'); hardBox.classList.add('diff-locked');
        }
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
        this.sfx.play('modal');
    }

    selectDifficulty(key) {
        this.currentDifficulty = key;
        document.querySelectorAll('.diff-box').forEach(b => b.classList.remove('selected'));
        const box = document.getElementById(`diff-${key}`);
        if (box) box.classList.add('selected');
        this.renderCarousel();
        this.refreshMenuButtons();
        this.sfx.play('btn');
    }

    onDifficultyClick(key) {
        if (key === 'soon') {
            this.showDiffModal('Coming Soon', 'This difficulty is not available yet.', [
                { label:'OK', cls:'restart-btn', action:() => {} }
            ]); return;
        }
        if (key === 'hard' && !this.hardUnlocked) {
            const canAfford = this.points >= 800 || this.infiniteCoins;
            this.showDiffModal('Unlock Hard?',
                `Hard difficulty costs <strong>800 points</strong>.<br>You have <strong>${this.infiniteCoins ? '∞' : this.points} points</strong>.`,
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
        if (!this.infiniteCoins) { this.points -= 800; localStorage.setItem('ms_points', this.points); }
        this.hardUnlocked = true;
        localStorage.setItem('ms_hard_unlocked', 'true');
        this.renderLevelBar();
        this.renderDifficultyGrid();
        this.selectDifficulty('hard');
        this.sfx.play('purchase');
    }

    /* ══ CAROUSEL ══════════════════════════════════════════════ */
    getBoardConfig(boardIndex) {
        const diff = this.currentDifficulty || 'easy';
        return BOARD_CONFIGS[diff][boardIndex] || BOARD_CONFIGS.easy[0];
    }

    renderCarousel(slideDir) {
        const idx        = this.carouselIndex;
        const rs         = this.runState;
        const unlockedUp = rs ? rs.unlockedUpTo : 0;
        const diff       = this.currentDifficulty;
        const diffColor  = diff ? DIFF_COLORS[diff] : '#aaa';

        const makeCard = (boardIdx) => {
            if (boardIdx < 0 || boardIdx >= NUM_BOARDS) return '';
            const cfg        = this.getBoardConfig(boardIdx);
            const isUnlocked = boardIdx <= unlockedUp;
            const isCompleted= rs && boardIdx < rs.currentBoard;
            const lockedClass= isUnlocked ? (isCompleted ? 'is-completed' : '') : 'is-locked';
            const bandColor  = isCompleted ? '#4CAF50' : (isUnlocked ? diffColor : '#bbb');
            return `
            <div class="board-card ${lockedClass}">
                <div class="card-band" style="background:${bandColor}">BOARD ${boardIdx+1}</div>
                <div class="card-num num-font" style="color:${isUnlocked ? diffColor : '#aaa'}">${boardIdx+1}</div>
                <div class="card-dims" style="color:${isUnlocked ? '' : 'var(--text-muted)'}">
                    ${isUnlocked ? `${cfg.cols}×${cfg.rows} · ${cfg.mines}${MINE_DOT_SVG}` : 'LOCKED'}
                </div>
            </div>`;
        };

        const wrapper = document.getElementById('carousel-wrapper');
        /* Apply slide animation */
        if (slideDir) {
            wrapper.classList.remove('slide-next', 'slide-prev');
            void wrapper.offsetWidth;
            wrapper.classList.add(slideDir === 1 ? 'slide-next' : 'slide-prev');
            setTimeout(() => wrapper.classList.remove('slide-next', 'slide-prev'), 350);
        }

        document.getElementById('slot-left').innerHTML   = makeCard(idx - 1);
        document.getElementById('slot-center').innerHTML = makeCard(idx);
        document.getElementById('slot-right').innerHTML  = makeCard(idx + 1);
        document.getElementById('carousel-counter').textContent = `${idx + 1} / ${NUM_BOARDS}`;

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
                const newIdx = parseInt(dot.dataset.dot);
                const dir = newIdx > this.carouselIndex ? 1 : -1;
                this.carouselIndex = newIdx;
                this.renderCarousel(dir); this.updateBoardCounters(); this.refreshMenuButtons();
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
        this.renderCarousel(dir);
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

    /* ══ MENU BUTTON STATE ═════════════════════════════════════ */
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
            playBtn.classList.add('hidden');
            continueBtn.classList.remove('hidden');
            abortBtn.classList.remove('hidden');
        } else {
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

    /* ══ RUN FLOW ══════════════════════════════════════════════ */
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
        this.sfx.play('btn');
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
        rs.paused = false; this._saveRunState();
        const cfg = this.getBoardConfig(rs.currentBoard);
        this.rows = cfg.rows; this.cols = cfg.cols; this.mines = cfg.mines;
        this.sfx.play('btn');
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
                this.updateCellFontSize();
                this.updateBoardPosition();
                this.renderBoard(); this.renderSavedState(); this.updateDisplay();
                this.bindGameEvents(); this.setupScrolling();
                if (!this.firstClick) { if (this.timerInterval) clearInterval(this.timerInterval); this.startTimer(); }
            } else {
                this.createFreshBoard(); this.bindGameEvents(); this.setupScrolling();
            }
            this.updateBoardIndicator();
        });
    }

    abortRun() {
        if (this.timerInterval) { clearInterval(this.timerInterval); this.timerInterval = null; }
        this._clearRunState();
        this.runState = null;
        this.carouselIndex = 0;
        this.renderDifficultyGrid(); this.renderCarousel(); this.refreshMenuButtons();
        this.sfx.play('btn');
    }

    pauseRun() {
        if (!this.runState) return;
        const state = {
            rows: this.rows, cols: this.cols, mines: this.mines,
            board: this.board, revealed: this.revealed, flagged: this.flagged,
            timer: this.timer, mode: this.mode, firstClick: this.firstClick
        };
        this.runState.paused = true; this.runState.boardState = state;
        this._saveRunState();
    }

    boardComplete() {
        if (this.timerInterval) { clearInterval(this.timerInterval); this.timerInterval = null; }
        const rs       = this.runState;
        const boardNum = rs ? rs.currentBoard + 1 : 1;
        const isLast   = rs && rs.currentBoard === NUM_BOARDS - 1;

        let correctFlags = 0;
        for (let i = 0; i < this.rows; i++)
            for (let j = 0; j < this.cols; j++)
                if (this.board[i][j] === -1 && this.flagged[i][j]) correctFlags++;
        const earned = this.awardPoints(correctFlags);

        this.feats.boardsCleared++;
        this.feats.currentConsecutive++;
        this.feats.bestConsecutive = Math.max(this.feats.bestConsecutive, this.feats.currentConsecutive);
        this._saveFeats(); this.checkFeats();
        this.sfx.play('complete');

        if (isLast) {
            this._clearRunState(); this.runState = null;
            const el = document.getElementById('board-finished-modal');
            document.getElementById('bf-title').textContent = 'Run Complete!';
            document.getElementById('bf-message').textContent = 'All 8 boards cleared! Progression resets.';
            document.getElementById('bf-points').textContent  = earned > 0 ? `+${earned} points` : '';
            document.getElementById('bf-continue-btn').classList.add('hidden');
            document.getElementById('bf-menu-btn').textContent = 'Back to Menu';
            el.classList.add('show');
        } else {
            if (rs) {
                rs.currentBoard++; rs.unlockedUpTo = Math.max(rs.unlockedUpTo, rs.currentBoard);
                rs.boardState = null; this._saveRunState();
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
        this.createFreshBoard(); this.bindGameEvents(); this.setupScrolling(); this.updateBoardIndicator();
    }

    updateBoardIndicator() {
        const el = document.getElementById('board-indicator');
        if (!el) return;
        const n = this.runState ? this.runState.currentBoard + 1 : 1;
        el.textContent = `${n}/8`;
    }

    /* ══ TRANSITIONS ═══════════════════════════════════════════ */
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
        this.renderDifficultyGrid(); this.renderCarousel(); this.renderLevelBar(); this.refreshMenuButtons();
    }

    /* ══ MENU EVENTS ═══════════════════════════════════════════ */
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

        /* ── STORE ── */
        document.getElementById('store-btn').addEventListener('click', () => {
            this.sfx.play('modal');
            this.storeTab = 'themes';
            document.querySelectorAll('#store-tab-bar .tab-btn').forEach(b => b.classList.toggle('active', b.dataset.storeTab === 'themes'));
            document.querySelectorAll('#store-modal .tab-panel').forEach(p => p.classList.remove('active'));
            document.getElementById('store-panel-themes').classList.add('active');
            this.renderStoreThemes();
            document.getElementById('store-modal').classList.add('show');
        });
        document.getElementById('store-close-btn').addEventListener('click', () => {
            document.getElementById('store-modal').classList.remove('show');
            this.revertPreview();
            this.sfx.play('btn');
        });
        document.getElementById('store-modal').addEventListener('click', e => {
            if (e.target === document.getElementById('store-modal')) {
                document.getElementById('store-modal').classList.remove('show');
                this.revertPreview();
            }
        });
        document.querySelectorAll('#store-tab-bar .tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const tab = btn.dataset.storeTab;
                this.sfx.play('tab');
                if (tab === 'cs1' || tab === 'cs2') {
                    document.getElementById('coming-soon-modal').classList.add('show');
                    return;
                }
                this.storeTab = tab;
                document.querySelectorAll('#store-tab-bar .tab-btn').forEach(b => b.classList.toggle('active', b.dataset.storeTab === tab));
                document.querySelectorAll('#store-modal .tab-panel').forEach(p => p.classList.remove('active'));
                document.getElementById(`store-panel-${tab}`).classList.add('active');
                if (tab === 'themes') this.renderStoreThemes();
            });
        });

        /* ── FEATS ── */
        document.getElementById('feats-btn').addEventListener('click', () => {
            this.sfx.play('modal');
            this.featsTab = 'board';
            document.querySelectorAll('#feats-tab-bar .tab-btn').forEach(b => b.classList.toggle('active', b.dataset.featsTab === 'board'));
            this.renderFeatsPanel('board');
            document.getElementById('feats-modal').classList.add('show');
        });
        document.getElementById('feats-close-btn').addEventListener('click', () => {
            document.getElementById('feats-modal').classList.remove('show'); this.sfx.play('btn');
        });
        document.getElementById('feats-modal').addEventListener('click', e => {
            if (e.target === document.getElementById('feats-modal'))
                document.getElementById('feats-modal').classList.remove('show');
        });
        document.querySelectorAll('#feats-tab-bar .tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const tab = btn.dataset.featsTab;
                this.sfx.play('tab');
                this.featsTab = tab;
                document.querySelectorAll('#feats-tab-bar .tab-btn').forEach(b => b.classList.toggle('active', b.dataset.featsTab === tab));
                this.renderFeatsPanel(tab);
            });
        });

        /* ── BOARD FINISHED MODAL ── */
        document.getElementById('bf-continue-btn').addEventListener('click', () => this.startNextBoard());
        document.getElementById('bf-menu-btn').addEventListener('click', () => {
            document.getElementById('board-finished-modal').classList.remove('show');
            this.showMenu();
        });

        /* ── GAME OVER MODAL ── */
        document.getElementById('menu-btn').addEventListener('click', () => {
            document.getElementById('game-over-modal').classList.remove('show');
            document.getElementById('modal-restore-btn').classList.add('hidden');
            this._clearRunState(); this.runState = null; this.showMenu();
        });
        document.getElementById('restart-btn').addEventListener('click', () => {
            document.getElementById('game-over-modal').classList.remove('show');
            document.getElementById('modal-restore-btn').classList.add('hidden');
            this._clearRunState(); this.runState = null; this.showMenu();
        });
        document.getElementById('modal-hide-btn').addEventListener('click', () => {
            document.getElementById('game-over-modal').classList.remove('show');
            document.getElementById('modal-restore-btn').classList.remove('hidden');
        });
        document.getElementById('modal-restore-btn').addEventListener('click', () => {
            document.getElementById('game-over-modal').classList.add('show');
            document.getElementById('modal-restore-btn').classList.add('hidden');
        });

        /* ── BACK BUTTON ── */
        document.getElementById('back-btn').addEventListener('click', () => {
            this.pauseRun(); this.showMenu(); this.sfx.play('btn');
        });

        /* ── ZOOM ── */
        document.getElementById('zoom-in') .addEventListener('click', () => { this.zoom(0.25); this.sfx.play('btn'); });
        document.getElementById('zoom-out').addEventListener('click', () => { this.zoom(-0.25); this.sfx.play('btn'); });

        /* ── SETTINGS ── */
        document.getElementById('settings-open-btn').addEventListener('click', () => {
            document.getElementById('settings-modal').classList.add('show'); this.sfx.play('modal');
        });
        document.getElementById('settings-close-btn').addEventListener('click', () => {
            document.getElementById('settings-modal').classList.remove('show'); this.sfx.play('btn');
        });
        document.getElementById('settings-modal').addEventListener('click', e => {
            if (e.target === document.getElementById('settings-modal'))
                document.getElementById('settings-modal').classList.remove('show');
        });
        document.getElementById('dark-mode-toggle').addEventListener('change', e => {
            document.body.classList.toggle('dark-mode', e.target.checked);
            localStorage.setItem('darkMode', e.target.checked);
            this.sfx.play('btn');
        });

        /* ── SFX VOLUME ── */
        const volSlider = document.getElementById('sfx-volume-slider');
        const volDisplay = document.getElementById('sfx-vol-display');
        if (volSlider) {
            volSlider.addEventListener('input', () => {
                const v = parseInt(volSlider.value) / 100;
                this.sfx.sfxVolume = v;
                localStorage.setItem('ms_sfx_volume', v);
                if (volDisplay) volDisplay.textContent = `${Math.round(v * 100)}%`;
            });
        }

        /* ── SAVE FILES ── */
        document.getElementById('save-file-open-btn').addEventListener('click', () => {
            this.saveCurrentToSlot(this.currentSlot);
            this.renderSavesModal();
            document.getElementById('saves-modal').classList.add('show');
            this.sfx.play('modal');
        });
        document.getElementById('saves-close-btn').addEventListener('click', () => {
            document.getElementById('saves-modal').classList.remove('show'); this.sfx.play('btn');
        });
        document.getElementById('saves-modal').addEventListener('click', e => {
            if (e.target === document.getElementById('saves-modal'))
                document.getElementById('saves-modal').classList.remove('show');
        });

        /* ── REDEEM CODE (inline input) ── */
        const redeemInput = document.getElementById('redeem-input');
        const redeemApply = document.getElementById('redeem-apply-btn');
        if (redeemInput) {
            redeemInput.addEventListener('keydown', e => {
                if (e.key === 'Enter') this._handleRedeem();
            });
        }
        if (redeemApply) {
            redeemApply.addEventListener('click', () => this._handleRedeem());
        }

        /* ── PURCHASE / COMING SOON MODALS ── */
        document.getElementById('coming-soon-close-btn').addEventListener('click', () => {
            document.getElementById('coming-soon-modal').classList.remove('show'); this.sfx.play('btn');
        });

        /* ── LEVEL UP ── */
        document.getElementById('upgrade-btn').addEventListener('click', () => {
            const cost = this.levelUpCost(this.level);
            if (this.points >= cost || this.infiniteCoins) {
                if (!this.infiniteCoins) this.points -= cost;
                this.level++;
                localStorage.setItem('ms_points', this.points);
                localStorage.setItem('ms_level', this.level);
                this.renderLevelBar();
                this.checkFeats();
                this.sfx.play('lvlup');
            }
        });

        /* ── CAROUSEL SWIPE ── */
        this.bindCarouselSwipe();
    }

    _handleRedeem() {
        const input = document.getElementById('redeem-input');
        const msg   = document.getElementById('redeem-msg');
        const code  = (input.value || '').trim().toUpperCase();
        msg.classList.remove('hidden', 'success', 'error');
        if (code === '123ABC') {
            this.infiniteCoins = true;
            localStorage.setItem('ms_infinite_coins', 'true');
            this.renderLevelBar();
            msg.textContent = '✓ Infinite coins activated!';
            msg.classList.add('success');
            input.value = '';
            this.sfx.play('redeem');
        } else if (code === '') {
            msg.classList.add('hidden');
        } else {
            msg.textContent = '✗ Invalid code.';
            msg.classList.add('error');
            this.sfx.play('error');
        }
    }

    /* ══ ZOOM ══════════════════════════════════════════════════ */
    zoom(delta) {
        const newZoom = Math.min(this.maxZoom, Math.max(this.minZoom, this.zoomLevel + delta));
        if (newZoom === this.zoomLevel) return;
        this.zoomLevel = newZoom;
        document.getElementById('game-board').style.transform = `scale(${this.zoomLevel})`;
        const el = document.getElementById('zoom-level');
        el.textContent = Math.round(this.zoomLevel * 100) + '%';
        el.classList.add('pop'); setTimeout(() => el.classList.remove('pop'), 140);
        this.updateCellFontSize();
        this.clampScroll(); this.updateBoardPosition();
    }

    /* Scale cell font size inversely with zoom for readability */
    updateCellFontSize() {
        /* At zoom=1.0: 0.82rem; at zoom=0.5: ~1.06rem; at zoom=2.0: ~0.65rem */
        const base = 0.82;
        const scaled = Math.min(1.4, Math.max(0.5, base / Math.sqrt(this.zoomLevel)));
        document.documentElement.style.setProperty('--cell-font-size', `${scaled.toFixed(3)}rem`);
    }

    /* ══ BOARD SCROLLING ═══════════════════════════════════════ */
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

    /* ══ BOARD SETUP ═══════════════════════════════════════════ */
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
        this.updateCellFontSize();
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

    /* ══ GAME EVENTS ═══════════════════════════════════════════ */
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
            this.sfx.play('btn');
        };
        document.getElementById('flag-btn').onclick = () => {
            this.mode = 'flag';
            document.getElementById('flag-btn').classList.add('active');
            document.getElementById('dig-btn').classList.remove('active');
            this.sfx.play('btn');
        };
    }

    handleLongPress(r, c) {
        if (this.gameOver || this.revealed[r][c]) return;
        if (this.mode === 'dig') this.toggleFlag(r, c);
        else if (!this.flagged[r][c]) { this.digCell(r, c); if (!this.gameOver && this.checkWin()) this.boardComplete(); }
        this.updateDisplay(); this.saveCurrentBoardToRun();
    }

    handleCellTap(r, c) {
        if (this.gameOver || this.revealed[r][c]) return;
        if (this.mode === 'dig') {
            if (this.flagged[r][c]) this.toggleFlag(r, c);
            else { this.digCell(r, c); if (!this.gameOver && this.checkWin()) this.boardComplete(); }
        } else { this.toggleFlag(r, c); }
        this.updateDisplay(); this.saveCurrentBoardToRun();
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
        this.sfx.play('dig');
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
            if (this.flagged[r][c]) {
                cell.insertAdjacentHTML('beforeend', FLAG_SVG);
                this.sfx.play('flag');
            } else {
                this.sfx.play('unflag');
            }
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
            this.sfx.play('reveal');
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
        this.sfx.play('mine');
        this.feats.currentConsecutive = 0; this._saveFeats();

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
