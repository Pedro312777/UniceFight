// ===================================================
// UNICEFIGHT - BOSS SYSTEM BALANCE PATCH FINAL
// boss.js
// ===================================================
// NOVO BALANCEAMENTO:
// ✔ Lutas mais longas
// ✔ Pedro continua tanque
// ✔ Menos spam agressivo
// ✔ Mais troca de golpes
// ✔ Menos launcher infinito
// ✔ Boss mais estável
// ✔ Melhor pacing arcade
// ✔ Melhor leitura de combate
// ✔ Pressão sem unfair
// ✔ Tank feeling preservado
// ===================================================




const BOSS_DATA = {




  pedro: {
    name: 'Prof. Pedro',
    subject: 'Lógica de Programação',
    style: 'militar',
    color: '#2E4A1E',
    hp: 300,
    speed: 1.82,
    aggression: 1.0,
    personality: {
      reactionTime: 4,
      repetitionRate: 0.55,
      pressureLevel: 0.96,
      chasePower: 0.78,
      recoveryBias: 0.9,
      isTank: true,
      armorLevel: 0.30,
      stunResistance: 0.72,
      knockbackResistance: 0.50
    }
  },




 fase2: {
  name: 'Prof. Romes',
  subject: 'Scrum',
  style: 'adaptativo',
  color: '#5A2E8A',
  hp: 380,
  speed: 2.4,
  aggression: 1.0,




  personality: {
    reactionTime: 2,




    repetitionRate: 0.25,




    pressureLevel: 0.75,




    chasePower: 1.20,




    recoveryBias: 0.9,




    isTank: false,




    armorLevel: 0.10,




    stunResistance: 1.0,




    knockbackResistance: 1.0
  }
},




  fase3: {
    name: 'Prof. Rômulo',
    subject: 'Programação estruturada',
    style: 'normal',
    color: '#8A4A2E',
    hp: 320,
    speed: 2.0,
    aggression: 1.0,
    personality: {
      reactionTime: 3,
      repetitionRate: 0.65,
      pressureLevel: 1.0,
      chasePower: 0.85,
      recoveryBias: 0.9,
      isTank: false,
      armorLevel: 0.20,
      stunResistance: 0.95,
      knockbackResistance: 1.0
    }
  },




  fase4: {
    name: 'Prof. Geovanne',
    subject: 'Engenharia de Requisitos',
    style: 'normal',
    color: '#2E6F8A',
    hp: 340,
    speed: 2.1,
    aggression: 1.0,
    personality: {
      reactionTime: 3,
      repetitionRate: 0.60,
      pressureLevel: 1.0,
      chasePower: 0.90,
      recoveryBias: 0.9,
      isTank: false,
      armorLevel: 0.25,
      stunResistance: 1.0,
      knockbackResistance: 1.05
    }
  },




fase5: {
    name: 'Professor Weverson',
    subject: 'Programação em games',
    style: 'elite',
    color: '#AA2222',
    hp: 380,
    speed: 1.8,
    aggression: 1.0,
    personality: {
      reactionTime: 4,
      repetitionRate: 0.45,
      pressureLevel: 0.85,
      chasePower: 0.75,
      recoveryBias: 0.9,
      isTank: true,
      armorLevel: 0.35,
      stunResistance: 1.1,
      knockbackResistance: 1.1
    }
  }
};
const PHASE_TO_BOSS = [
  'pedro',
  'fase2',
  'fase3',
  'fase4',
  'fase5'
];




class Boss {




