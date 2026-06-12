// ===================================================
// UNICEFIGHT - PHASE SYSTEM FINAL V2
// ARCADE COMBAT READY
// ===================================================
// MELHORIAS:
// ✔ Integração total com combat system
// ✔ Compatível com launch / knockdown
// ✔ Boss update otimizado
// ✔ Removido double damage bug
// ✔ LF2 pacing
// ✔ Background refinado
// ✔ Timer estabilizado
// ✔ Spawn alinhado
// ✔ Performance cleanup
// ✔ Compatível com future waves
// ✔ Compatível com effects system
// ===================================================

// ===================================================
// DADOS DAS FASES
// ===================================================
const PHASE_DATA = [

  // FASE 1
  {
    id: 1,
    name: '1º Semestre',
    subtitle: 'Professor Pedro',
    bgColor: '#4A6080',
    groundColor: '#808080',

    hasBoss: true,
    bossName: 'pedro',

    timeLimit: 99,

    music: 'fase1_theme',
    bossMusic: 'boss_pedro',

    weather: null,
    ambientEffects: true,

    backgroundType: 'entrada',

    cutsceneIntro: false,
    cutsceneEnding: false,

    enemyWaves: [],
    itemSpawns: []
  },

  // FASE 2
  {
    id: 2,
    name: '2º Semestre',
    subtitle: 'Professor 2',
    bgColor: '#5A6B85',
    groundColor: '#707070',

    hasBoss: true,
    bossName: 'boss2',

    timeLimit: 99,

    music: 'fase2_theme',
    bossMusic: 'boss2_theme',

    weather: null,
    ambientEffects: true,

    backgroundType: 'biblioteca',

    cutsceneIntro: false,
    cutsceneEnding: false,

    enemyWaves: [],
    itemSpawns: []
  },

  // FASE 3
  {
    id: 3,
    name: '3º Semestre',
    subtitle: 'Professor 3',
    bgColor: '#587050',
    groundColor: '#666666',

    hasBoss: true,
    bossName: 'boss3',

    timeLimit: 99,

    music: 'fase3_theme',
    bossMusic: 'boss3_theme',

    weather: null,
    ambientEffects: true,

    backgroundType: 'blocoC',

    cutsceneIntro: false,
    cutsceneEnding: false,

    enemyWaves: [],
    itemSpawns: []
  },

  // FASE 4
  {
    id: 4,
    name: '4º Semestre',
    subtitle: 'Professor 4',
    bgColor: '#705050',
    groundColor: '#666666',

    hasBoss: true,
    bossName: 'boss4',

    timeLimit: 99,

    music: 'fase4_theme',
    bossMusic: 'boss4_theme',

    weather: null,
    ambientEffects: true,

    backgroundType: 'curral',

    cutsceneIntro: false,
    cutsceneEnding: false,

    enemyWaves: [],
    itemSpawns: []
  },

  // FASE 5
  {
    id: 5,
    name: 'Formatura',
    subtitle: 'Diretor',
    bgColor: '#353550',
    groundColor: '#606060',

    hasBoss: true,
    bossName: 'boss5',

    timeLimit: 99,

    music: 'fase5_theme',
    bossMusic: 'boss5_theme',

    weather: null,
    ambientEffects: true,

    backgroundType: 'auditorio',

    cutsceneIntro: false,
    cutsceneEnding: false,

    enemyWaves: [],
    itemSpawns: []
  }
];

// ===================================================
// PHASE CLASS
// ===================================================
class Phase {

  constructor(
    phaseIndex,
    canvasWidth,
    canvasHeight
  ) {

    // =========================================
    // SAFETY
    // =========================================
    if (
      !PHASE_DATA[phaseIndex]
    ) {

      phaseIndex = 0;
    }

    // =========================================
    // DATA
    // =========================================
    this.index = phaseIndex;

    this.data =
      PHASE_DATA[phaseIndex];

    this.canvasWidth =
      canvasWidth;

    this.canvasHeight =
      canvasHeight;

    // =========================================
    // TIMER
    // =========================================
    this.timeLimit =
      this.data.timeLimit;

    this.timeLeft =
      this.timeLimit;

    this.frameCounter = 0;

    // =========================================
    // STATES
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
    // =========================================
    this.playerSpawn = {

      x: 80,

      y:
        canvasHeight - 160
    };

    // =========================================
    // FUTURE SYSTEMS
    // =========================================
    this.checkpoints = [];

    this.enemies = [];

    this.currentWave = 0;

    this.waveStarted = false;

    this.items = [];

    this.effects = [];

    this.events = [];

    // =========================================
    // CUTSCENE
    // =========================================
    this.isCutscenePlaying =
      false;

    // =========================================
    // PLATFORMS
    // =========================================
    this.platforms =
      this.createPlatforms();

    // =========================================
    // BOSS
    // =========================================
    this.boss = null;

    if (
      this.data.hasBoss
    ) {

      this.boss =
        new Boss(
          phaseIndex,
          canvasWidth,
          canvasHeight
        );

      // =====================================
      // GROUND ALIGN
      // =====================================
      this.boss.y =
        this.platforms[0].y -
        this.boss.height;

      this.boss.onGround = true;

      this.boss.isActive = true;
    }

    // =========================================
    // BACKGROUND
    // =========================================
    this.backgroundLayers =
      this.createBackgroundLayers();

    // =========================================
    // START
    // =========================================
    this.startPhase();
  }

