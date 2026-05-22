// ===================================================
// UNICEFIGHT - BOSS CLEAN ARCHITECTURE
// FASE 5 READY
// ===================================================
// OBJETIVO:
// ✔ Boss focado em gameplay
// ✔ Sem efeitos internos
// ✔ Sem partículas internas
// ✔ Sem tremor interno
// ✔ Preparado para AnimationManager
// ✔ Preparado para AudioManager
// ✔ Preparado para EffectsManager
// ✔ Preparado para sprite sheets
// ✔ IA separada da renderização
// ===================================================

const BOSS_DATA = {

  pedro: {

    name: 'Prof. Pedro',

    subject: 'Lógica de Programação',

    style: 'militar',

    color: '#2E4A1E',

    hp: 100,

    speed: 1,

    introDialogue: [
      'SENTIDO, CALOURO!',
      'Você acha que programar é fácil?',
      'Vou te ensinar lógica na marra!'
    ],

    defeatDialogue: [
      'Impossível...',
      'Você passou.'
    ],

    spritePath: null
  }
};

// -----------------------------------------------
// RELAÇÃO FASE -> BOSS
// -----------------------------------------------
const PHASE_TO_BOSS = [
  'pedro'
];

// ===================================================
// CLASSE BOSS
// ===================================================
class Boss {

  constructor(
    phaseIndex,
    canvasWidth,
    canvasHeight
  ) {

    const bossKey =
      PHASE_TO_BOSS[phaseIndex];

    const data =
      BOSS_DATA[bossKey];

    // -----------------------------------
    // IDENTIDADE
    // -----------------------------------
    this.key = bossKey;

    this.name = data.name;

    this.subject = data.subject;

    this.style = data.style;

    this.color = data.color;

    this.introDialogue =
      data.introDialogue;

    this.defeatDialogue =
      data.defeatDialogue;

    // -----------------------------------
    // POSIÇÃO
    // -----------------------------------
    this.width = 60;

    this.height = 90;

    this.canvasWidth =
      canvasWidth;

    this.x =
      canvasWidth -
      this.width -
      80;

    this.y =
      canvasHeight -
      this.height -
      20;

    // -----------------------------------
    // VIDA
    // -----------------------------------
    this.maxHp = data.hp;

    this.hp = data.hp;

    // -----------------------------------
    // MOVIMENTO
    // -----------------------------------
    this.speed = data.speed;

    this.facingRight = false;
    this.targetFacingRight = false;
    this.turnTimer = 0;
    this.turnDelay = 18;

    // -----------------------------------
    // ESTADOS
    // -----------------------------------
    this.isActive = true;

    this.isDead = false;

    this.isDefeated = false;

    this.isHurt = false;

    this.isMoving = false;

    // -----------------------------------
    // ATAQUES
    // -----------------------------------
    this.isAttacking = false;

    this.isKicking = false;

    // -----------------------------------
    // TIMERS
    // -----------------------------------
    this.hurtTimer = 0;

    this.attackTimer = 0;

    this.attackCooldown = 0;

    this.invulnerabilityTimer = 0;

    // -----------------------------------
    // IA
    // -----------------------------------
    this.minDistance = 58;

    this.attackSequence = [
      'soco',
      'soco',
      'chute',
      'chute',
      'chute',
      'chute'
    ];

    this.attackIndex = 0;

    // -----------------------------------
    // DANO
    // -----------------------------------
    this.currentDamage = 0;

    // ===================================================
    // SISTEMA DE ANIMAÇÃO
    // ===================================================
    this.currentAnimation = 'idle';

    this.currentFrame = 0;

    this.animationTimer = 0;

    // -----------------------------------
    // ANIMAÇÕES
    // -----------------------------------
    this.animations = {

      idle: {
        frames: 4,
        speed: 12,
        loop: true
      },

      walk: {
        frames: 6,
        speed: 7,
        loop: true
      },

      punch: {
        frames: 3,
        speed: 5,
        loop: false
      },

      kick: {
        frames: 4,
        speed: 5,
        loop: false
      },

      hurt: {
        frames: 2,
        speed: 8,
        loop: false
      },

      death: {
        frames: 6,
        speed: 10,
        loop: false
      }
    };
  }

