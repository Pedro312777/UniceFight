// ===================================================
// UNICEFIGHT - COLLISION SYSTEM V7
// HITBOX + HURTBOX UPDATE
// ===================================================
// MELHORIAS V7:
// ✔ Hurtbox separada do sprite (colisão visual correta)
// ✔ Multihit no special attack via Set de IDs
// ✔ Range check redundante removido
// ✔ drawAllBoxes com hurtbox + hitbox + pushbox
// ✔ getHurtbox exportável e reutilizável
// ✔ Estrutura mais limpa e fácil de manter
// ===================================================


// ===================================================
// COLISÃO RETANGULAR (AABB)
// ===================================================
function checkCollision(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}


// ===================================================
// HURTBOX
// Representa a área onde o personagem PODE ser atingido.
// Menor que o sprite para evitar hits "fantasma".
// Ajuste os multiplicadores conforme o sprite de cada char.
// ===================================================
function getHurtbox(entity) {
  // Margem lateral: 15% de cada lado → 70% da largura total
  // Margem superior: 8% do topo
  // Altura: 88% do sprite
  return {
    x:      entity.x + entity.width  * 0.15,
    y:      entity.y + entity.height * 0.08,
    width:  entity.width  * 0.70,
    height: entity.height * 0.88
  };
}

// Hurtbox customizada por tipo de personagem (opcional)
// Se o personagem tiver um campo `hurtboxDef`, usa ele.
// Exemplo: player.hurtboxDef = { ox: 0.15, oy: 0.08, w: 0.70, h: 0.88 }
function getHurtboxForEntity(entity) {
  const def = entity.hurtboxDef || {
    ox: 0.15,
     oy: -1.30,
      w:  0.90,
     h:  1.20
  };
  return {
    x:      entity.x + entity.width  * def.ox,
    y:      entity.y + entity.height * def.oy,
    width:  entity.width  * def.w,
    height: entity.height * def.h
  };
}


// ===================================================
// PLATFORM COLLISION
// ===================================================
function checkPlatformCollision(entity, platforms) {
  entity.onGround = false;

  for (const platform of platforms) {
    const overlapX = (
      entity.x + entity.width > platform.x &&
      entity.x < platform.x + platform.width
    );

    if (!overlapX) continue;

    // -----------------------------------------------
    // FLOOR
    // -----------------------------------------------
    const entityBottom   = entity.y + entity.height;
    const previousBottom = entityBottom - entity.velocityY;
    const landed = (
      previousBottom <= platform.y &&
      entityBottom   >= platform.y
    );

    if (landed && entity.velocityY >= 0) {
      entity.y         = platform.y - entity.height;
      entity.velocityY = 0;
      entity.onGround  = true;
    }

    // -----------------------------------------------
    // CEILING
    // -----------------------------------------------
    const entityTop      = entity.y;
    const previousTop    = entityTop - entity.velocityY;
    const platformBottom = platform.y + platform.height;
    const hitCeiling = (
      previousTop    >= platformBottom &&
      entityTop      <= platformBottom
    );

    if (hitCeiling && entity.velocityY < 0) {
      entity.y         = platformBottom;
      entity.velocityY = 0;
    }
  }
}


// ===================================================
// WALLS
// ===================================================
function checkWallCollision(entity, canvasWidth) {
  if (entity.x < 0) {
    entity.x = 0;
  }
  if (entity.x + entity.width > canvasWidth) {
    entity.x = canvasWidth - entity.width;
  }
}


