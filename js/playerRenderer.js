// ===================================================
// UNICEFIGHT - PLAYER RENDERER BALANCED V2
// SLOWER ARCADE COMBAT VISUALS
// ===================================================
// MELHORIAS:
// ✔ movimentação visual mais pesada
// ✔ animações mais lentas
// ✔ idle breathing reduzido
// ✔ walk cycle menos acelerado
// ✔ ataques com peso visual
// ✔ knockdown mais impactante
// ✔ hit feedback refinado
// ✔ compatível com animator.js
// ✔ compatível com combat rebalance
// ✔ pronto para sprites futuros
// ===================================================

// ===================================================
// CONFIG
// ===================================================
const PLAYER_RENDER_CONFIG = {

  invulnerabilityBlinkSpeed: 4,

  idleBreathingSpeed: 0.045,
  idleBreathingIntensity: 0.9,

  walkCycleSpeed: 0.12,
  walkCycleIntensity: 2.2,

  attackLean: 5,
  kickLean: 8,

  airTiltIntensity: 0.012,

  shadowOpacity: 0.24,

  heavyHitFlash: '#FF8844',
  hurtColor: '#CC4444'
};

// ===================================================
// DRAW PLAYER
// ===================================================
function drawPlayer(ctx, player) {

  console.log("PLAYER RENDERER RODANDO");
  // =========================================
  // SEGURANÇA
  // =========================================
  if (!player) {
    return;
  }

    console.log(
    "BLINK:",
    player.invulnerabilityTimer
  );
  // =========================================
  // INVULNERABILIDADE
  // =========================================
  if (
    player.invulnerabilityTimer > 0 &&
    Math.floor(
      player.invulnerabilityTimer /
      PLAYER_RENDER_CONFIG.invulnerabilityBlinkSpeed
    ) % 2 === 0
  ) {
    return;
  }

  // =========================================
  // FALLBACK
  // =========================================
  if (!player.animation) {

    player.animation = {
      current: 'idle',
      frameIndex: 0,
      timer: 0
    };
  }

  // =========================================
  // BASE
  // =========================================
  const x = player.x;
  const y = player.y - 14;

  const width = 50;
  const height = 90;

  // =========================================
  // TEMPO
  // =========================================
  const animTime =
    performance.now() * 0.001;

  // =========================================
  // IDLE
  // =========================================
  let idleOffset = 0;

  if (
    !player.isMoving &&
    player.onGround
  ) {

    idleOffset =
      Math.sin(
        animTime *
        PLAYER_RENDER_CONFIG.idleBreathingSpeed *
        60
      ) *
      PLAYER_RENDER_CONFIG.idleBreathingIntensity;
  }

  // =========================================
  // WALK
  // =========================================
  let legSwing = 0;

  if (
    player.isMoving &&
    player.onGround
  ) {

    legSwing =
      Math.sin(
        animTime *
        PLAYER_RENDER_CONFIG.walkCycleSpeed *
        60
      ) *
      PLAYER_RENDER_CONFIG.walkCycleIntensity;
  }

  // =========================================
  // ATTACK OFFSET
  // =========================================
  let attackOffset = 0;

  if (player.isAttacking) {

    attackOffset =
      PLAYER_RENDER_CONFIG.attackLean;
  }

  if (player.isKicking) {

    attackOffset =
      PLAYER_RENDER_CONFIG.kickLean;
  }

  // =========================================
  // AIR TILT
  // =========================================
  let airTilt = 0;

  if (!player.onGround) {

    airTilt =
      player.velocityY *
      PLAYER_RENDER_CONFIG.airTiltIntensity;
  }

  // =========================================
  // CORES
  // =========================================
const skinColor = '#F5D7B2';

let shirtColor =
  player.gender === 'feminino'
    ? '#FF69B4'
    : '#4D8BFF';

const pantsColor =
  player.gender === 'feminino'
    ? '#3A2A5E'
    : '#222';

const hairColor =
  player.gender === 'feminino'
    ? '#5A2D0C'
    : '#111';

  // =========================================
  // ESTADOS
  // =========================================
  if (player.isAttacking) {

    shirtColor = '#E06A2F';
  }

  if (player.isKicking) {

    shirtColor = '#E0B800';
  }

  if (player.isSpecialAttacking) {

    shirtColor = '#00C8E8';
  }

  if (player.isHurt) {

    shirtColor =
      PLAYER_RENDER_CONFIG.hurtColor;
  }

  /*
  if (player.isKnockedDown) {

    shirtColor = '#777';
  }
  */

  // =========================================
  // SPRITE RENDER
  // =========================================
 if(
player.spriteSheet &&
window.drawEntitySprite
){

drawEntitySprite(
ctx,
player
);

if (player.isLaughing) {

  ctx.font =
    "22px Arial";

ctx.fillText(

  "😂",

  player.x +
  player.width / 2 -
  10,

  player.y -
  70 +

  Math.sin(
    performance.now() *
    0.01
  ) * 4
);

}

/*
// ======================
// DEBUG BODY
// ======================

drawHitbox(

ctx,

{

x:
player.x,

y:
player.y - 66,

width:
player.width,

height:
66

},

'green'

);


// ======================
// DEBUG ATTACK
// ======================

drawHitbox(

ctx,

{

x: player.x,

y: player.y,

width: player.width,

height: player.height

},

'blue'

);
*/



return;

}
  // =========================================
  // SAVE
  // =========================================
  ctx.save();

  // =========================================
  // FLIP
  // =========================================
  if (!player.facingRight) {

    ctx.translate(
      x + width / 2,
      0
    );

    ctx.scale(-1, 1);

    ctx.translate(
      -(x + width / 2),
      0
    );
  }

  // =========================================
  // SHADOW
  // =========================================
  ctx.fillStyle =
    `rgba(0,0,0,${
      PLAYER_RENDER_CONFIG.shadowOpacity
    })`;

  ctx.fillRect(
    x + 8,
    y + height - 4,
    width - 16,
    5
  );

  // =========================================
  // LEGS
  // =========================================
  ctx.fillStyle = pantsColor;

  // LEFT LEG
  ctx.fillRect(
    x + 10,
    y + 58,
    12,
    30 + legSwing
  );

  // RIGHT LEG
  ctx.fillRect(
    x + 28,
    y + 58,
    12,
    30 - legSwing
  );

  // =========================================
  // BODY
  // =========================================
  ctx.save();

  ctx.translate(
    x + width / 2,
    y + 40
  );

  ctx.rotate(airTilt);

  ctx.fillStyle = shirtColor;

  // =========================================
  // HIT EMPHASIS
  // =========================================
  if (
    player.isSpecialAttacking ||
    player.comboStep >= 3
  ) {

    ctx.shadowColor =
      PLAYER_RENDER_CONFIG.heavyHitFlash;

    ctx.shadowBlur = 10;
  }

  ctx.fillRect(
    -20,
    -14 + idleOffset,
    40,
    42
  );

  ctx.restore();

  // =========================================
  // LEFT ARM
  // =========================================
  ctx.fillStyle = skinColor;

  ctx.fillRect(
    x - 8,
    y + 24,
    12,
    30
  );

  // =========================================
  // RIGHT ARM
  // =========================================
  ctx.fillRect(
    x + 46 + attackOffset,
    y + 24,
    12,
    30
  );

  // =========================================
  // HEAD
  // =========================================
  ctx.fillRect(
    x + 10,
    y - 2 + idleOffset,
    30,
    player.gender === 'feminino'
      ? 28
      : 26
  );
  // =========================================
  // HAIR
  // =========================================
  ctx.fillStyle = hairColor;

  ctx.fillRect(
    x + 8,
    y - 8 + idleOffset,
    34,
    10
  );

  if (
  player.gender === 'feminino'
) {

  ctx.fillRect(
    x + 6,
    y + 2 + idleOffset,
    8,
    26
  );

  ctx.fillRect(
    x + 36,
    y + 2 + idleOffset,
    8,
    26
  );
}

  // =========================================
  // EYES
  // =========================================
  ctx.fillStyle = '#000';

  ctx.fillRect(
    x + 16,
    y + 8 + idleOffset,
    3,
    3
  );

  ctx.fillRect(
    x + 30,
    y + 8 + idleOffset,
    3,
    3
  );

  // =========================================
  // KNOCKDOWN VISUAL
  // =========================================
  /*
  if (player.isKnockedDown) {

    ctx.fillStyle =
      'rgba(255,255,255,0.12)';

    ctx.fillRect(
      x - 2,
      y - 2,
      width + 4,
      height + 4
    );
  }
    */

  // =========================================
  // RESTORE
  // =========================================
  ctx.restore();
}

// ===================================================
// EXPORT GLOBAL
// ===================================================
window.drawPlayer = drawPlayer;

// ===================================================
// LOG
// ===================================================
console.log(
  '[playerRender] balanced renderer carregado'
);
