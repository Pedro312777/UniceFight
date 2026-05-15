// ===================================================
// UNICEFIGHT - MVP
// main.js simplificado
// ===================================================

// -----------------------------------------------
// CONFIGURAÇÃO DO CANVAS
// -----------------------------------------------
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const GAME_WIDTH = 800;
const GAME_HEIGHT = 480;

canvas.width = GAME_WIDTH;
canvas.height = GAME_HEIGHT;

function resizeCanvas() {
  const scaleX = window.innerWidth / GAME_WIDTH;
  const scaleY = window.innerHeight / GAME_HEIGHT;
  const scale = Math.min(scaleX, scaleY);

  canvas.style.width = `${GAME_WIDTH * scale}px`;
  canvas.style.height = `${GAME_HEIGHT * scale}px`;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// -----------------------------------------------
// ESTADOS DO JOGO
// -----------------------------------------------
const STATES = {
  PLAYING: 'playing',
  GAME_OVER: 'gameOver',
  VICTORY: 'victory'
};

let gameState = STATES.PLAYING;

// -----------------------------------------------
// OBJETOS PRINCIPAIS
// -----------------------------------------------
let player = null;
let phase = null;

// -----------------------------------------------
// INICIALIZAÇÃO
// -----------------------------------------------
function init() {

  // Cria jogador
  player = new Player(80, GAME_HEIGHT - 160, 'masculino');

  // Cria fase única
  phase = new Phase(0, GAME_WIDTH, GAME_HEIGHT);

  // =========================================
  // ATIVA O BOSS IMEDIATAMENTE
  // =========================================
  if (phase.boss) {
    phase.boss.isActive = true;
    phase.boss.introShown = true;
  }

  console.log('[UNICEFIGHT MVP] iniciado!');
}

// -----------------------------------------------
// LOOP PRINCIPAL
// -----------------------------------------------
function gameLoop() {

  ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

  switch (gameState) {

    // ---------------------------------------
    case STATES.PLAYING:

      updatePlaying();
      drawPlaying();

      break;

    // ---------------------------------------
    case STATES.GAME_OVER:

    drawPlaying();
    drawGameOver(ctx, canvas);

    break;
    // ---------------------------------------
    case STATES.VICTORY:

    drawPlaying();

    drawPhaseVictory(
      ctx,
      canvas,
      1,
      1000
    );

    break;
  }

  requestAnimationFrame(gameLoop);
}

// -----------------------------------------------
// UPDATE DO JOGO
// -----------------------------------------------
function updatePlaying() {

  if (!player || !phase) return;

  // Atualiza fase
  phase.update(player);

  // Atualiza player
  player.update(phase.platforms, GAME_WIDTH, GAME_HEIGHT);

  // ---------------------------------------
  // PLAYER MORREU
  // ---------------------------------------
  if (player.isDead) {
    gameState = STATES.GAME_OVER;
  }

  // ---------------------------------------
  // BOSS DERROTADO
  // ---------------------------------------
  if (phase.boss && phase.boss.hp <= 0) {
    gameState = STATES.VICTORY;
  }
}

// -----------------------------------------------
// DESENHA O JOGO
// -----------------------------------------------
function drawPlaying() {

  if (!player || !phase) return;

  // Cenário
  phase.draw(ctx);

  // Player
  player.draw(ctx);

  // HUD
  HUD.draw(
    ctx,
    canvas,
    player,
    phase.boss,
    phase.timeLeft,
    1
  );
}

// -----------------------------------------------
// INICIA O JOGO
// -----------------------------------------------
init();
gameLoop();

console.log(`
=========================
UNICEFIGHT MVP
=========================

Controles:
A/D = mover
W = pular
J = soco
K = chute
`);