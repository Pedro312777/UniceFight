// ===================================================
// UNICEFIGHT - BOSS RENDERER FINAL V3
// ARCADE / LF2 VISUAL POLISH
// ===================================================
// MELHORIAS:
// ✔ Tank boss visual weight
// ✔ Procedural idle breathing
// ✔ Heavy walk cycle
// ✔ Launch / knockdown visuals
// ✔ Dash visuals
// ✔ Attack anticipation
// ✔ Hurt feedback melhorado
// ✔ Super armor glow
// ✔ Heavy landing squash
// ✔ Visual pacing mais lento
// ✔ Shadow polish
// ✔ Freeze frame compatibility
// ✔ Future sprite-ready
// ===================================================

// ===================================================
// CONFIG
// ===================================================
const BOSS_RENDER_CONFIG = {

  shadowOpacity: 0.30,

  blinkSpeed: 4,

  breathingSpeed: 0.028,

  walkCycleSpeed: 0.085,

  heavyBreathingMultiplier: 1.2,

  launchTilt: 10,

  knockdownFlatten: 0.72
};

// ===================================================
// DRAW BOSS
// ===================================================
function drawBoss(ctx, boss) {

  if (!boss) {

    return;
  }

console.log(
  "INVUL:",
  boss.invulnerabilityTimer
);

    console.log(
    "DRAW POS",
    "x:", boss.x,
    "y:", boss.y,
    "w:", boss.width,
    "h:", boss.height
  );

  if (
    boss.x < -200 ||
    boss.x > 1200 ||
    boss.y < -200 ||
    boss.y > 1000
  ) {

    console.log(
      "FORA DA TELA",
      boss.x,
      boss.y
    );

  }

  if (
    boss.spriteSheet &&
    boss.animation
){

    drawEntitySprite(
        ctx,
        boss
    );

    return;
}

  console.log(
  "ATTACK STATE:",
  boss.isAttacking
);

  // =========================================
  // INVULNERABILITY BLINK
  // =========================================
  ctx.save();

  console.log(
  "FLIP",
  "meeting:", boss.isMeetingAttack,
  "facing:", boss.facingRight,
  "x:", boss.x
);

  // =========================================
  // FLIP
  // =========================================
  applyBossFlip(ctx, boss);

  // =========================================
  // ANIMATION DATA
  // =========================================
  const anim =
    getBossAnimationData(boss);

  // =========================================
  // BODY COLOR
  // =========================================
  let bodyColor =
    boss.color || '#3A5525';

  // =========================================
  // STATES
  // =========================================
  if (
    boss.isSpecialAttacking
  ) {

    bodyColor = '#FF8800';
  }

  else if (
    boss.isAttacking ||
    boss.isKicking
  ) {

    bodyColor = '#D96A00';
  }

  else if (
    boss.isStunned
  ) {

    bodyColor = '#D4B200';
  }

  else if (
    boss.isHurt
  ) {

    bodyColor = '#C94A4A';
  }

  // =========================================
  // SHADOW
  // =========================================
  drawBossShadow(
    ctx,
    boss,
    anim
  );

  // =========================================
  // TRANSFORM
  // =========================================
  ctx.translate(

    boss.x +
    boss.width / 2,

    boss.y +
    boss.height / 2
  );

  // =========================================
  // KNOCKDOWN SQUASH
  // =========================================

  /*
  knockDown()
  if (
    boss.isKnockedDown
  ) {

    ctx.scale(
      1.08,
      BOSS_RENDER_CONFIG
        .knockdownFlatten
    );
  }
    */

  ctx.translate(
    -boss.width / 2,
    -boss.height / 2
  );

  // =========================================
  // SUPER ARMOR GLOW
  // =========================================
  if (
    boss.isTank &&
    !boss.isHurt &&
    !boss.isDead
  ) {

    ctx.save();

    ctx.globalAlpha = 0.12;

    ctx.fillStyle = '#FFFFFF';

    ctx.fillRect(
      -4,
      18,
      boss.width + 8,
      42
    );

    ctx.restore();
  }

  // =========================================
  // DASH LEAN
  // =========================================
  const dashLean =

    boss.isDashing

      ? (
          boss.facingRight
            ? 4
            : -4
        )

      : 0;

  // =========================================
  // LEGS
  // =========================================
  ctx.fillStyle = '#1A1A1A';

  ctx.fillRect(

    12 + dashLean,

    56,

    14,

    18 + anim.legOffset
  );

  ctx.fillRect(

    38 + dashLean,

    56,

    14,

    18 - anim.legOffset
  );

  // =========================================
  // BODY
  // =========================================
  ctx.fillStyle = bodyColor;

  ctx.fillRect(

    dashLean,

    24 + anim.breathingOffset,

    boss.width,

    32
  );

  // =========================================
  // BODY ARMOR STRIPE
  // =========================================
  ctx.fillStyle = 'rgba(255,255,255,0.12)';

  ctx.fillRect(

    8 + dashLean,

    28 + anim.breathingOffset,

    boss.width - 16,

    6
  );

  // =========================================
  // LEFT ARM
  // =========================================
  let leftArmX = -6;

  let rightArmX =
    boss.width - 4;

  // =========================================
  // ATTACK POSE
  // =========================================
  if (
    boss.isAttacking
  ) {

    rightArmX += 8;
  }

  if (
    boss.isHurt
  ) {

    leftArmX -= 2;

    rightArmX -= 2;
  }

  ctx.fillStyle = bodyColor;

  ctx.fillRect(

    leftArmX,

    30,

    10,

    22
  );

  // =========================================
  // RIGHT ARM
  // =========================================
  ctx.fillRect(

    rightArmX,

    28,

    10,

    24
  );

  // =========================================
  // HEAD
  // =========================================
  ctx.fillStyle = '#E8B78F';

  ctx.fillRect(

    14,

    anim.breathingOffset,

    boss.width - 28,

    24
  );

  // =========================================
  // CAP
  // =========================================
  ctx.fillStyle = '#203814';

  ctx.fillRect(

    8,

    -6 + anim.breathingOffset,

    boss.width - 16,

    10
  );

  // =========================================
  // CAP DETAIL
  // =========================================
  ctx.fillStyle = '#314F1F';

  ctx.fillRect(

    10,

    -2 + anim.breathingOffset,

    boss.width - 20,

    3
  );

  // =========================================
  // EYES
  // =========================================
  ctx.fillStyle = '#000000';

  // stunned eyes
  if (
    boss.isStunned
  ) {

    ctx.fillRect(
      20,
      11,
      6,
      2
    );

    ctx.fillRect(
      38,
      11,
      6,
      2
    );
  }

  else {

    ctx.fillRect(
      20,
      10,
      4,
      4
    );

    ctx.fillRect(
      40,
      10,
      4,
      4
    );
  }

  // =========================================
  // MOUTH
  // =========================================
  ctx.fillStyle = '#5A2A2A';

  if (
    boss.isHurt
  ) {

    ctx.fillRect(
      27,
      18,
      10,
      2
    );
  }

  else {

    ctx.fillRect(
      28,
      18,
      8,
      1
    );
  }

  ctx.restore();
}