  constructor(
    phaseIndex,
    canvasWidth,
    canvasHeight
  ) {








    console.log(
          "BOSS INDEX:",
          phaseIndex
        );
    console.log("BOSS NOVO CARREGADO");




    const bossKey =
      PHASE_TO_BOSS[phaseIndex];




    console.log(
      "Boss carregado:",
      bossKey
    );




    const data =
      BOSS_DATA[bossKey];




    // ===================================
    // IDENTIDADE
    // ===================================
    this.key = bossKey;




    this.name = data.name;




    this.subject = data.subject;




    this.color = data.color;




    this.personality =
      data.personality;




    this.isScrumBoss =
    this.key === "fase2";




    this.isStructuredBoss =
    this.key === "fase3";




    this.isRequirementBoss =
    this.key === "fase4";




    this.sprintTimer = 0;




    this.strategy = "neutral";




    this.adaptationTimer = 0;




    this.rushRecovery = false;




    this.isEnraged = false;




    this.flowStep = 0;




    this.executingFlow = false;




    this.flowCooldown = 0;




    this.completedFlows = 0;




    this.currentFlowAction = null;




    this.flowPattern = [
      "combo",
      "combo",
      "kick",
      "retreat"
    ];




    this.escapeJumping = false;




    this.requirementMode =
      "normal";




    this.requirementTimer = 180;




    this.requirementIndex = 0;

  

    this.escapeDirection = 0;




    this.escapeTimer = 0;




    this.repositioning = false;




    // ===================================
    // TANK ATTRIBUTES
    // ===================================
    this.isTank =
      this.personality.isTank || false;




    this.armorLevel =
      this.personality.armorLevel || 0;




    this.stunResistance =
      this.personality.stunResistance || 1;




    this.knockbackResistance =
      this.personality.knockbackResistance || 1;








    // ===================================
    // TAMANHO
    // ===================================
    this.width = 64;




    this.height = 74;




    // ===================================
    // CANVAS
    // ===================================
    this.canvasWidth =
      canvasWidth;




    this.canvasHeight =
      canvasHeight;




    this.groundY =
      this.canvasHeight -
      20 -
      this.height;




    this.y = this.groundY;




    this.x =
      canvasWidth -
      this.width -
      100;




    // ===================================
    // VIDA
    // ===================================
    this.maxHp = data.hp;




    this.hp = data.hp;




    // ===================================
    // MOVIMENTO
    // ===================================
    this.speed = data.speed;




    this.velocityX = 0;




    this.velocityY = 0;




    this.gravity = 0.55;




    this.facingRight = false;




    this.onGround = true;




    // ===================================
    // IA
    // ===================================
    this.minDistance = 50;




    this.preferredDistance = 70;




    // TURN SYSTEM
    this.turnTimer = 0;




    // tempo para virar
    this.turnCooldown =
      this.key === "pedro"
        ? 20
    : this.personality.reactionTime;




    this.directionLocked = false;




    // ===================================
    // ESTADOS
    // ===================================
    this.isActive = true;




    this.isDead = false;




    this.isDefeated = false;




    this.isMoving = false;




    this.isHurt = false;




    this.isStunned = false;




    this.isDashing = false;




    this.isSpecialAttacking = false;




    this.isAttacking = false;




    this.isKicking = false;




    this.isJoking = false;




    this.jokeTimer = 0;




    this.jokePhase = 0;




    this.jokeTriggered = false;




    this.isEasyAttacking = false;




    this.easyAttackTimer = 0;




    this.easyAttackTriggered = false;




    this.isVisaAttack = false;

    this.visaTargetWall = null;




    this.visaAttackTimer = 0;




    this.visaCooldown = 0;




    this.visaPhase = 0;




    this.visaDirection = 0;

    this.visaTargetWall = null;


    this.isExhausted = false;




    this.exhaustedTimer = 0;




    // Reunião de Emergência




    this.isMeetingAttack = false;






    this.meetingPhase = 0;


    this.meetingTimer = 0;


    this.meetingTriggered = false;




    this.meetingCooldown = 0;


    this.exhaustionRecoveryCooldown = 0;
    this.meetingPressure = 0;


    this.meetingComboCount = 0;
    this.meetingMaxCombos = 4;

    this.meetingLevel = 0;




    this.easyAttackHit = false;




    this.usedFirstEasyAttack = false;

    this.usedFirstVisaAttack = false;


    // Referências aos Clássicos

    this.classicPhase = 0;

    this.classicPortal = null;

    this.classicGhost = null;

    this.classicShip = null;

    this.classicPacMan = null;

    this.classicSequenceIndex = 0;
    this.classicUsedSequence = false;

    this.classicAttackSuccess = false;

    this.classicPlayerEscaped = false;


    this.isClassicAttack = false;


    this.classicTimer = 0;


    this.classicType = null;

    this.isShipAttack = false;

    this.shipPhase = 0;

    this.shipTimer = 0;

    this.shipTriggered = false;

    this.shipX = 0;
    this.shipY = 0;

    this.shipVisible = false;

    this.classicTriggered = false;


    this.classicCooldown = 300;

    this.classicGhost = null;


    this.classicTargetWall = 0;

    this.classicAttackSuccess = false;

this.isControlInversion = false;

this.controlInversionTimer = 0;

this.controlInversionCooldown = 0;


    this.isComboing = false;




    // ===================================
    // COMBATE
    // ===================================
    this.currentDamage = 0;




    this.attackAlreadyHit = false;




    // ===================================
    // PERSONALIDADE
    // ===================================
    this.comboChainChance =
      this.personality.repetitionRate;




    this.pressureLevel =
      this.personality.pressureLevel;




    this.chasePower =
      this.personality.chasePower;




    // ===================================
    // KNOCKBACK
    // ===================================
    this.knockbackForce = 3.2;




    // ===================================
    // PUSHBOX
    // ===================================
   this.bodyPushResistance =
    this.key === "pedro"
      ? 6
      : 0.72;




    // ===================================
    // TIMERS
    // ===================================
    this.attackTimer = 0;




    this.attackCooldown = 0;




    this.hurtTimer = 0;




    this.jokeCooldown = 300;




    this.easyAttackCooldown = 0;




    this.globalJokeCooldown = 0;




    this.invulnerabilityTimer = 0;




    this.armorBrokenTimer = 0;








    this.exposedTimer = 0;




    this.easyAttackInvulnerability = 0;




    this.stunTimer = 0;




    this.dashTimer = 0;




    this.aiReactionTimer = 0;




    this.comboLoopCount = 0;




    // ===================================
    // MENOS INFINITO
    // ===================================
    this.maxComboLoops = 1;




    // ===================================
    // NOVOS TIMERS
    // ===================================
    /*
    this.knockdownTimer = 0;




    this.launchTimer = 0;




    this.recoveryTimer = 0;
    */








    // ===================================
    // HITSTOP
    // ===================================
    this.hitstop = 0;

    Object.defineProperty(
  this,
  "easyAttackProtection",
  {
    get() {
      return this._easyAttackProtection || 0;
    },

    set(value) {

      console.trace(
        "EASY PROTECTION SET:",
        value
      );

      this._easyAttackProtection = value;
    }
  }
);

this.easyAttackProtection = 0;




    this.isBoss = true;




// ===================================
// SPRITE SYSTEM
// ===================================

if (this.key === "pedro") {

    this.spriteSheet =
    sprites.get("pedro");

this.animations =
AnimationData.professorPedro;
this.spriteScale = 1.30;
this.animationSpeedMultiplier = 1.0

}

else if (this.key === "fase2") {

    this.spriteSheet =
    sprites.get("boss_romes");

    this.animations =
    AnimationData.professorRomes;
    this.spriteScale =  1.22;
    this.animationSpeedMultiplier = 0.6
}

else if (this.key === "fase3") {

    this.spriteSheet =
    sprites.get("romulo");

this.animations =
AnimationData.professorRomulo;
this.spriteScale = 1.34;
this.animationSpeedMultiplier = 1.0

}

else if (this.key === "fase4") {

    this.spriteSheet =
    sprites.get("geovanne");

    this.animations =
    AnimationData.professorGeovanne;
    this.spriteScale = 1.41;
    this.animationSpeedMultiplier = 1.0
}

else if (this.key === "fase5") {

    this.spriteSheet =
    sprites.get("weverson");

    this.animations =
    AnimationData.professorWeverson;
    this.spriteScale = 1.38;
    this.animationSpeedMultiplier = 1.0;
}

else {

    this.spriteSheet = null;

    this.animations = null;

}

this.spriteOffsetY = -60;

if (this.key === "pedro") {
  this.attackHitboxDef = {
    punch: { oy: -2000, w: 42, h: 1144 },
    kick:  { oy: 28, w: 54, h: 26 }
  };
} else if (this.key === "fase2") {
  this.attackHitboxDef = {
    punch: { oy: 20, w: 42, h: 34 },
    kick:  { oy: 28, w: 54, h: 26 }
  };
} else if (this.key === "fase3") {
  this.attackHitboxDef = {
    punch: { oy: 20, w: 42, h: 34 },
    kick:  { oy: 28, w: 54, h: 26 }
  };
} else if (this.key === "fase4") {
  this.attackHitboxDef = {
    punch: { oy: 20, w: 42, h: 34 },
    kick:  { oy: 28, w: 54, h: 26 }
  };
} else if (this.key === "fase5") {
  this.attackHitboxDef = {
    punch: { oy: 20, w: 42, h: 34 },
    kick:  { oy: 28, w: 54, h: 26 }
  };
}


// ← ADICIONA AQUI
if (this.key === "pedro") {
  this.hurtboxDef = { ox: 0.05, oy: -1.70, w: 0.90, h: 1.50 };
}
else if (this.key === "fase2") {
  this.hurtboxDef = { ox: 0.05, oy: -1.55, w: 0.90, h: 1.50 };
}
else if (this.key === "fase3") {
  this.hurtboxDef = { ox: 0.05, oy: -1.85, w: 0.90, h: 1.65 };
}
else if (this.key === "fase4") {
  this.hurtboxDef = { ox: 0.05, oy: -1.87, w: 0.90, h: 1.75 };
}
else if (this.key === "fase5") {
  this.hurtboxDef = { ox: 0.05, oy: -1.75, w: 0.90, h: 1.65 };
}

initializeAnimator(this);

console.log(
    "BOSS SPRITE:",
    this.spriteSheet
);
  }




  // ===================================================
  // UPDATE
  // ===================================================
  update(player) {

    console.log(
  "UPDATE RUNNING",
  "meeting:", this.isMeetingAttack,
  "hp:", this.hp
);




    if (this.isDefeated) {
      return;
    }



    console.log(
  "HITSTOP",
  this.hitstop,
  "meeting:",
  this.isMeetingAttack
);

    if (this.hitstop > 0) {




      this.hitstop--;




      return;
    }




    this.handleTimers(player);


if (this.pendingControlAttack) {

    this.pendingControlTimer--;

    if (this.pendingControlTimer <= 0) {

        this.pendingControlAttack = false;

        this.startControlInversion();
    }

    return;
}



  // ===================================
// FASES DO ROMES
// ===================================
if (this.isScrumBoss) {




  const hpPercent =
    this.hp / this.maxHp;




  // Sprint Final
  if (hpPercent <= 0.35) {




    this.chasePower = 1.60;
    this.comboChainChance = 0.60;
  }




  // Adaptação
  else if (hpPercent <= 0.70) {




    this.chasePower = 1.40;
    this.comboChainChance = 0.40;
  }




  // Planejamento
  else {




    this.chasePower = 1.20;
    this.comboChainChance = 0.25;
  }
}




    /*
    if (this.isKnockedDown) {




      this.velocityX *= 0.92;
    }
    */
   
    if (!this.isStunned)
    {




      this.updateDirection(player);




      if (
        this.aiReactionTimer > 0
      ) {




        this.aiReactionTimer--;
      }




      if (
        !this.isStunned &&
        !this.isDead &&
        this.aiReactionTimer <= 0
      ) {




        this.updateBehavior(player);




        this.aiReactionTimer =
          this.personality.reactionTime;
      }
    }




    this.applyPhysics();




    console.log(




    "AFTER PHYSICS",




    "x:", this.x,




    "velX:", this.velocityX




    );




if (this.y >= this.groundY) {




  this.y = this.groundY;




  this.velocityY = 0;




  this.onGround = true;




}












if (
  this.escapeJumping &&
  this.onGround
)
{
  this.escapeJumping = false;




  const playerCenter =
    player.x + player.width / 2;




  const bossCenter =
    this.x + this.width / 2;




  if (bossCenter > playerCenter) {








    this.escapeDirection = 1;




  } else {




    this.escapeDirection = -1;
  }




    console.log(
    "POUSOU",
    "playerCenter:",
    playerCenter,
    "bossCenter:",
    bossCenter,
    "escapeDirection:",
    this.escapeDirection
  );




  this.repositioning = true;




}




this.limitPosition();
  }




