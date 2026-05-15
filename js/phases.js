// ===================================================
// UNICEFIGHT - Sistema de Fases (MVP)
// Arquivo: js/phases.js
// ===================================================

// -----------------------------------------------
// DADOS DA ÚNICA FASE
// -----------------------------------------------
const PHASE_DATA = [
  {
    name: '1º Semestre',
    subtitle: 'Professor Pedro',
    bgColor: '#4A6080',
    groundColor: '#808080',

    hasBoss: true,
    bossName: 'pedro',

    timeLimit: 90
  }
];

// -----------------------------------------------
// CLASSE DA FASE
// -----------------------------------------------
class Phase {

  constructor(phaseIndex, canvasWidth, canvasHeight) {

    this.index = phaseIndex;
    this.data = PHASE_DATA[phaseIndex];

    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;

    // -----------------------------
    // TIMER
    // -----------------------------
    this.timeLimit = this.data.timeLimit;
    this.timeLeft = this.timeLimit;
    this.frameCounter = 0;

    // -----------------------------
    // ESTADO
    // -----------------------------
    this.isComplete = false;
    this.isFailed = false;

    // -----------------------------
    // SEM INIMIGOS COMUNS
    // -----------------------------
    this.enemies = [];

    // -----------------------------
    // SEM ITENS
    // -----------------------------
    this.items = [];

    // -----------------------------
    // BOSS
    // -----------------------------
    this.boss = new Boss(
      0,
      canvasWidth,
      canvasHeight
    );

    this.boss.isActive = true;

    // -----------------------------
    // CHÃO
    // -----------------------------
    this.platforms = this.createPlatforms();

    // -----------------------------
    // SCORE
    // -----------------------------
    this.score = 0;
  }

  // -----------------------------------------------
  // PLATAFORMAS
  // -----------------------------------------------
  createPlatforms() {

    const platforms = [];

    // Apenas chão
    platforms.push({
      x: 0,
      y: this.canvasHeight - 20,
      width: this.canvasWidth,
      height: 20,
      color: this.data.groundColor
    });

    return platforms;
  }

  // -----------------------------------------------
  // UPDATE
  // -----------------------------------------------
  update(player) {

    // -----------------------------
    // TIMER
    // -----------------------------
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

    // -----------------------------
    // BOSS
    // -----------------------------
    if (this.boss && this.boss.isActive) {

      this.boss.update(player);

      // Boss ataca player
      if (this.boss.isHittingPlayer(player)) {
        player.takeDamage(this.boss.damage * 0.08);
      }

      // Player ataca boss
      if (checkAttackCollision(player, this.boss)) {

        const damage = player.isKicking ? 20 : 10;

        this.boss.takeDamage(damage);
      }

      // Boss derrotado
      if (this.boss.isDefeated) {

        this.isComplete = true;

        this.score += 500 + (this.timeLeft * 5);

        player.score = this.score;
      }
    }
  }

  // -----------------------------------------------
  // DRAW
  // -----------------------------------------------
  draw(ctx) {

    this.drawBackground(ctx);

    this.drawPlatforms(ctx);

    if (this.boss) {
      this.boss.draw(ctx);
    }
  }

  // -----------------------------------------------
  // BACKGROUND
  // -----------------------------------------------
  drawBackground(ctx) {

    // Fundo
    ctx.fillStyle = this.data.bgColor;

    ctx.fillRect(
      0,
      0,
      this.canvasWidth,
      this.canvasHeight
    );

    // Chão
    const groundGrad = ctx.createLinearGradient(
      0,
      this.canvasHeight - 80,
      0,
      this.canvasHeight
    );

    groundGrad.addColorStop(0, this.data.groundColor);
    groundGrad.addColorStop(1, '#333');

    ctx.fillStyle = groundGrad;

    ctx.fillRect(
      0,
      this.canvasHeight - 80,
      this.canvasWidth,
      80
    );

    // Faculdade simples no fundo

    ctx.fillStyle = '#2E3B55';

    ctx.fillRect(
      500,
      120,
      220,
      220
    );

    // Janelas

    ctx.fillStyle = '#AABBDD';

    for (let y = 150; y < 300; y += 40) {

      for (let x = 530; x < 680; x += 40) {

        ctx.fillRect(x, y, 20, 20);
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
}