  // ===================================================
  // UPDATE
  // ===================================================
  update(player) {

    if (this.isDefeated) {
      return;
    }

    this.handleTimers();

    this.updateBehavior(player);

    this.updateAnimation();

    // -----------------------------------
    // DIREÇÃO COM DELAY
    // -----------------------------------
    this.targetFacingRight =
      player.x > this.x;

    // Conta tempo para virar
    if (
      this.targetFacingRight !==
      this.facingRight
    ) {

      this.turnTimer++;
    }

    else {

      this.turnTimer = 0;
    }

    // Só vira após delay
    if (
      this.turnTimer >=
      this.turnDelay
    ) {

      this.facingRight =
        this.targetFacingRight;

      this.turnTimer = 0;
    }
    // -----------------------------------
    // LIMITES DA TELA
    // -----------------------------------
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
  // TIMERS
  // ===================================================
  handleTimers() {

    // Hurt
    if (this.hurtTimer > 0) {

      this.hurtTimer--;
    }

    else {

      this.isHurt = false;
    }

    // Ataque
    if (this.attackTimer > 0) {

      this.attackTimer--;
    }

    else {

      this.isAttacking = false;

      this.isKicking = false;
    }

    // Cooldown
    if (this.attackCooldown > 0) {

      this.attackCooldown--;
    }

    // Invulnerabilidade
    if (
      this.invulnerabilityTimer > 0
    ) {

      this.invulnerabilityTimer--;
    }
  }

  // ===================================================
  // IA
  // ===================================================
  updateBehavior(player) {

    const dx =
      player.x - this.x;

    const dist =
      Math.abs(dx);

    this.isMoving = false;

    // -----------------------------------
    // APROXIMAÇÃO
    // -----------------------------------
    if (
      dist > 70 &&
      !this.isAttacking &&
      !this.isKicking
    ) {

      this.x +=
        dx > 0
          ? this.speed
          : -this.speed;

      this.isMoving = true;
    }

    // -----------------------------------
    // EVITA GRUDAR
    // -----------------------------------
    if (
      dist < this.minDistance
    ) {

      this.x +=
        dx > 0
          ? -0.8
          : 0.8;
    }

    // -----------------------------------
    // ATAQUE
    // -----------------------------------
    if (
      dist < 78 &&
      this.attackCooldown <= 0 &&
      !this.isHurt
    ) {

      const nextAttack =
        this.attackSequence[
          this.attackIndex
        ];

      this.startAttack(
        nextAttack
      );

      this.attackIndex++;

      if (
        this.attackIndex >=
        this.attackSequence.length
      ) {

        this.attackIndex = 0;
      }
    }
  }

  // ===================================================
  // ATAQUE
  // ===================================================
  startAttack(type) {

    // -----------------------------------
    // SOCO
    // -----------------------------------
    if (type === 'soco') {

      this.isAttacking = true;

      this.isKicking = false;

      this.currentDamage = 18;

      this.attackTimer = 12;

      this.attackCooldown = 48;

      // FUTURO:
      // AudioManager.play('bossPunch');
    }

    // -----------------------------------
    // CHUTE
    // -----------------------------------
    if (type === 'chute') {

      this.isKicking = true;

      this.isAttacking = false;

      this.currentDamage = 24;

      this.attackTimer = 20;

      this.attackCooldown = 80;

      // FUTURO:
      // AudioManager.play('bossKick');
    }
  }

  // ===================================================
  // ANIMAÇÃO
  // ===================================================
  updateAnimation() {

    // PRIORIDADE
    if (this.isDead) {

      this.setAnimation('death');
    }

    else if (this.isHurt) {

      this.setAnimation('hurt');
    }

    else if (this.isKicking) {

      this.setAnimation('kick');
    }

    else if (this.isAttacking) {

      this.setAnimation('punch');
    }

    else if (this.isMoving) {

      this.setAnimation('walk');
    }

    else {

      this.setAnimation('idle');
    }

    // Frames
    const anim =
      this.animations[
        this.currentAnimation
      ];

    this.animationTimer++;

    if (
      this.animationTimer >=
      anim.speed
    ) {

      this.animationTimer = 0;

      this.currentFrame++;

      // Loop
      if (
        this.currentFrame >=
        anim.frames
      ) {

        if (anim.loop) {

          this.currentFrame = 0;
        }

        else {

          this.currentFrame =
            anim.frames - 1;
        }
      }
    }
  }

  // ===================================================
  // TROCAR ANIMAÇÃO
  // ===================================================
  setAnimation(name) {

    if (
      this.currentAnimation === name
    ) {
      return;
    }

    this.currentAnimation = name;

    this.currentFrame = 0;

    this.animationTimer = 0;
  }

  // ===================================================
  // TOMAR DANO
  // ===================================================
  takeDamage(amount) {

    // Invulnerável
    if (
      this.invulnerabilityTimer > 0
    ) {
      return;
    }

    this.hp -= amount;

    this.isHurt = true;

    this.hurtTimer = 12;

    this.invulnerabilityTimer = 24;

    // FUTURO:
    // EffectsManager.spawnHit(...)
    // EffectsManager.shakeScreen(...)
    // AudioManager.play('bossHurt')

    if (this.hp <= 0) {

      this.hp = 0;

      this.isDead = true;

      this.isDefeated = true;

      // FUTURO:
      // AudioManager.play('bossDeath')
      // EffectsManager.spawnExplosion(...)
    }
  }

  // ===================================================
  // ACERTO NO PLAYER
  // ===================================================
  isHittingPlayer(player) {

    if (
      !this.isAttacking &&
      !this.isKicking
    ) {
      return false;
    }

    let hitboxWidth;

    let hitboxHeight;

    let hitboxY;

    let offset;

    // -----------------------------------
    // SOCO
    // -----------------------------------
    if (this.isAttacking) {

      hitboxWidth = 42;

      hitboxHeight = 34;

      offset = 10;

      hitboxY =
        this.y + 28;
    }

    // -----------------------------------
    // CHUTE
    // -----------------------------------
    if (this.isKicking) {

      hitboxWidth = 58;

      hitboxHeight = 24;

      offset = 14;

      hitboxY =
        this.y + 62;
    }

    // -----------------------------------
    // HITBOX
    // -----------------------------------
    const hitbox = {

      x: this.facingRight
        ? this.x +
          this.width -
          offset
        : this.x -
          hitboxWidth +
          offset,

      y: hitboxY,

      width: hitboxWidth,

      height: hitboxHeight
    };

    // -----------------------------------
    // DISTÂNCIA
    // -----------------------------------
    const centerA =
      this.x +
      this.width / 2;

    const centerB =
      player.x +
      player.width / 2;

    const distance =
      Math.abs(
        centerA - centerB
      );

    const maxDistance =
      this.isKicking
        ? 92
        : 72;

    if (
      distance > maxDistance
    ) {
      return false;
    }

    // -----------------------------------
    // COLISÃO
    // -----------------------------------
    if (
      checkCollision(
        hitbox,
        player
      )
    ) {

      player.takeDamage(
        this.currentDamage
      );

      return true;
    }

    return false;
  }

  // ===================================================
  // DRAW
  // ===================================================
  // ===================================================
  // DRAW
  // ===================================================
  draw(ctx) {

    // Invulnerabilidade piscando
    if (
      this.invulnerabilityTimer > 0 &&
      Math.floor(
        this.invulnerabilityTimer / 4
      ) % 2 === 0
    ) {
      return;
    }

    ctx.save();

    // Espelha sprite
    if (!this.facingRight) {

      ctx.scale(-1, 1);

      ctx.translate(
        -this.x * 2 - this.width,
        0
      );
    }

    // ===================================================
    // VARIÁVEIS DE ANIMAÇÃO
    // ===================================================

    let offsetX = 0;
    let offsetY = 0;

    let bodyWidth = this.width;
    let bodyHeight = this.height - 25;

    let headY = this.y;

    let armOffset = 0;
    let legOffset = 0;

    // ===================================================
    // ANIMAÇÕES
    // ===================================================

    switch (this.currentAnimation) {

      // -----------------------------------
      // IDLE
      // -----------------------------------
      case 'idle':

        offsetY =
          Math.sin(this.animationTimer * 0.15) * 1.5;

        break;

      // -----------------------------------
      // WALK
      // -----------------------------------
      case 'walk':

        legOffset =
          Math.sin(this.currentFrame) * 4;

        armOffset =
          Math.cos(this.currentFrame) * 4;

        break;

      // -----------------------------------
      // PUNCH
      // -----------------------------------
      case 'punch':

        armOffset = 16;

        bodyWidth += 4;

        break;

      // -----------------------------------
      // KICK
      // -----------------------------------
      case 'kick':

        legOffset = 22;

        bodyWidth += 8;

        break;

      // -----------------------------------
      // HURT
      // -----------------------------------
      case 'hurt':

        offsetX =
          Math.sin(this.animationTimer * 2) * 4;

        break;

      // -----------------------------------
      // DEATH
      // -----------------------------------
      case 'death':

        bodyHeight = 24;

        offsetY = 52;

        break;
    }

    // ===================================================
    // CORES
    // ===================================================

    let bodyColor = this.color;

    if (
      this.isAttacking ||
      this.isKicking
    ) {
      bodyColor = '#FF6600';
    }

    if (this.isHurt) {
      bodyColor = '#FF4444';
    }

    // ===================================================
    // CORPO
    // ===================================================

    ctx.fillStyle = bodyColor;

    ctx.fillRect(
      this.x + offsetX,
      this.y + 25 + offsetY,
      bodyWidth,
      bodyHeight
    );

    // ===================================================
    // CABEÇA
    // ===================================================

    ctx.fillStyle = '#F5C5A0';

    ctx.fillRect(
      this.x + 10 + offsetX,
      headY + offsetY,
      this.width - 20,
      28
    );

    // ===================================================
    // QUEPE
    // ===================================================

    ctx.fillStyle = '#1A3010';

    ctx.fillRect(
      this.x + 6 + offsetX,
      headY - 8 + offsetY,
      this.width - 12,
      12
    );

    // ===================================================
    // BRAÇOS
    // ===================================================

    ctx.fillStyle = '#F5C5A0';

    // Braço esquerdo
    ctx.fillRect(
      this.x - 6 + offsetX,
      this.y + 36 + offsetY,
      10,
      24
    );

    // Braço direito
    ctx.fillRect(
      this.x + this.width - 2 + armOffset + offsetX,
      this.y + 36 + offsetY,
      10,
      24
    );

    // ===================================================
    // PERNAS
    // ===================================================

    ctx.fillStyle = '#111';

    // Perna esquerda
    ctx.fillRect(
      this.x + 12 + offsetX,
      this.y + this.height - 6 + offsetY,
      12,
      20
    );

    // Perna direita
    ctx.fillRect(
      this.x + 32 + legOffset + offsetX,
      this.y + this.height - 6 + offsetY,
      12,
      20
    );

    ctx.restore();
  }

  // ===================================================
  // RESET
  // ===================================================
  reset(x, y) {

    this.x = x;

    this.y = y;

    this.hp = this.maxHp;

    this.isDead = false;

    this.isDefeated = false;

    this.isHurt = false;

    this.isMoving = false;

    this.isAttacking = false;

    this.isKicking = false;

    this.attackTimer = 0;

    this.attackCooldown = 0;

    this.hurtTimer = 0;

    this.invulnerabilityTimer = 0;

    this.attackIndex = 0;

    // Reset animação
    this.currentAnimation = 'idle';

    this.currentFrame = 0;

    this.animationTimer = 0;
  }
}