  // ===================================================
  // IA
  // ===================================================
  updateBehavior(player) {
      console.log("UPDATE BEHAVIOR");




console.log(
  "UPDATE BEHAVIOR",
  "velocityX:",
  this.velocityX,
  "sprintTimer:",
  this.sprintTimer
);




if (




this.isJoking ||




this.isEasyAttacking ||




this.isVisaAttack ||




this.isMeetingAttack ||


this.isClassicAttack ||


this.isExhausted




) {




if (




this.isJoking ||




this.isExhausted




) {




this.velocityX = 0;




}




return;




}




    if (this.isBusy()) {
      return;
    }




if (
  this.isStructuredBoss &&
  this.executingFlow &&
  !this.repositioning
) {




  // ação ainda acontecendo
  if (
    this.currentFlowAction &&
    (
      this.isAttacking ||
      this.isKicking ||
      this.attackCooldown > 0
    )
  ) {




    return;
  }




  // ação terminou
  if (this.currentFlowAction) {




    this.flowStep++;




    this.currentFlowAction = null;




    if (
      this.flowStep >=
      this.flowPattern.length
    ) {




      this.executingFlow = false;




      this.flowCooldown = 90;




      this.flowStep = 0;




      this.completedFlows++;




      return;
    }
  }




  const action =
    this.flowPattern[
      this.flowStep
    ];




  console.log(
    "ROMULO STEP:",
    this.flowStep,
    "ACTION:",
    action
  );




  this.currentFlowAction =
    action;




  if (action === "combo") {




    this.startCombo();




  } else if (action === "kick") {




    this.startKick();




  } else if (action === "retreat") {




    this.velocityX =
      this.facingRight
        ? -7
        : 7;




    this.attackCooldown = 25;
  }




  return;
}




  // ===================================
  // REPOSICIONAMENTO APÓS SALTO
  // ===================================
  if (this.repositioning) {




    const centerX =
      this.canvasWidth / 2;




    const bossCenter =
      this.x + this.width / 2;




    const distanceToCenter =
      Math.abs(centerX - bossCenter);




    if (distanceToCenter < 60) {




      this.repositioning = false;




      this.velocityX = 0;




    } else {




      this.velocityX =
        bossCenter < centerX
          ? 5
          : -5;
    }




    return;
  }




    const playerCenter =
      player.x + player.width / 2;




    const bossCenter =
      this.x + this.width / 2;




    const dx =
      playerCenter - bossCenter;




    const dist =
      Math.abs(dx);


if (
  this.key === "fase5" &&
  this.classicCooldown <= 0 &&
  !this.isClassicAttack
) {
  this.startClassicAttack();
  return;
}




// ===================================
// PULO DE ESCAPE - GEOVANNE
// ===================================
if (this.isRequirementBoss) {




  const wallWarningDistance = 140;




  const nearLeftWall =
    this.x <= wallWarningDistance;




  const nearRightWall =
    this.x >=
    this.canvasWidth -
    this.width -
    wallWarningDistance;




  const trappedLeft =
    nearLeftWall &&
    dx > 0;




  const trappedRight =
    nearRightWall &&
    dx < 0;




if (
  dist < 120 &&
  (
    trappedLeft ||
    trappedRight
  )
) {




  console.log(
    "GEOVANNE DECIDIU PULAR"
  );




  this.startEscapeJump(player);




  // entra em modo rush após escapar
  this.requirementMode = "rush";




  this.requirementTimer = 240;




  console.log(
  "GEOVANNE ENTROU EM RUSH APOS O PULO"
  );




  return;
}
}




      if (
  this.isRequirementBoss
) {

  if (

    this.meetingPressure >= 6 &&

    this.meetingCooldown <= 0 &&

    !this.isMeetingAttack

) {

    console.log(
        "REUNIAO POR PRESSAO"
    );

    this.meetingPressure = 0;

    this.startMeetingAttack();

    this.meetingCooldown = 240;

    return;
}

if (
  !this.usedFirstVisaAttack &&
  dist > 100 &&
  dist < 250
) {

  this.usedFirstVisaAttack = true;

  this.startVisaAttack();

  return;
}


if (

this.visaCooldown <= 0 &&
this.exhaustionRecoveryCooldown <= 0 &&

dist > 100 &&

dist < 250 &&

Math.random() < 0.015

) {




this.startVisaAttack();




return;
}




if (

this.meetingCooldown <= 0 &&
this.exhaustionRecoveryCooldown <= 0 &&

dist > 80 &&

dist < 220 &&

Math.random() < 0.04

) {

    this.startMeetingAttack();

    this.meetingCooldown = 300;

    return;
}
  // ======================
  // MODO DISTÂNCIA
  // ======================




  if (
    this.requirementMode ===
    "distance"
  ) {




    if (dist < 180) {




      this.velocityX =
        dx > 0
          ? -4
          : 4;
    }




    return;
  }




  // ======================
  // MODO RUSH
  // ======================




  if (
    this.requirementMode ===
    "rush"
  ) {




    console.log(
    "GEOVANNE ESTA EM RUSH"
    );




    if (
      this.attackCooldown <= 0
    ) {




      this.startSprint();




      this.attackCooldown = 40;
    }




    return;
  }
}




      if (




  this.isStructuredBoss &&




  !this.usedFirstEasyAttack &&
  this.completedFlows >= 1 &&




  dist > 90 &&




  dist < 220




) {




  this.usedFirstEasyAttack = true;




  this.startEasyAttack();




  return;
}




      if (
        this.isStructuredBoss &&
        this.jokeCooldown <= 0 &&
        this.globalJokeCooldown <= 0 &&
        dist > 80 &&
        dist < 180
      )
      {
        this.startJoke();




        return;
      }




if (




  this.isStructuredBoss &&




  this.easyAttackCooldown <= 0 &&




  this.globalJokeCooldown <= 0 &&




  !this.isEasyAttacking &&




  !this.isJoking &&




  this.attackCooldown <= 0 &&




  dist > 90 &&




  dist < 220 &&




  Math.random() < 0.05




)
{




  this.startEasyAttack();




  return;
}




  // ===================================
// PULO DE ESCAPE - RÔMULO
// ===================================
if (this.isStructuredBoss) {




  const wallWarningDistance = 140;




  const nearLeftWall =
    this.x <= wallWarningDistance;




  const nearRightWall =
    this.x >=
    this.canvasWidth -
    this.width -
    wallWarningDistance;




  const trappedLeft =
    nearLeftWall &&
    dx > 0;




  const trappedRight =
    nearRightWall &&
    dx < 0;




  if (
    dist < 120 &&
    (
      trappedLeft ||
      trappedRight
    )
  ) {




    console.log(
      "ROMULO DECIDIU PULAR"
    );




    this.startEscapeJump(player);




    return;
  }
}












    //MODOS DO ROMES
if (this.isScrumBoss) {




  if (this.adaptationTimer > 0) {




    this.strategy = "space";




  } else if (this.rushRecovery) {




    this.strategy = "rush";




  } else if (dist > 180) {




    this.strategy = "chase";




  } else {




    this.strategy = "neutral";
  }
}
    this.isMoving = false;




if (
    this.isScrumBoss &&
    Math.random() < 0.01
) {




    this.velocityX = 0;




    return;
  }




    // ===================================
    // PERSEGUIÇÃO MAIS PESADA
    // ===================================
    if (
      dist > this.preferredDistance
    ) {




      this.isMoving = true;




      this.velocityX =
        dx > 0
          ? this.speed * this.chasePower
          : -this.speed * this.chasePower;
    }




    // ===================================
    // MENOS COLADO
    // ===================================
    if (
      dist < this.minDistance
    ) {




      this.velocityX =
        dx > 0
          ? -0.45
          : 0.45;
    }




      console.log(
      "DIST:",
      dist,
      "CD:",
      this.attackCooldown,
      "TURN:",
      this.turnTimer
    );




if (
  this.isScrumBoss &&
  this.strategy === "space"
) {




const wallWarningDistance = 140;




const nearLeftWall =
  this.x <= wallWarningDistance;




const nearRightWall =
  this.x >=
  this.canvasWidth -
  this.width -
  wallWarningDistance;




const trappedLeft =
  nearLeftWall &&
  dx > 0;




const trappedRight =
  nearRightWall &&
  dx < 0;




if (
  dist < 120 &&
  (
    trappedLeft ||
    trappedRight
  )
) {




  console.log(
    "ROMES DECIDIU PULAR"
  );




  this.startEscapeJump(player);




  return;
}




  this.velocityX =
    dx > 0
      ? -3
      : 3;




  return;
}




if (
  this.isScrumBoss &&
  this.strategy === "rush"
)
{
  if (this.attackCooldown <= 0) {




  this.startRetreatSprint();




    this.rushRecovery = false;
  }




  return;
}












    if (
      this.isScrumBoss &&
      this.strategy === "chase" &&
      this.attackCooldown <= 0 &&
      Math.random() < 0.45
    ) {




      this.startSprint();
      return;
    }




    // ===================================
    // ATAQUE
    // ===================================
if (
  dist < 74 &&
  this.attackCooldown <= 0 &&
  this.turnTimer <= 0
) {




if (this.isScrumBoss) {




  const roll = Math.random();




  if (roll < 0.40) {




    this.startCombo();




  } else if (roll < 0.80) {




    this.startKick();




  } else {




    this.startSprint();
  }




}
else if (this.isStructuredBoss) {




  if (
    !this.executingFlow &&
    this.flowCooldown <= 0
  ) {




    this.executingFlow = true;




    this.flowStep = 0;
  }
}
else {




  if (
    Math.random() <
    this.comboChainChance
  ) {




    this.startCombo();




  } else {




    this.startKick();
  }
}




}
  }




