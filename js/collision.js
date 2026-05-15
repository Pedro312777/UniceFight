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
// FUNCIONA PARA SOCO E CHUTE
// -----------------------------------------------
function checkAttackCollision(attacker, target) {

  // -----------------------------------
  // SÓ ATACA SE ESTIVER GOLPEANDO
  // -----------------------------------
  if (!attacker.isAttacking && !attacker.isKicking) {

    return false;
  }

  let hitboxWidth;
  let hitboxHeight;
  let hitboxY;

  // -----------------------------------
  // SOCO
  // -----------------------------------
  if (attacker.isAttacking) {

    hitboxWidth = 60;
    hitboxHeight = 40;

    hitboxY = attacker.y + attacker.height * 0.2;
  }

  // -----------------------------------
  // CHUTE
  // -----------------------------------
  if (attacker.isKicking) {

    hitboxWidth = 70;
    hitboxHeight = 30;

    // Hitbox mais baixa
    hitboxY = attacker.y + attacker.height * 0.65;
  }

  // -----------------------------------
  // POSIÇÃO DA HITBOX
  // -----------------------------------
  const attackHitbox = {

    x: attacker.facingRight
      ? attacker.x + attacker.width
      : attacker.x - hitboxWidth,

    y: hitboxY,

    width: hitboxWidth,
    height: hitboxHeight
  };

  // -----------------------------------
  // DEBUG VISUAL (OPCIONAL)
  // Descomente para visualizar hitbox
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