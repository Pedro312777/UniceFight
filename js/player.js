// ===================================================
// UNICEFIGHT - PLAYER COMBAT REBALANCE
// PLAYER MAIS FORTE CONTRA BOSS
// pacing continua arcade/lento
// ===================================================
// ALTERAÇÕES:
// ✔ player causa mais dano no boss
// ✔ combos recompensam mais
// ✔ especial continua forte sem quebrar jogo
// ✔ neutral continua equilibrado
// ✔ boss continua tank
// ✔ pacing lento preservado
// ✔ recovery continua justa
// ✔ combate menos frustrante
// ===================================================


class Player {


constructor(x, y, gender = 'masculino') {


this.x = x;
this.y = y;


// ========================================
// CORPO FÍSICO (colisão real)
// ========================================


this.width = 54;
this.height = 80;


// ========================================
// VISUAL DO SPRITE
// ========================================


this.spriteScale = 1.0;


this.spriteOffsetX = 0;


this.spriteOffsetY = 0;


// ===================================================
// MOVIMENTO
// ===================================================
this.velocityX = 0;
this.velocityY = 0;


this.speed = 3.15;
this.maxSpeed = 6.0;


this.jumpForce = -12;
this.gravity = 0.60;


this.onGround = false;


// ===================================================
// DIREÇÃO
// ===================================================
this.facingRight = true;


// ===================================================
// PERSONAGEM
// ===================================================
this.gender = gender;


// ===================================================
// VIDA
// ===================================================
this.maxHp = 185;
this.hp = 185;


// ===================================================
// ENERGIA
// ===================================================
this.specialMeter = 0;
this.energy = 0;


this.maxSpecialMeter = 100;
this.maxEnergy = 100;


// ===============================================
// LEVEMENTE MAIS RÁPIDO
// ===============================================
this.energyRegenRate = 0.024;


// ===============================================
// MAIS RECOMPENSA POR ACERTAR
// ===============================================
this.hitEnergyGain = 4;


// ===============================================
// MAIS METER AO TOMAR HIT
// ===============================================
this.damageEnergyGain = 5;


// ===================================================
// ESTADOS
// ===================================================
this.isDead = false;
this.isHurt = false;


this.isMoving = false;
this.isJumping = false;
this.isDefending = false;


this.isDashing = false;


this.isAttacking = false;
this.isKicking = false;
this.isAirKicking = false;


this.isSpecialAttacking = false;


this.isLaughing = false;


this.laughTimer = 0;


this.speedMultiplier = 1;


this.defenseMultiplier = 1;


// ===================================================
// COMBO
// ===================================================
this.comboStep = 0;


this.comboTimer = 0;


this.isComboFinisher = true;


this.finisherReady = false;


this.finisherWindow = 60;


this.comboDisplayTimer = 0;


this.comboHitsConnected = 0;


this.comboArmor = false;


this.comboComplete = false;


// ===============================================
// COMBO WINDOW LEVEMENTE MAIOR
// ===============================================


this.comboQueued = false;


this.comboLocked = false;
this.comboLockTimer = 0;


// ===================================================
// COMBATE
// ===================================================
this.attackDamage = 0;


// ===============================================
// MAIS DANO
// ===============================================
this.kickDamage = 8;
this.airKickDamage = 10;


this.attackAlreadyHit = false;


// ===================================================
// KNOCKBACK
// ===================================================
this.knockbackForce = 3.7;


// ===================================================
// HITSTOP
// ===================================================
this.hitstop = 0;


// ===================================================
// TIMERS
// ===================================================
this.attackTimer = 0;
this.attackCooldown = 0;


this.hurtTimer = 0;


this.hurtDuration = 14;


this.invulnerabilityDuration = 12;


this.invulnerabilityTimer = 0;

this.perfectDodgeProtectionDuration = 180;


this.easyAttackProtection = 0;


this.dashTimer = 0;


this.easyAttackWindow = 0;


this.slowTimer = 0;
// ===================================================
// DASH
// ===================================================
this.dashDirection = 0;


this.dashSpeed = 7.1;


// ===================================================
// ESTADOS AVANÇADOS TIMERS
// ===================================================
/*this.knockdownTimer = 0;*/


// ===================================================
// BUFFER
// ===================================================
this.attackBuffer = 0;

this.controlsInverted = false;
this.controlHackTimer = 0;
// ===================================================
// ANIMAÇÃO
// ===================================================
this.currentAnimation = 'idle';


this.currentFrame = 0;
this.animationTimer = 0;


// ===================================================
// ===================================================
// SPRITE SYSTEM
// ===================================================


this.spriteSheet =
sprites.get(
"player"
);


this.animations =
AnimationData.playerMasculino;

this.spriteOffsetY = -60;

// ===================================
// ESCALA VISUAL
// ===================================
if (gender === "feminino") {

    this.animations =
    AnimationData.playerFeminino;

    this.spriteScale = 1.26;

} else {

    this.animations =
    AnimationData.playerMasculino;

    this.spriteScale = 1.30;

}



// ===================================================
// SCORE
// ===================================================
this.score = 0;


// ===================================================
// COLISÃO CORPORAL
// ===================================================
this.bodyPushForce = 0.45;


this.contactSlowdown = 0.82;


this.bodyPushResistance = 1;


// ===================================================
// COMBO COUNTER
// ===================================================
this.comboHits = 0;


console.log(
  "SPRITE PLAYER:",
  this.spriteSheet
);


}




// ===================================================
// UPDATE
// ===================================================
update(platforms, canvasWidth, canvasHeight) {


if (this.isDead) return;


if (this.hitstop > 0) {


this.hitstop--;
return;
}


if (this.slowTimer > 0) {


    this.slowTimer--;


}


this.handleInput();


this.applyPhysics();


this.handleTimers();




this.regenerateEnergy();


checkPlatformCollision(
this,
platforms
);


checkWallCollision(
this,
canvasWidth
);


const groundY =
canvasHeight - this.height;


if (this.y >= groundY) {


this.y = groundY;


this.velocityY = 0;


this.onGround = true;


//if (
//this.isLaunched
//) {


//this.knockDown();
//}
}
}


// ===================================================
// INPUT
// ===================================================
handleInput() {


if (
    this.isHurt &&
    this.comboStep === 0
){
    return;
}


this.isMoving = false;


let currentSpeed =
    this.speed *
    this.speedMultiplier;


if (this.slowTimer > 0) {


    currentSpeed *= 0.55;


}


if (this.isDashing) {


this.velocityX =
this.dashSpeed *
this.dashDirection;


return;
}


if (
!this.isAttacking &&
!this.isKicking &&
!this.isSpecialAttacking
) {


const leftPressed =

    this.controlsInverted

    ? keys.right

    : keys.left;

const rightPressed =

    this.controlsInverted

    ? keys.left

    : keys.right;

if (leftPressed) {

    this.velocityX =
    -currentSpeed;

    this.facingRight = false;

    this.isMoving = true;
}

else if (rightPressed) {

    this.velocityX =
    currentSpeed;

    this.facingRight = true;

    this.isMoving = true;
}


else {


this.velocityX *= 0.76;


if (
Math.abs(this.velocityX) < 0.08
) {


this.velocityX = 0;
}
}
}


if (
keys.up &&
this.onGround &&
!this.isAttacking
) {


this.velocityY =
this.jumpForce;


this.onGround = false;


this.isJumping = true;


// ESQUIVA DO ATAQUE DE DISTRAÇÃO
if (this.easyAttackWindow > 0) {


    this.easyAttackProtection =
        this.perfectDodgeProtectionDuration;


    this.easyAttackWindow = 0;


    console.log(
      "ESQUIVA PERFEITA"
    );
}
}


if (this.onGround) {


this.isJumping = false;
}


this.isDefending =
keys.defend &&
!this.isAttacking &&
!this.isKicking &&
!this.isAirKicking;




if (keys.defend) {


  console.log(
    "PLAYER UPDATE",
    "defending:",
    this.isDefending,
    "attacking:",
    this.isAttacking,
    "kicking:",
    this.isKicking,
    "airKick:",
    this.isAirKicking
  );
}


console.log(
    "DEFENDENDO:",
    this.isDefending
);


if (
keys.dash &&
!this.isDashing &&
!this.isAttacking &&
!this.isKicking &&
this.attackCooldown <= 0
) {


if (keys.left) {


this.startDash(-1);
}


if (keys.right) {


this.startDash(1);
}
}


if (
keys.special &&
this.specialMeter >= 100 &&
!this.isSpecialAttacking
) {


this.startSpecial();
}


if (
keys.attack ||
keys.kick
) {


this.attackBuffer = 5;
}


if (
this.attackBuffer > 0 &&
this.attackCooldown <= 0
) {


if (
keys.kick &&
!this.onGround
) {


this.startAirKick();


this.attackBuffer = 0;


return;
}


if (
keys.attack &&
this.onGround
) {
console.log("BOTAO ATAQUE DETECTADO");
this.startPunch();


this.attackBuffer = 0;


return;
}


if (
keys.kick &&
this.onGround
) {


this.startKick();


this.attackBuffer = 0;
}
}
}


// ===================================================
// COMBO
// ===================================================
startPunch() {


if (this.comboLocked) {
return;
}
console.log(
  "COMBO STEP:",
  this.comboStep,
  "TIMER:",
  this.comboTimer,
  "CD:",
  this.attackCooldown
);


if (
this.isAttacking &&
this.attackTimer > 2
) {


this.comboQueued = true;
return;
}


if (
this.isKicking ||
this.isSpecialAttacking
) {
return;
}

AudioManager.play('punch'); // <-- ADICIONADO AQUI


this.isAttacking = true;


this.attackAlreadyHit = false;


if (this.comboStep === 0) {


  this.comboStep = 1;
}
else if (this.comboStep === 1) {


  this.comboStep = 2;
}
else {


  return;
}


this.comboTimer = 50;


// ===================================================
// JAB
// ===================================================
if (this.comboStep === 1) {


// MAIS DANO
this.attackDamage = 4;


this.attackTimer = 8;


// RECOVERY MENOR
this.attackCooldown = 11;
}


// ===================================================
// STRAIGHT
// ===================================================
else if (this.comboStep === 2) {


  this.attackDamage = 6;


  this.attackTimer = 9;


  this.attackCooldown = 14;


  this.comboTimer =
  this.finisherWindow;


  this.velocityX =
    this.facingRight
      ? 2.0
      : -2.0;


this.comboArmor = true;
}


}


// ===================================================
// CHUTE
// ===================================================
startKick() {


// FINALIZADOR DO COMBO


  console.log(
        "KICK",
        "hits:", this.comboHitsConnected,
        "timer:", this.comboTimer,
        "step:", this.comboStep,
        "cooldown:", this.attackCooldown
    );


if (
    this.comboHitsConnected >= 2 &&
    this.comboTimer > 0
){

 AudioManager.play('kick'); // <-- ADICIONADO AQUI (finalizador)


  this.isAttacking = false;


  this.isKicking = true;


  this.attackAlreadyHit = false;


  this.attackDamage = 10;


  this.attackTimer = 16;


  this.attackCooldown = 24;


  this.isComboFinisher = true;


  this.finisherReady = true;


  this.velocityX =
    this.facingRight
      ? 1.8
      : -1.8;


  this.comboLocked = true;


  this.comboLockTimer = 20;


  // RESETA O COMBO


  console.log(
        "COMBO RESETADO",
        "comboHitsConnected:",
        this.comboHitsConnected
    );


  return;
}


if (
this.isAttacking ||
this.isKicking ||
this.isSpecialAttacking
) {
return;
}


this.isKicking = true;


this.attackAlreadyHit = false;


this.attackDamage =
this.kickDamage;


this.attackTimer = 18;


// LEVEMENTE MENOR
this.attackCooldown = 24;


this.velocityX =
this.facingRight
? 1.3
: -1.3;
}


// ===================================================
// AIR KICK
// ===================================================
startAirKick() {


if (
this.isAirKicking ||
this.onGround
) {
return;
}


this.isAirKicking = true;
this.isKicking = true;      


this.attackAlreadyHit = false;


this.attackDamage =
this.airKickDamage;


this.attackTimer = 16;


this.attackCooldown = 20;


this.velocityY = 0.1;


this.velocityX =
this.facingRight
? 1.8
: -1.8;
}


// ===================================================
// DASH
// ===================================================
startDash(direction) {


this.isDashing = true;


this.dashDirection =
direction;


this.dashTimer = 7;


this.velocityX =
this.dashSpeed *
direction;
}


// ===================================================
// ESPECIAL
// ===================================================
startSpecial() {


this.isSpecialAttacking = true;


this.attackAlreadyHit = false;


this.specialMeter = 0;


// ===============================================
// MAIS FORTE NOVAMENTE
// ===============================================
this.attackDamage = 16;


this.attackTimer = 42;


// ===============================================
// AINDA TEM RECOVERY GRANDE
// ===============================================
this.attackCooldown = 72;


this.velocityX =
this.facingRight
? 2
: -2;
}


applyJokeDebuff() {


  this.isLaughing = true;


  this.laughTimer = 240;


  this.speedMultiplier = 0.30;


  this.defenseMultiplier = 0.80;


  console.log(
    "PLAYER COMECOU A RIR"
  );
}


// ===================================================
// FÍSICA
// ===================================================
applyPhysics() {


this.velocityY += this.gravity;


if (
this.velocityX > this.maxSpeed &&
!this.isDashing
) {


this.velocityX =
this.maxSpeed;
}


if (
this.velocityX < -this.maxSpeed &&
!this.isDashing
) {


this.velocityX =
-this.maxSpeed;
}


this.x += this.velocityX;


if (this.isLaughing) {


  this.x +=
    Math.sin(
      Date.now() * 0.03
    ) * 0.6;
}


this.y += this.velocityY;
}


// ===================================================
// TIMERS
// ===================================================
handleTimers() {


if (this.attackTimer > 0) {


this.attackTimer--;


if (
this.comboQueued &&
this.attackTimer <= 2 &&
this.comboStep < 3
) {


this.comboQueued = false;


this.isAttacking = false;


this.startPunch();
}
}


else {


this.isAttacking = false;


this.isKicking = false;


this.isAirKicking = false;


this.isSpecialAttacking = false;


this.attackAlreadyHit = false;


this.comboArmor = false;


if (this.isComboFinisher) {


    this.comboStep = 0;
    this.comboHitsConnected = 0;
    this.finisherReady = false;
}


this.isComboFinisher = false;


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
this.easyAttackProtection > 0
) {


this.easyAttackProtection--;
}


if (this.easyAttackWindow > 0) {


    this.easyAttackWindow--;
}


if (
this.attackCooldown > 0
) {


this.attackCooldown--;
}


if (this.comboTimer > 0) {


this.comboTimer--;


}


else {


this.comboStep = 0;
this.comboHitsConnected = 0;
}


if (this.comboDisplayTimer > 0) {


    this.comboDisplayTimer--;


} else {


     this.comboComplete = false;
}


if (this.comboLockTimer > 0) {


this.comboLockTimer--;
}


else {


this.comboLocked = false;
}


if (this.dashTimer > 0) {


this.dashTimer--;
}


else {


this.isDashing = false;
}




if (this.attackBuffer > 0) {


this.attackBuffer--;
}


if (this.laughTimer > 0) {


  this.laughTimer--;


} else if (this.isLaughing) {


  this.isLaughing = false;


  this.speedMultiplier = 1;


  this.defenseMultiplier = 1;


  console.log(
    "PAROU DE RIR"
  );
}
}


// ===================================================
// ENERGIA
// ===================================================
regenerateEnergy() {


if (
this.specialMeter <
this.maxSpecialMeter
) {


this.specialMeter +=
this.energyRegenRate;


if (
this.specialMeter >
this.maxSpecialMeter
) {


this.specialMeter =
this.maxSpecialMeter;
}
}


this.energy =
this.specialMeter;


this.maxEnergy =
this.maxSpecialMeter;
}


// ===================================================
// DAMAGE
// ===================================================
takeDamage(amount, ignoreDefense = false) {

  console.log(
    "DANO RECEBIDO",
    "protection:",
    this.easyAttackProtection
);


if (
    this.easyAttackProtection > 0
){
    console.log(
        "DANO BLOQUEADO PELA ESQUIVA PERFEITA"
    );
    return;
}

if (
    this.invulnerabilityTimer > 0
){
    return;
}


console.log(
    "LEVOU DANO",
    "comboStep:", this.comboStep,
    "comboHitsConnected:", this.comboHitsConnected
);


if (
    this.comboArmor
) {


    this.hp -= amount;


    this.specialMeter +=
      this.damageEnergyGain;


    if (
        this.specialMeter >
        this.maxSpecialMeter
    ) {


        this.specialMeter =
        this.maxSpecialMeter;
    }


    return;
}




if (
    this.isDefending &&
    !ignoreDefense
) {

    amount *=
    0.38 /
    this.defenseMultiplier;

    amount = Math.round(amount);
}


this.hp -= amount;


//this.comboHits = 0;


this.isHurt = true;


this.hurtTimer =
this.hurtDuration;


this.invulnerabilityTimer =
this.invulnerabilityDuration;


//this.comboQueued = false;


//this.comboLocked = false;


const knockbackX =
  this.facingRight
    ? -this.knockbackForce
    : this.knockbackForce;


this.velocityX = knockbackX;


if (amount >= 10) {


  this.velocityX *= 1.5;
}


this.specialMeter +=
this.damageEnergyGain;


if (
this.specialMeter >
this.maxSpecialMeter
) {


this.specialMeter =
this.maxSpecialMeter;
}


if (this.hp <= 0) {


this.hp = 0;


this.isDead = true;
}
}


// ===================================================
// HITSTOP
// ===================================================
applyHitstop(frames = 2) {


this.hitstop = frames;
}


// ===================================================
// CURA
// ===================================================
heal(amount) {


this.hp = Math.min(
this.hp + amount,
this.maxHp
);
}


// ===================================================
// RESET
// ===================================================
reset(x, y) {


this.x = x;
this.y = y;


this.velocityX = 0;
this.velocityY = 0;


this.hp = this.maxHp;


this.specialMeter = 0;


this.comboStep = 0;
this.comboTimer = 0;


this.comboHits = 0;


this.isDead = false;
this.isHurt = false;


this.isMoving = false;
this.isJumping = false;


this.isDefending = false;


this.isAttacking = false;
this.isKicking = false;
this.isAirKicking = false;


this.isSpecialAttacking = false;


this.isDashing = false;


this.attackAlreadyHit = false;


this.attackTimer = 0;
this.attackCooldown = 0;


this.hurtTimer = 0;


this.invulnerabilityTimer = 0;


this.hitstop = 0;


this.comboLocked = false;
this.comboLockTimer = 0;


this.canRecover = false;


}
}