  // ===================================================
  // COMBO
  // ===================================================
startCombo() {




  console.log("ROMULO EXECUTOU COMBO");




  console.trace("START COMBO");




  this.isAttacking = true;
   
    this.isAttacking = true;




    this.attackAlreadyHit = false;




    // ===================================
    // MENOS DANO
    // ===================================
    this.currentDamage = 6;




    // ===================================
    // ATAQUE MAIS LENTO (Geovanne ataque mais rápido)
    // ===================================
    if (this.isRequirementBoss) {

        this.attackTimer = 7;
        this.attackCooldown = 18;

    } else {

        this.attackTimer = 10;
        this.attackCooldown = 24;
    }




    this.velocityX =
      this.facingRight
        ? 0.8
        : -0.8;
  }




  // ===================================================
  // CHUTE PESADO
  // ===================================================
  startKick() {




    console.log("ROMULO EXECUTOU KICK");




    this.isKicking = true;




    this.isAttacking = false;




    this.attackAlreadyHit = false;




    this.currentDamage = 12;



    // (Geovanne mais rápido)
    if (this.isRequirementBoss) {

        this.attackTimer = 14;
        this.attackCooldown = 36;

    } else {

        this.attackTimer = 18;
        this.attackCooldown = 48;
    }



    this.velocityX =
      this.facingRight
        ? 0.4
        : -0.4;
  }




startJoke() {




  this.currentJoke =
    "Esse aí tá com mais preguiça que quem fez a bandeira do Japão.";




  showCombatQuote(




    this.currentJoke,




    this.x + this.width / 2,




    this.y,
    this
  );




  this.isJoking = true;




  this.jokeTriggered = false;




  this.jokeTimer = 90;




  this.attackCooldown = 60;




  this.velocityX = 0;




  this.jokeCooldown = 600;




  this.globalJokeCooldown = 180;
}








startEasyAttack() {




  this.isEasyAttacking = true;




  this.easyAttackTriggered = false;




  this.easyAttackHit = false;




  this.easyAttackTimer = 50;




  this.velocityX = 0;




  this.easyAttackCooldown = 420;




  this.globalJokeCooldown = 180;




  showCombatQuote(




    "Isso tá mais fácil que...",




    this.x +
    this.width / 2,




    this.y,
    this
  );




}




