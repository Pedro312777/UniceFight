// ===================================================
// UNICEFIGHT - MAIN SYSTEM BALANCED V7
// COMBAT BALANCE + PERFORMANCE PATCH
// ===================================================
// MELHORIAS:
// ✔ Camera integrada corretamente
// ✔ Shake MUITO reduzido
// ✔ Freeze frames balanceados
// ✔ Combos mais lentos
// ✔ Menos spam visual
// ✔ Dash FX reduzido
// ✔ LF2 pacing refinado
// ✔ Melhor duração das lutas
// ✔ Impactos ainda satisfatórios
// ✔ Correção Camera.shake()
// ✔ Loop mais estável
// ===================================================

// ---------------------------------------------------
// CANVAS
// ---------------------------------------------------

const sprites =
new SpriteLoader();

const canvas =
  document.getElementById(
    'gameCanvas'
  );

const ctx =
  canvas.getContext('2d');

const GAME_WIDTH = 800;
const GAME_HEIGHT = 480;

canvas.width = GAME_WIDTH;
canvas.height = GAME_HEIGHT;
let debugMode = false;

// ===================================================
// RESPONSIVE
// ===================================================
function resizeCanvas() {

  const scaleX =
    window.innerWidth /
    GAME_WIDTH;

  const scaleY =
    window.innerHeight /
    GAME_HEIGHT;

  const scale =
    Math.min(scaleX, scaleY);

  canvas.style.width =
    `${GAME_WIDTH * scale}px`;

  canvas.style.height =
    `${GAME_HEIGHT * scale}px`;
}

window.addEventListener(
  'resize',
  resizeCanvas
);

resizeCanvas();

// ===================================================
// STATES
// ===================================================
const STATES = {

  MENU: 'menu',

  CHARACTER_SELECT: 'characterSelect',

  CREDITS: 'credits',

  SETTINGS: 'settings',

  PLAYING: 'playing',

  PAUSED: 'paused',

  GAME_OVER: 'gameOver',

  PHASE_COMPLETE: 'phaseComplete',

  VICTORY: 'victory',

  FINAL: 'final'
};

// ===================================================
// SETTINGS
// ===================================================
const GameSettings = {

  soundVolume: 1,

  musicVolume: 1,

  effectsEnabled: true,

  particlesEnabled: true
};

// ===================================================
// GAME MANAGER
// ===================================================
const Game = {

  state: STATES.MENU,

  currentPhaseIndex: 0,

  selectedGender:
  'masculino',

  player: null,

  phase: null,

  isRunning: true,

  freezeFrames: 0,

  comboScaling: 1,

  lastFrameTime: 0,

  sprites: sprites
};

window.Game = Game;

// ===================================================
// INPUT LOCKS
// ===================================================
let pausePressed = false;

// ===================================================
// PLAYER
// ===================================================
function createPlayer() {

  const player =
    new Player(

      80,

      GAME_HEIGHT - 160,

      Game.selectedGender ||
      'masculino'

    );

  player.spriteSheet =
    sprites.get("player");

  return player;
}
// ===================================================
// PHASE
// ===================================================
function createPhase(index) {
console.log("CRIANDO FASE:", index);

  return new Phase(

    index,

    GAME_WIDTH,

    GAME_HEIGHT
  );
}

async function loadAssets(){

    console.log(
        "Carregando sprites..."
    );

    await sprites.load(

        "player",

        "./assets/player/aluno-sprite-sheet.png"

    );

    await sprites.load(
    "pedro",
    "./assets/bosses/pedro-sprite-sheet.png"
);

    await sprites.load(

    "boss_romes",

    "./assets/bosses/romes-sprite-sheet.png"

    );

  await sprites.load(
    "romulo",
    "./assets/bosses/romulo-sprite-sheet.png"
  );

  await sprites.load(
    "geovanne",
    "./assets/bosses/geovane-sprite-sheet.png"
);

await sprites.load(
    "weverson",
    "./assets/bosses/weverson-sprite-sheet.png"
);

    await sprites.load(
    "entrada",
    "./assets/backgrounds/entrada.jpeg"
    );

      await sprites.load(
        "biblioteca",
        "./assets/backgrounds/biblioteca.jpeg"
    );

    await sprites.load(
        "blocoC",
        "./assets/backgrounds/blocoC.jpeg"
    );

    await sprites.load(
    "curral",
    "./assets/backgrounds/curral.jpeg"
    );


    await sprites.load(
        "auditorio",
        "./assets/backgrounds/auditorio.jpeg"
    );

    await sprites.load(
    "menu",
    "./assets/backgrounds/menu.jpeg"
);

    console.log(
        "Sprites carregadas"
    );

}

