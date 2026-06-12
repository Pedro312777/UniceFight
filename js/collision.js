// ===================================================
// UNICEFIGHT - COLLISION SYSTEM FINAL V6
// BALANCED COMBAT UPDATE
// ===================================================
// MELHORIAS NOVAS:
// ✔ Combate mais longo
// ✔ Menos dano explosivo
// ✔ Menos launch excessivo
// ✔ Knockback balanceado
// ✔ Hitstop reduzido
// ✔ Menos infinitos
// ✔ Boss mais estável
// ✔ Pushbox mais natural
// ✔ Dash menos dominante
// ✔ LF2 pacing refinado
// ===================================================


// ===================================================
// COLISÃO RETANGULAR
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
// PLATFORM COLLISION
// ===================================================
function checkPlatformCollision(
  entity,
  platforms
) {


  entity.onGround = false;


  for (const platform of platforms) {


    const overlapX = (


      entity.x + entity.width >
      platform.x &&


      entity.x <
      platform.x + platform.width
    );


    if (!overlapX) {
      continue;
    }


    // ===============================================
    // FLOOR
    // ===============================================
    const entityBottom =
      entity.y + entity.height;


    const previousBottom =
      entityBottom - entity.velocityY;


    const landed = (


      previousBottom <= platform.y &&
      entityBottom >= platform.y
    );


    if (
      landed &&
      entity.velocityY >= 0
    ) {


      entity.y =
        platform.y - entity.height;


      entity.velocityY = 0;


      entity.onGround = true;
    }


    // ===============================================
    // CEILING
    // ===============================================
    const entityTop = entity.y;


    const previousTop =
      entityTop - entity.velocityY;


    const platformBottom =
      platform.y + platform.height;


    const hitCeiling = (


      previousTop >= platformBottom &&
      entityTop <= platformBottom
    );


    if (
      hitCeiling &&
      entity.velocityY < 0
    ) {


      entity.y = platformBottom;


      entity.velocityY = 0;
    }
  }
}


// ===================================================
// WALLS
// ===================================================
function checkWallCollision(
  entity,
  canvasWidth
) {


  if (entity.x < 0) {


    entity.x = 0;
  }


  if (
    entity.x + entity.width >
    canvasWidth
  ) {


    entity.x =
      canvasWidth - entity.width;
  }
}


// ===================================================
// HITBOX
// ===================================================
function getAttackHitbox(attacker) {


  let hitboxWidth;
  let hitboxHeight;
  let hitboxY;
  let attackOffset;


  // ===============================================
  // PUNCH
  // ===============================================
  if (
    attacker.isAttacking &&
    attacker.attackTimer >= 4
  ) {


hitboxWidth = 52;
hitboxHeight = 28;


attackOffset = 6;


hitboxY =
attacker.y +
attacker.height * 0.38;
  }


  // ===============================================
  // KICK
  // ===============================================
  else if (
    attacker.isKicking &&
    attacker.attackTimer >= 5
  ) {
   
hitboxWidth = 82;


hitboxHeight = 26;


attackOffset = 8;


hitboxY =
attacker.y +
attacker.height * 0.44;
  }


  // ===============================================
  // AIR KICK
  // ===============================================
  else if (
    attacker.isAirKicking &&
    attacker.attackTimer >= 4
  ) {


    hitboxWidth = 76;


    hitboxHeight = 58;


    attackOffset = 0;


    hitboxY = attacker.y + 6;
  }


  // ===============================================
  // SPECIAL
  // ===============================================
  else if (
    attacker.isSpecialAttacking
  ) {


    hitboxWidth = 104;


    hitboxHeight = 78;


    attackOffset = 0;


    hitboxY = attacker.y + 4;
  }


  // ===============================================
  // NO HITBOX
  // ===============================================
  if (
    hitboxWidth === undefined
  ) {


    return null;
  }


const bodyCenterX =


attacker.x +


(attacker.width / 2);




return {


x:


attacker.facingRight


?


bodyCenterX +


(attacker.width * 0.25)


-


attackOffset


:


bodyCenterX -


hitboxWidth -


(attacker.width * 0.25)


+


attackOffset,


y: hitboxY,


width: hitboxWidth,


height: hitboxHeight


};
}