// ===================================================
// HITBOX DE ATAQUE
// Retorna a hitbox ativa do atacante, ou null se não houver.
// Os timers garantem que a hitbox só aparece no frame certo.
// ===================================================
function getAttackHitbox(attacker) {
  let hitboxWidth;
  let hitboxHeight;
  let hitboxY;
  let attackOffset;

  // -----------------------------------------------
  // PUNCH
  // -----------------------------------------------
  if (attacker.isAttacking && attacker.attackTimer <= 5 && attacker.attackTimer >= 2) {
    hitboxWidth  = 52;
    hitboxHeight = 28;
    attackOffset = 6;
    hitboxY = attacker.y + (attacker.spriteOffsetY || 0) - attacker.height * 0.67;
  }

  // -----------------------------------------------
  // KICK
  // -----------------------------------------------
// AIR KICK — vem primeiro!
  if (attacker.isAirKicking && attacker.attackTimer <= 10 && attacker.attackTimer >= 3) {
    hitboxWidth  = 76;
    hitboxHeight = 58;
    attackOffset = 0;
    hitboxY = attacker.y + (attacker.spriteOffsetY || 0) + attacker.height * 0.100;
  }

  // KICK
  else if (attacker.isKicking && attacker.attackTimer <= 10 && attacker.attackTimer >= 4) {
    hitboxWidth  = 82;
    hitboxHeight = 26;
    attackOffset = 8;
    hitboxY = attacker.y + (attacker.spriteOffsetY || 0) - attacker.height * 0.55;
  }

  // -----------------------------------------------
  // SPECIAL
  // -----------------------------------------------
  else if (attacker.isSpecialAttacking) {
    hitboxWidth  = 104;
    hitboxHeight = 78;
    attackOffset = 0;
    hitboxY = attacker.y + (attacker.spriteOffsetY || 0) + 4;
  }

  // -----------------------------------------------
  // SEM HITBOX ATIVA
  // -----------------------------------------------
  if (hitboxWidth === undefined) return null;

  const bodyCenterX = attacker.x + attacker.width / 2;

  return {
    x: attacker.facingRight
      ? bodyCenterX + (attacker.width * 0.25) - attackOffset
      : bodyCenterX - hitboxWidth - (attacker.width * 0.25) + attackOffset,
    y:      hitboxY,
    width:  hitboxWidth,
    height: hitboxHeight
  };
}


// ===================================================
// HITSTOP
// ===================================================
function applyHitstop(attacker, target, duration = 3) {
  if (attacker.applyHitstop) attacker.applyHitstop(duration);
  if (target.applyHitstop)   target.applyHitstop(duration);
}


// ===================================================
// PRIORITY
// ===================================================
function getAttackPriority(attacker) {
  if (attacker.isSpecialAttacking) return 5;
  if (attacker.comboStep >= 3)     return 4;
  if (attacker.isAirKicking)       return 3;
  if (attacker.isKicking)          return 2;
  return 1;
}


// ===================================================
// KNOCKBACK
// ===================================================
function applyKnockback(target, forceX, forceY) {
  const resistance = target.knockbackResistance || 1;
  forceX *= resistance;
  forceY *= resistance;

  // Tank armor reduz knock sem quebrar
  if (target.superArmor && Math.abs(forceY) < 5) {
    forceX *= 0.55;
    forceY *= 0.35;
  }

  // Limites absolutos
  forceX = Math.max(-5.5, Math.min(5.5, forceX));
  forceY = Math.max(-6,   Math.min(3,   forceY));

  target.velocityX = forceX;
  target.velocityY = forceY;
  target.onGround  = false;
}


// ===================================================
// HIT REACTION
// ===================================================
function applyHitReaction(attacker, target, damage, knockbackX, knockbackY) {
  const launcherHit = knockbackY <= -5;
  const armorBreak  = damage >= (target.armorBreakThreshold || 999);

  // Launch resistance (ex: boss)
  if (launcherHit && target.launchResistance) {
    knockbackY *= target.launchResistance;
    knockbackX *= target.launchResistance;
  }

  // Super armor: absorve sem voar
  if (target.superArmor && !armorBreak) {
    applyKnockback(target, knockbackX * 0.55, knockbackY * 0.35);
    return;
  }

  // Launch
  if (launcherHit && target.launch) {
    target.launch(knockbackX, knockbackY);
    return;
  }

  // Normal
  applyKnockback(target, knockbackX, knockbackY);
}