// ===================================================
// INIT
// ===================================================
function init() {

  enterPressed = false;

  pausePressed = false;

  Game.currentPhaseIndex = 4;

  Game.state =
    STATES.PLAYING;

  Game.phase = null;

  Game.freezeFrames = 0;

  Game.player =
    createPlayer();

  Game.phase =
    createPhase(
      Game.currentPhaseIndex
    );

  initializeAnimator(
    Game.player
  );

  if (Game.phase.boss) {

    Game.phase.boss.isActive =
      true;

    Game.phase.boss.introShown =
      true;

    initializeAnimator(
      Game.phase.boss
    );
  }
}

// ===================================================
// NEXT PHASE
// ===================================================
function loadNextPhase() {
 console.log("CARREGANDO FASE", Game.currentPhaseIndex + 2);
  Game.currentPhaseIndex++;

  Game.phase =
    createPhase(
      Game.currentPhaseIndex
    );

    Game.state = STATES.PLAYING;

  Game.player.reset(

    80,

    GAME_HEIGHT - 160
  );

  initializeAnimator(
    Game.player
  );

  if (Game.phase.boss) {

    initializeAnimator(
      Game.phase.boss
    );
  }
}


function saveProgress() {

SaveSystem.save({
  currentPhase:
    Game.currentPhaseIndex,

  selectedGender:
    Game.selectedGender
});

}
// ===================================================
// INPUT
// ===================================================
window.addEventListener(
  'keydown',
  (e) => {

    if (
  Game.state === STATES.MENU
) {

  if (e.key === 'ArrowUp') {

    Menu.moveUp();
  }

  if (e.key === 'ArrowDown') {

    Menu.moveDown();
  }

  if (e.key === 'Enter') {

    const option =
      Menu.getSelected();

    switch(option) {

    case 'Iniciar Jogo':

    SaveSystem.clear();

    CharacterSelect.visible = true;

    Game.state =
      STATES.CHARACTER_SELECT;

    break;


     case 'Continuar':

      const save =
        SaveSystem.load();

      if (!save) {

        break;
      }

      Game.selectedGender =
      save.selectedGender ||
      'masculino';

      init();

      Game.currentPhaseIndex =
        save.currentPhase + 1;

      Game.phase =
        createPhase(
          Game.currentPhaseIndex
        );

      Game.state =
        STATES.PLAYING;

      break;

      case 'Créditos':

        Game.state =
          'credits';

        break;

      case 'Configurações':

        Game.state =
          'settings';

        break;
    }
  }

  return;
}

    if (
      Game.state ===
      STATES.CHARACTER_SELECT
    ) {

      if (
        e.key === 'a' ||
        e.key === 'ArrowLeft' ||
        e.key === 'd' ||
        e.key === 'ArrowRight'
      ) {

        CharacterSelect.toggle();
      }

      if (
        e.key === 'Enter'
      ) {

        Game.selectedGender =
          CharacterSelect.selectedGender;

        SaveSystem.save({
        currentPhase: 0,
        selectedGender:
          Game.selectedGender
      });

        CharacterSelect.visible = false;

          AudioManager.play('start'); // <-- ADICIONADO AQUI

        init();
      }

      return;
    }

if (
    Game.state === STATES.CREDITS ||
    Game.state === STATES.SETTINGS
) {
    if (e.key === 'Backspace') {
        Game.state = STATES.MENU;
    }
    return;
}

if (Game.state === STATES.FINAL) {
    if (e.key === 'Backspace') {
        Game.state = STATES.MENU;
    }
    if (e.key === 'Enter') {
        init();
    }
    return;
}

    if (e.key.toLowerCase() === 'h') {
      debugMode = !debugMode;
    }
    // =================================
    // PAUSE
    // =================================
    if (

      e.key.toLowerCase() === 'p' &&
      !pausePressed

    ) {

      pausePressed = true;

      if (
        Game.state ===
        STATES.PLAYING
      ) {

        Game.state =
          STATES.PAUSED;
      }

      else if (
        Game.state ===
        STATES.PAUSED
      ) {

        Game.state =
          STATES.PLAYING;
      }
    }

    // =================================
    // RESTART
    // =================================
    if (
      e.key === 'Enter'
    ) {

      // Próxima fase
      if (
        Game.state ===
        STATES.PHASE_COMPLETE
      ) {

        loadNextPhase();

        return;
      }

      // Reiniciar jogo
if (Game.state === STATES.GAME_OVER) {
    enterPressed = false;
    init();
    return;
}

if (Game.state === STATES.VICTORY) {
    console.log("VICTORY → FINAL");
    Game.state = STATES.FINAL;
    return;
}

if (Game.state === STATES.FINAL) {
    enterPressed = false;
    init();
    return;
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

// ===================================================
// GAME LOOP
// ===================================================
function gameLoop(timestamp = 0) {

  if (!Game.isRunning) {
    return;
  }

  const delta =
    timestamp -
    Game.lastFrameTime;

  Game.lastFrameTime =
    timestamp;

  ctx.clearRect(

    0,
    0,

    GAME_WIDTH,
    GAME_HEIGHT
  );

  // ===================================
  // FREEZE FRAMES
  // ===================================
  if (Game.freezeFrames > 0) {

    Game.freezeFrames--;
  }

  else {

    if (
      Game.state ===
      STATES.PLAYING
    ) {

      updateGame(delta);
    }
  }

  // ===================================
  // CAMERA
  // ===================================
  Camera.begin(ctx);

  console.log("STATE ATUAL:", Game.state);

  switch (Game.state) {

    case STATES.MENU:

    Menu.draw(
      ctx,
      canvas
    );

    break;

    case STATES.CHARACTER_SELECT:

    CharacterSelect.draw(
      ctx,
      canvas
    );

    break;

    case STATES.CREDITS:

  Menu.drawCredits(
    ctx,
    canvas
  );

  break;

  case STATES.SETTINGS:

    Menu.drawSettings(
      ctx,
      canvas
    );

    break;

    case STATES.PLAYING:

      drawGame();

      break;

    case STATES.PAUSED:

      drawGame();

      drawPauseScreen();

      break;

    case STATES.GAME_OVER:

      drawGame();

      drawGameOver(
        ctx,
        canvas
      );

      break;

    case STATES.PHASE_COMPLETE:

    drawGame();

    drawPhaseCompleteScreen(
      ctx,
      canvas,
      Game.currentPhaseIndex + 1
    );

    break;

    case STATES.VICTORY:

      drawGame();

      drawPhaseVictory(

        ctx,

        canvas,

        Game.currentPhaseIndex + 1,

        1000
      );

      break;

      case STATES.FINAL:

      console.log("DESENHANDO FINAL");

    drawFinalScreen(
        ctx,
        canvas,
        Game.lastFrameTime
    );

    break;
  }

  Camera.end(ctx);

  requestAnimationFrame(
    gameLoop
  );
}

// ===================================================
// UPDATE
// ===================================================
function updateGame(delta) {

  if (
    !Game.player ||
    !Game.phase
  ) {

    return;
  }

  const player =
    Game.player;

  const boss =
    Game.phase.boss;

  // ===================================
  // PLAYER
  // ===================================
  player.update(

    Game.phase.platforms,

    GAME_WIDTH,

    GAME_HEIGHT
  );

  // ===================================
  // PHASE
  // ===================================
  Game.phase.update(
    player
  );

  // ===================================
  // EFFECTS
  // ===================================
  updateEffects();

  // ===================================
  // DASH FX
  // ===================================
  handleDashEffects(player);

  if (boss) {

    handleDashEffects(boss);
  }

  // ===================================
  // BOSS COMBAT
  // ===================================
  if (
    boss &&
    !boss.isDefeated
  ) {

    // -------------------------------
    // PUSH COLLISION
    // -------------------------------
    resolveEntityCollision(
      player,
      boss
    );

    // -------------------------------
    // PLAYER HIT
    // -------------------------------
    const playerHit =
      checkAttackCollision(
        player,
        boss
      );

    if (playerHit) {

      // ENERGY
      player.specialMeter +=
        player.hitEnergyGain;

      if (
        player.specialMeter >
        player.maxSpecialMeter
      ) {

        player.specialMeter =
          player.maxSpecialMeter;
      }
    
      // -----------------------------
      // HEAVY
      // -----------------------------
      const heavyHit = (

        player.comboStep >= 3 ||

        player.isSpecialAttacking ||

        player.isAirKicking
      );

      // -----------------------------
      // EFFECTS
      // -----------------------------
      spawnHitEffect(

        boss.x +
          boss.width / 2,

        boss.y + 40,

        heavyHit
      );

      // -----------------------------
      // LAUNCH FX
      // -----------------------------
      if (
        heavyHit
      ) {

        spawnLaunchEffect(

          boss.x +
            boss.width / 2,

          boss.y + 35
        );
      }

      // -----------------------------
      // CAMERA SHAKE
      // MUITO REDUZIDO
      // -----------------------------
      Camera.addShake(
        heavyHit ? 1.5 : 0.6
      );

      // -----------------------------
      // FREEZE
      // MAIS SUAVE
      // -----------------------------
      Game.freezeFrames =
        heavyHit ? 2 : 1;
    }

    // -------------------------------
    // BOSS HIT PLAYER
    // -------------------------------
    boss.isHittingPlayer(
      player
    );
  }

  // ===================================
  // LAND EFFECTS
  // ===================================
  handleLandingEffects(
    player
  );

  if (boss) {

    handleLandingEffects(
      boss
    );
  }

  // ===================================
  // ANIMATION
  // ===================================

  console.log(
    "UPDATE ANIMATOR:",
    updateAnimator
);
  updateAnimator(player);

  if (boss) {

    updateAnimator(boss);
  }

  // ===================================
  // CAMERA UPDATE
  // ===================================
  Camera.update();

  // ===================================
  // COMBO TIMER
  // ===================================
  if (
    player.comboDisplayTimer > 0
  ) {

    player.comboDisplayTimer--;
  }

  else {

    player.comboHits = 0;
  }

  // ===================================
  // GAME OVER
  // ===================================
if (
  (Game.phase.timeLeft <= 0 || player.isDead) &&
  Game.state !== STATES.GAME_OVER
) {

  player.isDead = true;

  Game.state =
    STATES.GAME_OVER;

  AudioManager.play('defeat');
}

  // ===================================
  // VICTORY
  // ===================================
  if (

  Game.state ===
    STATES.PLAYING &&

  boss &&
  boss.isDefeated

) {

  // Ainda existem fases?
  if (

    Game.currentPhaseIndex <
    PHASE_DATA.length - 1

  ) {

    saveProgress();

    Game.state =
    STATES.PHASE_COMPLETE;

    return;
  }

  saveProgress();
  // Última fase
  Game.state =
    STATES.VICTORY;

    AudioManager.play('victory'); // <-- ADICIONADO AQUI

  return;
}
}

// ===================================================
// DASH FX
// ===================================================
function handleDashEffects(entity) {

  if (
    !entity ||
    !entity.isDashing
  ) {

    return;
  }

  // ===================================
  // MENOS SPAM
  // ===================================
  if (
    Math.random() < 0.18
  ) {

    spawnDashEffect(entity);
  }
}

// ===================================================
// LAND EFFECTS
// ===================================================
function handleLandingEffects(
  entity
) {

  if (!entity) {
    return;
  }

  // ===================================
  // LAND
  // ===================================
  if (

    entity.wasAirborne &&
    entity.onGround

  ) {

    const heavyLand = (

     entity.isKnockedDown ||

      entity.velocityY > 6
     
    );

    spawnLandEffect(

      entity.x +
        entity.width / 2,

      entity.y +
        entity.height,

      heavyLand
    );


    // =================================
    // KNOCKDOWN SLAM
    // =================================
    /*
    if (
      entity.isKnockedDown
    ) {

      spawnKnockdownEffect(

        entity.x +
          entity.width / 2,

        entity.y +
          entity.height
      );

      // SHAKE REDUZIDO
      Camera.addShake(1.8);
    }
      */

    entity.wasAirborne =
      false;
  }

  if (!entity.onGround) {

    entity.wasAirborne =
      true;
  }
}

// ===================================================
// DRAW
// ===================================================
function drawGame() {

  if (
    !Game.player ||
    !Game.phase
  ) {

    return;
  }

  // ===================================
  // PHASE
  // ===================================
  Game.phase.draw(ctx);

  // ===================================
  // PLAYER
  // ===================================
  drawPlayer(

    ctx,

    Game.player
  );

  // ===================================
  // BOSS
  // ===================================
  if (Game.phase.boss) {

    drawBoss(

      ctx,

      Game.phase.boss
    );
  }

  // ===================================
  // EFFECTS
  // ===================================
  renderEffects(ctx);

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

  // ===================================
  // COMBO COUNTER
  // ===================================
  drawComboCounter();
  if (debugMode && Game.player) {
    drawAllBoxes(ctx, Game.player);
  }

  if (debugMode && Game.phase?.boss) {
    drawAllBoxes(ctx, Game.phase.boss);
  }
}


// ===================================================
// START
// ===================================================

(async ()=>{

    await loadAssets();

    gameLoop();

})();

console.log(
  '[main] balanced combat system carregado'
);