  startSprint() {




  this.sprintTimer = 20;




  this.velocityX =
    this.facingRight
      ? 6
      : -6;




  this.attackCooldown = 20;
}




startVisaAttack() {




  this.isVisaAttack = true;

this.visaCooldown = 180;

  this.visaPhase = 1;




  this.velocityX = 0;




  this.visaJumpStarted = false;




  this.visaHitDash1 = false;




  this.visaHitDash2 = false;
}




startExhaustion() {




this.isExhausted = true;




this.exhaustedTimer = 300;

this.exhaustionRecoveryCooldown = 240;




this.velocityX = 0;




showCombatQuote(




"Pessoal... vou abrir o próximo slide...",




this.x +
this.width / 2,




this.y,
this




);




}




startMeetingAttack() {
  

  this.meetingLevel++;

if (this.meetingLevel > 4) {
    this.meetingLevel = 4;
}

  this.isAttacking = false;
  this.isKicking = false;
  this.attackTimer = 0;


  this.meetingMaxCombos =
      2 + (this.meetingLevel * 2);

  this.isMeetingAttack = true;

  this.meetingPhase = 1;

  this.meetingTimer = 90; // 1,5 segundos

  this.meetingTriggered = false;

  this.meetingComboCount = 0;

  this.velocityX = 0;

let meetingQuote =
    "Rapidinho, vamos alinhar uma coisa.";

if (this.meetingLevel >= 2) {

    meetingQuote =
        "Pessoal, precisamos revisar alguns pontos.";
}

if (this.meetingLevel >= 3) {

    meetingQuote =
        "Vamos precisar marcar outra reunião.";
}

if (this.meetingLevel >= 4) {

    meetingQuote =
        "Essa reunião vai demorar um pouco.";
}

showCombatQuote(

    meetingQuote,

    this.x + this.width / 2,

    this.y,
    this

);
}

startClassicAttack() {

  console.log(
    "CLASSIC INICIO",
    this.classicPhase
);


 // Reset dos resultados do clássico anterior
  this.classicPlayerEscaped = false;
  this.classicAttackSuccess = false;


if (!this.classicUsedSequence) {
const sequence = ["ghost", "ship", "pacman"];
this.classicType = sequence[this.classicSequenceIndex];
this.classicSequenceIndex++;
if (this.classicSequenceIndex >= sequence.length) {
    this.classicUsedSequence = true;
}
} else {
    const options = ["ghost", "ship", "pacman"];
    this.classicType = options[Math.floor(Math.random() * options.length)];
}

console.log(
    "CLASSIC TYPE:", this.classicType,
    "SEQ INDEX:", this.classicSequenceIndex,
    "USED SEQUENCE:", this.classicUsedSequence
)


  this.isClassicAttack = true;

  this.classicTriggered = false;

  this.classicAttackSuccess = false;

  this.isClassicAttack = true;

  this.classicPhase = 1;

  this.velocityX = 0;

  this.classicCooldown = 480;

  const playerCenter =
      Game.player.x +
      Game.player.width / 2;

  const arenaCenter =
      this.canvasWidth / 2;

  if (playerCenter < arenaCenter) {

      this.classicTargetWall =
          this.canvasWidth -
          this.width -
          20;

  } else {

      this.classicTargetWall = 20;

  }


if (this.classicType === "ship") {
    showCombatQuote(
        "Prepare-se para a invasão!",
        this.x + this.width / 2,
        this.y,
        this
    );
} else if (this.classicType === "pacman") {
    showCombatQuote(
        "E esse clássico?",
        this.x + this.width / 2,
        this.y,
        this
    );
} else {
    showCombatQuote(
        "Todo desenvolvedor aprende com os clássicos.",
        this.x + this.width / 2,
        this.y,
        this
    );
}


}

startControlInversion() {

    this.isControlInversion = true;

    this.controlInversionTimer = 300; // 5 segundos

    player.controlsInverted = true;

    showCombatQuote(

        "Eu programo as regras deste jogo.",

        this.x + this.width / 2,

        this.y

    );
}

/*startShipAttack() {

    this.isShipAttack = true;

    this.shipPhase = 1;

    this.shipTimer = 60;

    this.shipTriggered = false;

    this.shipVisible = true;

    this.shipX = this.x;

    this.shipY = this.y - 60;

    showCombatQuote(

        "Prepare-se para a invasão.",

        this.x + this.width / 2,

        this.y

    );
}

*/


startRetreatSprint() {




 console.log(
    "START RETREAT SPRINT",
    this.escapeDirection
  );




  this.sprintTimer = 20;




  this.velocityX =
    this.escapeDirection * 8;
  console.log(
    "SPRINT X:",
    this.velocityX
  );
}




startEscapeJump(player) {




  if (!this.onGround) {
    return;
  }




  this.escapeJumping = true;




  this.velocityY = -15;




const playerCenter =
  player.x + player.width / 2;




const bossCenter =
  this.x + this.width / 2;




if (bossCenter > playerCenter) {




  // jogador está à esquerda
  // saltar para a esquerda




  this.velocityX = -12;




} else {




  // jogador está à direita
  // saltar para a direita




  this.velocityX = 12;
}




  console.log(
    "ROMES ESCAPOU DO CANTO"
  );
}




  // ===================================================
  // DIREÇÃO
  // ===================================================
  updateDirection(player) {




    if (
      this.isAttacking ||
      this.directionLocked
    ) {
      return;
    }




    const shouldFaceRight =
      player.x > this.x;




    if (
      shouldFaceRight !==
      this.facingRight
    ) {




      if (this.turnTimer <= 0) {




        this.turnTimer =
          this.turnCooldown;




        return;
      }




      this.turnTimer--;




      if (this.turnTimer <= 0) {




        this.facingRight =
          shouldFaceRight;
      }




      return;
    }




    this.turnTimer = 0;
  }




  // ===================================================
  // FÍSICA
  // ===================================================
  applyPhysics() {




    this.velocityY += this.gravity;




    this.x += this.velocityX;




    this.y += this.velocityY;




    // ===================================
    // MAIS PESADO
    // ===================================
    this.velocityX *= 0.91;




    if (
      Math.abs(this.velocityX) < 0.04
    ) {




      this.velocityX = 0;
    }
  }




