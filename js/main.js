// ===================================================
// UNICEFIGHT - MVP
// main.js FINAL FASE 4 PREPARADO PARA ESCALABILIDADE
// ===================================================
// PREPARAÇÃO PARA FASE 5:
// ✔ Estrutura pronta para múltiplas fases
// ✔ Sistema preparado para áudio
// ✔ Sistema preparado para efeitos
// ✔ Sistema preparado para animações
// ✔ Separação de update/draw
// ✔ Controle centralizado de jogo
// ✔ Futuro save/load facilitado
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

window.addEventListener(
  'resize',
  resizeCanvas
);

resizeCanvas();

// -----------------------------------------------
// ESTADOS DO JOGO
// -----------------------------------------------
const STATES = {

  PLAYING: 'playing',

  PAUSED: 'paused',

  GAME_OVER: 'gameOver',

  VICTORY: 'victory'
};

// -----------------------------------------------
// CONFIGURAÇÃO GLOBAL
// FUTURAMENTE:
// volume, dificuldade,
// fullscreen, idioma etc.
// -----------------------------------------------
const GameSettings = {

  soundVolume: 1,

  musicVolume: 1,

  effectsEnabled: true,

  particlesEnabled: true
};

// -----------------------------------------------
// GAME MANAGER
// CENTRALIZA TUDO
// -----------------------------------------------
const Game = {

  state: STATES.PLAYING,

  currentPhaseIndex: 0,

  player: null,

  phase: null,

  isRunning: true
};

// -----------------------------------------------
// INPUT LOCKS
// -----------------------------------------------
let pausePressed = false;

// -----------------------------------------------
// SISTEMA DE ÁUDIO
// PREPARADO PARA FASE 5
// -----------------------------------------------
const AudioManager = {

  sounds: {},

  music: null,

  play(soundName) {

    // futuro:
    // tocar efeito
  },

  stop(soundName) {

    // futuro:
    // parar efeito
  },

  playMusic(trackName) {

    // futuro:
    // tocar música
  }
};

// -----------------------------------------------
// SISTEMA DE EFEITOS
// PREPARADO PARA FASE 5
// -----------------------------------------------
const EffectsManager = {

  effects: [],

  update() {

    // futuro:
    // atualizar partículas
  },

  draw(ctx) {

    // futuro:
    // desenhar partículas
  },

  add(effectData) {

    // futuro:
    // adicionar efeito
  }
};

// -----------------------------------------------
// SISTEMA DE ANIMAÇÃO
// PREPARADO PARA FASE 5
// -----------------------------------------------
const AnimationManager = {

  update() {

    // futuro:
    // atualizar animações
  }
};

// -----------------------------------------------
// CRIAR PLAYER
// -----------------------------------------------
function createPlayer() {

  return new Player(
    80,
    GAME_HEIGHT - 160,
    'masculino'
  );
}

// -----------------------------------------------
// CRIAR FASE
// -----------------------------------------------
function createPhase(index) {

  return new Phase(
    index,
    GAME_WIDTH,
    GAME_HEIGHT
  );
}

// -----------------------------------------------
// INICIAR / RESETAR JOGO
// -----------------------------------------------
function init() {

  enterPressed = false;
  pausePressed = false;

  // =======================================
  // RESET ESTADO
  // =======================================
  Game.currentPhaseIndex = 0;
  Game.state = STATES.PLAYING;
  Game.phase = null;
  // =======================================
  // PLAYER
  // =======================================
  Game.player = createPlayer();

  // =======================================
  // FASE
  // =======================================
  Game.phase = createPhase(
    Game.currentPhaseIndex
  );

  // =======================================
  // BOSS
  // =======================================
  if (Game.phase.boss) {

    Game.phase.boss.isActive = true;

    Game.phase.boss.introShown = true;
  }

  console.log(
    '[UNICEFIGHT] iniciado!'
  );
}

// -----------------------------------------------
// TROCAR FASE
// PREPARADO PARA FASE 5
// -----------------------------------------------
function loadNextPhase() {

  Game.currentPhaseIndex++;

  Game.phase = createPhase(
    Game.currentPhaseIndex
  );

  Game.player.reset(
    80,
    GAME_HEIGHT - 160
  );
}

// -----------------------------------------------
// CONTROLES GLOBAIS
// -----------------------------------------------
window.addEventListener(
  'keydown',
  (e) => {

    console.log(e.key);

    // ===================================
    // PAUSA
    // ===================================
    if (
      e.key.toLowerCase() === 'p' &&
      !pausePressed
    ) {

      pausePressed = true;

      if (Game.state === STATES.PLAYING) {

        Game.state = STATES.PAUSED;
      }
      else if (
        Game.state === STATES.PAUSED
      ) {

        Game.state = STATES.PLAYING;
      }
    }

  // ===================================
  // RESTART
  // ===================================
  if (e.key === 'Enter') {

    console.log('ENTER');

    if (
      Game.state === STATES.GAME_OVER ||
      Game.state === STATES.VICTORY
    ) {

      console.log('REINICIANDO');

      enterPressed = false;

      init();
    }
  }
  }
);

window.addEventListener(
  'keyup',
  (e) => {

    if (
      e.key.toLowerCase() === 'p'
    ) {

      pausePressed = false;
    }

  }
);