// ===================================================
// HITSTOP
// ===================================================
function applyHitstop(
  attacker,
  target,
  duration = 3
) {


  if (attacker.applyHitstop) {


    attacker.applyHitstop(
      duration
    );
  }


  if (target.applyHitstop) {


    target.applyHitstop(
      duration
    );
  }
}


// ===================================================
// PRIORITY
// ===================================================
function getAttackPriority(attacker) {


  if (
    attacker.isSpecialAttacking
  ) {


    return 5;
  }


  if (
    attacker.comboStep >= 3
  ) {


    return 4;
  }


  if (
    attacker.isAirKicking
  ) {


    return 3;
  }


  if (
    attacker.isKicking
  ) {


    return 2;
  }


  return 1;
}


// ===================================================
// KNOCKBACK
// ===================================================
function applyKnockback(
  target,
  forceX,
  forceY
) {


  // ===============================================
  // RESISTÊNCIA
  // ===============================================
  const resistance =
    target.knockbackResistance || 1;


  forceX *= resistance;
  forceY *= resistance;


  // ===============================================
  // TANK ARMOR
  // ===============================================
  if (
    target.superArmor &&
    Math.abs(forceY) < 5
  ) {


    forceX *= 0.55;
    forceY *= 0.35;
  }


  // ===============================================
  // LIMITADORES
  // ===============================================
  forceX = Math.max(
    -5.5,
    Math.min(5.5, forceX)
  );


  forceY = Math.max(
    -6,
    Math.min(3, forceY)
  );


  target.velocityX = forceX;
  target.velocityY = forceY;


  target.onGround = false;
}


// ===================================================
// HIT REACTION
// ===================================================
function applyHitReaction(
  attacker,
  target,
  damage,
  knockbackX,
  knockbackY
) {


  const launcherHit =
    knockbackY <= -5;


  const heavyHit =
    damage >= 10;


  // ===============================================
  // ARMOR BREAK
  // ===============================================
  const armorBreak =
    damage >= (
      target.armorBreakThreshold || 999
    );


  // ===============================================
  // TANK LAUNCH RESIST
  // ===============================================
  if (
    launcherHit &&
    target.launchResistance
  ) {


    knockbackY *=
      target.launchResistance;


    knockbackX *=
      target.launchResistance;
  }


  // ===============================================
  // SUPER ARMOR
  // ===============================================
  if (
    target.superArmor &&
    !armorBreak
  ) {


    applyKnockback(
      target,
      knockbackX * 0.55,
      knockbackY * 0.35
    );


    return;
  }


  // ===============================================
  // LAUNCH
  // ===============================================
  if (
    launcherHit &&
    target.launch
  ) {


    target.launch(
      knockbackX,
      knockbackY
    );


    return;
  }


  // ===============================================
  // NORMAL HIT
  // ===============================================
  applyKnockback(
    target,
    knockbackX,
    knockbackY
  );


  // ===============================================
  // HARD HIT
  // ===============================================
 
  //if (
  //  heavyHit &&
  //  target.onGround &&
  //  target.knockDown
  //) {


  //  target.knockDown();
 // }
}
 


