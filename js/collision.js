// ===================================================
// UNICEFIGHT - Sistema de Colisão
// Arquivo: js/collision.js
// ===================================================

// -----------------------------------------------
// COLISÃO RETANGULAR (AABB)
// -----------------------------------------------
function checkCollision(a, b) {

  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

// -----------------------------------------------
// COLISÃO COM CHÃO / PLATAFORMAS
// -----------------------------------------------
function checkPlatformCollision(entity, platforms) {

  entity.onGround = false;

  for (const platform of platforms) {

    // -----------------------------------
    // VERIFICA SOBREPOSIÇÃO X
    // -----------------------------------
    const overlapX = (

      entity.x + entity.width > platform.x &&
      entity.x < platform.x + platform.width
    );

    if (!overlapX) continue;

    // -----------------------------------
    // COLISÃO PELOS PÉS
    // -----------------------------------
    const entityBottom = entity.y + entity.height;

    const prevBottom = entityBottom - entity.velocityY;

    const landedOn = (

      prevBottom <= platform.y &&
      entityBottom >= platform.y
    );

    if (landedOn && entity.velocityY >= 0) {

      entity.y = platform.y - entity.height;

      entity.velocityY = 0;

      entity.onGround = true;
    }

    // -----------------------------------
    // COLISÃO COM TETO
    // -----------------------------------
    const entityTop = entity.y;

    const prevTop = entityTop - entity.velocityY;

    const platformBottom = platform.y + platform.height;

    const hitCeiling = (

      prevTop >= platformBottom &&
      entityTop <= platformBottom
    );

    if (hitCeiling && entity.velocityY < 0) {

      entity.y = platformBottom;

      entity.velocityY = 0;
    }
  }
}

// -----------------------------------------------
// COLISÃO COM PAREDES
// -----------------------------------------------
function checkWallCollision(entity, canvasWidth) {

  // Parede esquerda
  if (entity.x < 0) {

    entity.x = 0;
  }

  // Parede direita
  if (entity.x + entity.width > canvasWidth) {

    entity.x = canvasWidth - entity.width;
  }
}

// -----------------------------------------------
// HITBOX DE ATAQUE
// BALANCEADA PARA FASE 4
// -----------------------------------------------
function checkAttackCollision(attacker, target) {

  // -----------------------------------
  // SÓ ATACA SE ESTIVER GOLPEANDO
  // -----------------------------------
  if (
    !attacker.isAttacking &&
    !attacker.isKicking &&
    !attacker.isAirKicking
  ) {

    return false;
  }

  let hitboxWidth;
  let hitboxHeight;
  let hitboxY;
  let attackOffset;

  // -----------------------------------
  // SOCO
  // MAIS JUSTO E CURTO
  // -----------------------------------
  if (
  attacker.isAttacking &&
  attacker.attackTimer >= 8 &&
  attacker.attackTimer <= 14
  ) {

    hitboxWidth = 42;

    hitboxHeight = 34;

    attackOffset = 8;

    hitboxY = attacker.y + attacker.height * 0.28;
  }

  // -----------------------------------
  // CHUTE NORMAL
  // -----------------------------------
    if (
    attacker.isKicking &&
    attacker.attackTimer >= 8 &&
    attacker.attackTimer <= 16
  ) {

      hitboxWidth = 58;

      hitboxHeight = 24;

      attackOffset = 12;

      hitboxY =
        attacker.y + attacker.height * 0.68;
    }

    // -----------------------------------
  // CHUTE AÉREO
  // -----------------------------------
  if (
    attacker.isAirKicking &&
    attacker.attackTimer >= 6 &&
    attacker.attackTimer <= 20
  ) {

    hitboxWidth = 80;

    hitboxHeight = 80;

    attackOffset = 0;

    hitboxY = attacker.y;
  }
  // -----------------------------------
  // POSIÇÃO DA HITBOX
  // -----------------------------------

  if (
    hitboxWidth === undefined
  ) {
    return false;
  }
  const attackHitbox = {

    x: attacker.facingRight
      ? attacker.x + attacker.width - attackOffset
      : attacker.x - hitboxWidth + attackOffset,

    y: hitboxY,

    width: hitboxWidth,
    height: hitboxHeight
  };

  // -----------------------------------
  // ALCANCE MÁXIMO
  // EVITA ATAQUES INJUSTOS
  // -----------------------------------
  const centerA = attacker.x + attacker.width / 2;

  const centerB = target.x + target.width / 2;

  const distance = Math.abs(centerA - centerB);

  const maxDistance =
    (
      attacker.isKicking ||
      attacker.isAirKicking
    )
      ? 95
      : 75;

  if (distance > maxDistance) {

    return false;
  }

  // -----------------------------------
  // DEBUG VISUAL (OPCIONAL)
  // -----------------------------------
  /*
  const ctx = document
    .getElementById('gameCanvas')
    .getContext('2d');

  ctx.save();

  ctx.strokeStyle = 'red';

  ctx.strokeRect(
    attackHitbox.x,
    attackHitbox.y,
    attackHitbox.width,
    attackHitbox.height
  );

  ctx.restore();
  */

  // -----------------------------------
  // VERIFICA COLISÃO
  // -----------------------------------
  return checkCollision(attackHitbox, target);
}

// -----------------------------------------------
// COLISÃO COM ITENS
// -----------------------------------------------
function checkItemCollision(player, items) {

  const collected = [];

  for (let i = items.length - 1; i >= 0; i--) {

    if (checkCollision(player, items[i])) {

      collected.push(items[i]);

      items.splice(i, 1);
    }
  }

  return collected;
}

// -----------------------------------------------
// COLISÃO COM OBSTÁCULOS
// -----------------------------------------------
function checkObstacleCollision(entity, obstacles) {

  for (const obs of obstacles) {

    if (checkCollision(entity, obs)) {

      return obs;
    }
  }

  return null;
}

// -----------------------------------------------
// COLISÃO ENTRE PLAYER E BOSS
// Impede atravessar personagens
// -----------------------------------------------
function resolveEntityCollision(player, boss) {

  // ===================================
  // PLAYER NO AR PODE ATRAVESSAR
  // ===================================
  if (!player.onGround) {
    return;
  }

  // ===================================
  // VERIFICA COLISÃO
  // ===================================
  if (!checkCollision(player, boss)) {
    return;
  }

  const centerPlayer =
    player.x + player.width / 2;

  const centerBoss =
    boss.x + boss.width / 2;

  const overlap =
    (player.width / 2 + boss.width / 2)
    - Math.abs(centerPlayer - centerBoss);

  // ===================================
  // EMPURRA MENOS O BOSS
  // ===================================
  const playerPush = overlap * 0.75;
  const bossPush = overlap * 0.25;

  if (centerPlayer < centerBoss) {

    player.x -= playerPush;
    boss.x += bossPush;

  } else {

    player.x += playerPush;
    boss.x -= bossPush;
  }
}