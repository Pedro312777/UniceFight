// ===================================================
// UNICEFIGHT - PLAYER MVP
// FASE 4 - COMBATE MELHORADO
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

    this.speed = 4;

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
    this.isAttacking = false;
    this.isKicking = false;

    this.isDefending = false;

    this.isJumping = false;

    this.isHurt = false;
    this.isDead = false;

    // NOVO
    this.isInvulnerable = false;

    // -----------------------------------
    // TIMERS
    // -----------------------------------
    this.attackTimer = 0;

    this.hurtTimer = 0;

    this.hurtDuration = 20;

    this.attackCooldown = 0;

    // NOVO
    this.invulnerableTimer = 0;
    this.invulnerableDuration = 40;

    // -----------------------------------
    // SCORE
    // -----------------------------------
    this.score = 0;
  }

  // ===================================================
  // UPDATE
  // ===================================================
  update(platforms, canvasWidth, canvasHeight) {

    if (this.isDead) return;

    this.handleInput();

    this.applyPhysics();

    this.handleTimers();

    // Colisão com plataformas
    checkPlatformCollision(this, platforms);

    // Parede
    checkWallCollision(this, canvasWidth);

    // Chão
    if (this.y + this.height >= canvasHeight) {

      this.y = canvasHeight - this.height;

      this.velocityY = 0;

      this.onGround = true;
    }
  }

  // ===================================================
  // INPUT
  // ===================================================
  handleInput() {

    // Enquanto toma dano perde controle temporário
    if (this.isHurt) return;

    // -----------------------------------
    // MOVIMENTO
    // -----------------------------------
    if (keys.left) {

      this.velocityX = -this.speed;

      this.facingRight = false;
    }
    else if (keys.right) {

      this.velocityX = this.speed;

      this.facingRight = true;
    }
    else {

      // FREIO SUAVE
      this.velocityX *= 0.8;

      if (Math.abs(this.velocityX) < 0.1) {
        this.velocityX = 0;
      }
    }

    // -----------------------------------
    // PULO
    // -----------------------------------
    if (keys.up && this.onGround) {

      this.velocityY = this.jumpForce;

      this.onGround = false;

      this.isJumping = true;
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
    if (
      this.attackCooldown <= 0 &&
      !this.isAttacking &&
      !this.isKicking
    ) {

      // SOCO
      if (keys.attack) {

        this.startPunch();
      }

      // CHUTE
      else if (keys.kick) {

        this.startKick();
      }
    }
  }

  // ===================================================
  // SOCO
  // ===================================================
  startPunch() {

    this.isAttacking = true;

    this.isKicking = false;

    // Duração curta
    this.attackTimer = 12;

    // Cooldown rápido
    this.attackCooldown = 30;
  }

  // ===================================================
  // CHUTE
  // ===================================================
  startKick() {

    this.isKicking = true;

    this.isAttacking = false;

    // Duração maior
    this.attackTimer = 18;

    // Cooldown maior
    this.attackCooldown = 60;
  }

  // ===================================================
  // FÍSICA
  // ===================================================
  applyPhysics() {

    // Gravidade
    this.velocityY += this.gravity;

    // Movimento
    this.x += this.velocityX;
    this.y += this.velocityY;

    // Resistência horizontal
    this.velocityX *= 0.92;

    if (Math.abs(this.velocityX) < 0.05) {
      this.velocityX = 0;
    }
  }

  // ===================================================
  // TIMERS
  // ===================================================
  handleTimers() {

    // -----------------------------------
    // ATAQUE
    // -----------------------------------
    if (this.attackTimer > 0) {

      this.attackTimer--;
    }
    else {

      this.isAttacking = false;

      this.isKicking = false;
    }

    // -----------------------------------
    // DANO
    // -----------------------------------
    if (this.hurtTimer > 0) {

      this.hurtTimer--;
    }
    else {

      this.isHurt = false;
    }

    // -----------------------------------
    // INVULNERABILIDADE
    // -----------------------------------
    if (this.invulnerableTimer > 0) {

      this.invulnerableTimer--;
    }
    else {

      this.isInvulnerable = false;
    }

    // -----------------------------------
    // COOLDOWN
    // -----------------------------------
    if (this.attackCooldown > 0) {

      this.attackCooldown--;
    }
  }

  // ===================================================
  // TOMAR DANO
  // ===================================================
  takeDamage(amount, attackerX = null) {

    // Invulnerabilidade
    if (this.isInvulnerable) return;

    // Defesa reduz dano
    if (this.isDefending) {

      amount *= 0.5;
    }

    this.hp -= amount;

    // Estado hurt
    this.isHurt = true;
    this.hurtTimer = this.hurtDuration;

    // Invulnerabilidade temporária
    this.isInvulnerable = true;
    this.invulnerableTimer = this.invulnerableDuration;

    // -----------------------------------
    // KNOCKBACK MELHORADO
    // -----------------------------------

    // Descobre direção do golpe
    if (attackerX !== null) {

      if (this.x < attackerX) {

        this.velocityX = -8;

      } else {

        this.velocityX = 8;
      }

    } else {

      // fallback
      this.velocityX = this.facingRight ? -8 : 8;
    }

    // Joga levemente para cima
    this.velocityY = -4;

    // -----------------------------------
    // MORTE
    // -----------------------------------
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

    if (this.isDead) return;

    // -----------------------------------
    // PISCAR INVULNERÁVEL
    // -----------------------------------
    if (
      this.isInvulnerable &&
      Math.floor(this.invulnerableTimer / 3) % 2 === 0
    ) {
      return;
    }

    ctx.save();

    // Espelha
    if (!this.facingRight) {

      ctx.scale(-1, 1);

      ctx.translate(
        -this.x * 2 - this.width,
        0
      );
    }

    // -----------------------------------
    // COR
    // -----------------------------------
    let bodyColor =
      this.gender === 'masculino'
      ? '#3A6BAC'
      : '#AC3A6B';

    // Defesa
    if (this.isDefending) {
      bodyColor = '#5AA';
    }

    // Ataque
    if (this.isAttacking || this.isKicking) {
      bodyColor = '#F80';
    }

    // Hurt
    if (this.isHurt) {
      bodyColor = '#FF4444';
    }

    // -----------------------------------
    // CORPO
    // -----------------------------------
    ctx.fillStyle = bodyColor;

    ctx.fillRect(
      this.x,
      this.y + 20,
      this.width,
      this.height - 20
    );

    // -----------------------------------
    // CABEÇA
    // -----------------------------------
    ctx.fillStyle = '#F5C5A0';

    ctx.fillRect(
      this.x + 10,
      this.y,
      this.width - 20,
      22
    );

    // -----------------------------------
    // CABELO
    // -----------------------------------
    ctx.fillStyle =
      this.gender === 'masculino'
      ? '#222'
      : '#4A2';

    ctx.fillRect(
      this.x + 8,
      this.y,
      this.width - 16,
      10
    );

    // -----------------------------------
    // SOCO
    // -----------------------------------
    if (this.isAttacking) {

      ctx.fillStyle = '#F5C5A0';

      ctx.fillRect(
        this.x + this.width,
        this.y + 30,
        20,
        10
      );
    }

    // -----------------------------------
    // CHUTE
    // -----------------------------------
    if (this.isKicking) {

      ctx.fillStyle = '#222';

      ctx.fillRect(
        this.x + this.width,
        this.y + this.height - 18,
        28,
        10
      );
    }

    // -----------------------------------
    // DEFESA
    // -----------------------------------
    if (this.isDefending) {

      ctx.fillStyle = 'rgba(0,150,255,0.3)';

      ctx.fillRect(
        this.x - 5,
        this.y,
        this.width + 10,
        this.height
      );
    }

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

    this.isAttacking = false;
    this.isKicking = false;

    this.isDefending = false;

    this.isHurt = false;

    this.isInvulnerable = false;

    this.invulnerableTimer = 0;
  }
}