// ===================================================
// ATTACK COLLISION
// ===================================================
function checkAttackCollision(
  attacker,
  target
) {


  if (


    !attacker.isAttacking &&
    !attacker.isKicking &&
    !attacker.isAirKicking &&
    !attacker.isSpecialAttacking
  ) {


    return false;
  }


  if (
    attacker.attackAlreadyHit
  ) {


    return false;
  }


  if (
    target.invulnerabilityTimer > 0
  ) {


    return false;
  }


  const attackHitbox =
    getAttackHitbox(attacker);


  if (!attackHitbox) {


    return false;
  }


  // ===============================================
  // RANGE
  // ===============================================
  const centerA =
    attacker.x +
    attacker.width / 2;


  const centerB =
    target.x +
    target.width / 2;


  const horizontalDistance =
    Math.abs(centerA - centerB);


  const verticalDistance =
    Math.abs(attacker.y - target.y);


  let maxHorizontal = 72;


  if (
    attacker.isKicking ||
    attacker.isAirKicking
  ) {


    maxHorizontal = 96;
  }


  if (
    attacker.isSpecialAttacking
  ) {


    maxHorizontal = 122;
  }


  if (
    horizontalDistance >
    maxHorizontal
  ) {


    return false;
  }


  if (
    verticalDistance > 66
  ) {


    return false;
  }


  // ===============================================
  // FINAL HIT
  // ===============================================
  if (
    checkCollision(
      attackHitbox,
      target
    )
  ) {


    attacker.attackAlreadyHit = true;


    if (attacker.comboStep === 1) {


    attacker.comboHitsConnected = 1;
    }


    else if (attacker.comboStep === 2) {


        attacker.comboHitsConnected = 2;
    }
   
    // =============================================
    // DAMAGE
    // =============================================
    let damage =
      attacker.attackDamage || 0;




    if (attacker.isKicking) {


      damage = attacker.attackDamage;
    }


    if (attacker.isAirKicking) {


      damage =
        attacker.airKickDamage ||
        damage;
    }


    if (
      attacker.isSpecialAttacking
    ) {


      damage *= 1.25;
    }


    // =============================================
    // COMBO SCALING
    // =============================================
    /*
    if (
      attacker.comboHits >= 4
    ) {


      damage *= 0.88;
    }


    if (
      attacker.comboHits >= 7
    ) {


      damage *= 0.75;
    }
      */


    // =============================================
    // TANK DAMAGE REDUCTION
    // =============================================
    if (
      target.damageReduction
    ) {


      damage *=
        target.damageReduction;
    }


    damage = Math.max(
      1,
      Math.floor(damage)
    );


    // =============================================
    // HITSTOP
    // =============================================
    let hitstop = 2;


    if (damage >= 10) {


      hitstop = 4;
    }


    if (
      attacker.isSpecialAttacking
    ) {


      hitstop = 5;
    }


    applyHitstop(
      attacker,
      target,
      hitstop
    );


    // =============================================
    // KNOCKBACK
    // =============================================
    let knockbackX =
      attacker.facingRight
        ? 3
        : -3;


    let knockbackY = -1.1;


    // =============================================
    // FINISHER
    // =============================================
    if (
      attacker.comboStep >= 3
    ) {


      knockbackX *= 1.45;


      knockbackY = -4.5;
    }


    // =============================================
    // SPECIAL
    // =============================================
    if (
      attacker.isSpecialAttacking
    ) {


      knockbackX *= 1.8;


      knockbackY = -5.8;
    }


    // =============================================
    // AIR KICK
    // =============================================
    if (
      attacker.isAirKicking
    ) {


      knockbackY = -3.2;
    }


    // =============================================
    // DASH MOMENTUM
    // =============================================
    if (
      attacker.isDashing
    ) {


      knockbackX *= 1.1;
    }




    // =============================================
    // DEBUG COMBO
    // =============================================
    console.log(
      "DANO:",
      damage,
      "STEP:",
      attacker.comboStep,
      "FINISHER:",
      attacker.isComboFinisher
    );


    // =============================================
    // DAMAGE
    // =============================================
    if (target.takeDamage) {


    console.log(
    "ANTES TAKE DAMAGE:",
    damage
      );


      target.takeDamage(
        damage
      );
    }
   
    // =============================================
    // FRAQUEZA DO RÔMES
    // =============================================
      if (
          attacker.isComboFinisher &&
          attacker.finisherReady &&
          target.onComboPressure
      ) {


          target.onComboPressure();
      }


        console.log(
      "FINISHER?",
      attacker.isComboFinisher,
      "STEP:",
      attacker.comboStep
    );
if (
    attacker.isComboFinisher &&
    attacker.finisherReady
) {


    attacker.comboComplete = true;
    attacker.comboDisplayTimer = 120;
}


    if (
      attacker.isAirKicking &&
      target.onAirKickHit
    ) {


      target.onAirKickHit();
    }


    // =============================================
    // REACTION
    // =============================================
    applyHitReaction(


      attacker,
      target,
      damage,
      knockbackX,
      knockbackY
    );


    return true;
  }


  return false;
}


