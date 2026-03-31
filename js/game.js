// ============================================
// 游戏引擎：试用期六个月
// ============================================

// ---------- 存档系统 ----------
const Storage = {
  KEY: 'probation_game_save',
  VERSION: 2,  // Bump to reset all saves
  
  load() {
    try {
      const d = JSON.parse(localStorage.getItem(this.KEY));
      if (d && d.version === this.VERSION) return d;
      return this.defaultData();
    } catch { return this.defaultData(); }
  },
  
  save(data) {
    localStorage.setItem(this.KEY, JSON.stringify(data));
  },
  
  defaultData() {
    return {
      version: this.VERSION,
      unlockedLevels: [1],
      bossUnlocked: [],
      bestScores: {}  // e.g. { "pm_1": 85, "algorithm_2": 120 }
    };
  }
};

// ---------- UI 管理 ----------
const UI = {
  currentScreen: 'screen-menu',
  saveData: null,
  secretClickCount: 0,
  secretTimer: null,
  
  init() {
    this.saveData = Storage.load();
    this.initParticles();
    this.initSecretDoor();
  },
  
  initParticles() {
    const container = document.getElementById('particles');
    for (let i = 0; i < 30; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      p.style.left = Math.random() * 100 + '%';
      p.style.top = Math.random() * 100 + '%';
      p.style.animationDelay = Math.random() * 8 + 's';
      p.style.animationDuration = (6 + Math.random() * 6) + 's';
      container.appendChild(p);
    }
  },
  
  initSecretDoor() {
    const trigger = document.getElementById('secretTrigger');
    trigger.addEventListener('click', () => {
      this.secretClickCount++;
      clearTimeout(this.secretTimer);
      this.secretTimer = setTimeout(() => { this.secretClickCount = 0; }, 2000);
      if (this.secretClickCount >= 5) {
        this.secretClickCount = 0;
        this.showScreen('screen-secret');
      }
    });
  },
  
  showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    const screen = document.getElementById(screenId);
    if (screen) {
      screen.classList.add('active');
      this.currentScreen = screenId;
    }
    
    // Build dynamic content
    if (screenId === 'screen-character') this.buildCharacterSelect();
    if (screenId === 'screen-level') this.buildLevelSelect();
    if (screenId === 'screen-learning') this.buildLearning();
  },
  
  showOverlay(id) {
    document.getElementById(id).classList.add('active');
  },
  
  hideOverlay(id) {
    document.getElementById(id).classList.remove('active');
  },
  
  // ---------- Character Select ----------
  buildCharacterSelect() {
    const grid = document.getElementById('characterGrid');
    grid.innerHTML = '';
    const chars = GAME_DATA.characters;
    
    Object.values(chars).forEach(ch => {
      const card = document.createElement('div');
      card.className = 'character-card';
      card.style.setProperty('--card-accent', ch.color);
      
      const isBoss = ch.id === 'boss';
      const isLocked = isBoss && !this.isBossAvailable();
      if (isLocked) card.classList.add('locked');
      
      card.innerHTML = `
        <div class="char-emoji">${ch.emoji}</div>
        <div class="char-name" style="color:${ch.color}">${ch.name}</div>
        <div class="char-desc">${ch.description}</div>
        <div class="char-stats">
          <span>❤️ ${ch.maxHealth}</span>
          <span>⚡ ${ch.speed < 1 ? '慢' : ch.speed > 1 ? '快' : '中'}</span>
        </div>
      `;
      
      if (!isLocked) {
        card.addEventListener('click', () => {
          Game.selectedCharacter = ch.id;
          this.showScreen('screen-level');
        });
      }
      
      grid.appendChild(card);
    });
  },
  
  isBossAvailable() {
    return this.saveData.bossUnlocked.length > 0;
  },
  
  // ---------- Level Select ----------
  buildLevelSelect() {
    const grid = document.getElementById('levelGrid');
    grid.innerHTML = '';
    
    const roleDisplay = document.getElementById('selectedRoleDisplay');
    const ch = GAME_DATA.characters[Game.selectedCharacter];
    roleDisplay.innerHTML = `${ch.emoji} ${ch.name}`;
    
    Object.values(GAME_DATA.levels).forEach(lv => {
      const card = document.createElement('div');
      card.className = 'level-card';
      
      const isBoss = Game.selectedCharacter === 'boss';
      const isUnlocked = isBoss
        ? this.saveData.bossUnlocked.includes(lv.id)
        : this.saveData.unlockedLevels.includes(lv.id);
      if (!isUnlocked) card.classList.add('locked');
      
      const scoreKey = `${Game.selectedCharacter}_${lv.id}`;
      const bestScore = this.saveData.bestScores[scoreKey] || 0;
      
      card.innerHTML = `
        <div class="level-number">${lv.id}</div>
        <div class="level-info">
          <h3>${lv.name}</h3>
          <div class="level-subtitle">${lv.subtitle}</div>
          <p>${lv.description}</p>
        </div>
        ${isUnlocked ? `
          <div class="level-score">
            <div>最高分</div>
            <div class="best-score">${bestScore}</div>
          </div>
        ` : `<div class="level-lock-icon">🔒</div>`}
      `;
      
      if (isUnlocked) {
        card.addEventListener('click', () => {
          Game.selectedLevel = lv.id;
          Game.start();
        });
      }
      
      grid.appendChild(card);
    });
  },
  
  // ---------- Learning Module ----------
  buildLearning() {
    const tabsContainer = document.getElementById('learningTabs');
    const contentContainer = document.getElementById('learningContent');
    tabsContainer.innerHTML = '';
    
    const roles = [
      { id: 'pm', name: '产品经理' },
      { id: 'algorithm', name: '大模型算法' },
      { id: 'backend', name: '后端工程师' },
      { id: 'boss', name: '老板' }
    ];
    
    roles.forEach((role, i) => {
      const tab = document.createElement('div');
      tab.className = 'learning-tab' + (i === 0 ? ' active' : '');
      tab.textContent = `${GAME_DATA.characters[role.id].emoji} ${role.name}`;
      tab.addEventListener('click', () => {
        tabsContainer.querySelectorAll('.learning-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        this.renderLearningContent(role.id, contentContainer);
      });
      tabsContainer.appendChild(tab);
    });
    
    this.renderLearningContent('pm', contentContainer);
  },
  
  renderLearningContent(roleId, container) {
    container.innerHTML = '';
    const items = GAME_DATA.items[roleId];
    
    [1, 2, 3].forEach(lvl => {
      const levelData = items[lvl];
      const levelInfo = GAME_DATA.levels[lvl];
      
      const section = document.createElement('div');
      section.className = 'learning-section fade-in';
      
      let html = `<h3>第${lvl}关 · ${levelInfo.name} — ${levelInfo.subtitle}</h3>`;
      
      html += `<h4 style="color:var(--accent-red)">● 障碍物（需躲避）</h4>`;
      html += `<div class="learning-items-grid">`;
      levelData.obstacles.forEach(item => {
        html += `
          <div class="learning-item obstacle">
            <div class="learning-emoji">${item.emoji}</div>
            <div class="learning-item-info">
              <div class="item-name">${item.name}</div>
              <div class="item-desc">${item.desc}</div>
            </div>
          </div>`;
      });
      html += `</div>`;
      
      html += `<h4 style="color:var(--accent-green)">● 收集物（需击中）</h4>`;
      html += `<div class="learning-items-grid">`;
      levelData.collectibles.forEach(item => {
        html += `
          <div class="learning-item collectible">
            <div class="learning-emoji">${item.emoji}</div>
            <div class="learning-item-info">
              <div class="item-name">${item.name}</div>
              <div class="item-desc">${item.desc}</div>
            </div>
          </div>`;
      });
      html += `</div>`;
      
      section.innerHTML = html;
      container.appendChild(section);
    });
  },
  
  // ---------- HUD ----------
  updateHealth(current, max) {
    const container = document.getElementById('hudHealth');
    container.innerHTML = '';
    for (let i = 0; i < max; i++) {
      const heart = document.createElement('div');
      if (current >= i + 1) {
        heart.className = 'hud-heart';
      } else if (current >= i + 0.5) {
        heart.className = 'hud-heart half';
      } else {
        heart.className = 'hud-heart empty';
      }
      heart.textContent = '❤️';
      container.appendChild(heart);
    }
  },
  
  updateTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    document.getElementById('hudTime').textContent =
      String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
  },
  
  updateScore(score) {
    document.getElementById('hudScore').textContent = score;
  },
  
  showItemPopup(name, isObstacle) {
    const popup = document.getElementById('itemPopup');
    popup.className = 'item-popup show ' + (isObstacle ? 'obstacle-popup' : 'collectible-popup');
    popup.textContent = (isObstacle ? '💢 ' : '✨ ') + name;
    clearTimeout(popup._timer);
    popup._timer = setTimeout(() => {
      popup.className = 'item-popup';
    }, 1200);
  },
  
  showGameOver(stats) {
    const isVictory = stats.score >= stats.targetScore;
    const title = document.getElementById('gameoverTitle');
    title.textContent = isVictory ? '🎉 通关成功！' : '💀 游戏结束';
    title.className = 'gameover-title ' + (isVictory ? 'victory' : 'defeat');
    
    document.getElementById('statTime').textContent = Math.floor(stats.survivalTime) + 's';
    document.getElementById('statScore').textContent = stats.score;
    document.getElementById('statCollected').textContent = stats.collected;
    document.getElementById('statHit').textContent = stats.obstaclesHit;
    
    // Save best score first
    const scoreKey = `${Game.selectedCharacter}_${Game.selectedLevel}`;
    const prev = this.saveData.bestScores[scoreKey] || 0;
    if (stats.score > prev) {
      this.saveData.bestScores[scoreKey] = stats.score;
    }
    
    // Unlock logic
    const unlockEl = document.getElementById('gameoverUnlock');
    let unlockMsg = '';
    const levelData = GAME_DATA.levels[Game.selectedLevel];
    const passScore = levelData.passScore;
    const curLevel = Game.selectedLevel;
    const curChar = Game.selectedCharacter;
    
    if (curChar !== 'boss') {
      // Check if all 3 non-boss characters have passed this level → unlock boss
      const nonBossRoles = ['pm', 'algorithm', 'backend'];
      const allPassed = nonBossRoles.every(role => {
        const key = `${role}_${curLevel}`;
        return (this.saveData.bestScores[key] || 0) >= passScore;
      });
      if (allPassed && !this.saveData.bossUnlocked.includes(curLevel)) {
        this.saveData.bossUnlocked.push(curLevel);
        unlockMsg += `🔓 解锁老板角色（第${curLevel}关）\n`;
      }
    } else {
      // Boss passed this level → unlock next level for all characters
      const bestBoss = this.saveData.bestScores[scoreKey] || 0;
      if (bestBoss >= passScore) {
        const nextLvl = curLevel + 1;
        if (GAME_DATA.levels[nextLvl] && !this.saveData.unlockedLevels.includes(nextLvl)) {
          this.saveData.unlockedLevels.push(nextLvl);
          unlockMsg += `🔓 解锁新关卡：${GAME_DATA.levels[nextLvl].name}\n`;
        }
      }
    }
    
    Storage.save(this.saveData);
    
    if (unlockMsg) {
      unlockEl.textContent = unlockMsg;
      unlockEl.classList.add('show');
    } else {
      unlockEl.classList.remove('show');
    }
    
    this.showOverlay('overlay-gameover');
  }
};