// ===================================================
// ATTACK COLLISION
// Principal função de detecção de hit.
//
// V7 — MUDANÇAS:
// • Colide contra HURTBOX (não o sprite inteiro)
// • Special usa Set de IDs para multihit
// • Range check horizontal/vertical REMOVIDO
//   (a hitbox + hurtbox já controlam o alcance)
// • Único filtro de segurança mantido: distância Y > 90
// ===================================================
function checkAttackCollision(attacker, target) {

  // Sem ataque ativo → ignora
  if (
    !attacker.isAttacking &&
    !attacker.isKicking   &&
    !attacker.isAirKicking &&
    !attacker.isSpecialAttacking
  ) return false;

  // Invulnerabilidade do alvo
  if (target.invulnerabilityTimer > 0) return false;

  // -----------------------------------------------
  // CONTROLE DE MULTIHIT
  // Special attack: pode acertar o mesmo alvo múltiplas
  //   vezes (Set por ID). Outros ataques: flag booleana.
  // -----------------------------------------------
  if (attacker.isSpecialAttacking) {
    // Garante que o Set existe
    if (!attacker.hitTargetsThisSwing) {
      attacker.hitTargetsThisSwing = new Set();
    }
    if (attacker.hitTargetsThisSwing.has(target.id)) return false;
  } else {
    if (attacker.attackAlreadyHit) return false;
  }

  // Obtém hitbox do atacante
  const attackHitbox = getAttackHitbox(attacker);
  if (!attackHitbox) return false;

  // Filtro de segurança vertical (evita hits entre andares)
  if (Math.abs(attacker.y - target.y) > 90) return false;

  // -----------------------------------------------
  // HURTBOX DO ALVO
  // Colisão contra área menor que o sprite inteiro,
  // evitando hits visuais incorretos.
  // -----------------------------------------------
  const hurtbox = getHurtboxForEntity(target);

  if (!checkCollision(attackHitbox, hurtbox)) return false;

  // ===================================================
  // HIT CONFIRMADO
  // ===================================================

  // Registra hit no controle de multihit
  if (attacker.isSpecialAttacking) {
    attacker.hitTargetsThisSwing.add(target.id);
  } else {
    attacker.attackAlreadyHit = true;
  }

  // Atualiza combo step hits conectados
  if      (attacker.comboStep === 1) attacker.comboHitsConnected = 1;
  else if (attacker.comboStep === 2) attacker.comboHitsConnected = 2;

  // -----------------------------------------------
  // DAMAGE
  // -----------------------------------------------
  let damage = attacker.attackDamage || 0;

  if (attacker.isKicking)          damage = attacker.attackDamage;
  if (attacker.isAirKicking)       damage = attacker.airKickDamage || damage;
  if (attacker.isSpecialAttacking) damage *= 1.25;

  // Tank damage reduction
  if (target.damageReduction) damage *= target.damageReduction;

  damage = Math.max(1, Math.floor(damage));

  // -----------------------------------------------
  // HITSTOP
  // -----------------------------------------------
  let hitstop = 2;
  if (damage >= 10)                hitstop = 4;
  if (attacker.isSpecialAttacking) hitstop = 5;

  applyHitstop(attacker, target, hitstop);

  // -----------------------------------------------
  // KNOCKBACK
  // -----------------------------------------------
  let knockbackX = attacker.facingRight ? 3 : -3;
  let knockbackY = -1.1;

  // Finisher (último hit do combo)
  if (attacker.comboStep >= 3) {
    knockbackX *= 1.45;
    knockbackY  = -4.5;
  }

  // Special
  if (attacker.isSpecialAttacking) {
    knockbackX *= 1.8;
    knockbackY  = -5.8;
  }

  // Air kick
  if (attacker.isAirKicking) {
    knockbackY = -3.2;
  }

  // Dash momentum
  if (attacker.isDashing) {
    knockbackX *= 1.1;
  }

  // -----------------------------------------------
  // DEBUG
  // -----------------------------------------------
  console.log(
    `[HIT] dano=${damage} step=${attacker.comboStep}` +
    ` finisher=${attacker.isComboFinisher}` +
    ` special=${attacker.isSpecialAttacking}`
  );

  // -----------------------------------------------
  // APLICA DANO
  // -----------------------------------------------
  if (target.takeDamage) {
    target.takeDamage(damage);
  }

  // -----------------------------------------------
  // FRAQUEZA DO RÔMES
  // -----------------------------------------------
  if (
    attacker.isComboFinisher &&
    attacker.finisherReady   &&
    target.onComboPressure
  ) {
    target.onComboPressure();
  }

  // Combo completo
  if (attacker.isComboFinisher && attacker.finisherReady) {
    attacker.comboComplete      = true;
    attacker.comboDisplayTimer  = 120;
  }

  // Air kick callback
  if (attacker.isAirKicking && target.onAirKickHit) {
    target.onAirKickHit();
  }

  // -----------------------------------------------
  // REAÇÃO AO HIT
  // -----------------------------------------------
  applyHitReaction(attacker, target, damage, knockbackX, knockbackY);

  return true;
}

// ===================================================
// RESET MULTIHIT (chamar ao fim do special attack)
// ===================================================
function resetHitTargets(attacker) {
  if (attacker.hitTargetsThisSwing) {
    attacker.hitTargetsThisSwing.clear();
  }
}


