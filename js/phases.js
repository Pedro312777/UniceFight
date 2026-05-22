// ===================================================
// UNICEFIGHT - Sistema de Fases
// Arquivo: js/phases.js
// PREPARADO PARA FASE 5
// ===================================================
// PREPARAÇÃO REALIZADA:
// ✔ Múltiplas fases
// ✔ Múltiplos backgrounds
// ✔ Música por fase
// ✔ Efeitos climáticos
// ✔ Eventos de fase
// ✔ Spawn de inimigos
// ✔ Itens futuros
// ✔ Sistema de checkpoint
// ✔ Sistema de waves
// ✔ Sistema de cutscene
// ✔ Estrutura para animações
// ===================================================

// -----------------------------------------------
// DADOS DAS FASES
// -----------------------------------------------
const PHASE_DATA = [

  // =============================================
  // FASE 1
  // =============================================
  {
    id: 1,

    name: '1º Semestre',

    subtitle: 'Professor Pedro',

    bgColor: '#4A6080',

    groundColor: '#808080',

    // =========================================
    // BOSS
    // =========================================
    hasBoss: true,

    bossName: 'pedro',

    // =========================================
    // TIMER
    // =========================================
    timeLimit: 90,

    // =========================================
    // ÁUDIO FUTURO
    // =========================================
    music: 'fase1_theme',

    bossMusic: 'boss_pedro',

    // =========================================
    // EFEITOS FUTUROS
    // =========================================
    weather: null,

    ambientEffects: true,

    // =========================================
    // CENÁRIO
    // =========================================
    backgroundType: 'campus',

    // =========================================
    // EVENTOS FUTUROS
    // =========================================
    cutsceneIntro: false,

    cutsceneEnding: false,

    // =========================================
    // WAVES FUTURAS
    // =========================================
    enemyWaves: [],

    // =========================================
    // ITENS FUTUROS
    // =========================================
    itemSpawns: []
  }
];

// -----------------------------------------------
// CLASSE DA FASE
// -----------------------------------------------
class Phase {

  constructor(
    phaseIndex,
    canvasWidth,
    canvasHeight
  ) {

    // =========================================
    // DADOS
    // =========================================
    this.index = phaseIndex;

    this.data = PHASE_DATA[phaseIndex];

    this.canvasWidth = canvasWidth;

    this.canvasHeight = canvasHeight;

    // =========================================
    // TIMER
    // =========================================
    this.timeLimit = this.data.timeLimit;

    this.timeLeft = this.timeLimit;

    this.frameCounter = 0;

    // =========================================
    // ESTADO
    // =========================================
    this.isComplete = false;

    this.isFailed = false;

    this.isPaused = false;

    // =========================================
    // SCORE
    // =========================================
    this.score = 0;

    // =========================================
    // PLAYER SPAWN
    // FUTURO CHECKPOINT
    // =========================================
    this.playerSpawn = {

      x: 80,

      y: canvasHeight - 160
    };

    // =========================================
    // CHECKPOINT FUTURO
    // =========================================
    this.checkpoints = [];

    // =========================================
    // INIMIGOS FUTUROS
    // =========================================
    this.enemies = [];

    // =========================================
    // WAVES FUTURAS
    // =========================================
    this.currentWave = 0;

    this.waveStarted = false;

    // =========================================
    // ITENS FUTUROS
    // =========================================
    this.items = [];

    // =========================================
    // EFEITOS FUTUROS
    // =========================================
    this.effects = [];

    // =========================================
    // EVENTOS FUTUROS
    // =========================================
    this.events = [];

    // =========================================
    // CUTSCENES FUTURAS
    // =========================================
    this.isCutscenePlaying = false;

    // =========================================
    // BOSS
    // =========================================
    this.boss = null;

    if (this.data.hasBoss) {

      this.boss = new Boss(
        phaseIndex,
        canvasWidth,
        canvasHeight
      );

      this.boss.isActive = true;
    }

    // =========================================
    // PLATAFORMAS
    // =========================================
    this.platforms =
      this.createPlatforms();

    // =========================================
    // BACKGROUND LAYERS
    // FUTURO PARALLAX
    // =========================================
    this.backgroundLayers =
      this.createBackgroundLayers();

    // =========================================
    // INICIAR FASE
    // =========================================
    this.startPhase();
  }

