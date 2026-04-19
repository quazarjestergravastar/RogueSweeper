/* ── CONSTANTS ──────────────────────────────────────────────── */
const NUM_BOARDS = 8;
const RANK_LABELS = ['D', 'C', 'B', 'A', 'S', 'Z'];
const RANK_COLORS = { D:'#4CAF50', C:'#2196F3', B:'#FFC107', A:'#FF9800', S:'#F44336', Z:'#9C27B0' };
const RANK_DECAY  = { D:0.045, C:0.075, B:0.115, A:0.165, S:0.260, Z:0.380 };
const RANK_MULT   = { D:1, C:1.5, B:2, A:3, S:5, Z:8 };
const SM_CIRCUMF  = 2 * Math.PI * 20; // ≈ 125.66

/* ── SVG ICONS ───────────────────────────────────────────────── */
const FLAG_SVG = `<svg class="cell-svg-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 4.2 C12.85 4.2 13.6 4.65 14.05 5.38 L20.15 15.55 C21.1 17.15 19.95 19.18 18.1 19.18 H5.9 C4.05 19.18 2.9 17.15 3.85 15.55 L9.95 5.38 C10.4 4.65 11.15 4.2 12 4.2 Z"/></svg>`;
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

/* ── FEAT ICONS ──────────────────────────────────────────────── */
const FEAT_ICONS_SVG = {
    board:     `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="4"/><polyline points="9,12 11,14 15,10"/></svg>`,
    streak:    `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2 L4 14 h7 l-1 8 9-12h-7z"/></svg>`,
    collector: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r="9"/></svg>`,
    score:     `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="12,3 15.1,8.3 21,9.3 16.5,13.6 17.6,19.5 12,16.5 6.4,19.5 7.5,13.6 3,9.3 8.9,8.3"/></svg>`,
    score_hi:  `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="12,2 15.1,7.3 21,8.3 16.5,12.6 17.6,18.5 12,15.5 6.4,18.5 7.5,12.6 3,8.3 8.9,7.3"/><circle cx="12" cy="10" r="2" fill="currentColor" stroke="none"/></svg>`,
    level:     `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="22,12 18,12 15,21 9,3 6,12 2,12"/></svg>`,
    level_hi:  `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2 L14 8 L20 8 L15 12 L17 18 L12 14 L7 18 L9 12 L4 8 L10 8 Z"/><line x1="4" y1="22" x2="20" y2="22"/></svg>`,
    meta:      `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`,
    secret:    `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
    circle:    `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3"/></svg>`,
    lock:      `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="11" width="14" height="10" rx="3"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>`,
    fun:       `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>`,
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

/* ── THEMES (with per-difficulty color theory) ───────────────── */
const THEMES = {
    green:  { name:'Green Theme',  accent:'#4CAF50', cost:0,   diff:{ easy:'#8BC34A', normal:'#4CAF50', hard:'#00695C' } },
    red:    { name:'Red Theme',    accent:'#F44336', cost:150, diff:{ easy:'#FFEB3B', normal:'#FF9800', hard:'#F44336' } },
    blue:   { name:'Blue Theme',   accent:'#2196F3', cost:150, diff:{ easy:'#00BCD4', normal:'#2196F3', hard:'#3F51B5' } },
    yellow: { name:'Yellow Theme', accent:'#FFC107', cost:150, diff:{ easy:'#FFF176', normal:'#FFC107', hard:'#FF8F00' } },
    purple: { name:'Purple Theme', accent:'#9C27B0', cost:150, diff:{ easy:'#CE93D8', normal:'#9C27B0', hard:'#4A148C' } },
    black:  { name:'Black Theme',  accent:'#111111', cost:0, secret:true, diff:{ easy:'#333333', normal:'#111111', hard:'#000000' } },
};

/* ── FEAT DEFINITIONS ────────────────────────────────────────── */
const FEAT_DEFS = [
    /* Board */
    { id:'boards_5',       cat:'board',     name:'Board Clearer I',    desc:'Clear 5 boards total',                    iconKey:'board' },
    { id:'boards_10',      cat:'board',     name:'Board Clearer II',   desc:'Clear 10 boards total',                   iconKey:'board' },
    { id:'boards_20',      cat:'board',     name:'Board Clearer III',  desc:'Clear 20 boards total',                   iconKey:'board' },
    { id:'boards_25',      cat:'board',     name:'Board Clearer IV',   desc:'Clear 25 boards total',                   iconKey:'board' },
    { id:'consec_10',      cat:'board',     name:'Streak I',           desc:'Clear 10 consecutive boards',             iconKey:'streak' },
    { id:'consec_20',      cat:'board',     name:'Streak II',          desc:'Clear 20 consecutive boards',             iconKey:'streak' },
    { id:'consec_25',      cat:'board',     name:'Streak III',         desc:'Clear 25 consecutive boards',             iconKey:'streak' },
    /* Score – run milestones */
    { id:'srun_100',       cat:'score', sub:'run', name:'Style 100',   desc:'Reach 100 style score in a run',          iconKey:'score' },
    { id:'srun_200',       cat:'score', sub:'run', name:'Style 200',   desc:'Reach 200 style score in a run',          iconKey:'score' },
    { id:'srun_350',       cat:'score', sub:'run', name:'Style 350',   desc:'Reach 350 style score in a run',          iconKey:'score' },
    { id:'srun_550',       cat:'score', sub:'run', name:'Style 550',   desc:'Reach 550 style score in a run',          iconKey:'score_hi' },
    { id:'srun_800',       cat:'score', sub:'run', name:'Style 800',   desc:'Reach 800 style score in a run',          iconKey:'score_hi' },
    { id:'srun_1150',      cat:'score', sub:'run', name:'Style 1150',  desc:'Reach 1150 style score in a run',         iconKey:'score_hi' },
    /* Score – board milestones */
    { id:'sboard_25',      cat:'score', sub:'board', name:'Board Style 25',  desc:'Score 25 style in one board',       iconKey:'score' },
    { id:'sboard_50',      cat:'score', sub:'board', name:'Board Style 50',  desc:'Score 50 style in one board',       iconKey:'score' },
    { id:'sboard_100',     cat:'score', sub:'board', name:'Board Style 100', desc:'Score 100 style in one board',      iconKey:'score_hi' },
    { id:'sboard_200',     cat:'score', sub:'board', name:'Board Style 200', desc:'Score 200 style in one board',      iconKey:'score_hi' },
    { id:'sboard_350',     cat:'score', sub:'board', name:'Board Style 350', desc:'Score 350 style in one board',      iconKey:'score_hi' },
    { id:'sboard_500',     cat:'score', sub:'board', name:'Board Style 500', desc:'Score 500 style in one board',      iconKey:'score_hi' },
    /* Level */
    { id:'level_10',       cat:'level',     name:'Level 10',           desc:'Reach level 10',                          iconKey:'level' },
    { id:'level_15',       cat:'level',     name:'Level 15',           desc:'Reach level 15',                          iconKey:'level' },
    { id:'level_20',       cat:'level',     name:'Level 20',           desc:'Reach level 20',                          iconKey:'level' },
    { id:'level_100',      cat:'level',     name:'Level 100',          desc:'Reach level 100',                         iconKey:'level_hi' },
    { id:'level_250',      cat:'level',     name:'Level 250',          desc:'Reach level 250',                         iconKey:'level_hi' },
    { id:'level_500',      cat:'level',     name:'Level 500',          desc:'Reach level 500',                         iconKey:'level_hi' },
    /* Collection */
    { id:'all_themes',     cat:'collector', name:'Color Collector',    desc:'Purchase all available themes',           iconKey:'collector' },
    { id:'fun_code',       cat:'collector', name:'Cheat Enabled',      desc:'Enter a Fun Code',                        iconKey:'fun' },
    { id:'all_boards_done',cat:'collector', name:'Board Completionist',desc:'Complete all board feats',                iconKey:'meta' },
    { id:'all_score_done', cat:'collector', name:'Score Completionist',desc:'Complete all score feats',                iconKey:'meta' },
    { id:'all_level_done', cat:'collector', name:'Level Completionist',desc:'Complete all level feats',                iconKey:'meta' },
    /* Original / Secret (hidden until unlocked) */
    { id:'circle_board',   cat:'original',  name:'Geometric Shift',   desc:'Transform the board into a circle',       iconKey:'circle',  secret:true },
    { id:'score_69',       cat:'original',  name:'Nice.',             desc:'Score exactly 69 style in one action',    iconKey:'score_hi',secret:true },
    { id:'ultrakill',      cat:'original',  name:"AIN'T SEEN NOTHIN'",desc:'Discover the hidden ULTRAKILL Easter egg', iconKey:'secret',  secret:true },
    { id:'ting',           cat:'original',  name:'There Is No Game', desc:'Find the meta-event',                      iconKey:'secret',  secret:true },
    { id:'edgelord_phase', cat:'original',  name:"it's just a phase", desc:'Unlock the black theme',                  iconKey:'secret',  secret:true },
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
    _noise(dur, vol = 0.35) {
        try {
            const ctx = this._ctx(); if (!ctx) return;
            const sr = ctx.sampleRate, n = Math.floor(sr * dur);
            const buf = ctx.createBuffer(1, n, sr), d = buf.getChannelData(0);
            for (let i = 0; i < n; i++) d[i] = (Math.random()*2-1) * Math.pow(1-i/n, 2.2);
            const src = ctx.createBufferSource(), gain = ctx.createGain();
            src.buffer = buf; src.connect(gain); gain.connect(ctx.destination);
            gain.gain.value = vol * this.sfxVolume; src.start(); src.stop(ctx.currentTime + dur);
        } catch(e) {}
    }
    play(sound) {
        if (this.muted || this.sfxVolume === 0) return;
        try {
            const ctx = this._ctx(); if (!ctx) return;
            const t = ctx.currentTime;
            switch(sound) {
                case 'dig':      this._tone(820,'sine',t,0.003,0.042,0.09); this._tone(1160,'triangle',t+0.016,0.002,0.038,0.04); break;
                case 'reveal':   this._tone(440,'sine',t,0.002,0.025,0.055); this._tone(660,'sine',t+0.012,0.001,0.022,0.03); break;
                case 'flag':     this._tone(600,'triangle',t,0.004,0.068,0.08); this._tone(1020,'sine',t+0.032,0.003,0.058,0.06); this._tone(800,'square',t+0.066,0.002,0.04,0.028); this._tone(1400,'sine',t+0.09,0.001,0.03,0.018); break;
                case 'unflag':   this._tone(400,'sine',t,0.004,0.065,0.07); this._tone(280,'triangle',t+0.03,0.003,0.06,0.04); break;
                case 'mine':     this._noise(0.42,0.36); this._tone(110,'sawtooth',t,0.003,0.36,0.14); this._tone(180,'sawtooth',t+0.04,0.003,0.28,0.10); break;
                case 'btn':      this._tone(480,'sine',t,0.003,0.040,0.06); break;
                case 'complete': [392,523,659,784,1047].forEach((f,i) => this._tone(f,'triangle',t+i*0.07,0.012,0.22,0.1)); this._tone(1568,'sine',t+0.33,0.006,0.28,0.08); this._tone(1047,'sine',t+0.38,0.004,0.22,0.07); break;
                case 'lvlup':    [523,659,784,1047,1319].forEach((f,i) => this._tone(f,'triangle',t+i*0.065,0.012,0.19,0.11)); break;
                case 'purchase': this._tone(880,'triangle',t,0.004,0.095,0.09); this._tone(1100,'sine',t+0.048,0.004,0.13,0.09); this._tone(1650,'sine',t+0.11,0.003,0.19,0.08); this._tone(1047,'triangle',t+0.18,0.003,0.14,0.07); break;
                case 'error':    this._tone(160,'sawtooth',t,0.005,0.15,0.09); this._tone(120,'sawtooth',t+0.07,0.004,0.14,0.07); break;
                case 'redeem':   this._tone(880,'sine',t,0.005,0.1,0.09); this._tone(1100,'sine',t+0.08,0.004,0.12,0.09); this._tone(1320,'sine',t+0.16,0.004,0.18,0.1); break;
                case 'modal':    this._tone(540,'sine',t,0.004,0.075,0.07); this._tone(680,'sine',t+0.035,0.003,0.065,0.05); break;
                case 'tab':      this._tone(620,'sine',t,0.003,0.048,0.058); this._tone(780,'sine',t+0.02,0.002,0.038,0.04); break;
                case 'rankup':   this._tone(880,'sine',t,0.005,0.085,0.13); this._tone(1100,'sine',t+0.075,0.004,0.13,0.11); this._tone(1320,'triangle',t+0.15,0.003,0.16,0.09); break;
                case 'quickdig': this._tone(1260,'sine',t,0.003,0.038,0.092); this._tone(1000,'triangle',t+0.028,0.003,0.065,0.075); this._tone(1500,'sine',t+0.052,0.002,0.04,0.04); break;
                case 'ultrakill':this._noise(0.18,0.28); this._tone(200,'sawtooth',t,0.002,0.28,0.20); this._tone(140,'sawtooth',t+0.06,0.003,0.22,0.14); break;
                case 'runover':  this._noise(0.28,0.22); this._tone(240,'triangle',t,0.005,0.20,0.09); this._tone(160,'sine',t+0.10,0.006,0.26,0.07); this._tone(110,'sawtooth',t+0.22,0.004,0.22,0.06); break;
                case 'boardwin': [392,523,659,784,1047,1319].forEach((f,i) => this._tone(f,'triangle',t+i*0.065,0.012,0.28,0.11)); this._tone(1568,'sine',t+0.38,0.006,0.35,0.09); this._tone(2093,'sine',t+0.48,0.005,0.30,0.09); break;
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
        return getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#4CAF50';
    }
    _hexToRgb(hex) {
        const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i, '#$1$1$2$2$3$3'));
        return r ? { r:parseInt(r[1],16), g:parseInt(r[2],16), b:parseInt(r[3],16) } : { r:100,g:160,b:200 };
    }
    _makeColor(opacity) {
        const { r, g, b } = this._hexToRgb(this._getThemeColor());
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
        const keys  = Object.keys(FLOAT_SVGS);
        const type  = keys[Math.floor(Math.random() * keys.length)];
        shape.className = 'floating-shape';
        const size = 28 + Math.random() * 60;
        shape.style.width = `${size}px`; shape.style.height = `${size}px`;
        shape.style.left  = `${Math.random() * 100}%`;
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

/* ── STYLE METER ────────────────────────────────────────────── */
class StyleMeter {
    constructor() {
        this.rankIdx  = 0;
        this.fill     = 0;
        this.score    = 0;
        this.lastActionTime = Date.now();
        this.active   = false;
        this.decayFrame = null;
        this.lastDecayTick = 0;
        this._69Pending = false;

        this.el         = document.getElementById('style-meter');
        this.ringFill   = document.getElementById('sm-ring-fill');
        this.rankLabel  = document.getElementById('sm-rank-letter');
        this.scoreEl    = document.getElementById('sm-score');
        this.rankWrap   = document.getElementById('sm-rank-wrap');
    }
    get rank() { return RANK_LABELS[this.rankIdx]; }
    get color(){ return RANK_COLORS[this.rank]; }

    show() {
        if (!this.el) return;
        this.el.classList.remove('hidden');
        this.active = true;
        this._startDecay();
    }
    hide() {
        if (!this.el) return;
        this.el.classList.add('hidden');
        this.active = false;
        this._stopDecay();
    }
    reset() {
        this.rankIdx = 0; this.fill = 0; this.score = 0;
        this.lastActionTime = Date.now();
        this._update();
    }

    /* Returns { scoreGain, checkFor69 } */
    onAction(type) {
        if (!this.active) return 0;
        const now = Date.now();
        const dt  = (now - this.lastActionTime) / 1000;
        this.lastActionTime = now;
        if (this.el) this.el.classList.remove('is-decaying');
        const mult = RANK_MULT[this.rank];

        let fillBoost = 0, scoreGain = 0;
        if      (type === 'dig')      { fillBoost = 0.08; scoreGain = 1 * mult; }
        else if (type === 'quickdig') { fillBoost = 0.18; scoreGain = 3 * mult; }
        else if (type === 'cascade')  { fillBoost = 0.015; scoreGain = 0.4 * mult; }

        /* Speed bonus */
        if (dt < 1.5) fillBoost += 0.035;
        else if (dt < 3) fillBoost += 0.015;

        this.fill = Math.min(1, this.fill + fillBoost);
        const prevFloor = Math.floor(this.score);
        this.score += scoreGain;
        const newFloor  = Math.floor(this.score);

        /* Check for 69 crossing */
        const hit69 = prevFloor < 69 && newFloor >= 69;

        if (this.fill >= 1) this._rankUp();
        this._update();
        return { scoreGain, hit69 };
    }

    _rankUp() {
        if (this.rankIdx >= RANK_LABELS.length - 1) { this.fill = 1; return; }
        this.rankIdx++;
        this.fill = 0.15;
        if (this.rankWrap) {
            this.rankWrap.classList.remove('rank-bump','rank-decay');
            void this.rankWrap.offsetWidth;
            this.rankWrap.classList.add('rank-bump');
            this.rankWrap.classList.toggle('z-smolder', this.rank === 'Z');
            setTimeout(() => this.rankWrap && this.rankWrap.classList.remove('rank-bump'), 600);
        }
    }
    _rankDown() {
        if (this.rankIdx <= 0) { this.fill = 0; return; }
        this.rankIdx--;
        this.fill = 0.55;
        if (this.rankWrap) {
            this.rankWrap.classList.remove('rank-bump','z-smolder');
            this.rankWrap.classList.add('rank-decay');
            setTimeout(() => this.rankWrap && this.rankWrap.classList.remove('rank-decay'), 800);
        }
    }
    _startDecay() {
        this._stopDecay();
        this.lastDecayTick = performance.now();
        const tick = (ts) => {
            if (!this.active) return;
            const dt = Math.min(0.12, Math.max(0, (ts - this.lastDecayTick) / 1000));
            this.lastDecayTick = ts;
            const rate = RANK_DECAY[this.rank];
            this.fill = Math.max(0, this.fill - rate * dt);
            if (this.el) this.el.classList.add('is-decaying');
            if (this.fill <= 0 && this.rankIdx > 0) this._rankDown();
            this._update();
            this.decayFrame = requestAnimationFrame(tick);
        };
        this.decayFrame = requestAnimationFrame(tick);
    }
    _stopDecay() {
        if (this.decayFrame) { cancelAnimationFrame(this.decayFrame); this.decayFrame = null; }
        if (this.el) this.el.classList.remove('is-decaying');
    }
    _update() {
        if (!this.el) return;
        document.documentElement.style.setProperty('--sm-color', this.color);
        if (this.rankLabel) this.rankLabel.textContent = this.rank;
        if (this.scoreEl)  this.scoreEl.textContent = Math.floor(this.score);
        if (this.ringFill) {
            const offset = Math.max(0, Math.min(1, 1 - this.fill));
            this.ringFill.style.strokeDashoffset = offset;
        }
    }
    getFinalRank() { return this.rank; }
    getScore()     { return Math.floor(this.score); }
}

/* ── FEAT NOTIFICATION QUEUE ────────────────────────────────── */
class FeatNotifyQueue {
    constructor() {
        this.queue   = [];
        this.showing = false;
        this.el      = document.getElementById('feat-notify-container');
    }
    push(def) {
        this.queue.push(def);
        if (!this.showing) this._next();
    }
    _next() {
        if (!this.queue.length) { this.showing = false; return; }
        this.showing = true;
        const def = this.queue.shift();
        const icon = FEAT_ICONS_SVG[def.iconKey] || FEAT_ICONS_SVG.board;
        const el = document.createElement('div');
        el.className = 'feat-notify';
        el.innerHTML = `<div class="feat-notify-icon">${icon}</div>
            <div class="feat-notify-text">
                <span class="feat-notify-title">Feat Unlocked!</span>
                <span class="feat-notify-name">${def.name}</span>
                <span class="feat-notify-desc">${def.desc}</span>
            </div>`;
        if (this.el) this.el.appendChild(el);
        requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('show')));
        setTimeout(() => {
            el.classList.remove('show');
            setTimeout(() => { el.remove(); this._next(); }, 400);
        }, 2800);
    }
}

/* ══════════════════════════════════════════════════════════════ */
/*  MINESWEEPER                                                   */
/* ══════════════════════════════════════════════════════════════ */
class Minesweeper {
    constructor() {
        this.sfx        = new SoundEngine();
        this.styleMeter = new StyleMeter();
        this.notifyQ    = new FeatNotifyQueue();

        /* board state */
        this.rows = 10; this.cols = 8; this.mines = 10;
        this.board = []; this.revealed = []; this.flagged = [];
        this.gameOver = false; this.firstClick = true;
        this.timer = 0; this.timerInterval = null;
        this.mode = 'dig'; this.circleMode = false;
        this.zoomLevel = 1; this.minZoom = 0.5; this.maxZoom = 2.5;
        this.scrollX = 0; this.scrollY = 0;
        this.velocityX = 0; this.velocityY = 0;
        this.isDragging = false; this.hasDragged = false;
        this.dragStartX = 0; this.dragStartY = 0;
        this.lastX = 0; this.lastY = 0;
        this.dragThreshold = 8; this.animationId = null;

        /* style score tracking */
        this.boardStyleScore = 0;
        this.runStyleScore   = 0;

        /* save slot */
        this.currentSlot = parseInt(localStorage.getItem('ms_save_slot') || '0');

        /* meta */
        this.points       = parseInt(localStorage.getItem('ms_points') || '0');
        this.level        = parseInt(localStorage.getItem('ms_level')  || '0');
        this.hardUnlocked = localStorage.getItem('ms_hard_unlocked') === 'true';
        this.infiniteCoins = localStorage.getItem('ms_infinite_coins') === 'true';

        /* themes */
        this.ownedThemes  = JSON.parse(localStorage.getItem('ms_owned_themes') || '["green"]');
        this.activeTheme  = localStorage.getItem('ms_active_theme') || 'green';
        this._previewTheme = null;

        /* feats */
        this.feats = this._loadFeats();
        this.unviewedFeatIds = JSON.parse(localStorage.getItem('ms_unviewed_feats') || '[]');
        this.newFeatItemIds = JSON.parse(localStorage.getItem('ms_new_feat_items') || localStorage.getItem('ms_unviewed_feats') || '[]');

        /* run state */
        this.runState = this._loadRunState();
        this._loadActiveSlotSnapshot();

        /* menu UI */
        this.currentDifficulty = this.runState ? this.runState.difficulty : null;
        this.carouselIndex     = this.runState ? this.runState.currentBoard : 0;
        this.storeTab = 'themes';
        this.featsTab = 'board';
        this.texts = {};
        this._lastTextJson = '';

        /* Easter egg trackers */
        this._redThemeClicks  = [];
        this._saveSwitchTimes = [];
        this._tingTriggered   = false;
        this._tingAnomalySet  = false;

        this.applyTheme(this.activeTheme);
        if (this.infiniteCoins) document.body.classList.add('dev-mode');
        this.loadSettings();
        this.loadTexts();
        this.bindMenuEvents();
        this.renderDifficultyGrid();
        this.renderLevelBar();
        this.renderCarousel();
        this.refreshMenuButtons();
        this._updateNotifDot();
        this._updateTabDots();
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
    _clearRunState() { this.runState = null; localStorage.removeItem('ms_run_state'); }

    /* ══ FEATS ═════════════════════════════════════════════════ */
    _loadFeats() {
        const d = {
            boardsCleared:0, currentConsecutive:0, bestConsecutive:0,
            totalEarned:0, bestRunStyleScore:0, bestBoardStyleScore:0,
            funCodeUsed:false, completed:{}
        };
        try {
            const s = localStorage.getItem('ms_feats');
            return s ? { ...d, ...JSON.parse(s) } : d;
        } catch(e) { return d; }
    }
    _saveFeats() { localStorage.setItem('ms_feats', JSON.stringify(this.feats)); }

    _defaultFeats() {
        return { boardsCleared:0, currentConsecutive:0, bestConsecutive:0, totalEarned:0, bestRunStyleScore:0, bestBoardStyleScore:0, funCodeUsed:false, completed:{} };
    }

    _loadActiveSlotSnapshot() {
        const d = this.getSlotData(this.currentSlot);
        if (!d) return;
        this.points = d.points || 0;
        this.level = d.level || 0;
        this.hardUnlocked = d.hardUnlocked || false;
        this.runState = d.runState || null;
        this.feats = { ...this._defaultFeats(), ...(d.feats || {}) };
        this.ownedThemes = d.ownedThemes || ['green'];
        this.activeTheme = d.activeTheme || 'green';
        this.infiniteCoins = d.infiniteCoins === true;
        this.unviewedFeatIds = d.unviewedFeatIds || [];
        this.newFeatItemIds = d.newFeatItemIds || this.unviewedFeatIds.slice();
        if (d.darkMode !== undefined) {
            document.body.classList.toggle('dark-mode', d.darkMode);
            localStorage.setItem('darkMode', d.darkMode);
        }
    }

    _isFeatDone(id) {
        const f = this.feats;
        const c = f.completed || {};
        const boardFeats  = ['boards_5','boards_10','boards_20','boards_25','consec_10','consec_20','consec_25'];
        const scoreFeats  = ['srun_100','srun_200','srun_350','srun_550','srun_800','srun_1150','sboard_25','sboard_50','sboard_100','sboard_200','sboard_350','sboard_500'];
        const levelFeats  = ['level_10','level_15','level_20','level_100','level_250','level_500'];
        switch(id) {
            case 'boards_5':   return f.boardsCleared >= 5;
            case 'boards_10':  return f.boardsCleared >= 10;
            case 'boards_20':  return f.boardsCleared >= 20;
            case 'boards_25':  return f.boardsCleared >= 25;
            case 'consec_10':  return f.bestConsecutive >= 10;
            case 'consec_20':  return f.bestConsecutive >= 20;
            case 'consec_25':  return f.bestConsecutive >= 25;
            case 'srun_100':   return f.bestRunStyleScore >= 100;
            case 'srun_200':   return f.bestRunStyleScore >= 200;
            case 'srun_350':   return f.bestRunStyleScore >= 350;
            case 'srun_550':   return f.bestRunStyleScore >= 550;
            case 'srun_800':   return f.bestRunStyleScore >= 800;
            case 'srun_1150':  return f.bestRunStyleScore >= 1150;
            case 'sboard_25':  return f.bestBoardStyleScore >= 25;
            case 'sboard_50':  return f.bestBoardStyleScore >= 50;
            case 'sboard_100': return f.bestBoardStyleScore >= 100;
            case 'sboard_200': return f.bestBoardStyleScore >= 200;
            case 'sboard_350': return f.bestBoardStyleScore >= 350;
            case 'sboard_500': return f.bestBoardStyleScore >= 500;
            case 'all_themes': return Object.entries(THEMES).filter(([,t]) => !t.secret).every(([k]) => this.ownedThemes.includes(k));
            case 'fun_code':   return f.funCodeUsed === true;
            case 'all_boards_done': return boardFeats.every(x => c[x] || this._isFeatDone(x));
            case 'all_score_done':  return scoreFeats.every(x => c[x] || this._isFeatDone(x));
            case 'all_level_done':  return levelFeats.every(x => c[x] || this._isFeatDone(x));
            case 'level_10':   return this.level >= 10;
            case 'level_15':   return this.level >= 15;
            case 'level_20':   return this.level >= 20;
            case 'level_100':  return this.level >= 100;
            case 'level_250':  return this.level >= 250;
            case 'level_500':  return this.level >= 500;
            /* secrets only set directly */
            case 'circle_board': case 'score_69': case 'ultrakill': case 'ting': case 'edgelord_phase':
                return c[id] === true;
        }
        return false;
    }

    checkFeats() {
        let anyNew = false;
        for (const def of FEAT_DEFS) {
            if (!this.feats.completed[def.id] && this._isFeatDone(def.id)) {
                this.feats.completed[def.id] = true;
                anyNew = true;
                if (!this.unviewedFeatIds.includes(def.id)) this.unviewedFeatIds.push(def.id);
                if (!this.newFeatItemIds.includes(def.id)) this.newFeatItemIds.push(def.id);
                this.notifyQ.push(def);
            }
        }
        if (anyNew) {
            this._saveFeats();
            this._saveFeatIndicators();
            this._updateNotifDot();
            this._updateTabDots();
        }
    }

    _unlockSecret(id) {
        if (this.feats.completed[id]) return;
        this.feats.completed[id] = true;
        const def = FEAT_DEFS.find(d => d.id === id);
        if (def) {
            if (!this.unviewedFeatIds.includes(id)) this.unviewedFeatIds.push(id);
            if (!this.newFeatItemIds.includes(id)) this.newFeatItemIds.push(id);
            this.notifyQ.push(def);
        }
        this._saveFeats();
        this._saveFeatIndicators();
        this._updateNotifDot();
        this._updateTabDots();
    }

    _updateNotifDot() {
        const dot = document.getElementById('feats-notif-dot');
        if (dot) dot.classList.toggle('hidden', this.unviewedFeatIds.length === 0);
    }

    _saveFeatIndicators() {
        localStorage.setItem('ms_unviewed_feats', JSON.stringify(this.unviewedFeatIds));
        localStorage.setItem('ms_new_feat_items', JSON.stringify(this.newFeatItemIds));
        if (Number.isInteger(this.currentSlot)) this.saveCurrentToSlot(this.currentSlot);
    }

    t(key, fallback = '') {
        return this.texts && this.texts[key] !== undefined ? this.texts[key] : fallback;
    }

    async loadTexts() {
        try {
            const res = await fetch(`/static/text.json?v=${Date.now()}`, { cache: 'no-store' });
            if (!res.ok) return;
            const raw = await res.text();
            if (raw === this._lastTextJson) return;
            this._lastTextJson = raw;
            this.texts = JSON.parse(raw);
            this.applyTexts();
        } catch(e) {}
    }

    applyTexts() {
        document.querySelectorAll('[data-text]').forEach(el => {
            const key = el.dataset.text;
            if (this.texts[key] !== undefined) el.textContent = this.texts[key];
        });
        document.querySelectorAll('[data-placeholder]').forEach(el => {
            const key = el.dataset.placeholder;
            if (this.texts[key] !== undefined) el.setAttribute('placeholder', this.texts[key]);
        });
        if (this.texts.pageTitle) document.title = this.texts.pageTitle;
    }

    /* ══ SAVE SYSTEM ══════════════════════════════════════════ */
    _buildSaveData() {
        return {
            points: this.points, level: this.level, hardUnlocked: this.hardUnlocked,
            runState: this.runState, feats: this.feats,
            ownedThemes: this.ownedThemes, activeTheme: this.activeTheme,
            infiniteCoins: this.infiniteCoins,
            unviewedFeatIds: this.unviewedFeatIds,
            newFeatItemIds: this.newFeatItemIds,
            darkMode: document.body.classList.contains('dark-mode'),
            timestamp: Date.now()
        };
    }
    saveCurrentToSlot(n) { localStorage.setItem(`ms_save_${n}`, JSON.stringify(this._buildSaveData())); }
    getSlotData(n) {
        try { return JSON.parse(localStorage.getItem(`ms_save_${n}`)) || null; }
        catch(e) { return null; }
    }
    switchSlot(n) {
        this._trackSaveSwitch();
        if (n === this.currentSlot) { document.getElementById('saves-modal').classList.remove('show'); return; }
        this.saveCurrentToSlot(this.currentSlot);
        this.currentSlot = n;
        localStorage.setItem('ms_save_slot', n);
        const d = this.getSlotData(n);
        if (d) {
            this.points = d.points || 0; this.level = d.level || 0;
            this.hardUnlocked = d.hardUnlocked || false;
            this.runState = d.runState || null;
            this.feats = { boardsCleared:0, currentConsecutive:0, bestConsecutive:0, totalEarned:0, bestRunStyleScore:0, bestBoardStyleScore:0, funCodeUsed:false, completed:{}, ...(d.feats||{}) };
            this.unviewedFeatIds = d.unviewedFeatIds || [];
            this.newFeatItemIds = d.newFeatItemIds || this.unviewedFeatIds.slice();
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
            this.feats = { boardsCleared:0, currentConsecutive:0, bestConsecutive:0, totalEarned:0, bestRunStyleScore:0, bestBoardStyleScore:0, funCodeUsed:false, completed:{} };
            this.unviewedFeatIds = [];
            this.newFeatItemIds = [];
            this.ownedThemes = ['green']; this.activeTheme = 'green'; this.infiniteCoins = false;
        }
        localStorage.setItem('ms_points', this.points);
        localStorage.setItem('ms_level', this.level);
        localStorage.setItem('ms_hard_unlocked', this.hardUnlocked);
        localStorage.setItem('ms_owned_themes', JSON.stringify(this.ownedThemes));
        localStorage.setItem('ms_active_theme', this.activeTheme);
        localStorage.setItem('ms_infinite_coins', this.infiniteCoins);
        this._saveFeats();
        this._saveFeatIndicators();
        document.body.classList.toggle('dev-mode', this.infiniteCoins);
        this.applyTheme(this.activeTheme);
        this.currentDifficulty = this.runState ? this.runState.difficulty : null;
        this.carouselIndex = this.runState ? this.runState.currentBoard : 0;
        this.renderDifficultyGrid(); this.renderLevelBar(); this.renderCarousel(); this.refreshMenuButtons();
        this._updateNotifDot(); this._updateTabDots();
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
            const isEmpty  = !d && !isActive;
            const div = document.createElement('div');
            div.className = `save-slot${isActive ? ' active-slot' : ''}${isEmpty ? ' empty-slot' : ''}`;
            if (isEmpty) {
                div.innerHTML = `<div class="save-slot-header"><span class="save-slot-name">Slot ${i+1}</span><span class="save-slot-badge" style="background:var(--border);color:var(--text-muted)">Empty</span></div><span class="save-slot-info">No data yet</span>`;
            } else {
                /* For active slot use live values; for others use stored */
                const lvl  = isActive ? this.level : (d && d.level || 0);
                const pts  = isActive ? this.points : (d && d.points || 0);
                const inf  = isActive ? this.infiniteCoins : (d && d.infiniteCoins === true);
                const cost = this.levelUpCost(lvl);
                const pct  = inf ? 100 : Math.min(100, Math.round((pts / cost) * 100));
                const ago  = d && d.timestamp ? this._timeAgo(d.timestamp) : 'just now';
                div.innerHTML = `<div class="save-slot-header"><span class="save-slot-name">Slot ${i+1}</span><span class="save-slot-actions">${isActive ? '<span class="save-slot-badge">Active</span>' : ''}<button class="save-delete-btn juicy-btn" data-delete-slot="${i}">Delete</button></span></div><span class="save-slot-info">${inf ? '∞' : pts.toLocaleString()} pts · ${ago}</span><div class="save-slot-bar-row"><span class="save-slot-bar-label">LVL ${lvl}</span><div class="save-slot-bar-wrap"><div class="save-slot-bar-fill" style="width:${pct}%"></div></div><span class="save-slot-bar-pts">${pct}%</span></div>`;
            }
            div.addEventListener('click', () => { this.sfx.play('btn'); this.switchSlot(i); });
            const del = div.querySelector('.save-delete-btn');
            if (del) del.addEventListener('click', e => { e.stopPropagation(); this.confirmDeleteSlot(i); });
            wrap.appendChild(div);
        }
    }
    confirmDeleteSlot(n) {
        this.showDiffModal(`Delete Slot ${n+1}?`, 'This save file will be permanently removed.', [
            {label:'Delete', cls:'abort-btn', action:()=>this.deleteSlot(n)},
            {label:'Cancel', cls:'menu-link-btn', action:()=>{}}
        ]);
    }
    deleteSlot(n) {
        localStorage.removeItem(`ms_save_${n}`);
        if (n === this.currentSlot) {
            this.points = 0; this.level = 0; this.hardUnlocked = false; this.runState = null;
            this.feats = this._defaultFeats();
            this.unviewedFeatIds = []; this.newFeatItemIds = [];
            this.ownedThemes = ['green']; this.activeTheme = 'green'; this.infiniteCoins = false;
            this.currentDifficulty = null; this.carouselIndex = 0;
            localStorage.setItem('ms_points', this.points);
            localStorage.setItem('ms_level', this.level);
            localStorage.setItem('ms_hard_unlocked', 'false');
            localStorage.setItem('ms_owned_themes', JSON.stringify(this.ownedThemes));
            localStorage.setItem('ms_active_theme', this.activeTheme);
            localStorage.setItem('ms_infinite_coins', 'false');
            this._clearRunState(); this._saveFeats(); this._saveFeatIndicators();
            document.body.classList.remove('dev-mode');
            this.applyTheme(this.activeTheme);
            this.renderDifficultyGrid(); this.renderLevelBar(); this.renderCarousel(); this.refreshMenuButtons();
            this._updateNotifDot(); this._updateTabDots();
        }
        this.renderSavesModal();
        this.sfx.play('error');
    }
    _timeAgo(ts) {
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
        document.documentElement.style.setProperty('--easy-c',   t.diff.easy);
        document.documentElement.style.setProperty('--normal-c', t.diff.normal);
        document.documentElement.style.setProperty('--hard-c',   t.diff.hard);
    }
    previewTheme(key) {
        this._previewTheme = key;
        const t = THEMES[key]; if (!t) return;
        document.documentElement.style.setProperty('--accent', t.accent);
        document.documentElement.style.setProperty('--easy-c',   t.diff.easy);
        document.documentElement.style.setProperty('--normal-c', t.diff.normal);
        document.documentElement.style.setProperty('--hard-c',   t.diff.hard);
    }
    revertPreview() { this._previewTheme = null; this.applyTheme(this.activeTheme); }
    selectTheme(key) {
        if (!this.ownedThemes.includes(key)) return;
        /* ULTRAKILL: red theme clicked 5x in 1 second */
        if (key === 'red') this._trackRedTheme();
        this.activeTheme = key;
        localStorage.setItem('ms_active_theme', key);
        this.applyTheme(key);
        this.renderStoreThemes();
        this.renderDifficultyGrid();
    }
    purchaseTheme(key, onDone) {
        const t = THEMES[key]; if (!t) return;
        if (this.ownedThemes.includes(key)) { this.selectTheme(key); if (onDone) onDone(); return; }
        if (!this.infiniteCoins && this.points < t.cost) {
            this.sfx.play('error');
            this.showDiffModal(this.t('notEnoughPoints','Not enough points'), `<span style="color:var(--text2)">${t.name} costs <strong>${t.cost} points</strong>. You have <strong>${this.points}</strong>.</span>`, [{ label:this.t('ok','OK'), cls:'restart-btn', action:()=>{} }]);
            return;
        }
        document.getElementById('purchase-title').textContent = `Buy ${t.name}?`;
        document.getElementById('purchase-body').textContent  = this.infiniteCoins ? 'You have infinite coins — free!' : `Cost: ${t.cost} pts · You have: ${this.points} pts`;
        document.getElementById('purchase-modal').classList.add('show');
        document.getElementById('purchase-confirm-btn').onclick = () => {
            document.getElementById('purchase-modal').classList.remove('show');
            if (!this.infiniteCoins) { this.points -= t.cost; localStorage.setItem('ms_points', this.points); }
            this.ownedThemes.push(key);
            localStorage.setItem('ms_owned_themes', JSON.stringify(this.ownedThemes));
            this.selectTheme(key); this.renderLevelBar(); this.checkFeats();
            this.sfx.play('purchase');
            const card = document.querySelector(`.theme-card[data-theme-key="${key}"]`);
            if (card) { card.classList.add('purchase-pop'); setTimeout(() => card.classList.remove('purchase-pop'), 450); }
            if (onDone) onDone();
        };
        document.getElementById('purchase-cancel-btn').onclick = () => {
            document.getElementById('purchase-modal').classList.remove('show'); this.sfx.play('btn');
        };
        this.sfx.play('modal');
    }
    renderStoreThemes() {
        const panel = document.getElementById('store-panel-themes');
        if (!panel) return;
        const isDark = document.body.classList.contains('dark-mode');
        const s1 = isDark ? '#1e1e1e' : '#3a3a3a';
        const s2 = isDark ? '#333333' : '#666666';
        const s3 = isDark ? '#4a4a4a' : '#999999';
        const adj = (hex) => {
            if (!isDark) return hex;
            const rv = parseInt(hex.slice(1,3),16), gv = parseInt(hex.slice(3,5),16), bv = parseInt(hex.slice(5,7),16);
            const lum = (rv*299+gv*587+bv*114)/1000;
            if (lum < 25) { const boost=35; return `rgb(${Math.min(255,rv+boost)},${Math.min(255,gv+boost)},${Math.min(255,bv+boost)})`; }
            return hex;
        };
        const entries = Object.entries(THEMES).filter(([key, t]) => !t.secret || this.ownedThemes.includes(key));
        panel.innerHTML = `<div class="themes-grid">${entries.map(([key, t]) => {
            const owned = this.ownedThemes.includes(key);
            const active= key === this.activeTheme;
            const pill  = active ? `<span class="theme-cost-pill pill-active">Active</span>`
                        : owned  ? `<span class="theme-cost-pill pill-owned">Owned</span>`
                        :          `<span class="theme-cost-pill">${t.cost} pts</span>`;
            return `<div class="theme-card${active?' theme-active-card':''}" data-theme-key="${key}" style="${active?`border-color:${t.accent};box-shadow:0 0 0 2px ${t.accent}`:''}">
                <div class="theme-swatches"><div class="swatch" style="background:${adj(s1)}"></div><div class="swatch" style="background:${adj(s2)}"></div><div class="swatch" style="background:${adj(s3)}"></div><div class="swatch" style="background:${t.accent}"></div></div>
                <span class="theme-card-name">${t.name}</span>${pill}</div>`;
        }).join('')}</div>`;

        panel.querySelectorAll('.theme-card').forEach(card => {
            const key = card.dataset.themeKey;
            let pressTimer = null, isPreviewing = false;
            card.addEventListener('pointerdown', () => { pressTimer = setTimeout(() => { isPreviewing=true; this.previewTheme(key); }, 180); });
            card.addEventListener('pointerup',   () => {
                clearTimeout(pressTimer);
                if (isPreviewing) { this.revertPreview(); isPreviewing=false; }
                else { const owned=this.ownedThemes.includes(key); if(owned){this.selectTheme(key);this.sfx.play('btn');}else{this.purchaseTheme(key,null);} }
            });
            card.addEventListener('pointerleave',() => { clearTimeout(pressTimer); if(isPreviewing){this.revertPreview();isPreviewing=false;} });
            card.addEventListener('contextmenu', e => e.preventDefault());
        });
    }

    /* ══ FEATS PANEL ═══════════════════════════════════════════ */
    renderFeatsPanel(tab) {
        const list = document.getElementById('feats-list');
        if (!list) return;
        const isDev = this.infiniteCoins;
        this._markFeatTabSeen(tab);

        if (tab === 'original') {
            const secretDefs = FEAT_DEFS.filter(d => d.cat === 'original');
            const unlockedSecrets = secretDefs.filter(d => this.feats.completed && this.feats.completed[d.id]);
            if (unlockedSecrets.length === 0) {
                list.innerHTML = `<div class="feats-empty-msg">Nothing here yet...</div>`;
                return;
            }
            list.innerHTML = unlockedSecrets.map(d => this._renderFeatItem(d, true, isDev)).join('');
            this._bindFeatItemMarkers(list);
            return;
        }

        if (tab === 'score') {
            const runDefs   = FEAT_DEFS.filter(d => d.cat === 'score' && d.sub === 'run');
            const boardDefs = FEAT_DEFS.filter(d => d.cat === 'score' && d.sub === 'board');
            list.innerHTML =
                `<div class="feats-section-header">Run Score</div>` +
                runDefs.map(d => this._renderFeatItem(d, this._isFeatDone(d.id), isDev)).join('') +
                `<div class="feats-section-header" style="margin-top:8px">Board Score</div>` +
                boardDefs.map(d => this._renderFeatItem(d, this._isFeatDone(d.id), isDev)).join('');
            this._bindFeatItemMarkers(list);
            return;
        }

        if (tab === 'board') {
            const streakDefs = FEAT_DEFS.filter(d => d.cat === 'board' && d.id.startsWith('consec_'));
            const clearDefs = FEAT_DEFS.filter(d => d.cat === 'board' && d.id.startsWith('boards_'));
            list.innerHTML =
                `<div class="feats-section-header">Streaks</div>` +
                streakDefs.map(d => this._renderFeatItem(d, this._isFeatDone(d.id), isDev)).join('') +
                `<div class="feats-section-header" style="margin-top:8px">Board Clears</div>` +
                clearDefs.map(d => this._renderFeatItem(d, this._isFeatDone(d.id), isDev)).join('');
            this._bindFeatItemMarkers(list);
            return;
        }

        const defs = FEAT_DEFS.filter(d => d.cat === tab && !d.sub);
        if (defs.length === 0) {
            list.innerHTML = `<div class="feats-empty-msg">Nothing here yet.</div>`;
            return;
        }
        list.innerHTML = defs.map(d => this._renderFeatItem(d, this._isFeatDone(d.id), isDev)).join('');
        this._bindFeatItemMarkers(list);
    }

    _renderFeatItem(def, done, isDev) {
        const iconSvg = done ? (FEAT_ICONS_SVG[def.iconKey] || FEAT_ICONS_SVG.board) : FEAT_ICONS_SVG.lock;
        const devStyle = isDev && done ? ' dev-feat' : '';
        const newMarker = done && this.newFeatItemIds.includes(def.id) ? '<span class="feat-new-marker"></span>' : '';
        return `<div class="feat-item ${done?'feat-done':'feat-locked'}${devStyle}" data-feat-id="${def.id}">
            <div class="feat-icon">${iconSvg}</div>
            <div class="feat-text">
                <span class="feat-name">${def.name}</span>
                <span class="feat-desc">${def.desc}</span>
            </div>${newMarker}</div>`;
    }

    _markFeatTabSeen(tab) {
        const before = this.unviewedFeatIds.length;
        this.unviewedFeatIds = this.unviewedFeatIds.filter(id => {
            const def = FEAT_DEFS.find(d => d.id === id);
            return def && def.cat !== tab;
        });
        if (before !== this.unviewedFeatIds.length) this._saveFeatIndicators();
        this._updateNotifDot();
        this._updateTabDots();
    }

    _bindFeatItemMarkers(list) {
        list.querySelectorAll('.feat-item[data-feat-id]').forEach(item => {
            item.addEventListener('click', () => this._markFeatItemSeen(item.dataset.featId));
        });
    }

    _markFeatItemSeen(id) {
        const before = this.newFeatItemIds.length + this.unviewedFeatIds.length;
        this.newFeatItemIds = this.newFeatItemIds.filter(x => x !== id);
        this.unviewedFeatIds = this.unviewedFeatIds.filter(x => x !== id);
        const marker = document.querySelector(`.feat-item[data-feat-id="${id}"] .feat-new-marker`);
        if (marker) marker.remove();
        if (before !== this.newFeatItemIds.length + this.unviewedFeatIds.length) this._saveFeatIndicators();
        this._updateNotifDot();
        this._updateTabDots();
    }

    _updateTabDots() {
        document.querySelectorAll('#feats-tab-bar .tab-btn').forEach(btn => {
            const tab = btn.dataset.featsTab;
            let dot = btn.querySelector('.notif-dot');
            if (!dot) { dot = document.createElement('span'); dot.className = 'notif-dot hidden'; btn.appendChild(dot); }
            const hasDot = this.unviewedFeatIds.some(id => {
                const def = FEAT_DEFS.find(d => d.id === id);
                return def && def.cat === tab;
            });
            dot.classList.toggle('hidden', !hasDot);
        });
    }

    /* ══ LEVEL / POINTS ════════════════════════════════════════ */
    levelUpCost(level) { return Math.round(100 + level * 30 + level * level * 3); }
    renderLevelBar() {
        const cost = this.levelUpCost(this.level);
        const pct  = this.infiniteCoins ? 1 : Math.min(1, this.points / cost);
        document.getElementById('level-label').textContent = `LVL ${this.level}`;
        document.getElementById('xp-bar-fill').style.width = `${Math.round(pct*100)}%`;
        document.getElementById('xp-text').textContent = this.infiniteCoins ? `∞ / ${cost}` : `${this.points} / ${cost}`;
        document.getElementById('upgrade-btn').classList.toggle('hidden', !this.infiniteCoins && this.points < cost);
        const pd = document.getElementById('points-display');
        if (pd) pd.textContent = this.infiniteCoins ? '∞' : this.points.toLocaleString();
    }
    awardPoints(n) {
        const earned = n * 10;
        if (!this.infiniteCoins) { this.points += earned; localStorage.setItem('ms_points', this.points); }
        this.feats.totalEarned += earned;
        this._saveFeats(); this.renderLevelBar(); this.checkFeats();
        return earned;
    }

    /* ══ SETTINGS ══════════════════════════════════════════════ */
    loadSettings() {
        const dark = localStorage.getItem('darkMode') === 'true';
        if (dark) { document.body.classList.add('dark-mode'); document.getElementById('dark-mode-toggle').checked = true; }
        const meterRight = localStorage.getItem('ms_style_meter_right') === 'true';
        document.body.classList.toggle('style-meter-right', meterRight);
        const meterToggle = document.getElementById('style-meter-position-toggle');
        if (meterToggle) meterToggle.checked = meterRight;
        const vol = parseFloat(localStorage.getItem('ms_sfx_volume') ?? '0.8');
        this.sfx.sfxVolume = vol;
        const slider  = document.getElementById('sfx-volume-slider');
        const display = document.getElementById('sfx-vol-display');
        if (slider)  slider.value = Math.round(vol * 100);
        if (display) display.textContent = `${Math.round(vol*100)}%`;
    }

    /* ══ DIFFICULTY GRID ═══════════════════════════════════════ */
    renderDifficultyGrid() {
        const hardBox = document.getElementById('diff-hard');
        if (this.hardUnlocked) { hardBox.classList.add('hard-unlocked'); hardBox.classList.remove('diff-locked'); }
        else { hardBox.classList.remove('hard-unlocked'); hardBox.classList.add('diff-locked'); }
        document.getElementById('difficulty-grid').classList.toggle('run-locked', !!this.runState);
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
        if (this.runState) return;
        this.currentDifficulty = key;
        document.querySelectorAll('.diff-box').forEach(b => b.classList.remove('selected'));
        const box = document.getElementById(`diff-${key}`);
        if (box) box.classList.add('selected');
        this.renderCarousel(); this.refreshMenuButtons(); this.sfx.play('btn');
    }

    onDifficultyClick(key) {
        if (this.runState) {
            this.showDiffModal(this.t('difficultyLockedTitle','Difficulty Locked'), this.t('difficultyLockedBody','Finish or abort the current run before changing difficulty.'), [{label:this.t('ok','OK'),cls:'restart-btn',action:()=>{}}]);
            return;
        }
        if (key === 'soon') { this.showDiffModal(this.t('comingSoon','Coming Soon'), this.t('difficultySoon','This difficulty is not available yet.'), [{label:this.t('ok','OK'),cls:'restart-btn',action:()=>{}}]); return; }
        if (key === 'hard' && !this.hardUnlocked) {
            const canAfford = this.points >= 800 || this.infiniteCoins;
            this.showDiffModal(this.t('unlockHardTitle','Unlock Hard?'),`Hard mode costs <strong>800 pts</strong>. You have <strong>${this.infiniteCoins?'∞':this.points}</strong>.`,[
                canAfford ? {label:this.t('unlock','Unlock'),cls:'confirm-btn',action:()=>this.unlockHard()} : {label:this.t('notEnoughPts','Not enough pts'),cls:'menu-link-btn',action:()=>{}},
                {label:this.t('cancel','Cancel'),cls:'menu-link-btn',action:()=>{}}
            ]); return;
        }
        this.selectDifficulty(key);
    }
    unlockHard() {
        if (!this.infiniteCoins) { this.points -= 800; localStorage.setItem('ms_points', this.points); }
        this.hardUnlocked = true; localStorage.setItem('ms_hard_unlocked', 'true');
        this.renderLevelBar(); this.renderDifficultyGrid(); this.selectDifficulty('hard'); this.sfx.play('purchase');
    }

    /* ══ CAROUSEL ══════════════════════════════════════════════ */
    getBoardConfig(boardIdx) {
        const diff = (this.runState && this.runState.difficulty) || this.currentDifficulty || 'easy';
        return BOARD_CONFIGS[diff][boardIdx] || BOARD_CONFIGS.easy[0];
    }
    renderCarousel(slideDir) {
        const idx       = this.carouselIndex;
        const rs        = this.runState;
        const unlocked  = rs ? rs.unlockedUpTo : 0;
        const diff      = rs ? rs.difficulty : this.currentDifficulty;
        const theme     = THEMES[this.activeTheme];
        const diffColor = diff ? (theme ? theme.diff[diff] : '#aaa') : '#aaa';

        const makeCard = (boardIdx) => {
            if (boardIdx < 0 || boardIdx >= NUM_BOARDS) return '';
            const cfg = this.getBoardConfig(boardIdx);
            const isU = boardIdx <= unlocked;
            const isC = rs && boardIdx < rs.currentBoard;
            const isRecent = rs && isC && boardIdx === rs.currentBoard - 1;
            const lockedCls = isU ? (isC ? 'is-completed' : '') : 'is-locked';
            const rankLetter = rs && rs.boardRanks && rs.boardRanks[boardIdx];
            const rankColor  = rankLetter ? RANK_COLORS[rankLetter] : '';
            const bandColor = isRecent && rankColor ? rankColor : (isC ? '#4CAF50' : (isU ? diffColor : '#bbb'));
            const tintBg = isC && rankColor ? `background: color-mix(in srgb, var(--card) 86%, ${rankColor} 14%);` : '';
            const borderStyle = isRecent && rankColor ? `border-color:${rankColor};--recent-rank-color:${rankColor};` : '';
            return `<div class="board-card ${lockedCls}${isRecent?' is-most-recent':''}" style="${tintBg}${borderStyle}">
                <div class="card-band" style="background:${bandColor}">BOARD ${boardIdx+1}</div>
                <div class="card-num num-font" style="color:${isU?diffColor:'#aaa'}">${boardIdx+1}</div>
                <div class="card-dims" style="color:${isU?'':'var(--text-muted)'}">
                    ${isU ? `${cfg.cols}×${cfg.rows} · ${cfg.mines}${MINE_DOT_SVG}` : 'LOCKED'}
                </div>
                ${rankLetter ? `<div class="card-rank-badge" style="--rank-color:${rankColor}">${rankLetter}</div>` : ''}
            </div>`;
        };

        const wrapper = document.getElementById('carousel-wrapper');
        if (slideDir) {
            wrapper.classList.remove('slide-next','slide-prev');
            void wrapper.offsetWidth;
            wrapper.classList.add(slideDir === 1 ? 'slide-next' : 'slide-prev');
            setTimeout(() => wrapper.classList.remove('slide-next','slide-prev'), 380);
        }

        document.getElementById('slot-left').innerHTML   = makeCard(idx - 1);
        document.getElementById('slot-center').innerHTML = makeCard(idx);
        document.getElementById('slot-right').innerHTML  = makeCard(idx + 1);
        document.getElementById('carousel-counter').textContent = `${idx + 1} / ${NUM_BOARDS}`;

        const dots = document.getElementById('carousel-dots');
        dots.innerHTML = Array.from({length: NUM_BOARDS}, (_,i) => {
            const isA = i === idx;
            const isC = rs && i < rs.currentBoard;
            const isU = i <= unlocked;
            const cls = isA ? 'active' : (isC ? 'completed' : (isU ? 'unlocked' : ''));
            return `<div class="carousel-dot ${cls}" data-dot="${i}"></div>`;
        }).join('');
        dots.querySelectorAll('.carousel-dot').forEach(dot => {
            dot.addEventListener('click', () => {
                const ni = parseInt(dot.dataset.dot);
                const dir = ni > this.carouselIndex ? 1 : -1;
                this.carouselIndex = ni;
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
        setVal('cols-value', cfg.cols); setVal('rows-value', cfg.rows); setVal('mines-value', cfg.mines);
    }

    navigateCarousel(dir) {
        const ni = this.carouselIndex + dir;
        if (ni < 0 || ni >= NUM_BOARDS) return;
        this.carouselIndex = ni;
        this.renderCarousel(dir); this.refreshMenuButtons();
    }

    bindCarouselSwipe() {
        const wrapper = document.getElementById('carousel-wrapper');
        let startX = 0, moved = false;
        wrapper.addEventListener('touchstart',  e => { startX=e.touches[0].clientX; moved=false; }, {passive:true});
        wrapper.addEventListener('touchmove',   e => { if(Math.abs(e.touches[0].clientX-startX)>10) moved=true; }, {passive:true});
        wrapper.addEventListener('touchend',    e => { if(!moved) return; const dx=e.changedTouches[0].clientX-startX; if(dx<-50) this.navigateCarousel(1); else if(dx>50) this.navigateCarousel(-1); });
        wrapper.addEventListener('mousedown',   e => { startX=e.clientX; moved=false; });
        wrapper.addEventListener('mousemove',   e => { if(e.buttons&&Math.abs(e.clientX-startX)>10) moved=true; });
        wrapper.addEventListener('mouseup',     e => { if(!moved) return; const dx=e.clientX-startX; if(dx<-50) this.navigateCarousel(1); else if(dx>50) this.navigateCarousel(-1); });
    }

    /* ══ MENU BUTTONS ══════════════════════════════════════════ */
    refreshMenuButtons() {
        const rs = this.runState, hasRun = !!rs;
        const diff = this.currentDifficulty;
        const unlocked = rs ? rs.unlockedUpTo : 0;
        const playBtn = document.getElementById('play-btn'), contBtn = document.getElementById('continue-btn'), abortBtn = document.getElementById('abort-btn');
        if (hasRun) {
            playBtn.classList.add('hidden'); contBtn.classList.remove('hidden'); abortBtn.classList.remove('hidden');
        } else {
            contBtn.classList.add('hidden'); abortBtn.classList.add('hidden');
            if (diff && !['cs1','cs2','cs3'].includes(diff)) {
                playBtn.classList.remove('hidden');
                playBtn.classList.toggle('greyed', this.carouselIndex > unlocked);
            } else playBtn.classList.add('hidden');
        }
    }

    /* ══ RUN FLOW ══════════════════════════════════════════════ */
    startRun() {
        if (this.runState) return;
        if (!this.currentDifficulty) return;
        const boardIdx = this.carouselIndex;
        const cfg = this.getBoardConfig(boardIdx);
        this.runState = { active:true, difficulty:this.currentDifficulty, currentBoard:boardIdx, unlockedUpTo:boardIdx, paused:false, boardState:null, boardRanks:[] };
        this._saveRunState();
        this.rows = cfg.rows; this.cols = cfg.cols; this.mines = cfg.mines;
        this.runStyleScore = 0; this.boardStyleScore = 0;
        this.sfx.play('btn');
        this.transitionToGame(() => { this.createFreshBoard(); this.bindGameEvents(); this.setupScrolling(); this.updateBoardIndicator(); });
    }
    continueRun() {
        if (!this.runState) return;
        const rs = this.runState; rs.paused = false; this._saveRunState();
        this.currentDifficulty = rs.difficulty;
        this.carouselIndex = rs.currentBoard;
        const cfg = this.getBoardConfig(rs.currentBoard);
        this.rows = cfg.rows; this.cols = cfg.cols; this.mines = cfg.mines;
        this.sfx.play('btn');
        this.transitionToGame(() => {
            if (rs.boardState) {
                const s = rs.boardState;
                this.rows = s.rows; this.cols = s.cols; this.mines = s.mines;
                this.board = s.board; this.revealed = s.revealed; this.flagged = s.flagged;
                this.timer = s.timer; this.mode = s.mode; this.firstClick = s.firstClick;
                this.boardStyleScore = s.boardStyleScore || 0;
                this.runStyleScore   = s.runStyleScore || 0;
                this.gameOver = false;
                const gb = document.getElementById('game-board');
                gb.style.gridTemplateColumns = `repeat(${this.cols}, 1fr)`;
                gb.style.transform = 'scale(1)';
                this.zoomLevel = 1; this.scrollX = 0; this.scrollY = 0;
                document.getElementById('zoom-level').textContent = '100%';
                this.updateCellFontSize(); this.updateBoardPosition();
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
        this.styleMeter.hide(); this.styleMeter.reset();
        this._clearRunState(); this.runState = null; this.carouselIndex = 0;
        this.renderDifficultyGrid(); this.renderCarousel(); this.refreshMenuButtons();
        this.sfx.play('btn');
    }
    pauseRun() {
        if (!this.runState) return;
        const state = {
            rows:this.rows, cols:this.cols, mines:this.mines,
            board:this.board, revealed:this.revealed, flagged:this.flagged,
            timer:this.timer, mode:this.mode, firstClick:this.firstClick,
            boardStyleScore:this.boardStyleScore, runStyleScore:this.runStyleScore
        };
        this.runState.paused = true; this.runState.boardState = state; this._saveRunState();
    }
    boardComplete() {
        if (this.timerInterval) { clearInterval(this.timerInterval); this.timerInterval = null; }
        this.gameOver = true;
        const rs = this.runState;
        const boardNum = rs ? rs.currentBoard + 1 : 1;
        const isLast = rs && rs.currentBoard === NUM_BOARDS - 1;

        /* Style score */
        const finalRank  = this.styleMeter ? this.styleMeter.getFinalRank() : 'D';
        const boardScore = this.styleMeter ? this.styleMeter.getScore() : 0;
        this.boardStyleScore = boardScore;
        this.runStyleScore  += boardScore;
        if (rs && !rs.boardRanks) rs.boardRanks = [];
        if (rs)  rs.boardRanks[rs.currentBoard] = finalRank;

        /* Update best scores */
        this.feats.bestBoardStyleScore = Math.max(this.feats.bestBoardStyleScore || 0, boardScore);
        this.feats.bestRunStyleScore   = Math.max(this.feats.bestRunStyleScore   || 0, this.runStyleScore);

        /* Flags XP */
        let correctFlags = 0;
        for (let i=0; i<this.rows; i++) for (let j=0; j<this.cols; j++)
            if (this.board[i][j]===-1 && this.flagged[i][j]) correctFlags++;
        const earned = this.awardPoints(correctFlags);

        this.feats.boardsCleared++;
        this.feats.currentConsecutive++;
        this.feats.bestConsecutive = Math.max(this.feats.bestConsecutive, this.feats.currentConsecutive);
        this._saveFeats(); this.checkFeats();
        this.sfx.play('complete');
        document.body.classList.add('board-complete-pulse');
        setTimeout(() => document.body.classList.remove('board-complete-pulse'), 700);

        this.styleMeter.hide();

        const el = document.getElementById('board-finished-modal');
        const rankLine = document.getElementById('bf-rank-line');
        if (rankLine) { rankLine.textContent = `${this.t('style','Style')}: ${boardScore} pts · ${this.t('rank','Rank')}: ${finalRank}`; rankLine.style.color = RANK_COLORS[finalRank]; }
        const overallRank = this.getOverallRunRank(finalRank);
        const rankBadge = document.getElementById('bf-rank-badge');
        const rankBadgeLetter = document.getElementById('bf-rank-badge-letter');
        if (rankBadge && rankBadgeLetter) {
            rankBadgeLetter.textContent = overallRank;
            rankBadge.style.setProperty('--rank-color', RANK_COLORS[overallRank]);
        }

        if (isLast) {
            this.carouselIndex = 0;
            this._clearRunState(); this.runState = null;
            this.sfx.play('boardwin');
            document.getElementById('bf-title').textContent   = this.t('runComplete','Run Complete!');
            document.getElementById('bf-message').textContent = this.t('allBoardsCleared','All 8 boards cleared!');
            document.getElementById('bf-points').textContent  = earned > 0 ? `+${earned} pts` : '';
            document.getElementById('bf-continue-btn').classList.add('hidden');
            document.getElementById('bf-menu-btn').textContent = this.t('backToMenu','Back to Menu');
        } else {
            if (rs) { rs.currentBoard++; rs.unlockedUpTo = Math.max(rs.unlockedUpTo, rs.currentBoard); rs.boardState = null; rs.paused = true; this.carouselIndex = rs.currentBoard; this._saveRunState(); }
            document.getElementById('bf-title').textContent   = `${this.t('board','Board')} ${boardNum} ${this.t('completeWord','Complete')}!`;
            document.getElementById('bf-message').textContent = `${this.t('board','Board')} ${boardNum} ${this.t('of','of')} 8 ${this.t('cleared','cleared')}!`;
            document.getElementById('bf-points').textContent  = earned > 0 ? `+${earned} pts` : '';
            document.getElementById('bf-continue-btn').classList.remove('hidden');
            document.getElementById('bf-menu-btn').textContent = this.t('menu','Menu');
        }
        el.classList.add('show');
    }
    getOverallRunRank(fallbackRank = 'D') {
        const ranks = this.runState && Array.isArray(this.runState.boardRanks)
            ? this.runState.boardRanks.filter(rank => RANK_LABELS.includes(rank))
            : [];
        if (!ranks.length) return fallbackRank;
        const avg = ranks.reduce((sum, rank) => sum + RANK_LABELS.indexOf(rank), 0) / ranks.length;
        return RANK_LABELS[Math.max(0, Math.min(RANK_LABELS.length - 1, Math.round(avg)))];
    }
    checkWin() {
        return this.isBoardSolved();
    }
    startNextBoard() {
        document.getElementById('board-finished-modal').classList.remove('show');
        if (!this.runState) { this.showMenu(); return; }
        this.runState.paused = false;
        this.currentDifficulty = this.runState.difficulty;
        this._saveRunState();
        const cfg = this.getBoardConfig(this.runState.currentBoard);
        this.rows = cfg.rows; this.cols = cfg.cols; this.mines = cfg.mines;
        this.boardStyleScore = 0;
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
                overlay.classList.remove('slide-down'); overlay.classList.add('slide-up');
                setTimeout(() => { overlay.className = 'screen-transition'; }, 420);
            }, 380);
        }));
    }
    showMenu() {
        if (this.timerInterval) { clearInterval(this.timerInterval); this.timerInterval = null; }
        if (this.animationId)   { cancelAnimationFrame(this.animationId); this.animationId = null; }
        this.styleMeter.hide();
        document.getElementById('game-screen').classList.add('hidden');
        document.getElementById('menu-screen').classList.remove('hidden');
        if (this.runState) this.carouselIndex = this.runState.currentBoard;
        if (this.runState && this.currentDifficulty) {
            document.querySelectorAll('.diff-box').forEach(b => b.classList.remove('selected'));
            const box = document.getElementById(`diff-${this.currentDifficulty}`);
            if (box) box.classList.add('selected');
        }
        this.renderDifficultyGrid(); this.renderCarousel(); this.renderLevelBar(); this.refreshMenuButtons();
    }

    /* ══ MENU EVENTS ═══════════════════════════════════════════ */
    bindMenuEvents() {
        /* Difficulty */
        ['easy','normal','hard','cs1','cs2','cs3'].forEach(k => {
            const el = document.getElementById(`diff-${k}`);
            if (el) el.addEventListener('click', () => this.onDifficultyClick(['cs1','cs2','cs3'].includes(k) ? 'soon' : k));
        });

        /* Play / Continue / Abort */
        document.getElementById('play-btn').addEventListener('click',     () => { if (!document.getElementById('play-btn').classList.contains('greyed')) this.startRun(); });
        document.getElementById('continue-btn').addEventListener('click', () => this.continueRun());
        document.getElementById('abort-btn').addEventListener('click',    () => this.abortRun());

        /* Store */
        document.getElementById('store-btn').addEventListener('click', () => {
            this.sfx.play('modal'); this.storeTab='themes';
            document.querySelectorAll('#store-tab-bar .tab-btn').forEach(b => b.classList.toggle('active', b.dataset.storeTab==='themes'));
            document.querySelectorAll('#store-modal .tab-panel').forEach(p => p.classList.remove('active'));
            document.getElementById('store-panel-themes').classList.add('active');
            this.renderStoreThemes();
            document.getElementById('store-modal').classList.add('show');
            if (this._updateStoreArrows) this._updateStoreArrows();
        });
        document.getElementById('store-close-btn').addEventListener('click', () => { document.getElementById('store-modal').classList.remove('show'); this.revertPreview(); this.sfx.play('btn'); });
        document.getElementById('store-modal').addEventListener('click', e => { if (e.target===document.getElementById('store-modal')) { document.getElementById('store-modal').classList.remove('show'); this.revertPreview(); } });

        /* Feats */
        document.getElementById('feats-btn').addEventListener('click', () => {
            this.sfx.play('modal'); this.featsTab='board';
            this.unviewedFeatIds = []; this._saveFeatIndicators();
            document.querySelectorAll('#feats-tab-bar .tab-btn').forEach(b => b.classList.toggle('active', b.dataset.featsTab==='board'));
            this.renderFeatsPanel('board');
            document.getElementById('feats-modal').classList.add('show');
            this._updateTabDots();
            this.updateFeatsTabProgress('board');
            if (this._updateFeatsArrows) this._updateFeatsArrows();
        });
        document.getElementById('feats-btn').addEventListener('contextmenu', e => {
            e.preventDefault();
            this.unviewedFeatIds = []; this._saveFeatIndicators();
            this._updateNotifDot(); this._updateTabDots();
        });
        document.getElementById('feats-close-btn').addEventListener('click', () => { document.getElementById('feats-modal').classList.remove('show'); this.sfx.play('btn'); });
        document.getElementById('feats-modal').addEventListener('click', e => { if (e.target===document.getElementById('feats-modal')) document.getElementById('feats-modal').classList.remove('show'); });

        /* Board Finished Modal */
        document.getElementById('bf-continue-btn').addEventListener('click', () => this.startNextBoard());
        document.getElementById('bf-menu-btn').addEventListener('click', () => { document.getElementById('board-finished-modal').classList.remove('show'); this.showMenu(); });
        this.bindHoldToHide('bf-hold-hide-btn', 'board-finished-modal');

        /* Game Over Modal */
        document.getElementById('menu-btn').addEventListener('click', () => {
            document.getElementById('game-over-modal').classList.remove('show');
            this._clearRunState(); this.runState = null; this.showMenu();
        });
        document.getElementById('restart-btn').addEventListener('click', () => {
            const prevDiff = this.currentDifficulty || 'normal';
            document.getElementById('game-over-modal').classList.remove('show');
            this._clearRunState(); this.runState = null;
            this.currentDifficulty = prevDiff;
            this.carouselIndex = 0;
            this.runStyleScore = 0; this.boardStyleScore = 0;
            this.runState = {
                active: true, difficulty: prevDiff, currentBoard: 0,
                unlockedUpTo: 0, paused: false, boardState: null, boardRanks: []
            };
            this._saveRunState();
            const cfg = this.getBoardConfig(0);
            this.rows = cfg.rows; this.cols = cfg.cols; this.mines = cfg.mines;
            this.sfx.play('btn');
            this.createFreshBoard(); this.bindGameEvents(); this.setupScrolling(); this.updateBoardIndicator();
        });
        this.bindHoldToHide('modal-hold-hide-btn', 'game-over-modal');

        /* Back button */
        document.getElementById('back-btn').addEventListener('click', () => { this.pauseRun(); this.showMenu(); this.sfx.play('btn'); });

        /* Zoom */
        document.getElementById('zoom-in') .addEventListener('click', () => { this.zoom(.25); this.sfx.play('btn'); });
        document.getElementById('zoom-out').addEventListener('click', () => { this.zoom(-.25); this.sfx.play('btn'); });

        /* Settings */
        document.getElementById('settings-open-btn').addEventListener('click', () => { document.getElementById('settings-modal').classList.add('show'); this.sfx.play('modal'); });
        document.getElementById('settings-close-btn').addEventListener('click', () => { document.getElementById('settings-modal').classList.remove('show'); this.sfx.play('btn'); });
        document.getElementById('settings-modal').addEventListener('click', e => { if (e.target===document.getElementById('settings-modal')) document.getElementById('settings-modal').classList.remove('show'); });
        document.getElementById('dark-mode-toggle').addEventListener('change', e => {
            document.body.classList.toggle('dark-mode', e.target.checked);
            localStorage.setItem('darkMode', e.target.checked);
            this.sfx.play('btn');
        });
        const meterToggle = document.getElementById('style-meter-position-toggle');
        if (meterToggle) meterToggle.addEventListener('change', e => {
            document.body.classList.toggle('style-meter-right', e.target.checked);
            localStorage.setItem('ms_style_meter_right', e.target.checked);
            this.sfx.play('btn');
        });

        /* SFX Volume */
        const volSlider = document.getElementById('sfx-volume-slider');
        const volDisplay = document.getElementById('sfx-vol-display');
        if (volSlider) volSlider.addEventListener('input', () => {
            const v = parseInt(volSlider.value)/100;
            this.sfx.sfxVolume = v; localStorage.setItem('ms_sfx_volume', v);
            if (volDisplay) volDisplay.textContent = `${Math.round(v*100)}%`;
        });

        /* Save Files */
        document.getElementById('save-file-open-btn').addEventListener('click', () => { this.saveCurrentToSlot(this.currentSlot); this.renderSavesModal(); document.getElementById('saves-modal').classList.add('show'); this.sfx.play('modal'); });
        document.getElementById('saves-close-btn').addEventListener('click',    () => { document.getElementById('saves-modal').classList.remove('show'); this.sfx.play('btn'); });
        document.getElementById('saves-modal').addEventListener('click', e => { if (e.target===document.getElementById('saves-modal')) document.getElementById('saves-modal').classList.remove('show'); });

        /* Fun Code */
        const redeemInput = document.getElementById('redeem-input');
        const redeemApply = document.getElementById('redeem-apply-btn');
        if (redeemInput) redeemInput.addEventListener('keydown', e => { if (e.key==='Enter') this._handleFunCode(); });
        if (redeemApply) redeemApply.addEventListener('click', () => this._handleFunCode());

        /* Purchase Modal */
        document.getElementById('coming-soon-close-btn').addEventListener('click', () => { document.getElementById('coming-soon-modal').classList.remove('show'); this.sfx.play('btn'); });

        /* Level Up */
        document.getElementById('upgrade-btn').addEventListener('click', () => {
            const cost = this.levelUpCost(this.level);
            if (this.points >= cost || this.infiniteCoins) {
                if (!this.infiniteCoins) this.points -= cost;
                this.level++;
                localStorage.setItem('ms_points', this.points);
                localStorage.setItem('ms_level', this.level);
                this.renderLevelBar(); this.checkFeats(); this.sfx.play('lvlup');
            }
        });

        /* Carousel Swipe */
        this.bindCarouselSwipe();

        /* TING modal close */
        document.getElementById('ting-close-btn').addEventListener('click', () => { document.getElementById('ting-modal').classList.remove('show'); this.sfx.play('btn'); });

        /* ── Feats tab arrow navigation ── */
        const _featsTabs = ['board','score','level','collector','original'];
        const _featsPrev = document.getElementById('feats-tab-prev');
        const _featsNext = document.getElementById('feats-tab-next');
        const _updateFeatsArrows = () => {
            const idx = _featsTabs.indexOf(this.featsTab);
            if (_featsPrev) _featsPrev.classList.toggle('disabled', idx <= 0);
            if (_featsNext) _featsNext.classList.toggle('disabled', idx >= _featsTabs.length - 1);
        };
        const _setFeatsTab = (tab) => {
            this.featsTab = tab;
            document.querySelectorAll('#feats-tab-bar .tab-btn').forEach(b => b.classList.toggle('active', b.dataset.featsTab === tab));
            this.renderFeatsPanel(tab);
            this.updateFeatsTabProgress(tab);
            this._markFeatTabSeen(tab);
            _updateFeatsArrows();
            this.sfx.play('tab');
        };
        if (_featsPrev) _featsPrev.addEventListener('click', () => {
            const idx = _featsTabs.indexOf(this.featsTab);
            if (idx > 0) _setFeatsTab(_featsTabs[idx - 1]);
        });
        if (_featsNext) _featsNext.addEventListener('click', () => {
            const idx = _featsTabs.indexOf(this.featsTab);
            if (idx < _featsTabs.length - 1) _setFeatsTab(_featsTabs[idx + 1]);
        });
        /* Also wire tab button clicks through the same helper so arrows stay in sync */
        document.querySelectorAll('#feats-tab-bar .tab-btn').forEach(btn => {
            btn.addEventListener('click', () => _setFeatsTab(btn.dataset.featsTab));
        });
        _updateFeatsArrows();
        this._updateFeatsArrows = _updateFeatsArrows;

        /* ── Store tab arrow navigation ── */
        const _storeTabs = ['themes','cs1','cs2'];
        const _storePrev = document.getElementById('store-tab-prev');
        const _storeNext = document.getElementById('store-tab-next');
        const _updateStoreArrows = () => {
            const idx = _storeTabs.indexOf(this.storeTab);
            if (_storePrev) _storePrev.classList.toggle('disabled', idx <= 0);
            if (_storeNext) _storeNext.classList.toggle('disabled', idx >= _storeTabs.length - 1);
        };
        const _setStoreTab = (tab) => {
            if (tab === 'cs1' || tab === 'cs2') { document.getElementById('coming-soon-modal').classList.add('show'); return; }
            this.storeTab = tab;
            document.querySelectorAll('#store-tab-bar .tab-btn').forEach(b => b.classList.toggle('active', b.dataset.storeTab === tab));
            document.querySelectorAll('#store-modal .tab-panel').forEach(p => p.classList.remove('active'));
            const panel = document.getElementById(`store-panel-${tab}`);
            if (panel) panel.classList.add('active');
            if (tab === 'themes') this.renderStoreThemes();
            _updateStoreArrows();
            this.sfx.play('tab');
        };
        if (_storePrev) _storePrev.addEventListener('click', () => {
            const idx = _storeTabs.indexOf(this.storeTab);
            if (idx > 0) _setStoreTab(_storeTabs[idx - 1]);
        });
        if (_storeNext) _storeNext.addEventListener('click', () => {
            const idx = _storeTabs.indexOf(this.storeTab);
            if (idx < _storeTabs.length - 1) _setStoreTab(_storeTabs[idx + 1]);
        });
        document.querySelectorAll('#store-tab-bar .tab-btn').forEach(btn => {
            btn.addEventListener('click', () => _setStoreTab(btn.dataset.storeTab));
        });
        _updateStoreArrows();
        this._updateStoreArrows = _updateStoreArrows;
    }

    _handleFunCode() {
        const input = document.getElementById('redeem-input');
        const msg   = document.getElementById('redeem-msg');
        const rawCode = (input.value || '').trim();
        const code  = rawCode.toUpperCase();
        const codeLower = rawCode.toLowerCase();
        msg.classList.remove('hidden','success','error');
        if (code === '123ABC') {
            this.infiniteCoins = true;
            localStorage.setItem('ms_infinite_coins', 'true');
            document.body.classList.add('dev-mode');
            this.feats.funCodeUsed = true; this._saveFeats();
            this.renderLevelBar(); this.checkFeats();
            msg.textContent = '✓ Infinite coins activated!';
            msg.classList.add('success');
            input.value = '';
            this.sfx.play('redeem');
        } else if (codeLower === 'edgelord') {
            if (!this.ownedThemes.includes('black')) this.ownedThemes.push('black');
            this.activeTheme = 'black';
            this.feats.funCodeUsed = true;
            localStorage.setItem('ms_owned_themes', JSON.stringify(this.ownedThemes));
            localStorage.setItem('ms_active_theme', this.activeTheme);
            this._saveFeats();
            this.applyTheme('black');
            this.renderStoreThemes();
            this.renderDifficultyGrid();
            this._unlockSecret('edgelord_phase');
            this.checkFeats();
            msg.textContent = this.t('edgelordSuccess','✓ Black theme unlocked.');
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

    bindHoldToHide(buttonId, modalId) {
        const btn = document.getElementById(buttonId);
        const modal = document.getElementById(modalId);
        if (!btn || !modal) return;
        const restore = () => modal.classList.remove('hold-hidden');
        const hide = (e) => {
            e.preventDefault();
            modal.classList.add('hold-hidden');
            window.addEventListener('pointerup', restore, { once:true });
            window.addEventListener('touchend', restore, { once:true });
            window.addEventListener('mouseup', restore, { once:true });
        };
        btn.addEventListener('pointerdown', hide);
        btn.addEventListener('touchstart', hide, { passive:false });
        btn.addEventListener('mousedown', hide);
    }

    updateFeatsTabProgress(tab) {
        const bar = document.getElementById('feats-tab-progress');
        if (!bar) return;
        const tabs = ['board','score','level','collector','original'];
        const idx = Math.max(0, tabs.indexOf(tab));
        const pct = tabs.length <= 1 ? 100 : Math.round((1 - idx / (tabs.length - 1)) * 100);
        bar.style.setProperty('--tab-progress', `${pct}%`);
        bar.dataset.side = idx < Math.floor(tabs.length / 2) ? 'right' : (idx > Math.floor(tabs.length / 2) ? 'left' : 'center');
    }

    /* ══ ZOOM ══════════════════════════════════════════════════ */
    zoom(delta) {
        const target = Math.min(this.maxZoom, Math.max(this.minZoom, (this._zoomTarget !== undefined ? this._zoomTarget : this.zoomLevel) + delta));
        if (target === this._zoomTarget) return;
        this._zoomTarget = target;
        const el = document.getElementById('zoom-level');
        if (el) { el.classList.add('pop'); setTimeout(() => el.classList.remove('pop'), 140); }
        if (!this._zoomAnimating) this._animateZoom();
    }

    _animateZoom() {
        this._zoomAnimating = true;
        const step = () => {
            const diff = this._zoomTarget - this.zoomLevel;
            if (Math.abs(diff) < 0.003) {
                this.zoomLevel = this._zoomTarget;
                this._zoomAnimating = false;
            } else {
                this.zoomLevel += diff * 0.18;
                this._zoomFrame = requestAnimationFrame(step);
            }
            const board = document.getElementById('game-board');
            if (board) board.style.transform = `scale(${this.zoomLevel})`;
            const el = document.getElementById('zoom-level');
            if (el) el.textContent = Math.round(this.zoomLevel * 100) + '%';
            this.updateCellFontSize();
            this.clampScroll(); this.updateBoardPosition();
        };
        step();
    }
    updateCellFontSize() {
        const scaled = Math.min(1.4, Math.max(0.5, 0.82 / Math.sqrt(this.zoomLevel)));
        document.documentElement.style.setProperty('--cell-font-size', `${scaled.toFixed(3)}rem`);
    }

    /* ══ SCROLLING ═════════════════════════════════════════════ */
    setupScrolling() {
        const container = document.getElementById('zoom-container');
        const newC = container.cloneNode(false);
        const wrapper = document.getElementById('board-wrapper');
        newC.appendChild(wrapper);
        container.parentNode.replaceChild(newC, container);

        const handleStart = (x, y) => {
            if (this.animationId) { cancelAnimationFrame(this.animationId); this.animationId = null; }
            this.isDragging=true; this.hasDragged=false;
            this.dragStartX=x; this.dragStartY=y;
            this.lastX=x; this.lastY=y; this.velocityX=0; this.velocityY=0;
        };
        const handleMove = (x, y) => {
            if (!this.isDragging) return;
            const dx = x-this.lastX, dy = y-this.lastY;
            if (Math.abs(x-this.dragStartX)>this.dragThreshold || Math.abs(y-this.dragStartY)>this.dragThreshold) this.hasDragged=true;
            if (this.hasDragged) {
                this.scrollX+=dx; this.scrollY+=dy;
                this.clampScroll(); this.updateBoardPosition();
                this.velocityX=dx*.8; this.velocityY=dy*.8;
            }
            this.lastX=x; this.lastY=y;
        };
        const handleEnd = () => {
            if (this.isDragging && this.hasDragged && (Math.abs(this.velocityX)>1 || Math.abs(this.velocityY)>1)) this.applyInertia();
            this.isDragging = false;
        };
        newC.addEventListener('touchstart', e => { if(e.touches.length===1) handleStart(e.touches[0].clientX,e.touches[0].clientY); }, {passive:true});
        newC.addEventListener('touchmove',  e => { if(e.touches.length===1) handleMove(e.touches[0].clientX,e.touches[0].clientY); }, {passive:true});
        newC.addEventListener('touchend',   handleEnd, {passive:true});
        newC.addEventListener('touchcancel',handleEnd, {passive:true});
        newC.addEventListener('mousedown',  e => handleStart(e.clientX,e.clientY));
        newC.addEventListener('mousemove',  e => handleMove(e.clientX,e.clientY));
        newC.addEventListener('mouseup',    handleEnd);
        newC.addEventListener('mouseleave', () => { this.isDragging=false; });
    }
    applyInertia() {
        const decay = .92;
        const animate = () => {
            if (Math.abs(this.velocityX)>.3 || Math.abs(this.velocityY)>.3) {
                this.scrollX+=this.velocityX; this.scrollY+=this.velocityY;
                this.clampScroll(); this.updateBoardPosition();
                this.velocityX*=decay; this.velocityY*=decay;
                this.animationId = requestAnimationFrame(animate);
            } else this.animationId = null;
        };
        this.animationId = requestAnimationFrame(animate);
    }
    clampScroll() {
        const container = document.getElementById('zoom-container');
        const board = document.getElementById('game-board');
        if (!container || !board) return;
        const cw=container.clientWidth, ch=container.clientHeight;
        const bw=board.offsetWidth*this.zoomLevel, bh=board.offsetHeight*this.zoomLevel;
        const pad=40;
        this.scrollX = Math.max(-(Math.max(0,bw-cw)+pad), Math.min(pad, this.scrollX));
        this.scrollY = Math.max(-(Math.max(0,bh-ch)+pad), Math.min(pad, this.scrollY));
    }
    updateBoardPosition() {
        const w = document.getElementById('board-wrapper');
        if (w) w.style.transform = `translate3d(${this.scrollX}px,${this.scrollY}px,0)`;
    }

    /* ══ BOARD SETUP ═══════════════════════════════════════════ */
    createFreshBoard() {
        this.board=[]; this.revealed=[]; this.flagged=[];
        this.gameOver=false; this.firstClick=true;
        this.timer=0; this.mode='dig'; this.circleMode=false;
        this.scrollX=0; this.scrollY=0; this.zoomLevel=1; this._zoomTarget=1; this._zoomAnimating=false;
        if (this.timerInterval) { clearInterval(this.timerInterval); this.timerInterval=null; }

        for (let i=0; i<this.rows; i++) {
            this.board[i]=[]; this.revealed[i]=[]; this.flagged[i]=[];
            for (let j=0; j<this.cols; j++) { this.board[i][j]=0; this.revealed[i][j]=false; this.flagged[i][j]=false; }
        }
        const gb = document.getElementById('game-board');
        gb.style.gridTemplateColumns = `repeat(${this.cols}, 1fr)`;
        gb.style.transform = 'scale(1)';
        document.getElementById('zoom-level').textContent = '100%';
        this.updateCellFontSize(); this.updateBoardPosition();
        document.getElementById('dig-btn').classList.add('active');
        document.getElementById('flag-btn').classList.remove('active');
        this.renderBoard(); this.updateDisplay();
        requestAnimationFrame(() => this.clampScroll());

        /* Show style meter */
        this.styleMeter.reset(); this.styleMeter.show();
    }

    renderBoard() {
        const gb = document.getElementById('game-board'); gb.innerHTML = '';
        for (let i=0; i<this.rows; i++) for (let j=0; j<this.cols; j++) {
            const cell = document.createElement('button');
            cell.className = 'cell'; cell.dataset.row=i; cell.dataset.col=j;
            gb.appendChild(cell);
        }
    }
    renderSavedState() {
        for (let i=0; i<this.rows; i++) for (let j=0; j<this.cols; j++) {
            const cell = this.getCell(i,j); if (!cell) continue;
            if (this.revealed[i][j]) {
                cell.classList.add('revealed');
                if (this.board[i][j] > 0) { cell.textContent=this.board[i][j]; cell.classList.add('n'+this.board[i][j]); }
            } else if (this.flagged[i][j]) { cell.classList.add('flagged'); cell.insertAdjacentHTML('beforeend', FLAG_SVG); }
        }
        const dig = document.getElementById('dig-btn'), flag = document.getElementById('flag-btn');
        if (this.mode==='dig') { dig.classList.add('active'); flag.classList.remove('active'); }
        else { flag.classList.add('active'); dig.classList.remove('active'); }
        /* Restore style meter */
        this.styleMeter.reset(); this.styleMeter.show();
    }

    /* ══ GAME EVENTS ═══════════════════════════════════════════ */
    bindGameEvents() {
        const gb = document.getElementById('game-board');
        const newGb = gb.cloneNode(true);
        gb.parentNode.replaceChild(newGb, gb);

        let longPressTimer=null, isLongPress=false, pressedCell=null;
        let touchStartX=0, touchStartY=0;
        const LONG=400, THR=8;

        const onStart = (cell, x, y) => {
            if (!cell) return;
            isLongPress=false; pressedCell=cell; touchStartX=x; touchStartY=y;
            cell.classList.add('pressed');
            const r=parseInt(cell.dataset.row), c=parseInt(cell.dataset.col);
            longPressTimer = setTimeout(() => {
                isLongPress=true; cell.classList.remove('pressed');
                if (!this.hasDragged) this.handleLongPress(r, c);
            }, LONG);
        };
        const onEnd = (x, y) => {
            if (longPressTimer) { clearTimeout(longPressTimer); longPressTimer=null; }
            if (pressedCell) pressedCell.classList.remove('pressed');
            if (!isLongPress && !this.hasDragged && pressedCell &&
                Math.abs(x-touchStartX)<THR && Math.abs(y-touchStartY)<THR)
                this.handleCellTap(parseInt(pressedCell.dataset.row), parseInt(pressedCell.dataset.col));
            isLongPress=false; pressedCell=null;
        };
        const onCancel = () => {
            if (longPressTimer) { clearTimeout(longPressTimer); longPressTimer=null; }
            if (pressedCell) pressedCell.classList.remove('pressed');
            isLongPress=false; pressedCell=null;
        };

        newGb.addEventListener('mousedown',  e => onStart(e.target.closest('.cell'), e.clientX, e.clientY));
        newGb.addEventListener('mouseup',    e => onEnd(e.clientX, e.clientY));
        newGb.addEventListener('mouseleave', onCancel);
        newGb.addEventListener('touchstart', e => { if(e.touches.length===1) onStart(e.target.closest('.cell'), e.touches[0].clientX, e.touches[0].clientY); }, {passive:true});
        newGb.addEventListener('touchend',   e => { if(e.changedTouches.length===1){e.preventDefault(); onEnd(e.changedTouches[0].clientX, e.changedTouches[0].clientY);} });
        newGb.addEventListener('touchcancel',onCancel);
        newGb.addEventListener('contextmenu',e => e.preventDefault());

        document.getElementById('dig-btn').onclick = () => { this.mode='dig'; document.getElementById('dig-btn').classList.add('active'); document.getElementById('flag-btn').classList.remove('active'); this.sfx.play('btn'); };
        document.getElementById('flag-btn').onclick= () => { this.mode='flag'; document.getElementById('flag-btn').classList.add('active'); document.getElementById('dig-btn').classList.remove('active'); this.sfx.play('btn'); };

        /* Long-press on BOARD indicator → secret circle mode */
        const boardInd = document.getElementById('board-indicator');
        if (boardInd) {
            let circlePressTimer = null;
            boardInd.addEventListener('pointerdown', () => {
                circlePressTimer = setTimeout(() => { this._toggleCircleMode(); }, 900);
            });
            boardInd.addEventListener('pointerup',    () => clearTimeout(circlePressTimer));
            boardInd.addEventListener('pointerleave', () => clearTimeout(circlePressTimer));
        }
    }

    handleLongPress(r, c) {
        if (this.gameOver || this.revealed[r][c]) return;
        if (this.mode==='dig') this.toggleFlag(r, c);
        else if (!this.flagged[r][c]) this.digCell(r, c);
        this.updateDisplay(); this.saveCurrentBoardToRun();
    }

    handleCellTap(r, c) {
        if (this.gameOver) return;

        /* Tap on revealed numbered cell → quick dig or quick flag */
        if (this.revealed[r][c]) {
            if (this.board[r][c] > 0) {
                if (this._tryQuickDig(r, c)) return;
                this._tryQuickFlag(r, c);
            }
            return;
        }

        if (this.mode==='dig') {
            if (this.flagged[r][c]) this.toggleFlag(r, c);
            else {
                this.digCell(r, c);
            }
        } else { this.toggleFlag(r, c); }
        this.updateDisplay(); this.saveCurrentBoardToRun();
    }

    /* ── Quick Dig (chord) ── */
    _tryQuickDig(r, c) {
        const adj = this._getAdj(r, c);
        const flags = adj.filter(([ar,ac]) => this.flagged[ar][ac]).length;
        if (flags !== this.board[r][c]) return false;
        let revealed = 0;
        for (const [ar, ac] of adj) {
            if (!this.flagged[ar][ac] && !this.revealed[ar][ac]) {
                this.reveal(ar, ac); revealed++;
                if (this.gameOver) { this.updateDisplay(); this.saveCurrentBoardToRun(); return true; }
            }
        }
        if (revealed > 0) {
            /* Style meter boost */
            const res = this.styleMeter.onAction('quickdig');
            if (res && res.hit69) this._unlockSecret('score_69');
            this.boardStyleScore = this.styleMeter.getScore();
            this.sfx.play('quickdig');
        }
        this.updateDisplay();
        this.evaluateFlagCompletion();
        this.saveCurrentBoardToRun();
        return true;
    }

    /* ── Quick Flag ── */
    _tryQuickFlag(r, c) {
        const adj = this._getAdj(r, c);
        const flagCount = adj.filter(([ar,ac]) => this.flagged[ar][ac]).length;
        const unrevealed = adj.filter(([ar,ac]) => !this.revealed[ar][ac] && !this.flagged[ar][ac]);
        if (flagCount + unrevealed.length === this.board[r][c] && unrevealed.length > 0) {
            for (const [ar, ac] of unrevealed) {
                if (this.gameOver) break;
                this.toggleFlag(ar, ac);
            }
            this.updateDisplay(); this.saveCurrentBoardToRun();
            return true;
        }
        return false;
    }

    _getAdj(r, c) {
        const adj = [];
        for (let di=-1; di<=1; di++) for (let dj=-1; dj<=1; dj++) {
            if (!di && !dj) continue;
            const nr=r+di, nc=c+dj;
            if (nr>=0 && nr<this.rows && nc>=0 && nc<this.cols) adj.push([nr, nc]);
        }
        return adj;
    }

    saveCurrentBoardToRun() {
        if (!this.runState || this.firstClick || this.gameOver) return;
        this.runState.boardState = {
            rows:this.rows, cols:this.cols, mines:this.mines,
            board:this.board, revealed:this.revealed, flagged:this.flagged,
            timer:this.timer, mode:this.mode, firstClick:this.firstClick,
            boardStyleScore:this.boardStyleScore, runStyleScore:this.runStyleScore
        };
        this._saveRunState();
    }

    digCell(r, c) {
        if (this.flagged[r][c]) return;
        if (this.firstClick) {
            this.firstClick=false; this.placeMines(r, c); this.startTimer();
            this.evaluateFlagCompletion();
            if (this.gameOver) return;
        }
        this.sfx.play('dig');
        const res = this.styleMeter.onAction('dig');
        if (res && res.hit69) this._unlockSecret('score_69');
        this.boardStyleScore = this.styleMeter.getScore();
        this.reveal(r, c);
    }

    toggleFlag(r, c) {
        if (this.revealed[r][c]) return;
        const placingFlag = !this.flagged[r][c];
        this.flagged[r][c] = !this.flagged[r][c];
        const cell = this.getCell(r, c);
        if (cell) {
            cell.classList.toggle('flagged', this.flagged[r][c]);
            const ex = cell.querySelector('.cell-svg-icon'); if (ex) ex.remove();
            if (this.flagged[r][c]) { cell.insertAdjacentHTML('beforeend', FLAG_SVG); this.sfx.play('flag'); this.playCellFx(cell, 'flag-pop'); }
            else this.sfx.play('unflag');
        }
        if (placingFlag) this.evaluateFlagCompletion();
    }

    allSafeTilesRevealed() {
        for (let i=0; i<this.rows; i++) for (let j=0; j<this.cols; j++) {
            if (this.board[i][j] !== -1 && !this.revealed[i][j]) return false;
        }
        return true;
    }

    allRequiredFlagsCorrect() {
        let flags = 0;
        for (let i=0; i<this.rows; i++) for (let j=0; j<this.cols; j++) {
            if (this.flagged[i][j]) {
                flags++;
                if (this.board[i][j] !== -1) return false;
            }
        }
        return flags === this.mines;
    }

    isBoardSolved() {
        return this.allSafeTilesRevealed() && this.allRequiredFlagsCorrect();
    }

    evaluateFlagCompletion() {
        if (this.gameOver || this.firstClick) return;
        const flags = this.flagged.flat().filter(Boolean).length;
        if (flags === this.mines && !this.allRequiredFlagsCorrect()) {
            this.gameOver = true;
            this.endGame();
            return;
        }
        if (this.isBoardSolved()) this.boardComplete();
    }

    placeMines(exR, exC) {
        let placed = 0;
        while (placed < this.mines) {
            const r = Math.floor(Math.random()*this.rows);
            const c = Math.floor(Math.random()*this.cols);
            if (this.board[r][c] !== -1 && !(Math.abs(r-exR)<=1 && Math.abs(c-exC)<=1)) {
                this.board[r][c]=-1; placed++;
            }
        }
        for (let i=0; i<this.rows; i++) for (let j=0; j<this.cols; j++)
            if (this.board[i][j] !== -1) this.board[i][j] = this._countAdj(i, j);
    }
    _countAdj(r, c) {
        let n=0;
        for (let di=-1; di<=1; di++) for (let dj=-1; dj<=1; dj++) {
            const nr=r+di, nc=c+dj;
            if (nr>=0&&nr<this.rows&&nc>=0&&nc<this.cols&&this.board[nr][nc]===-1) n++;
        }
        return n;
    }
    reveal(r, c) {
        if (r<0||r>=this.rows||c<0||c>=this.cols) return;
        if (this.revealed[r][c]||this.flagged[r][c]) return;
        this.revealed[r][c]=true;
        const cell = this.getCell(r, c);
        if (cell) { cell.classList.add('revealed'); this.playCellFx(cell, 'reveal-pop'); }
        if (this.board[r][c]===-1) { this.gameOver=true; this.endGame(); return; }
        if (this.board[r][c] > 0) {
            if (cell) { cell.textContent=this.board[r][c]; cell.classList.add('n'+this.board[r][c]); }
        } else {
            const res = this.styleMeter.onAction('cascade');
            if (res && res.hit69) this._unlockSecret('score_69');
            for (let di=-1;di<=1;di++) for (let dj=-1;dj<=1;dj++)
                if (di!==0||dj!==0) setTimeout(() => this.reveal(r+di,c+dj), 18);
        }
        this.sfx.play('reveal');
        this.evaluateFlagCompletion();
    }
    getCell(r, c) { return document.querySelector(`.cell[data-row="${r}"][data-col="${c}"]`); }
    playCellFx(cell, cls) {
        if (!cell) return;
        cell.classList.remove(cls);
        void cell.offsetWidth;
        cell.classList.add(cls);
        setTimeout(() => cell.classList.remove(cls), 320);
    }
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
        clearInterval(this.timerInterval); this.timerInterval=null;
        this.sfx.play('runover');
        document.body.classList.add('runover-pulse');
        setTimeout(() => document.body.classList.remove('runover-pulse'), 700);
        this.styleMeter.hide();
        this.feats.currentConsecutive=0; this._saveFeats();
        let correctFlags=0, delay=0;
        for (let i=0; i<this.rows; i++) for (let j=0; j<this.cols; j++) {
            const mine=this.board[i][j]===-1, flag=this.flagged[i][j];
            if (mine&&flag) { correctFlags++; }
            else if (mine&&!flag) {
                const d=delay;
                setTimeout(() => { const c=this.getCell(i,j); if(c){c.classList.add('mine');c.classList.remove('flagged');const ex=c.querySelector('.cell-svg-icon');if(ex)ex.remove();c.insertAdjacentHTML('beforeend',MINE_SVG);} }, d);
                delay+=35;
            } else if (!mine&&flag) {
                const d=delay;
                setTimeout(() => { const c=this.getCell(i,j); if(c) c.classList.add('flag-wrong'); }, d);
                delay+=25;
            }
        }
        this.carouselIndex = 0;
        this._clearRunState(); this.runState=null;
        const earned = this.awardPoints(correctFlags);
        const stylePts = this.styleMeter ? this.styleMeter.getScore() : 0;
        const styleRank = this.styleMeter ? this.styleMeter.getFinalRank() : 'D';
        setTimeout(() => {
            document.getElementById('modal-title').textContent   = this.t('runOver','Run Over');
            document.getElementById('modal-message').textContent = `${correctFlags} flag${correctFlags!==1?'s':''} · ${this.timer}s`;
            document.getElementById('points-earned').textContent = earned > 0 ? `+${earned} ${this.t('points','points')}` : this.t('noPointsEarned','No points earned');
            const badge = document.getElementById('go-rank-badge');
            const letter = document.getElementById('go-rank-badge-letter');
            const line = document.getElementById('go-rank-line');
            if (badge && letter && line) {
                letter.textContent = styleRank;
                badge.style.setProperty('--rank-color', RANK_COLORS[styleRank]);
                line.textContent = `${this.t('style','Style')}: ${stylePts} pts · ${this.t('rank','Rank')}: ${styleRank}`;
                line.style.color = RANK_COLORS[styleRank];
            }
            document.getElementById('game-over-modal').classList.add('show');
        }, Math.min(delay+300, 1400));
    }

    /* ══ CIRCLE MODE (secret) ══════════════════════════════════ */
    _toggleCircleMode() {
        this.circleMode = !this.circleMode;
        if (this.circleMode) {
            this._unlockSecret('circle_board');
            this._applyCircleMode();
        } else {
            document.querySelectorAll('.cell.circle-void').forEach(c => c.classList.remove('circle-void'));
        }
    }
    _applyCircleMode() {
        const cr = (this.rows-1)/2, cc = (this.cols-1)/2;
        const radius = Math.min(cr, cc) * 0.95;
        for (let i=0; i<this.rows; i++) for (let j=0; j<this.cols; j++) {
            const dist = Math.sqrt((i-cr)**2 + (j-cc)**2);
            const cell = this.getCell(i, j);
            if (cell) cell.classList.toggle('circle-void', dist > radius);
        }
    }

    /* ══ EASTER EGGS ═══════════════════════════════════════════ */
    _trackRedTheme() {
        const now = Date.now();
        this._redThemeClicks = this._redThemeClicks.filter(t => now-t < 1000);
        this._redThemeClicks.push(now);
        if (this._redThemeClicks.length >= 5) {
            this._redThemeClicks = [];
            this._triggerUltrakill();
        }
    }
    _triggerUltrakill() {
        document.body.classList.add('ultrakill-flash', 'ultrakill-shake');
        setTimeout(() => document.body.classList.remove('ultrakill-flash', 'ultrakill-shake'), 1200);
        this.sfx.play('ultrakill');
        this._unlockSecret('ultrakill');
    }

    _trackSaveSwitch() {
        const now = Date.now();
        this._saveSwitchTimes = this._saveSwitchTimes.filter(t => now-t < 30000);
        this._saveSwitchTimes.push(now);
        if (this._saveSwitchTimes.length >= 4 && !this._tingTriggered) {
            this._tingTriggered = true;
            this._triggerTING();
        }
    }
    _triggerTING() {
        /* Glitch effect */
        document.body.classList.add('ting-glitch');
        setTimeout(() => document.body.classList.remove('ting-glitch'), 900);
        /* Unlock achievement */
        this._unlockSecret('ting');
        /* Delayed popup (10–18 seconds later) */
        const delay = 10000 + Math.random() * 8000;
        setTimeout(() => {
            if (!this._tingAnomalySet) {
                document.getElementById('ting-modal').classList.add('show');
                /* Subtle persistent anomaly (disappears on reload) */
                document.body.classList.add('ting-anomaly');
                this._tingAnomalySet = true;
            }
        }, delay);
    }
}

document.addEventListener('DOMContentLoaded', () => new Minesweeper());