// ===================================================
// LF2 PUSH COLLISION
// ===================================================
function resolveEntityCollision(entityA, entityB) {
  if (entityA.isDead || entityB.isDead) return;

  if (!entityA.onGround || !entityB.onGround) return;

  const pushboxA = {
    x:      entityA.x + 12,
    y:      entityA.y + 8,
    width:  entityA.width  - 24,
    height: entityA.height - 12
  };

  const pushboxB = {
    x:      entityB.x + 12,
    y:      entityB.y + 8,
    width:  entityB.width  - 24,
    height: entityB.height - 12
  };

  if (!checkCollision(pushboxA, pushboxB)) return;

  const centerA = pushboxA.x + pushboxA.width  / 2;
  const centerB = pushboxB.x + pushboxB.width  / 2;
  const overlap = (pushboxA.width / 2 + pushboxB.width / 2) - Math.abs(centerA - centerB);

  if (overlap <= 0) return;

  let weightA = entityA.bodyPushResistance || 1;
  let weightB = entityB.bodyPushResistance || 1;

  // Personagens pesados
  if (entityA.key === "pedro") weightA *= 4;
  if (entityB.key === "pedro") weightB *= 4;

  // Tank mass
  if (entityA.superArmor) weightA *= 1.5;
  if (entityB.superArmor) weightB *= 1.5;

  // Dash priority
  if (entityA.isDashing) weightA *= 1.25;
  if (entityB.isDashing) weightB *= 1.25;

  const totalWeight = weightA + weightB;
  const pushForce   = overlap * 0.18;
  const moveA       = pushForce * (weightB / totalWeight);
  const moveB       = pushForce * (weightA / totalWeight);

  if (centerA < centerB) {
    entityA.x -= moveA;
    entityB.x += moveB;
  } else {
    entityA.x += moveA;
    entityB.x -= moveB;
  }

  // Dash momentum preservation
  if (entityA.isDashing) entityA.velocityX *= 0.992;
  if (entityB.isDashing) entityB.velocityX *= 0.992;

  // Anti-shake
  if (Math.abs(entityA.velocityX) < 0.04) entityA.velocityX = 0;
  if (Math.abs(entityB.velocityX) < 0.04) entityB.velocityX = 0;
}


// ===================================================
// ITEM COLLISION
// ===================================================
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


// ===================================================
// OBSTACLE COLLISION
// ===================================================
function checkObstacleCollision(entity, obstacles) {
  for (const obstacle of obstacles) {
    if (checkCollision(entity, obstacle)) return obstacle;
  }
  return null;
}


// ===================================================
// DEBUG — DRAW HITBOX SIMPLES
// ===================================================
function drawHitbox(ctx, hitbox, color = 'red') {
  if (!hitbox) return;

  ctx.save();
  ctx.strokeStyle  = color;
  ctx.lineWidth    = 2;
  ctx.globalAlpha  = 0.9;
  ctx.strokeRect(hitbox.x, hitbox.y, hitbox.width, hitbox.height);
  ctx.fillStyle    = color;
  ctx.globalAlpha  = 0.12;
  ctx.fillRect(hitbox.x, hitbox.y, hitbox.width, hitbox.height);
  ctx.restore();
}


// ===================================================
// DEBUG — DRAW ALL BOXES
// Mostra hitbox, hurtbox e pushbox de uma entidade.
// Ative com uma tecla (ex: F1 / tecla D) no game loop.
//
// USO:
//   if (debugMode) drawAllBoxes(ctx, player);
//   if (debugMode) enemies.forEach(e => drawAllBoxes(ctx, e));
// ===================================================
function drawAllBoxes(ctx, entity) {
  // Hurtbox — verde (onde o personagem leva hit)
  const hurtbox = getHurtboxForEntity(entity);
  drawHitbox(ctx, hurtbox, 'lime');

  // Hitbox de ataque — vermelho (onde o ataque causa dano)
  const attackHitbox = getAttackHitbox(entity);
  if (attackHitbox) {
    drawHitbox(ctx, attackHitbox, 'red');
  }

  // Pushbox — ciano (colisão de corpo a corpo)
  const pushbox = {
    x:      entity.x + 12,
    y:      entity.y + 8,
    width:  entity.width  - 24,
    height: entity.height - 12
  };
  drawHitbox(ctx, pushbox, 'cyan');

  // Label com nome/id (opcional)
  if (entity.id || entity.key) {
    ctx.save();
    ctx.fillStyle   = 'white';
    ctx.font        = '10px monospace';
    ctx.fillText(
      entity.key || entity.id,
      entity.x,
      entity.y - 4
    );
    ctx.restore();
  }
}