  // -----------------------------------------------
  // INICIAR FASE
  // -----------------------------------------------
  startPhase() {

    // =========================================
    // MÚSICA FUTURA
    // =========================================
    /*
    AudioManager.playMusic(
      this.data.music
    );
    */

    // =========================================
    // CUTSCENE FUTURA
    // =========================================
    if (this.data.cutsceneIntro) {

      this.startIntroCutscene();
    }
  }

  // -----------------------------------------------
  // BACKGROUND LAYERS
  // FUTURO PARALLAX
  // -----------------------------------------------
  createBackgroundLayers() {

    return [

      {
        speed: 0.2,
        elements: []
      },

      {
        speed: 0.5,
        elements: []
      },

      {
        speed: 1,
        elements: []
      }
    ];
  }

  // -----------------------------------------------
  // PLATAFORMAS
  // -----------------------------------------------
  createPlatforms() {

    const platforms = [];

    // =========================================
    // CHÃO
    // =========================================
    platforms.push({

      x: 0,

      y: this.canvasHeight - 20,

      width: this.canvasWidth,

      height: 20,

      color: this.data.groundColor
    });

    // =========================================
    // FUTURAS PLATAFORMAS
    // =========================================
    /*
    platforms.push({
      x: 300,
      y: 300,
      width: 200,
      height: 20,
      color: '#777'
    });
    */

    return platforms;
  }

  // -----------------------------------------------
  // UPDATE
  // -----------------------------------------------
  update(player) {

    if (
      this.isComplete ||
      this.isFailed
    ) {
      return;
    }

    // =========================================
    // TIMER
    // =========================================
    this.updateTimer();

    // =========================================
    // BOSS
    // =========================================
    this.updateBoss(player);

    // =========================================
    // INIMIGOS FUTUROS
    // =========================================
    this.updateEnemies(player);

    // =========================================
    // ITENS FUTUROS
    // =========================================
    this.updateItems(player);

    // =========================================
    // EFEITOS FUTUROS
    // =========================================
    this.updateEffects();

    // =========================================
    // EVENTOS FUTUROS
    // =========================================
    this.updateEvents();

    // =========================================
    // CHECA FIM DA FASE
    // =========================================
    this.checkPhaseCompletion(player);
  }

  // -----------------------------------------------
  // TIMER
  // -----------------------------------------------
  updateTimer() {

    this.frameCounter++;

    if (this.frameCounter >= 60) {

      this.frameCounter = 0;

      if (this.timeLeft > 0) {

        this.timeLeft--;
      }
      else {

        this.isFailed = true;
      }
    }
  }

  // -----------------------------------------------
  // UPDATE BOSS
  // -----------------------------------------------
  updateBoss(player) {

    if (
      !this.boss ||
      !this.boss.isActive
    ) {
      return;
    }

    // =========================================
    // UPDATE
    // =========================================
    this.boss.update(player);

    // =========================================
    // BOSS ATACA PLAYER
    // =========================================
    if (
      this.boss.isHittingPlayer(player)
    ) {

      player.takeDamage(
        this.boss.currentDamage
      );
    }

    // =========================================
    // PLAYER ATACA BOSS
    // =========================================
    if (
      checkAttackCollision(
        player,
        this.boss
      )
    ) {

      // Evita múltiplos hits
      if (!player.attackAlreadyHit) {

        let damage = 0;

        // -----------------------------
        // SOCO
        // -----------------------------
        if (player.isAttacking) {

          damage =
            player.attackDamage;
        }

        // -----------------------------
        // CHUTE
        // -----------------------------
        if (
          player.isKicking &&
          player.onGround
        ) {

          damage =
            player.kickDamage;
        }

        // -----------------------------
        // CHUTE AÉREO
        // -----------------------------
        if (
          player.isKicking &&
          !player.onGround
        ) {

          damage = 10;
        }

        this.boss.takeDamage(
          damage
        );

        player.attackAlreadyHit =
          true;
      }
    }
  }

  // -----------------------------------------------
  // UPDATE ENEMIES
  // FUTURO
  // -----------------------------------------------
  updateEnemies(player) {

    for (const enemy of this.enemies) {

      enemy.update(player);
    }
  }

  // -----------------------------------------------
  // UPDATE ITEMS
  // FUTURO
  // -----------------------------------------------
  updateItems(player) {

    // futuro
  }