// ===================================================
// LF2 PUSH COLLISION
// ===================================================
function resolveEntityCollision(
  entityA,
  entityB
) {


  if (
    entityA.isDead ||
    entityB.isDead
  ) {


    return;
  }


  /*
  if (
    entityA.isKnockedDown ||
    entityB.isKnockedDown
  ) {


    return;
  }
  */


  if (
    !entityA.onGround ||
    !entityB.onGround
  ) {


    return;
  }


  const pushboxA = {


    x: entityA.x + 12,
    y: entityA.y + 8,


    width:
      entityA.width - 24,


    height:
      entityA.height - 12
  };


  const pushboxB = {


    x: entityB.x + 12,
    y: entityB.y + 8,


    width:
      entityB.width - 24,


    height:
      entityB.height - 12
  };


  if (
    !checkCollision(
      pushboxA,
      pushboxB
    )
  ) {


    return;
  }


  const centerA =
    pushboxA.x +
    pushboxA.width / 2;


  const centerB =
    pushboxB.x +
    pushboxB.width / 2;


  const overlap = (


    pushboxA.width / 2 +
    pushboxB.width / 2


  ) - Math.abs(centerA - centerB);


  if (overlap <= 0) {


    return;
  }


  let weightA =
    entityA.bodyPushResistance || 1;


  let weightB =
    entityB.bodyPushResistance || 1;


  if (entityA.key === "pedro") {


    weightA *= 4;
  }


  if (entityB.key === "pedro") {


    weightB *= 4;
  }


  // ===============================================
  // TANK MASS
  // ===============================================
  if (entityA.superArmor) {


    weightA *= 1.5;
  }


  if (entityB.superArmor) {


    weightB *= 1.5;
  }


  // ===============================================
  // DASH PRIORITY
  // ===============================================
  if (entityA.isDashing) {


    weightA *= 1.25;
  }


  if (entityB.isDashing) {


    weightB *= 1.25;
  }


  const totalWeight =
    weightA + weightB;


  const pushForce =
    overlap * 0.18;


  const moveA =
    pushForce *
    (weightB / totalWeight);


  const moveB =
    pushForce *
    (weightA / totalWeight);


  if (centerA < centerB) {


    entityA.x -= moveA;


    entityB.x += moveB;
  }


  else {


    entityA.x += moveA;


    entityB.x -= moveB;
  }


  // ===============================================
  // DASH MOMENTUM
  // ===============================================
  if (
    entityA.isDashing
  ) {


    entityA.velocityX *= 0.992;
  }


  if (
    entityB.isDashing
  ) {


    entityB.velocityX *= 0.992;
  }


  // ===============================================
  // ANTI SHAKE
  // ===============================================
  if (
    Math.abs(entityA.velocityX) < 0.04
  ) {


    entityA.velocityX = 0;
  }


  if (
    Math.abs(entityB.velocityX) < 0.04
  ) {


    entityB.velocityX = 0;
  }
}


// ===================================================
// ITEM COLLISION
// ===================================================
function checkItemCollision(
  player,
  items
) {


  const collected = [];


  for (
    let i = items.length - 1;
    i >= 0;
    i--
  ) {


    if (
      checkCollision(
        player,
        items[i]
      )
    ) {


      collected.push(
        items[i]
      );


      items.splice(i, 1);
    }
  }


  return collected;
}


// ===================================================
// OBSTACLE COLLISION
// ===================================================
function checkObstacleCollision(
  entity,
  obstacles
) {


  for (const obstacle of obstacles) {


    if (
      checkCollision(
        entity,
        obstacle
      )
    ) {


      return obstacle;
    }
  }


  return null;
}


// ===================================================
// DEBUG
// ===================================================
function drawHitbox(
ctx,
hitbox,
color='red'
){


if(!hitbox){
return;
}


ctx.save();


ctx.strokeStyle =
color;


ctx.lineWidth = 2;


ctx.globalAlpha =
0.9;


ctx.strokeRect(


hitbox.x,


hitbox.y,


hitbox.width,


hitbox.height


);


ctx.fillStyle =
color;


ctx.globalAlpha =
0.12;


ctx.fillRect(


hitbox.x,


hitbox.y,


hitbox.width,


hitbox.height


);


ctx.restore();


}