  // ===================================================
  // START
  // ===================================================
  startPhase() {

    /*
    AudioManager.playMusic(
      this.data.music
    );
    */

    if (
      this.data.cutsceneIntro
    ) {

      this.startIntroCutscene();
    }
  }

  // ===================================================
  // BACKGROUND LAYERS
  // ===================================================
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

  // ===================================================
  // PLATFORMS
  // ===================================================
  createPlatforms() {

    const platforms = [];

    // =========================================
    // FLOOR
    // =========================================
    platforms.push({

      x: 0,

      y:
        this.canvasHeight - 20,

      width:
        this.canvasWidth,

      height: 20,

      color:
        this.data.groundColor
    });

    return platforms;
  }

  // ===================================================
  // UPDATE
  // ===================================================
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
    // FUTURE
    // =========================================
    this.updateEnemies(player);

    this.updateItems(player);

    this.updateEffects();

    this.updateEvents();

    // =========================================
    // COMPLETE
    // =========================================
    this.checkPhaseCompletion(
      player
    );
  }

  // ===================================================
  // TIMER
  // ===================================================
  updateTimer() {

    if (
      this.isPaused
    ) {

      return;
    }

    this.frameCounter++;

    if (
      this.frameCounter >= 60
    ) {

      this.frameCounter = 0;

      if (
        this.timeLeft > 0
      ) {

        this.timeLeft--;
      }

      else {

        this.isFailed = true;
      }
    }
  }

  // ===================================================
  // BOSS UPDATE
  // ===================================================
  updateBoss(player) {

    if (
      !this.boss ||
      !this.boss.isActive ||
      this.boss.isDefeated
    ) {

      return;
    }

    // =========================================
    // UPDATE
    // =========================================
    this.boss.update(player);

    // =========================================
    // WALLS
    // =========================================
    checkWallCollision(

      this.boss,

      this.canvasWidth
    );

    // =========================================
    // PLATFORMS
    // =========================================
    checkPlatformCollision(

      this.boss,

      this.platforms
    );
  }

  // ===================================================
  // FUTURE ENEMIES
  // ===================================================
  updateEnemies(player) {

for (let i = this.enemies.length - 1; i >= 0; i--) {

    const enemy = this.enemies[i];

    enemy.update(player);

    if (enemy.isDead) {

        this.enemies.splice(i, 1);

    }

}
  }

  // ===================================================
  // FUTURE ITEMS
  // ===================================================
  updateItems(player) {

    // FUTURE
  }

  // ===================================================
  // FUTURE EFFECTS
  // ===================================================
  updateEffects() {

    // FUTURE
  }

  // ===================================================
  // FUTURE EVENTS
  // ===================================================
  updateEvents() {

    // FUTURE
  }

  // ===================================================
  // COMPLETE
  // ===================================================
  checkPhaseCompletion(player) {

    if (
      this.boss &&
      this.boss.isDefeated &&
      !this.isComplete
    ) {

      this.isComplete = true;

      this.score =

        500 +

        (this.timeLeft * 5) +

        (player.comboHits * 10);

      player.score =
        this.score;
    }
  }

  // ===================================================
  // DRAW
  // ===================================================
  draw(ctx) {

    this.drawBackground(ctx);

    this.drawPlatforms(ctx);

    // =========================================
    // FUTURE ENEMIES
    // =========================================
    this.drawEnemies(ctx);

    // =========================================
    // FUTURE ITEMS
    // =========================================
    this.drawItems(ctx);

    // =========================================
    // FUTURE EFFECTS
    // =========================================
    this.drawEffects(ctx);
  }

  // ===================================================
  // BACKGROUND
  // ===================================================
  drawBackground(ctx) {

if (
    this.data.backgroundType ===
    "biblioteca"
){

    this.drawBibliotecaBackground(
        ctx
    );

    return;
}

if (
    this.data.backgroundType ===
    "blocoC"
){

    this.drawBlocoCBackground(
        ctx
    );

    return;
}

    if (
    this.data.backgroundType === "curral"
){

    this.drawCurralBackground(
        ctx
    );

    return;
}

if (
    this.data.backgroundType === "auditorio"
){

    this.drawAuditorioBackground(
        ctx
    );

    return;
}

    // =========================================
    // SKY
    // =========================================
    const skyGradient =

      ctx.createLinearGradient(
        0,
        0,
        0,
        this.canvasHeight
      );

    skyGradient.addColorStop(
      0,
      '#708FC0'
    );

    skyGradient.addColorStop(
      1,
      this.data.bgColor
    );

    ctx.fillStyle =
      skyGradient;

    ctx.fillRect(

      0,
      0,

      this.canvasWidth,
      this.canvasHeight
    );

    // =========================================
    // GROUND
    // =========================================
    const groundGradient =

      ctx.createLinearGradient(
        0,
        this.canvasHeight - 90,
        0,
        this.canvasHeight
      );

    groundGradient.addColorStop(
      0,
      this.data.groundColor
    );

    groundGradient.addColorStop(
      1,
      '#2B2B2B'
    );

    ctx.fillStyle =
      groundGradient;

    ctx.fillRect(

      0,

      this.canvasHeight - 90,

      this.canvasWidth,

      90
    );

    // =========================================
    // TYPE
    // =========================================
switch (
  this.data.backgroundType
) {

  case 'campus':

    this.drawCampusBackground(ctx);
    break;

  case "entrada":

    this.drawEntradaBackground(ctx);
    return;

case "laboratorio":

    this.drawLaboratorioBackground(ctx);
    return;

case "blocoC":

    this.drawBlocoCBackground(ctx);
    return;

case "curral":

    this.drawCurralBackground(ctx);
    return;

case "auditorio":

    this.drawAuditorioBackground(ctx);
    return;
}
  }

  // ===================================================
  // CAMPUS
  // ===================================================
  drawCampusBackground(ctx) {

    // =========================================
    // BUILDING
    // =========================================
    ctx.fillStyle =
      '#2E3B55';

    ctx.fillRect(

      500,
      120,

      220,
      220
    );

    // =========================================
    // WINDOWS
    // =========================================
    ctx.fillStyle =
      '#B7D4FF';

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

    // =========================================
    // BUILDING SHADOW
    // =========================================
    ctx.fillStyle =
      'rgba(0,0,0,0.2)';

    ctx.fillRect(

      720,
      120,

      16,
      220
    );

    // =========================================
    // TEXT
    // =========================================
    ctx.fillStyle =
      '#FFFFFF';

    ctx.font =
      'bold 20px Arial';

    ctx.fillText(

      'UNICEPLAC',

      555,

      108
    );
  }

  drawEntradaBackground(ctx){

    const img =
    sprites.get("entrada");

    if(img){

        ctx.drawImage(
            img,
            0,
            0,
            this.canvasWidth,
            this.canvasHeight
        );

        return;
    }

    this.drawCampusBackground(ctx);

}