  // -----------------------------------------------
  // UPDATE EFFECTS
  // FUTURO
  // -----------------------------------------------
  updateEffects() {

    // futuro
  }

  // -----------------------------------------------
  // UPDATE EVENTS
  // FUTURO
  // -----------------------------------------------
  updateEvents() {

    // futuro
  }

  // -----------------------------------------------
  // FIM DA FASE
  // -----------------------------------------------
  checkPhaseCompletion(player) {

    // =========================================
    // BOSS DERROTADO
    // =========================================
    if (
        this.boss &&
        this.boss.isDefeated
      ) {

        this.score =
          500 +
          (this.timeLeft * 5);

        player.score = this.score;
      }
    }

  // -----------------------------------------------
  // DRAW
  // -----------------------------------------------
  draw(ctx) {

    this.drawBackground(ctx);

    this.drawPlatforms(ctx);

    // =========================================
    // INIMIGOS FUTUROS
    // =========================================
    this.drawEnemies(ctx);

    // =========================================
    // ITENS FUTUROS
    // =========================================
    this.drawItems(ctx);

    // =========================================
    // BOSS
    // =========================================
    if (this.boss) {

      this.boss.draw(ctx);
    }

    // =========================================
    // EFEITOS FUTUROS
    // =========================================
    this.drawEffects(ctx);
  }

  // -----------------------------------------------
  // BACKGROUND
  // -----------------------------------------------
  drawBackground(ctx) {

    // =========================================
    // FUNDO
    // =========================================
    ctx.fillStyle =
      this.data.bgColor;

    ctx.fillRect(
      0,
      0,
      this.canvasWidth,
      this.canvasHeight
    );

    // =========================================
    // CHÃO
    // =========================================
    const groundGrad =
      ctx.createLinearGradient(
        0,
        this.canvasHeight - 80,
        0,
        this.canvasHeight
      );

    groundGrad.addColorStop(
      0,
      this.data.groundColor
    );

    groundGrad.addColorStop(
      1,
      '#333'
    );

    ctx.fillStyle = groundGrad;

    ctx.fillRect(
      0,
      this.canvasHeight - 80,
      this.canvasWidth,
      80
    );

    // =========================================
    // BACKGROUND DINÂMICO
    // FUTURO
    // =========================================
    switch (
      this.data.backgroundType
    ) {

      case 'campus':

        this.drawCampusBackground(
          ctx
        );

        break;
    }
  }

  // -----------------------------------------------
  // CAMPUS
  // -----------------------------------------------
  drawCampusBackground(ctx) {

    // Prédio

    ctx.fillStyle = '#2E3B55';

    ctx.fillRect(
      500,
      120,
      220,
      220
    );

    // Janelas

    ctx.fillStyle = '#AABBDD';

    for (
      let y = 150;
      y < 300;
      y += 40
    ) {

      for (
        let x = 530;
        x < 680;
        x += 40
      ) {

        ctx.fillRect(
          x,
          y,
          20,
          20
        );
      }
    }

    // Texto

    ctx.fillStyle = '#FFFFFF';

    ctx.font = '20px Arial';

    ctx.fillText(
      'UNICEPLAC',
      560,
      110
    );
  }

  // -----------------------------------------------
  // PLATAFORMAS
  // -----------------------------------------------
  drawPlatforms(ctx) {

    for (const plat of this.platforms) {

      ctx.fillStyle = plat.color;

      ctx.fillRect(
        plat.x,
        plat.y,
        plat.width,
        plat.height
      );
    }
  }

  // -----------------------------------------------
  // DRAW ENEMIES
  // FUTURO
  // -----------------------------------------------
  drawEnemies(ctx) {

    for (const enemy of this.enemies) {

      enemy.draw(ctx);
    }
  }

  // -----------------------------------------------
  // DRAW ITEMS
  // FUTURO
  // -----------------------------------------------
  drawItems(ctx) {

    // futuro
  }

  // -----------------------------------------------
  // DRAW EFFECTS
  // FUTURO
  // -----------------------------------------------
  drawEffects(ctx) {

    // futuro
  }

  // -----------------------------------------------
  // CUTSCENE FUTURA
  // -----------------------------------------------
  startIntroCutscene() {

    this.isCutscenePlaying = true;
  }
}