  // ===================================================
  // TIMERS
  // ===================================================
  handleTimers(player) {




  if (this.sprintTimer > 0) {




    this.sprintTimer--;
  }




  if (this.adaptationTimer > 0) {




  this.adaptationTimer--;
  }




  if (
  this.isRequirementBoss
) {




  this.requirementTimer--;




  if (
    this.requirementTimer <= 0
  ) {




const modes = [




  "normal",




  "distance",




  "rush"
];




this.requirementIndex++;




if (
  this.requirementIndex >=
  modes.length
) {




  this.requirementIndex = 0;
}




this.requirementMode =
  modes[
    this.requirementIndex
  ];




    this.requirementTimer =




      360 +
      Math.floor(
        Math.random() * 120
      );




    console.log(
      "GEOVANNE NOVO REQUISITO:",
      this.requirementMode
    );
  }
}




  if (this.flowCooldown > 0) {




  this.flowCooldown--;
}








    if (this.attackTimer > 0) {




      this.attackTimer--;
    }




else {




  if (
    this.isAttacking &&
    Math.random() <
      this.comboChainChance
  ) {




    this.startCombo();
    return;
  }




  this.comboLoopCount = 0;




  this.isAttacking = false;




  this.isKicking = false;




  this.attackAlreadyHit = false;
}




    if (this.attackCooldown > 0) {




      this.attackCooldown--;
    }












    if (this.jokeCooldown > 0) {




      this.jokeCooldown--;
    }




    if (this.easyAttackCooldown > 0) {




    this.easyAttackCooldown--;
    }




    if (this.visaCooldown > 0) {




      this.visaCooldown--;
    }




    if (this.meetingCooldown > 0) {




    this.meetingCooldown--;




    }

    if (this.exhaustionRecoveryCooldown > 0) {
    this.exhaustionRecoveryCooldown--;
}




    if (this.classicCooldown > 0) {


      this.classicCooldown--;


    }


    if (this.exhaustedTimer > 0) {




    this.exhaustedTimer--;




    } else {




      this.isExhausted = false;
    }




    if (this.globalJokeCooldown > 0) {
      this.globalJokeCooldown--;
    }




if (this.isJoking) {




  if (this.jokeTimer > 0) {




    this.jokeTimer--;




    if (




        this.isJoking &&




        this.jokeTimer === 45 &&




        !this.jokeTriggered




      ) {




      this.jokeTriggered = true;




      this.jokePhase = 1;




      console.log(
        "PUNCHLINE"
      );




if (player) {




    console.log(
  "PIADA ACERTOU",
  {
    defending: player.isDefending,
    attacking: player.isAttacking,
    kicking: player.isKicking,
    airKick: player.isAirKicking,
    onGround: player.onGround
  }
);








  if (player.isDefending) {

    this.classicPlayerEscaped = true;

    this.classicAttackSuccess = true;


    console.log(
      "DEFENDEU A PIADA"
    );




    showCombatQuote(




      "Foco na aula!",




      player.x +
      player.width / 2,




      player.y - 60




    );




 } else {

    player.slowTimer = 240;

    showCombatQuote(
      "Que sono...",
      player.x + player.width / 2,
      player.y - 60

    );
}
}
    }




  } else {




    this.isJoking = false;




    this.jokePhase = 0;




    this.jokeTriggered = false;
  }
}




if (this.isEasyAttacking) {




  if (this.easyAttackTimer > 0) {




    this.easyAttackTimer--;




    if (




      this.easyAttackTimer === 25 &&




      !this.easyAttackTriggered




    ) {




      this.easyAttackTriggered =
        true;




      if (player) {




          player.easyAttackWindow = 30;
      }




      console.log(
        "DASH!"
      );




      this.velocityX =




      this.facingRight




      ? 18




      : -18;
    }




    if (




    this.easyAttackTriggered &&




    !this.easyAttackHit




    ) {




    const hitDistance =




    Math.abs(




    (player.x + player.width/2)




    -




    (this.x + this.width/2)




    );




    const verticalDistance =




    Math.abs(




    player.y -




    this.y




    );




if (




  hitDistance < 70 &&




  verticalDistance < 45




) {




  if (player.easyAttackProtection > 0) {




  console.log(
    "PROTECAO CONTRA PIADA"
  );




  return;
}




  // ===================================
  // ESQUIVA DA PIADA
  // ===================================
    if (!player.onGround) {




    console.log(
      "DESVIOU DA PIADA"
    );




    console.log(
    "PROTECAO ATIVADA:",
    player.easyAttackProtection
    );




    showCombatQuote(




      "Passar na sua matéria!",




      player.x +
      player.width / 2,




      player.y - 60




    );




    this.easyAttackHit = true;




    this.velocityX = 0;




    this.easyAttackTimer = 15;




    this.isStunned = true;




    this.stunTimer = 45;




    return;
  }




  this.easyAttackHit = true;




  console.log(
    "EASY ATTACK HIT"
  );



player.takeDamage(24, true);



  showCombatQuote(




    "...copiar slide!",




    this.x +
    this.width / 2,




    this.y,
    this




  );




  this.velocityX = 0;




  this.easyAttackTimer = 15;
}
    }




  } else {




  this.isEasyAttacking = false;




  this.easyAttackTriggered =
    false;




  this.velocityX = 0;




}
}

if (this.isMeetingAttack) {

    this.velocityX = 0;

    // =========================
    // FASE 1 - REUNIÃO
    // =========================

    if (this.meetingPhase === 1) {

const playerCenter =
    player.x + player.width / 2;

const bossCenter =
    this.x + this.width / 2;

const distance =
    Math.abs(playerCenter - bossCenter);

if (distance > 100) {

    this.velocityX =
        playerCenter > bossCenter
            ? 1.2
            : -1.2;

} else {

    this.velocityX = 0;


            /*showCombatQuote(
                "Todos vocês, atenção.",
                this.x + this.width / 2,
                this.y
            );*/

            this.meetingPhase = 2;

            this.meetingTimer = 180;
        }

        return;
    }

    // =========================
    // FASE 2 - ESPANCAMENTO
    // =========================

    if (this.meetingPhase === 2) {

      const playerCenter =
    player.x + player.width / 2;

const bossCenter =
    this.x + this.width / 2;

const distance =
    Math.abs(playerCenter - bossCenter);

// andar durante a reunião
if (
    !this.isAttacking &&
    !this.isKicking
) {

    if (distance > 80) {

        this.velocityX =
            playerCenter > bossCenter
                ? 1.5
                : -1.5;

    } else {

        this.velocityX = 0;
    }
}

        this.meetingTimer--;

        if (
            this.attackCooldown <= 0 &&
            !this.isAttacking &&
            !this.isKicking
        ) {

            const roll = Math.random();

            if (roll < 0.60) {

                this.startCombo();

            } else {

                this.startKick();
            }

            this.meetingComboCount++;
        }

        if (
            this.meetingTimer <= 0 ||
            this.meetingComboCount >= this.meetingMaxCombos
        ) {

            this.isMeetingAttack = false;

            this.meetingPhase = 0;

            this.meetingPressure = 0;

            this.isAttacking = false;
            this.isKicking = false;
            this.attackTimer = 0;

            this.attackCooldown = 45;

            this.startExhaustion();
        }

        if (this.hurtTimer > 0) {

            this.hurtTimer--;

        } else {

            this.isHurt = false;
        }

        if (this.invulnerabilityTimer > 0) {

            this.invulnerabilityTimer--;
        }

        return;
    }
}


if (this.isVisaAttack) {




// ===================================
// FASE 1 - SALTO SOBRE O JOGADOR
// ===================================




if (this.visaPhase === 1) {




  if (




    this.onGround &&




    !this.visaJumpStarted




  ) {




    this.visaJumpStarted = true;




    this.velocityY = -15;




    const playerCenter =
      player.x + player.width / 2;




    const bossCenter =
      this.x + this.width / 2;




    this.velocityX =




      bossCenter > playerCenter




      ? -10




      : 10;




    this.visaDirection =




      this.velocityX > 0




      ? 1




      : -1;
  }




  // só muda de fase depois de pousar




if (

  this.visaJumpStarted &&

  this.onGround

) {

  this.visaJumpStarted = false;

  const playerCenter =
    player.x + player.width / 2;

  const leftWall = 20;

  const rightWall =
    this.canvasWidth -
    this.width -
    20;

  const distLeft =
    Math.abs(playerCenter - leftWall);

  const distRight =
    Math.abs(playerCenter - rightWall);

  this.visaTargetWall =
    distLeft > distRight
      ? leftWall
      : rightWall;

  console.log(
    "PAREDE ESCOLHIDA:",
    this.visaTargetWall
  );

  this.visaPhase = 2;
}




  return;
}




// ===================================
// FASE 2 - IR PARA O CANTO
// ===================================




if (this.visaPhase === 2) {




const targetX =
  this.visaTargetWall;



  const distToTarget =
    Math.abs(this.x - targetX);




  if (distToTarget < 10) {




    this.velocityX = 0;




    this.visaPhase = 3;




  } else {




    const bossCenter =
  this.x + this.width / 2;




const playerCenter =
  player.x + player.width / 2;




const playerBlocking =




  (targetX > this.x &&
   playerCenter > bossCenter)




||




  (targetX < this.x &&
   playerCenter < bossCenter);




if (




  playerBlocking &&




  Math.abs(playerCenter - bossCenter) < 80 &&




  this.onGround




) {




  this.velocityY = -15;




}




    this.velocityX =
      this.x < targetX
        ? 4
        : -4;
  }




  return;
}




// ===================================
// FASE 3 - ESPERAR ALUNO
// ===================================




if (this.visaPhase === 3) {




  const playerCenter =
    player.x + player.width / 2;




  const arenaCenter =
    this.canvasWidth / 2;




  if (




    Math.abs(
      playerCenter -
      arenaCenter
    ) < 120




  ) {




    showCombatQuote(




      "Cadê o visto?",




      this.x + this.width / 2,




      this.y,
      this




    );




    this.visaPhase = 4;




    this.visaAttackTimer = 50;
  }




  return;
}




// ===================================
// FASE 4 - DASH 1
// ===================================




if (this.visaPhase === 4) {




  if (this.visaAttackTimer > 0) {




    this.visaAttackTimer--;




  } else {




    const arenaCenter =
  this.canvasWidth / 2;




const bossCenter =
  this.x + this.width / 2;




this.visaDirection =




bossCenter < arenaCenter




? 1




: -1;




this.velocityX =




this.visaDirection > 0




? 18




: -18;




    this.visaPhase = 5;
  }




  return;
}




// ===================================
// FASE 5 - CHEGAR OUTRA PAREDE
// ===================================




if (this.visaPhase === 5) {




this.velocityX =




this.visaDirection > 0




? 18




: -18;




if (!this.visaHitDash1) {




const horizontal =




Math.abs(




(player.x + player.width/2)




-




(this.x + this.width/2)




);




const vertical =




Math.abs(




player.y -




this.y




);




if (




horizontal < 70 &&




vertical < 45




) {




this.visaHitDash1 = true;




player.takeDamage(30);




}




}




this.isMoving = true;




const leftLimit = 20;




const rightLimit =




this.canvasWidth -




this.width -




20;




const reachedWall =




(




this.velocityX > 0 &&




this.x >= rightLimit




)




||




(




this.velocityX < 0 &&




this.x <= leftLimit




);




if (reachedWall) {




this.velocityX = 0;




if (this.visaHitDash1) {




this.isVisaAttack = false;

this.visaTargetWall = null;




this.visaPhase = 0;




this.startExhaustion();




return;




}




showCombatQuote(




"Volta aqui!",




this.x +
this.width / 2,




this.y,
this




);




this.visaDirection *= -1;




this.visaAttackTimer = 40;




this.visaPhase = 6;




}
return;
}




// ===================================
// FASE 6 - DASH DE VOLTA
// ===================================




if (this.visaPhase === 6) {




if (this.visaAttackTimer > 0) {




this.visaAttackTimer--;




return;




}




this.velocityX =




this.visaDirection > 0




? 18




: -18;




if (!this.visaHitDash2) {




const horizontal =




Math.abs(




(player.x + player.width/2)




-




(this.x + this.width/2)




);




const vertical =




Math.abs(




player.y -




this.y




);




if (




horizontal < 70 &&




vertical < 45




) {




this.visaHitDash2 = true;




player.takeDamage(30);




}




}




this.isMoving = true;




const leftLimit = 20;




const rightLimit =




this.canvasWidth -




this.width -




20;




const reachedWall =




(




this.velocityX > 0 &&




this.x >= rightLimit




)




||




(




this.velocityX < 0 &&




this.x <= leftLimit




);




if (reachedWall) {




this.velocityX = 0;




this.isVisaAttack = false;

this.visaTargetWall = null;




this.visaPhase = 0;




this.startExhaustion();




}




return;
}
}




if (this.isExhausted) {




if (this.exhaustedTimer > 0) {




this.exhaustedTimer--;




} else {




this.isExhausted = false;




}



}

if (this.pendingControlAttack) {

    this.pendingControlTimer--;

    if (this.pendingControlTimer <= 0) {

        this.pendingControlAttack = false;

        this.startControlInversion();
    }

    return;
}

/*if (this.isShipAttack) {

    // FASE 1
    if (this.shipPhase === 1) {

            const targetX =
          this.canvasWidth / 2;

      this.shipX +=
          (targetX - this.shipX) * 0.08;

        this.shipTimer--;

        if (this.shipTimer <= 0) {

            this.shipPhase = 2;

            this.shipTimer = 45;

            showCombatQuote(

                "Defenda-se!",

                this.x + this.width / 2,

                this.y

            );
        }

        return;
    }

    // FASE 2
    if (this.shipPhase === 2) {

        this.shipTimer--;

        if (this.shipTimer <= 0) {

            this.shipPhase = 3;

            // TESTE DE DEFESA

 if (!player.isDefending) {

    player.takeDamage(30);

    this.classicAttackSuccess = true;

    showCombatQuote(

        "Acerto direto!",

        player.x + player.width / 2,

        player.y

    );

} else {

    this.classicPlayerEscaped = true;

    showCombatQuote(

        "Bloqueado!",

        player.x + player.width / 2,

        player.y

    );
}

            this.shipTimer = 45;
        }

        return;
    }

    // FASE 3
    if (this.shipPhase === 3) {

        this.shipTimer--;

        if (this.shipTimer <= 0) {

           this.shipVisible = false;

            this.isShipAttack = false;

            this.shipPhase = 0;

            this.classicPhase = 0;

            this.isClassicAttack = false;

            // Vulnerabilidade

            this.exposedTimer = 240;

            this.isStunned = true;

            this.stunTimer = 240;

            this.classicCooldown = 900;

            showCombatQuote(

                "Tem alguma coisa errada aqui...",

                this.x + this.width / 2,

                this.y

            );
        }

        return;
    }
}

*/


if (this.isClassicAttack) {

  console.log(
    "CLASSIC PHASE:",
    this.classicPhase
);

    if (this.classicPhase === 1) {

const targetX =
    this.classicTargetWall;

const distance =
    Math.abs(
        this.x -
        targetX
    );

if (distance < 10) {

      console.log(
        "CLASSIC -> FASE 2"
    );


    this.velocityX = 0;

    this.classicPhase = 2;

} else {

    this.velocityX =

        this.x < targetX

        ? 4

        : -4;
}

return;
    }

    if (this.classicPhase === 2) {
if (this.classicPhase === 2) {

    const playerCenter =
        player.x +
        player.width / 2;

    const arenaCenter =
        this.canvasWidth / 2;

    const distance =
        Math.abs(
            playerCenter -
            arenaCenter
        );

if (this.classicType === "ship") {

    this.velocityX = 0;
    this.classicTimer = 60;
    this.classicPhase = 3;

} else {

    if (distance < 120) {

        console.log(
            "PLAYER NO CENTRO"
        );

        this.velocityX = 0;
        this.classicTimer = 60;
        this.classicPhase = 3;
    }
}

return;
}
    }

    if (this.classicPhase === 3) {

if (this.classicPhase === 3) {

    this.velocityX = 0;

    this.classicTimer--;

if (

    this.classicTimer === 30 &&

    !this.classicTriggered

) {

    this.classicTriggered = true;

    if (this.classicType === "ghost") {

    window.spawnClassicGhost(this);

        console.log(
            "FANTASMA INVOCADO"
        );

    } 
    else if (this.classicType === "ship") {

        window.spawnClassicShip(this);

        console.log(
            "NAVE INVOCADA"
        );
    }

       else if (this.classicType === "pacman") {
        window.spawnClassicPacMan(this);
        console.log("PAC-MAN INVOCADO");
    }
}

    if (this.classicTimer <= 0) {

        this.classicPhase = 4;
    }

    return;
}

        return;
    }


if (this.classicPhase === 4) {

  

const classicEntity =
    this.classicType === "ghost"
        ? this.classicGhost
        : this.classicType === "ship"
            ? this.classicShip
            : this.classicPacMan;

// Aguarda a entidade ser criada pelo setTimeout
if (!classicEntity) {
    return;
}

if (classicEntity.isDead) {

    // Verifica se é o último ataque da sequência
    const isLastAttack =
        this.classicUsedSequence ||
        this.classicType === "pacman";

  console.log(
    "CLASSIC ENTITY:",
    classicEntity,
    "TYPE:", this.classicType,
    "GHOST:", this.classicGhost,
    "SHIP:", this.classicShip,
    "PACMAN:", this.classicPacMan
);

        if (this.classicAttackSuccess) {

            console.log(
                "FANTASMA VENCEU"
            );
        }

if (this.classicPlayerEscaped) {

    this.classicPlayerEscaped = false;

    this.pendingControlTimer = 60;

    showCombatQuote(
        "Então vamos mudar as regras...",
        this.x + this.width / 2,
        this.y,
        this
    );
}

       this.classicPhase = 0;

        this.isClassicAttack = false;

        this.classicGhost = null;

        this.classicShip = null;

        this.classicPacMan = null;

// Só aplica cooldown longo e vulnerabilidade após completar a sequência
if (isLastAttack) {

            this.classicCooldown = 2400;

            this.exposedTimer = 360;

            this.isStunned = true;

            this.stunTimer = 360;

            // Pequeno delay para a frase sair após ficar vulnerável
            setTimeout(() => {

                if (Game.phase && Game.phase.boss) {

                    showCombatQuote(
                        "Tem alguma coisa errada aqui...",
                        Game.phase.boss.x + Game.phase.boss.width / 2,
                        Game.phase.boss.y,
                        Game.phase.boss
                    );
                }

            }, 500);

        } else {

            this.classicCooldown = 600;
        }
    }

    return;
}


}

if (this.pendingControlAttack) {

    this.pendingControlTimer--;

    if (this.pendingControlTimer <= 0) {

        this.pendingControlAttack = false;

        this.startControlInversion();
    }

    return;
}

if (this.isControlInversion) {

    this.controlInversionTimer--;

    if (this.controlInversionTimer <= 0) {

        this.isControlInversion = false;

        this.exposedTimer = 180;

        this.isStunned = true;

        this.stunTimer = 180;


      player.controlsInverted = false;

        showCombatQuote(

            "Por que não funcionou?",

            this.x + this.width / 2,

            this.y,
            this

        );
    }

    return;
}


    if (this.hurtTimer > 0) {




      this.hurtTimer--;
    }




    else {




      this.isHurt = false;
    }




    if (
      this.invulnerabilityTimer > 0
    ) {




      this.invulnerabilityTimer--;
    }




    if (
      this.easyAttackInvulnerability > 0
    ) {




      this.easyAttackInvulnerability--;
    }




    if (this.armorBrokenTimer > 0) {




      this.armorBrokenTimer--;




      if (this.armorBrokenTimer <= 0) {




        this.turnCooldown = 20;
      }
    }




    if (this.exposedTimer > 0) {
    this.exposedTimer--;
    }




    if (this.stunTimer > 0) {




      this.stunTimer--;
    }




    else {




      this.isStunned = false;
    }




    if (
      this.directionLocked &&
      this.turnTimer <= 0
    ) {




      this.directionLocked = false;
    }
  }




