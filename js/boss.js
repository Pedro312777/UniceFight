// ===================================================
// UNICEFIGHT - Sistema de Chefes (Boss)
// Arquivo: js/boss.js
// ===================================================

const BOSS_DATA = {

  pedro: {
    name: 'Prof. Pedro',
    subject: 'Lógica de Programação',
    style: 'militar',
    color: '#2E4A1E',

    // VIDA DO MVP
    hp: 100,

    speed: 2,

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

// SOMENTE PROFESSOR PEDRO
const PHASE_TO_BOSS = ['pedro'];

class Boss {

  constructor(phaseIndex, canvasWidth, canvasHeight) {

    const bossKey = PHASE_TO_BOSS[phaseIndex];
    const data = BOSS_DATA[bossKey];

    this.key = bossKey;
    this.name = data.name;
    this.subject = data.subject;
    this.style = data.style;
    this.color = data.color;

    this.introDialogue = data.introDialogue;
    this.defeatDialogue = data.defeatDialogue;

    // -----------------------------------
    // POSIÇÃO
    // -----------------------------------
    this.width = 60;
    this.height = 90;

    this.x = canvasWidth - this.width - 80;
    this.y = canvasHeight - this.height - 20;

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

    // -----------------------------------
    // ESTADOS
    // -----------------------------------
    this.isActive = true;

    this.isHurt = false;
    this.hurtTimer = 0;

    this.isAttacking = false;
    this.isKicking = false;

    this.attackTimer = 0;
    this.attackCooldown = 0;

    this.isDefeated = false;

    // NOVO:
    this.hasHitPlayer = false;

    // -----------------------------------
    // DANO
    // -----------------------------------
    this.currentDamage = 0;
  }

  // ===================================================
  // UPDATE
  // ===================================================
  update(player) {

    if (this.isDefeated) return;

    // -----------------------------------
    // HURT TIMER
    // -----------------------------------
    if (this.hurtTimer > 0) {

      this.hurtTimer--;

    } else {

      this.isHurt = false;
    }

    // -----------------------------------
    // ATTACK TIMER
    // -----------------------------------
    if (this.attackTimer > 0) {

      this.attackTimer--;

      // Verifica colisão do ataque
      this.isHittingPlayer(player);

    } else {

      this.isAttacking = false;
      this.isKicking = false;

      // Reseta acerto
      this.hasHitPlayer = false;
    }

    // -----------------------------------
    // COOLDOWN
    // -----------------------------------
    if (this.attackCooldown > 0) {

      this.attackCooldown--;
    }

    // -----------------------------------
    // IA SIMPLES
    // -----------------------------------
    this.updateBehavior(player);

    // -----------------------------------
    // OLHAR PLAYER
    // -----------------------------------
    this.facingRight = player.x > this.x;
  }

  // ===================================================
  // IA
  // ===================================================
  updateBehavior(player) {

    const dx = player.x - this.x;
    const dist = Math.abs(dx);

    // -----------------------------------
    // NÃO SE MOVE ENQUANTO ATACA
    // -----------------------------------
    if (this.isAttacking || this.isKicking) {
      return;
    }

    // -----------------------------------
    // PERSEGUE
    // -----------------------------------
    if (dist > 70) {

      this.x += dx > 0
        ? this.speed
        : -this.speed;
    }

    // -----------------------------------
    // ATAQUE
    // -----------------------------------
    if (dist < 80 && this.attackCooldown <= 0) {

      // 70% soco
      // 30% chute
      if (Math.random() < 0.7) {

        this.startAttack('soco');

      } else {

        this.startAttack('chute');
      }
    }
  }

  // ===================================================
  // INICIAR ATAQUE
  // ===================================================
  startAttack(type) {

    // Reseta hit do golpe
    this.hasHitPlayer = false;

    // -----------------------------------
    // SOCO
    // -----------------------------------
    if (type === 'soco') {

      this.isAttacking = true;
      this.isKicking = false;

      this.currentDamage = 10;

      this.attackTimer = 20;

      this.attackCooldown = 60;
    }

    // -----------------------------------
    // CHUTE
    // -----------------------------------
    if (type === 'chute') {

      this.isKicking = true;
      this.isAttacking = false;

      this.currentDamage = 20;

      this.attackTimer = 30;

      this.attackCooldown = 90;
    }
  }

  // ===================================================
  // TOMAR DANO
  // ===================================================
  takeDamage(amount) {

    // Invulnerabilidade curta
    if (this.isHurt || this.isDefeated) return;

    this.hp -= amount;

    this.isHurt = true;
    this.hurtTimer = 20;

    // Pequeno knockback
    this.x += this.facingRight ? -15 : 15;

    if (this.hp <= 0) {

      this.hp = 0;
      this.isDefeated = true;

      // Para ataques ao morrer
      this.isAttacking = false;
      this.isKicking = false;
    }
  }

  // ===================================================
  // VERIFICAR ACERTO
  // ===================================================
  isHittingPlayer(player) {

    // Já acertou nesse golpe
    if (this.hasHitPlayer) {
      return false;
    }

    if (!this.isAttacking && !this.isKicking) {
      return false;
    }

    let hitboxWidth;
    let hitboxHeight;
    let hitboxY;

    // -----------------------------------
    // SOCO
    // -----------------------------------
    if (this.isAttacking) {

      hitboxWidth = 60;
      hitboxHeight = 40;

      hitboxY = this.y + 20;
    }

    // -----------------------------------
    // CHUTE
    // -----------------------------------
    if (this.isKicking) {

      hitboxWidth = 70;
      hitboxHeight = 30;

      hitboxY = this.y + 55;
    }

    const hitbox = {

      x: this.facingRight
        ? this.x + this.width
        : this.x - hitboxWidth,

      y: hitboxY,

      width: hitboxWidth,
      height: hitboxHeight
    };

    // -----------------------------------
    // SE ACERTAR
    // -----------------------------------
    if (checkCollision(hitbox, player)) {

      player.takeDamage(this.currentDamage);

      // Impede múltiplos hits
      this.hasHitPlayer = true;

      return true;
    }

    return false;
  }

  // ===================================================
  // DESENHO
  // ===================================================
  draw(ctx) {

    if (this.isDefeated) return;

    // Piscar ao tomar dano
    if (
      this.isHurt &&
      Math.floor(this.hurtTimer / 4) % 2 === 0
    ) {
      return;
    }

    ctx.save();

    // Espelhar
    if (!this.facingRight) {

      ctx.scale(-1, 1);
      ctx.translate(-this.x * 2 - this.width, 0);
    }

    // -----------------------------------
    // COR
    // -----------------------------------
    let bodyColor = this.color;

    if (this.isAttacking || this.isKicking) {
      bodyColor = '#FF6600';
    }

    // -----------------------------------
    // CORPO
    // -----------------------------------
    ctx.fillStyle = bodyColor;

    ctx.fillRect(
      this.x,
      this.y + 25,
      this.width,
      this.height - 25
    );

    // -----------------------------------
    // CABEÇA
    // -----------------------------------
    ctx.fillStyle = '#F5C5A0';

    ctx.fillRect(
      this.x + 8,
      this.y,
      this.width - 16,
      28
    );

    // -----------------------------------
    // QUEPE
    // -----------------------------------
    ctx.fillStyle = '#1A3010';

    ctx.fillRect(
      this.x + 5,
      this.y - 8,
      this.width - 10,
      12
    );

    // -----------------------------------
    // SOCO
    // -----------------------------------
    if (this.isAttacking) {

      ctx.fillStyle = '#F5C5A0';

      ctx.fillRect(
        this.x + this.width,
        this.y + 30,
        25,
        12
      );
    }

    // -----------------------------------
    // CHUTE
    // -----------------------------------
    if (this.isKicking) {

      ctx.fillStyle = '#222';

      ctx.fillRect(
        this.x + this.width,
        this.y + this.height - 20,
        30,
        12
      );
    }

    ctx.restore();

    // -----------------------------------
    // NOME
    // -----------------------------------
    ctx.fillStyle = '#FFF';

    ctx.font = 'bold 12px monospace';

    ctx.textAlign = 'center';

    ctx.fillText(
      this.name,
      this.x + this.width / 2,
      this.y - 15
    );

    ctx.textAlign = 'left';
  }
}