// -----------------------------------------------
// LOOP PRINCIPAL
// -----------------------------------------------
function gameLoop() {

  if (!Game.isRunning) return;

  ctx.clearRect(
    0,
    0,
    GAME_WIDTH,
    GAME_HEIGHT
  );

  switch (Game.state) {

    // ===================================
    // PLAYING
    // ===================================
    case STATES.PLAYING:

      updateGame();

      drawGame();

      break;

    // ===================================
    // PAUSED
    // ===================================
    case STATES.PAUSED:

      drawGame();

      drawPauseScreen();

      break;

    // ===================================
    // GAME OVER
    // ===================================
    case STATES.GAME_OVER:

      drawGame();

      drawGameOver(
        ctx,
        canvas
      );

      break;

    // ===================================
    // VICTORY
    // ===================================
    case STATES.VICTORY:

      drawGame();

      drawPhaseVictory(
        ctx,
        canvas,
        Game.currentPhaseIndex + 1,
        1000
      );

      break;
  }

  requestAnimationFrame(
    gameLoop
  );
}

// -----------------------------------------------
// UPDATE CENTRAL
// -----------------------------------------------
function updateGame() {

  if (
    !Game.player ||
    !Game.phase
  ) {
    return;
  }

  // ===================================
  // UPDATE PLAYER
  // ===================================
  Game.player.update(
    Game.phase.platforms,
    GAME_WIDTH,
    GAME_HEIGHT
  );

  // ===================================
  // UPDATE FASE
  // ===================================
  Game.phase.update(
    Game.player
  );

  // ===================================
  // EFEITOS
  // ===================================
  EffectsManager.update();

  // ===================================
  // ANIMAÇÕES
  // ===================================
  AnimationManager.update();

  // ===================================
  // COLISÃO PLAYER/BOSS
  // ===================================
  if (
    Game.phase.boss &&
    !Game.phase.boss.isDefeated
  ) {

    resolveEntityCollision(
      Game.player,
      Game.phase.boss
    );
  }

  // ===================================
  // ATAQUES DO PLAYER
  // ===================================
  if (
    Game.phase.boss &&
    !Game.phase.boss.isDefeated
  ) {

    if (
    checkAttackCollision(
      Game.player,
      Game.phase.boss
    )
    ) {

    console.log("COLIDIU");
    }

    if (
      checkAttackCollision(
        Game.player,
        Game.phase.boss
      ) &&
      !Game.player.attackAlreadyHit
    ) {

      let damage = 0;

      // SOCO
      if (Game.player.isAttacking) {

        damage =
          Game.player.attackDamage;
      }

      // CHUTE
      else if (Game.player.isKicking) {

        damage =
          Game.player.kickDamage;
      }

      // CHUTE AÉREO
      else if (
        Game.player.isAirKicking
      ) {

        damage =
          Game.player.airKickDamage;
      }

      Game.phase.boss.takeDamage(
        damage
      );

      // Impede múltiplos hits
      Game.player.attackAlreadyHit = true;
    }
  }

  // ===================================
  // TEMPO ACABOU
  // ===================================
  if (
    Game.phase.timeLeft <= 0
  ) {

    Game.player.isDead = true;

    Game.state = STATES.GAME_OVER;
  }

  // ===================================
  // PLAYER MORREU
  // ===================================
  if (
    Game.player.isDead
  ) {

    Game.state = STATES.GAME_OVER;
  }

  // ===================================
  // VITÓRIA
  // ===================================
  if (
    Game.state === STATES.PLAYING &&
    Game.phase.boss &&
    Game.phase.boss.isDefeated
  ) {

    Game.state = STATES.VICTORY;

    return;
  }
}

// -----------------------------------------------
// DRAW CENTRAL
// -----------------------------------------------
function drawGame() {

  if (
    !Game.player ||
    !Game.phase
  ) {
    return;
  }

  // ===================================
  // CENÁRIO
  // ===================================
  Game.phase.draw(ctx);

  // ===================================
  // PLAYER
  // ===================================
  Game.player.draw(ctx);

  // ===================================
  // EFEITOS
  // ===================================
  EffectsManager.draw(ctx);

  // ===================================
  // HUD
  // ===================================
  HUD.draw(
    ctx,
    canvas,
    Game.player,
    Game.phase.boss,
    Game.phase.timeLeft,
    Game.currentPhaseIndex + 1
  );
}

// -----------------------------------------------
// TELA DE PAUSA
// -----------------------------------------------
function drawPauseScreen() {

  ctx.save();

  // Fundo
  ctx.fillStyle =
    'rgba(0,0,0,0.6)';

  ctx.fillRect(
    0,
    0,
    GAME_WIDTH,
    GAME_HEIGHT
  );

  // Texto
  ctx.fillStyle = '#FFF';

  ctx.textAlign = 'center';

  ctx.font =
    'bold 42px monospace';

  ctx.fillText(
    'PAUSADO',
    GAME_WIDTH / 2,
    GAME_HEIGHT / 2 - 20
  );

  ctx.font =
    '20px monospace';

  ctx.fillText(
    'Pressione P para continuar',
    GAME_WIDTH / 2,
    GAME_HEIGHT / 2 + 30
  );

  ctx.restore();
}

// -----------------------------------------------
// INICIAR
// -----------------------------------------------
init();

gameLoop();

// -----------------------------------------------
// LOG
// -----------------------------------------------
console.log(`

=========================
UNICEFIGHT MVP
=========================

Controles:
A/D = mover
W = pular
J = soco
K = chute
P = pausar
ENTER = reiniciar

FASE 4 FINALIZADA

Preparado para:
✔ múltiplas fases
✔ animações
✔ efeitos
✔ áudio
✔ expansão futura

`);