  // ===================================================
  // KNOCKDOWN
  // ===================================================
  /*knockDown() {




    this.isKnockedDown = true;












    this.isAttacking = false;




    this.attackTimer = 0;




    this.attackCooldown = 28;




    this.knockdownTimer =
      this.isTank
        ? Math.floor(
            44 * this.wakeupSpeed
          )
        : 44;




    this.velocityX *= 0.4;




    this.velocityY = 0;




    this.canRecover = false;
  }
    */




  // ===================================================
  // HITBOX
  // ===================================================
 getAttackHitbox() {
  const def = this.attackHitboxDef;

  if (this.isKicking) {
    return {
      x: this.facingRight
        ? this.x + this.width - 4
        : this.x - 54,
      y: this.y + (def ? def.kick.oy : 28),
      width:  def ? def.kick.w : 54,
      height: def ? def.kick.h : 26
    };
  }

  if (!this.isAttacking) return null;

  return {
    x: this.facingRight
      ? this.x + this.width - 8
      : this.x - 42,
    y: this.y + (def ? def.punch.oy : 20),
    width:  def ? def.punch.w : 42,
    height: def ? def.punch.h : 34
  };
}




  // ===================================================
  // ACERTO PLAYER
  // ===================================================
  isHittingPlayer(player) {




    if (
      this.attackAlreadyHit
    ) {
      return false;
    }




    const hitbox =
      this.getAttackHitbox();




    if (!hitbox) {
      return false;
    }




    if (
      checkCollision(
        hitbox,
        player
      )
    ) {




      this.attackAlreadyHit = true;




      player.takeDamage(
        this.currentDamage
      );




      player.velocityX =
        this.facingRight
          ? this.knockbackForce
          : -this.knockbackForce;




      player.velocityY = -1.1;




      if (player.applyHitstop) {




        player.applyHitstop(1);
      }




      this.applyHitstop(1);




      return true;
    }




    return false;
  }