drawBibliotecaBackground(ctx){

    const img =
    sprites.get(
        "biblioteca"
    );

    if(!img){
        return;
    }

    ctx.drawImage(
        img,
        0,
        0,
        this.canvasWidth,
        this.canvasHeight
    );

}

drawBlocoCBackground(ctx){

    const img =
    sprites.get(
        "blocoC"
    );

    if(!img){
        return;
    }

    ctx.drawImage(
        img,
        0,
        0,
        this.canvasWidth,
        this.canvasHeight
    );

}

  drawCurralBackground(ctx){

    const img =
    sprites.get("curral");

    if(!img){
        return;
    }

    ctx.drawImage(
        img,
        0,
        0,
        this.canvasWidth,
        this.canvasHeight
    );

}

drawAuditorioBackground(ctx){

    const img =
    sprites.get("auditorio");

    if(!img){
        return;
    }

    ctx.drawImage(
        img,
        0,
        0,
        this.canvasWidth,
        this.canvasHeight
    );

}

  // ===================================================
  // PLATFORMS
  // ===================================================
  drawPlatforms(ctx) {

    for (const plat of this.platforms) {

      ctx.fillStyle =
        plat.color;

      ctx.fillRect(

        plat.x,
        plat.y,

        plat.width,
        plat.height
      );
    }
  }

  // ===================================================
  // FUTURE ENEMIES
  // ===================================================
  drawEnemies(ctx) {

    for (const enemy of this.enemies) {

      if (enemy.draw) {

        enemy.draw(ctx);
      }
    }
  }

  // ===================================================
  // FUTURE ITEMS
  // ===================================================
  drawItems(ctx) {

    // FUTURE
  }

  // ===================================================
  // FUTURE EFFECTS
  // ===================================================
  drawEffects(ctx) {

    // FUTURE
  }

  // ===================================================
  // CUTSCENE
  // ===================================================
  startIntroCutscene() {

    this.isCutscenePlaying =
      true;
  }
}

// ===================================================
// EXPORT
// ===================================================
window.Phase = Phase;

console.log(
  '[phase] arcade combat phase system carregado'
);