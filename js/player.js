// ===================================================
// UNICEFIGHT - PLAYER CLEAN ARCHITECTURE
// FASE 5 READY
// ===================================================
// OBJETIVO:
// ✔ Player focado em gameplay
// ✔ Sem efeitos visuais internos
// ✔ Sem partículas internas
// ✔ Sem screen shake interno
// ✔ Preparado para sprite sheets
// ✔ Preparado para AnimationManager
// ✔ Preparado para AudioManager
// ✔ Preparado para EffectsManager
// ✔ Código muito mais modular
// ===================================================

class Player {

  constructor(x, y, gender = 'masculino') {

    // -----------------------------------
    // POSIÇÃO
    // -----------------------------------
    this.x = x;
    this.y = y;

    this.width = 48;
    this.height = 72;

    // -----------------------------------
    // MOVIMENTO
    // -----------------------------------
    this.velocityX = 0;
    this.velocityY = 0;

    this.speed = 2;

    this.jumpForce = -14;

    this.gravity = 0.5;

    this.onGround = false;

    // -----------------------------------
    // DIREÇÃO
    // -----------------------------------
    this.facingRight = true;

    // -----------------------------------
    // PERSONAGEM
    // -----------------------------------
    this.gender = gender;

    // -----------------------------------
    // VIDA
    // -----------------------------------
    this.maxHp = 100;

    this.hp = 100;

    // -----------------------------------
    // ESTADOS
    // -----------------------------------
    this.isDead = false;

    this.isHurt = false;

    this.isMoving = false;

    this.isJumping = false;

    this.isDefending = false;

    // -----------------------------------
    // ATAQUES
    // -----------------------------------
    this.isAttacking = false;

    this.isKicking = false;

    this.isAirKicking = false;

    // -----------------------------------
    // COMBATE
    // -----------------------------------
    this.attackDamage = 10;

    this.kickDamage = 20;

    this.airKickDamage = 10;

    this.attackAlreadyHit = false;

    // -----------------------------------
    // TIMERS
    // -----------------------------------
    this.attackTimer = 0;

    this.attackCooldown = 0;

    this.hurtTimer = 0;

    this.hurtDuration = 12;

    this.invulnerabilityDuration = 35;

    this.invulnerabilityTimer = 0;

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
        speed: 6,
        loop: true
      },

      jump: {
        frames: 2,
        speed: 10,
        loop: false
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

      airKick: {
        frames: 4,
        speed: 5,
        loop: false
      },

      defend: {
        frames: 1,
        speed: 1,
        loop: true
      },

      hurt: {
        frames: 2,
        speed: 8,
        loop: false
      },

      death: {
        frames: 5,
        speed: 10,
        loop: false
      }
    };