  // ===================================================
  // TOMAR DANO
  // ===================================================
  takeDamage(amount) {




    if (
      this.easyAttackInvulnerability > 0
    ) {




      return;
    }




        if (
      this.invulnerabilityTimer > 0
    ) {




      console.log(
        "GOLPE IGNORADO - IFRAME:",
        this.invulnerabilityTimer
      );




      return;
    }




    console.log(
    "PEDRO RECEBEU:",
    amount
  );
    if (
      this.invulnerabilityTimer > 0
    ) {
      return;
    }








    if (
      this.key === "pedro" &&
      this.armorBrokenTimer <= 0
    ) {




      console.log("ARMADURA ATIVA");




      amount *= (1 - this.armorLevel);

      amount = Math.round(amount);
    }




    if (this.exposedTimer > 0) {




    amount *= 1.25;

    amount = Math.round(amount);
    }



if (this.exposedTimer > 0) {

    amount *= 1.75;
    this.damageReduction = 1;
}


    this.hp -= amount;


    if (this.isRequirementBoss) {

        this.meetingPressure++;
    }

    this.isHurt = true;




    this.hurtTimer =
      this.isTank
        ? 5
        : 6;




    this.invulnerabilityTimer = 1;




    const heavyHit =
      amount >= 12;




    // ===================================
    // HIT LEVE
    // ===================================
    if (!heavyHit) {




      this.velocityX =
        this.facingRight
          ? -0.42 *
            this.knockbackResistance
          : 0.42 *
            this.knockbackResistance;
    }




    // ===================================
    // HIT PESADO
    // ===================================
else {




if (
  !this.isTank ||
  this.armorBrokenTimer > 0
) {




  this.isAttacking = false;
  this.isKicking = false;
  this.attackTimer = 0;
}




  this.comboLoopCount = 0;




  this.velocityX =
    this.facingRight
      ? -2.2 *
        this.knockbackResistance
      : 2.2 *
        this.knockbackResistance;
}




    if (this.hp <= 0) {




      this.hp = 0;




      this.isDead = true;




      this.isDefeated = true;
    }
  }




    // ===================================================
    // FRAQUEZA: CHUTE AÉREO
    // ===================================================
  onAirKickHit() {




    // Apenas Pedro possui essa fraqueza
    if (this.key !== "pedro") {
      return;
    }




    console.log(
      "PEDRO PERDEU A CONCENTRACAO"
    );




    if (!this.isTank) {




      this.isAttacking = false;




      this.isKicking = false;




      this.attackTimer = 0;
    }




    // abertura para combo terrestre
    this.isStunned = true;
    this.stunTimer = 30;




    // demora um pouco para voltar a atacar
    this.attackCooldown += 30;




    this.armorBrokenTimer = 360;




    this.exposedTimer = 120;




    this.turnCooldown = 35;




        console.log(
      "ARMADURA QUEBRADA"
    );
  }




   onComboPressure() {




    if (this.key !== "fase2") {
      return;
    }




    console.log(
      "ROMES PERDEU O RITMO"
    );




    this.attackCooldown += 12;




    this.isStunned = true;
    this.stunTimer = 8;




    this.adaptationTimer = 60;




    this.rushRecovery = true;
  }
  // ===================================================
  // HITSTOP
  // ===================================================
  applyHitstop(frames = 2) {




    this.hitstop = frames;
  }




  // ===================================================
  // UTIL
  // ===================================================
  isBusy() {




    if (this.isStunned) {
      return true;
    }




    if (
      this.isHurt &&
      this.hurtTimer > 2
    ) {




      return true;
    }




      return (
      this.isAttacking ||
      this.isKicking
      );
  }




  // ===================================================
  // LIMITES
  // ===================================================
  limitPosition() {




    if (this.x < 0) {




      this.x = 0;
    }




    const maxX =
      this.canvasWidth -
      this.width;




    if (this.x > maxX) {




      this.x = maxX;
    }
  }




  // ===================================================
  // RESET
  // ===================================================
  reset(x, y) {




    this.x = x;




    this.y = this.groundY;




    this.velocityX = 0;




    this.velocityY = 0;




    this.hp = this.maxHp;




    this.isDead = false;




    this.isDefeated = false;




    this.isHurt = false;




    this.isMoving = false;




    this.isAttacking = false;




    /*this.isKnockedDown = false;*/




    this.attackCooldown = 0;




    this.turnTimer = 0;




    this.directionLocked = false;




    this.comboLoopCount = 0;




    this.aiReactionTimer = 0;
  }
}




// ===================================================
// EXPORT
// ===================================================
window.Boss = Boss;




console.log(
  '[boss] balance patch final carregado'
);