// ---------- 游戏核心引擎 ----------
const Game = {
  selectedCharacter: 'pm',
  selectedLevel: 1,
  
  // Game state
  canvas: null,
  ctx: null,
  running: false,
  paused: false,
  animFrame: null,
  
  // Dimensions
  width: 0,
  height: 0,
  laneCount: 5,
  laneWidth: 0,
  
  // Player
  player: null,
  
  // Items on screen
  items: [],
  
  // Stats
  health: 5,
  maxHealth: 5,
  score: 0,
  survivalTime: 0,
  collected: 0,
  obstaclesHit: 0,
  
  // Timing
  lastTime: 0,
  spawnTimer: 0,
  gameTime: 0,
  
  // Speed & difficulty
  baseSpeed: 0,
  currentSpeed: 0,
  spawnInterval: 0,
  
  // Grid lines for scrolling effect
  gridOffset: 0,
  
  // Level items pool
  obstaclePool: [],
  collectiblePool: [],
  
  // Input
  touchStartX: 0,
  
  // ---------- Init & Start ----------
  start() {
    this.canvas = document.getElementById('gameCanvas');
    this.ctx = this.canvas.getContext('2d');
    
    UI.showScreen('screen-game');
    // Wait one frame for layout to compute before reading dimensions
    requestAnimationFrame(() => {
      this.setupCanvas();
      this.initGameState();
      this.bindInput();
      this.startCountdown();
    });
  },
  
  startFromSecret() {
    this.selectedCharacter = document.getElementById('secretCharacter').value;
    this.selectedLevel = parseInt(document.getElementById('secretLevel').value);
    this.start();
  },
  
  setupCanvas() {
    const area = document.getElementById('gameArea');
    const w = area.clientWidth;
    const h = area.clientHeight;
    
    // Canvas aspect ratio for 5-lane game
    const maxW = Math.min(w, 500);
    const canvasH = h;
    const canvasW = maxW;
    
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = canvasW * dpr;
    this.canvas.height = canvasH * dpr;
    this.canvas.style.width = canvasW + 'px';
    this.canvas.style.height = canvasH + 'px';
    this.ctx.scale(dpr, dpr);
    
    this.width = canvasW;
    this.height = canvasH;
    this.laneWidth = canvasW / this.laneCount;
  },
  
  initGameState() {
    const charData = GAME_DATA.characters[this.selectedCharacter];
    const levelData = GAME_DATA.levels[this.selectedLevel];
    
    this.maxHealth = 6;
    this.health = this.maxHealth;
    this.score = 0;
    this.survivalTime = 0;
    this.collected = 0;
    this.obstaclesHit = 0;
    this.gameTime = 0;
    this.spawnTimer = 0;
    this.items = [];
    this.paused = false;
    this.gridOffset = 0;
    
    this.baseSpeed = levelData.speed;
    this.currentSpeed = this.baseSpeed;
    this.spawnInterval = levelData.spawnInterval;
    
    // Player
    this.player = {
      lane: 2, // Middle lane (0-indexed)
      x: 0,
      y: 0,
      targetX: 0,
      emoji: charData.emoji,
      color: charData.color,
      moveSpeed: charData.speed,
      size: this.laneWidth * 0.6,
      animOffset: 0
    };
    this.updatePlayerPosition();
    this.player.x = this.player.targetX;
    
    // Item pools
    const itemData = GAME_DATA.items[this.selectedCharacter][this.selectedLevel];
    this.obstaclePool = itemData.obstacles;
    this.collectiblePool = itemData.collectibles;
    
    // Update HUD
    UI.updateHealth(this.health, this.maxHealth);
    UI.updateTime(GAME_DATA.maxGameTime);
    UI.updateScore(0);
  },
  
  updatePlayerPosition() {
    this.player.targetX = this.player.lane * this.laneWidth + this.laneWidth / 2;
    this.player.y = this.height - this.player.size - 30;
  },
  
  // ---------- Countdown ----------
  startCountdown() {
    UI.showOverlay('overlay-countdown');
    const numEl = document.getElementById('countdownNumber');
    let count = 3;
    
    const tick = () => {
      if (count > 0) {
        numEl.textContent = count;
        numEl.style.animation = 'none';
        numEl.offsetHeight; // trigger reflow
        numEl.style.animation = 'countPulse 1s ease-in-out';
        count--;
        setTimeout(tick, 1000);
      } else {
        numEl.textContent = 'GO!';
        numEl.style.animation = 'none';
        numEl.offsetHeight;
        numEl.style.animation = 'countPulse 1s ease-in-out';
        setTimeout(() => {
          UI.hideOverlay('overlay-countdown');
          this.running = true;
          this.lastTime = performance.now();
          this.loop(this.lastTime);
        }, 600);
      }
    };
    
    setTimeout(tick, 300);
  },
  
  // ---------- Input ----------
  bindInput() {
    // Remove old listeners
    this._onKeyDown = this._onKeyDown || this.handleKeyDown.bind(this);
    this._onTouchStart = this._onTouchStart || this.handleTouchStart.bind(this);
    this._onTouchEnd = this._onTouchEnd || this.handleTouchEnd.bind(this);
    
    document.removeEventListener('keydown', this._onKeyDown);
    document.addEventListener('keydown', this._onKeyDown);
    
    const touchLeft = document.getElementById('touchLeft');
    const touchRight = document.getElementById('touchRight');
    
    touchLeft.removeEventListener('touchstart', this._onTouchStart);
    touchRight.removeEventListener('touchstart', this._onTouchStart);
    touchLeft.removeEventListener('click', this._onTouchEnd);
    touchRight.removeEventListener('click', this._onTouchEnd);
    
    touchLeft.addEventListener('touchstart', (e) => { e.preventDefault(); this.movePlayer(-1); });
    touchRight.addEventListener('touchstart', (e) => { e.preventDefault(); this.movePlayer(1); });
    touchLeft.addEventListener('click', () => this.movePlayer(-1));
    touchRight.addEventListener('click', () => this.movePlayer(1));
    
    // Swipe support on canvas
    this.canvas.addEventListener('touchstart', (e) => {
      this.touchStartX = e.touches[0].clientX;
    }, { passive: true });
    this.canvas.addEventListener('touchend', (e) => {
      const dx = e.changedTouches[0].clientX - this.touchStartX;
      if (Math.abs(dx) > 30) {
        this.movePlayer(dx > 0 ? 1 : -1);
      }
    }, { passive: true });
  },
  
  handleKeyDown(e) {
    if (!this.running) return;
    if (e.key === 'ArrowLeft' || e.key === 'a') { e.preventDefault(); this.movePlayer(-1); }
    if (e.key === 'ArrowRight' || e.key === 'd') { e.preventDefault(); this.movePlayer(1); }
    if (e.key === 'Escape' || e.key === 'p') this.togglePause();
  },
  
  handleTouchStart(e) { /* handled inline */ },
  handleTouchEnd(e) { /* handled inline */ },
  
  movePlayer(dir) {
    if (this.paused || !this.running) return;
    const newLane = this.player.lane + dir;
    if (newLane >= 0 && newLane < this.laneCount) {
      this.player.lane = newLane;
      this.updatePlayerPosition();
    }
  },
  
  // ---------- Game Loop ----------
  loop(timestamp) {
    if (!this.running) return;
    
    const dt = Math.min((timestamp - this.lastTime) / 1000, 0.05);
    this.lastTime = timestamp;
    
    if (!this.paused) {
      this.update(dt);
      this.render();
    }
    
    this.animFrame = requestAnimationFrame((t) => this.loop(t));
  },
  
  update(dt) {
    // Time
    this.gameTime += dt;
    this.survivalTime += dt;
    
    const remaining = GAME_DATA.maxGameTime - this.gameTime;
    UI.updateTime(Math.max(0, remaining));
    
    // Score: 1 point per second
    this.score = Math.floor(this.survivalTime) + this.collected * 5;
    UI.updateScore(this.score);
    
    // Speed ramp up over time
    this.currentSpeed = this.baseSpeed + (this.gameTime / GAME_DATA.maxGameTime) * 1.5;
    
    // Spawn items
    this.spawnTimer += dt * 1000;
    if (this.spawnTimer >= this.spawnInterval) {
      this.spawnTimer = 0;
      this.spawnItem();
    }
    
    // Update player x with smooth movement
    const px = this.player;
    px.x += (px.targetX - px.x) * 0.2;
    px.animOffset = Math.sin(this.gameTime * 3) * 3;
    
    // Update items
    for (let i = this.items.length - 1; i >= 0; i--) {
      const item = this.items[i];
      item.y += this.currentSpeed * 60 * dt;
      item.rotation += item.rotSpeed * dt;
      
      // Collision check
      if (this.checkCollision(item)) {
        if (item.type === 'obstacle') {
          this.onObstacleHit(item);
        } else {
          this.onCollectibleHit(item);
        }
        this.items.splice(i, 1);
        continue;
      }
      
      // Remove if off screen
      if (item.y > this.height + 60) {
        this.items.splice(i, 1);
      }
    }
    
    // Grid scroll
    this.gridOffset = (this.gridOffset + this.currentSpeed * 60 * dt) % 40;
    
    // Time up
    if (this.gameTime >= GAME_DATA.maxGameTime) {
      this.gameOver();
    }
  },
  
  spawnItem() {
    const lane = Math.floor(Math.random() * this.laneCount);
    const isObstacle = Math.random() < 0.55;
    
    const pool = isObstacle ? this.obstaclePool : this.collectiblePool;
    const data = pool[Math.floor(Math.random() * pool.length)];
    
    this.items.push({
      x: lane * this.laneWidth + this.laneWidth / 2,
      y: -50,
      lane: lane,
      size: this.laneWidth * 0.55,
      type: isObstacle ? 'obstacle' : 'collectible',
      emoji: data.emoji,
      name: data.name,
      rotation: 0,
      rotSpeed: isObstacle ? (Math.random() - 0.5) * 2 : 0.5,
      bobOffset: Math.random() * Math.PI * 2
    });
    
    // Sometimes spawn a second item in a different lane
    if (Math.random() < 0.3 + this.gameTime / GAME_DATA.maxGameTime * 0.3) {
      let lane2 = lane;
      while (lane2 === lane) lane2 = Math.floor(Math.random() * this.laneCount);
      const isObs2 = Math.random() < 0.5;
      const pool2 = isObs2 ? this.obstaclePool : this.collectiblePool;
      const data2 = pool2[Math.floor(Math.random() * pool2.length)];
      
      this.items.push({
        x: lane2 * this.laneWidth + this.laneWidth / 2,
        y: -50,
        lane: lane2,
        size: this.laneWidth * 0.55,
        type: isObs2 ? 'obstacle' : 'collectible',
        emoji: data2.emoji,
        name: data2.name,
        rotation: 0,
        rotSpeed: isObs2 ? (Math.random() - 0.5) * 2 : 0.5,
        bobOffset: Math.random() * Math.PI * 2
      });
    }
  },
  
  checkCollision(item) {
    const px = this.player;
    const dx = Math.abs(item.x - px.x);
    const dy = Math.abs(item.y - px.y);
    const hitDist = (px.size + item.size) * 0.35;
    return dx < hitDist && dy < hitDist;
  },
  
  onObstacleHit(item) {
    this.health = Math.max(0, this.health - 1);
    this.obstaclesHit++;
    UI.updateHealth(this.health, this.maxHealth);
    UI.showItemPopup(item.name, true);
    
    // Screen shake
    const gameArea = document.getElementById('gameArea');
    gameArea.classList.add('screen-shake');
    setTimeout(() => gameArea.classList.remove('screen-shake'), 200);
    
    // Vibration feedback
    if (navigator.vibrate) {
      navigator.vibrate(150);
    }
    
    if (this.health <= 0) {
      this.gameOver();
    }
  },
  
  onCollectibleHit(item) {
    this.collected++;
    if (this.health < this.maxHealth) {
      this.health = Math.min(this.health + 0.5, this.maxHealth);
      UI.updateHealth(this.health, this.maxHealth);
    }
    UI.showItemPopup(item.name, false);
  },
  
  // ---------- Render ----------
  render() {
    const ctx = this.ctx;
    const w = this.width;
    const h = this.height;
    
    // Background
    const levelData = GAME_DATA.levels[this.selectedLevel];
    ctx.fillStyle = levelData.bgColor;
    ctx.fillRect(0, 0, w, h);
    
    // Scrolling grid
    this.renderGrid(ctx, w, h);
    
    // Lane separators
    this.renderLanes(ctx, w, h);
    
    // Items
    this.items.forEach(item => this.renderItem(ctx, item));
    
    // Player
    this.renderPlayer(ctx);
  },
  
  renderGrid(ctx, w, h) {
    ctx.strokeStyle = 'rgba(0,255,65,0.04)';
    ctx.lineWidth = 1;
    
    const gridSize = 40;
    const offset = this.gridOffset;
    
    for (let y = -gridSize + offset; y < h; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }
  },
  
  renderLanes(ctx, w, h) {
    for (let i = 1; i < this.laneCount; i++) {
      const x = i * this.laneWidth;
      ctx.strokeStyle = 'rgba(0,255,65,0.08)';
      ctx.lineWidth = 1;
      ctx.setLineDash([20, 15]);
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
      ctx.setLineDash([]);
    }
    
    // Side borders with glow
    const gradient = ctx.createLinearGradient(0, 0, 0, h);
    gradient.addColorStop(0, 'rgba(0,255,65,0.0)');
    gradient.addColorStop(0.5, 'rgba(0,255,65,0.15)');
    gradient.addColorStop(1, 'rgba(0,255,65,0.0)');
    
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(1, 0); ctx.lineTo(1, h); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(w - 1, 0); ctx.lineTo(w - 1, h); ctx.stroke();
  },
  
  renderItem(ctx, item) {
    ctx.save();
    ctx.translate(item.x, item.y);
    
    const scale = 0.85 + (item.y / this.height) * 0.3;
    const bob = Math.sin(this.gameTime * 3 + item.bobOffset) * 3;
    ctx.translate(0, bob);
    ctx.scale(scale, scale);
    
    const isObs = item.type === 'obstacle';
    
    // Colored glow (red/green) + dark shadow
    ctx.shadowColor = isObs ? 'rgba(255,0,64,0.35)' : 'rgba(0,255,65,0.35)';
    ctx.shadowBlur = 18;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 4;
    
    // Draw emoji (68px)
    ctx.font = '48px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(item.emoji, 0, 0);
    
    // Reset shadow for label
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    
    // Item name label below emoji
    ctx.font = '10px "Share Tech Mono", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const labelY = 42;
    const labelText = item.name;
    const labelW = ctx.measureText(labelText).width + 12;
    
    // Label background
    ctx.fillStyle = 'rgba(0,0,0,0.7)';
    ctx.fillRect(-labelW / 2, labelY - 8, labelW, 16);
    
    // Label border
    ctx.strokeStyle = isObs ? 'rgba(255,0,64,0.2)' : 'rgba(0,255,65,0.2)';
    ctx.lineWidth = 1;
    ctx.strokeRect(-labelW / 2, labelY - 8, labelW, 16);
    
    // Label text
    ctx.fillStyle = isObs ? '#ff4060' : '#40ff70';
    ctx.fillText(labelText, 0, labelY);
    
    ctx.restore();
  },
  
  renderPlayer(ctx) {
    const p = this.player;
    ctx.save();
    ctx.translate(p.x, p.y + p.animOffset);
    
    // Platform glow
    ctx.fillStyle = 'rgba(0,255,65,0.3)';
    ctx.beginPath();
    ctx.ellipse(0, 38, 35, 5, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw player emoji (68px)
    ctx.font = '48px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(p.emoji, 0, 0);
    
    // Damage flash when low health
    if (this.health <= 2) {
      ctx.fillStyle = `rgba(255,0,64,${0.15 + Math.sin(this.gameTime * 6) * 0.1})`;
      ctx.fillRect(-34, -34, 68, 68);
    }
    
    ctx.restore();
  },
  
  // ---------- Game Control ----------
  togglePause() {
    if (!this.running) return;
    this.paused = !this.paused;
    if (this.paused) {
      UI.showOverlay('overlay-pause');
    } else {
      UI.hideOverlay('overlay-pause');
      this.lastTime = performance.now();
    }
  },
  
  gameOver() {
    this.running = false;
    if (this.animFrame) cancelAnimationFrame(this.animFrame);
    
    const levelData = GAME_DATA.levels[this.selectedLevel];
    UI.showGameOver({
      score: this.score,
      survivalTime: this.survivalTime,
      collected: this.collected,
      obstaclesHit: this.obstaclesHit,
      targetScore: levelData.passScore || 0
    });
  },
  
  restart() {
    UI.hideOverlay('overlay-gameover');
    this.initGameState();
    this.startCountdown();
  },
  
  quit() {
    this.running = false;
    if (this.animFrame) cancelAnimationFrame(this.animFrame);
    UI.hideOverlay('overlay-pause');
    UI.hideOverlay('overlay-gameover');
    UI.showScreen('screen-menu');
  }
};

// ---------- 初始化 ----------
window.addEventListener('DOMContentLoaded', () => {
  UI.init();
});

// Handle resize
window.addEventListener('resize', () => {
  if (Game.running && Game.canvas) {
    Game.setupCanvas();
  }
});