    // -----------------------------------
    // SCORE
    // -----------------------------------
    this.score = 0;
  }

  // ===================================================
  // UPDATE
  // ===================================================
  update(platforms, canvasWidth, canvasHeight) {

    if (this.isDead) {
      return;
    }

    this.handleInput();

    this.applyPhysics();

    this.handleTimers();

    this.updateAnimation();

    // Colisão com plataformas
    checkPlatformCollision(
      this,
      platforms
    );

    // Colisão com parede
    checkWallCollision(
      this,
      canvasWidth
    );

    // Chão
    if (
      this.y + this.height >=
      canvasHeight
    ) {

      this.y =
        canvasHeight - this.height;

      this.velocityY = 0;

      this.onGround = true;
    }
  }

  // ===================================================
  // INPUT
  // ===================================================
  handleInput() {

    // Hurt trava controle
    if (this.isHurt) {
      return;
    }

    this.isMoving = false;

    // -----------------------------------
    // MOVIMENTO
    // -----------------------------------
    if (keys.left) {

      this.velocityX = -this.speed;

      this.facingRight = false;

      this.isMoving = true;
    }

    else if (keys.right) {

      this.velocityX = this.speed;

      this.facingRight = true;

      this.isMoving = true;
    }

    else {

      this.velocityX *= 0.82;

      if (
        Math.abs(this.velocityX) < 0.1
      ) {

        this.velocityX = 0;
      }
    }

    // -----------------------------------
    // PULO
    // -----------------------------------
    if (
      keys.up &&
      this.onGround
    ) {

      this.velocityY = this.jumpForce;

      this.onGround = false;

      this.isJumping = true;

      // FUTURO:
      // AudioManager.play('jump');
    }

    if (this.onGround) {

      this.isJumping = false;
    }

    // -----------------------------------
    // DEFESA
    // -----------------------------------
    this.isDefending = keys.defend;

    // -----------------------------------
    // ATAQUES
    // -----------------------------------
    if (this.attackCooldown <= 0) {

      // SOCO
      if (
        keys.attack &&
        this.onGround
      ) {

        this.startPunch();
      }

      // CHUTE
      else if (
        keys.kick &&
        this.onGround
      ) {

        this.startKick();
      }
    }
  }

  // ===================================================
  // SOCO
  // ===================================================
  startPunch() {

    if (
      this.isAttacking ||
      this.isKicking ||
      this.isAirKicking
    ) {
      return;
    }

    this.isAttacking = true;

    this.attackAlreadyHit = false;

    this.attackTimer = 18;

    this.attackCooldown = 42;

    // FUTURO
    // AudioManager.play('punch');
  }

  // ===================================================
  // CHUTE
  // ===================================================
  startKick() {

    if (
      this.isAttacking ||
      this.isKicking ||
      this.isAirKicking
    ) {
      return;
    }

    this.isKicking = true;

    this.attackAlreadyHit = false;

    this.attackTimer = 20;

    this.attackCooldown = 55;

    // FUTURO
    // AudioManager.play('kick');
  }

  // ===================================================
  // CHUTE AÉREO
  // ===================================================
  startAirKick() {

    if (
      this.isAttacking ||
      this.isKicking ||
      this.isAirKicking
    ) {
      return;
    }

    this.isAirKicking = true;

    this.attackAlreadyHit = false;

    this.attackTimer = 22;

    this.attackCooldown = 40;

    this.velocityY = 2;

    // FUTURO
    // AudioManager.play('airKick');
  }

  // ===================================================
  // FÍSICA
  // ===================================================
  applyPhysics() {

    this.velocityY += this.gravity;

    // Limites horizontais
    if (this.velocityX > 5) {
      this.velocityX = 5;
    }

    if (this.velocityX < -5) {
      this.velocityX = -5;
    }

    this.x += this.velocityX;

    this.y += this.velocityY;
  }

  // ===================================================
  // TIMERS
  // ===================================================
  handleTimers() {

    // Ataques
    if (this.attackTimer > 0) {

      this.attackTimer--;
    }

    else {

      this.isAttacking = false;

      this.isKicking = false;

      this.isAirKicking = false;

      this.attackAlreadyHit = false;
    }

    // Hurt
    if (this.hurtTimer > 0) {

      this.hurtTimer--;
    }

    else {

      this.isHurt = false;
    }

    // Invulnerabilidade
    if (
      this.invulnerabilityTimer > 0
    ) {

      this.invulnerabilityTimer--;
    }

    // Cooldown
    if (this.attackCooldown > 0) {

      this.attackCooldown--;
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

    else if (this.isDefending) {

      this.setAnimation('defend');
    }

    else if (!this.onGround) {

      this.setAnimation('jump');
    }

    else if (this.isMoving) {

      this.setAnimation('walk');
    }

    else {

      this.setAnimation('idle');
    }

    // Atualiza frames
    const anim =
      this.animations[this.currentAnimation];

    this.animationTimer++;

    if (
      this.animationTimer >= anim.speed
    ) {

      this.animationTimer = 0;

      this.currentFrame++;

      // Loop
      if (
        this.currentFrame >= anim.frames
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

    // Defesa reduz dano
    if (this.isDefending) {

      amount *= 0.5;
    }

    // Invulnerável
    if (
      this.invulnerabilityTimer > 0
    ) {
      return;
    }

    this.hp -= amount;

    this.isHurt = true;

    this.hurtTimer =
      this.hurtDuration;

    this.invulnerabilityTimer =
      this.invulnerabilityDuration;

    // Knockback
    this.velocityX =
      this.facingRight
        ? -3.5
        : 3.5;

    this.velocityY = -1.5;

    // FUTURO:
    // EffectsManager.spawnHit(...)
    // EffectsManager.shakeScreen(...)
    // AudioManager.play('hurt')

    if (this.hp <= 0) {

      this.hp = 0;

      this.isDead = true;
    }
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
      let bodyHeight = this.height - 20;

      let headY = this.y;

      let armOffset = 0;
      let legOffset = 0;

      // ===================================================
      // ANIMAÇÕES SIMPLES
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
        // JUMP
        // -----------------------------------
        case 'jump':

          bodyHeight -= 8;

          offsetY = -4;

          break;

        // -----------------------------------
        // PUNCH
        // -----------------------------------
        case 'punch':

          armOffset = 14;

          bodyWidth += 4;

          break;

        // -----------------------------------
        // KICK
        // -----------------------------------
        case 'kick':

          legOffset = 18;

          bodyWidth += 6;

          break;

        // -----------------------------------
        // AIR KICK
        // -----------------------------------
        case 'airKick':

          // Inclina corpo levemente
          offsetY = -4;

          bodyWidth += 10;

          bodyHeight -= 6;

          // Estica muito a perna
          legOffset = 28;

          // Avança o corpo
          offsetX += this.facingRight ? 6 : -6;

          break;

        // -----------------------------------
        // DEFEND
        // -----------------------------------
        case 'defend':

          bodyWidth -= 6;

          offsetX += 4;

          break;

        // -----------------------------------
        // HURT
        // -----------------------------------
        case 'hurt':

          offsetX =
            Math.sin(this.animationTimer * 2) * 3;

          break;

        // -----------------------------------
        // DEATH
        // -----------------------------------
        case 'death':

          bodyHeight = 20;

          offsetY = 42;

          break;
      }

      // ===================================================
      // CORES
      // ===================================================

      let bodyColor =
        this.gender === 'masculino'
          ? '#3A6BAC'
          : '#AC3A6B';

      if (this.isDefending) {
        bodyColor = '#5AA';
      }

      if (
        this.isAttacking ||
        this.isKicking ||
        this.isAirKicking
      ) {
        bodyColor = '#F80';
      }

      if (this.isHurt) {
        bodyColor = '#F44';
      }

      // ===================================================
      // CORPO
      // ===================================================

      ctx.fillStyle = bodyColor;

      ctx.fillRect(
        this.x + offsetX,
        this.y + 20 + offsetY,
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
        22
      );

      // ===================================================
      // CABELO
      // ===================================================

      ctx.fillStyle = '#222';

      ctx.fillRect(
        this.x + 8 + offsetX,
        headY + offsetY,
        this.width - 16,
        10
      );

      // ===================================================
      // BRAÇOS
      // ===================================================

      ctx.fillStyle = '#F5C5A0';

      // Braço esquerdo
      ctx.fillRect(
        this.x - 6 + offsetX,
        this.y + 28 + offsetY,
        8,
        20
      );

      // Braço direito
      ctx.fillRect(
        this.x + this.width - 2 + armOffset + offsetX,
        this.y + 28 + offsetY,
        8,
        20
      );

      // ===================================================
      // PERNAS
      // ===================================================

      ctx.fillStyle = '#111';

      // Perna esquerda
      ctx.fillRect(
        this.x + 10 + offsetX,
        this.y + this.height - 4 + offsetY,
        10,
        18
      );

      // Perna direita
      ctx.fillRect(
        this.x + 28 + legOffset + offsetX,
        this.y + this.height - 4 + offsetY,
        10,
        18
      );

      ctx.restore();
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

    this.isDead = false;

    this.isHurt = false;

    this.isMoving = false;

    this.isJumping = false;

    this.isDefending = false;

    this.isAttacking = false;

    this.isKicking = false;

    this.isAirKicking = false;

    this.attackAlreadyHit = false;

    this.attackTimer = 0;

    this.attackCooldown = 0;

    this.hurtTimer = 0;

    this.invulnerabilityTimer = 0;

    // Reset animação
    this.currentAnimation = 'idle';

    this.currentFrame = 0;

    this.animationTimer = 0;
  }
}