// ===================================================
// FLIP
// ===================================================
function applyBossFlip(ctx, boss) {

  if (!boss.facingRight) {

    ctx.scale(-1, 1);

    ctx.translate(
      -boss.x * 2 - boss.width,
      0
    );
  }
}

// ===================================================
// SHADOW
// ===================================================
function drawBossShadow(
  ctx,
  boss,
  anim
) {

  ctx.save();

  let shadowWidth =
    boss.width - 14;

  // =========================================
  // AIRBORNE
  // =========================================
  if (
    !boss.onGround
  ) {

    shadowWidth *= 0.72;
  }

  // =========================================
  // KNOCKDOWN
  // =========================================
  /*
 if (
    boss.isKnockedDown
  ) {

    shadowWidth *= 1.2;
  }
    */

  ctx.fillStyle =
    `rgba(0,0,0,${
      BOSS_RENDER_CONFIG.shadowOpacity
    })`;

  ctx.fillRect(

    boss.x +
    (boss.width - shadowWidth) / 2,

    boss.y +
    boss.height - 4,

    shadowWidth,

    6
  );

  ctx.restore();
}

// ===================================================
// PROCEDURAL ANIMATION
// ===================================================
function getBossAnimationData(
  boss
) {

  const time =
    performance.now() * 0.001;

  // =========================================
  // BREATHING
  // =========================================
  let breathingOffset =

    Math.sin(

      time *
      BOSS_RENDER_CONFIG
        .breathingSpeed *
      60

    ) * 1.2;

  // =========================================
  // TANK BREATHING
  // =========================================
  if (
    boss.isTank
  ) {

    breathingOffset *=
      BOSS_RENDER_CONFIG
        .heavyBreathingMultiplier;
  }

  // =========================================
  // WALK CYCLE
  // =========================================
  let legOffset = 0;

  if (
    boss.isMoving &&
    boss.onGround
  ) {

    legOffset =

      Math.sin(

        time *
        BOSS_RENDER_CONFIG
          .walkCycleSpeed *
        60

      ) * 2.8;
  }

  // =========================================
  // HURT SHAKE
  // =========================================
  let hurtOffset = 0;

  if (
    boss.isHurt
  ) {

    hurtOffset =
      Math.sin(time * 90) * 1.4;
  }

  return {

    breathingOffset,

    legOffset,

    hurtOffset
  };
}

// ===================================================
// EXPORT
// ===================================================
window.drawBoss =
  drawBoss;

console.log(
  '[bossRenderer] arcade tank renderer carregado'
);