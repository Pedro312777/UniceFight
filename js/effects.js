// ===================================================
// UNICEFIGHT - Sistema de Efeitos
// Arquivo: js/effects.js
// ===================================================
// SISTEMA PREPARADO PARA:
// ✔ Hit effects
// ✔ Partículas
// ✔ Screen shake global
// ✔ Flash de dano
// ✔ Efeitos de impacto
// ✔ Poeira de movimento
// ✔ Trails
// ✔ Efeitos de vitória
// ✔ Efeitos futuros
// ===================================================

// ===================================================
// GERENCIADOR GLOBAL
// ===================================================
const Effects = {

  particles: [],

  screenShake: 0,

  flashAlpha: 0,

  // ===============================================
  // UPDATE GLOBAL
  // ===============================================
  update() {

    // -------------------------------------------
    // PARTICLES
    // -------------------------------------------
    for (let i = this.particles.length - 1; i >= 0; i--) {

      const p = this.particles[i];

      p.update();

      if (p.dead) {

        this.particles.splice(i, 1);
      }
    }

    // -------------------------------------------
    // SCREEN SHAKE
    // -------------------------------------------
    if (this.screenShake > 0) {

      this.screenShake--;
    }

    // -------------------------------------------
    // FLASH
    // -------------------------------------------
    if (this.flashAlpha > 0) {

      this.flashAlpha -= 0.02;

      if (this.flashAlpha < 0) {
        this.flashAlpha = 0;
      }
    }
  },

  // ===============================================
  // DRAW GLOBAL
  // ===============================================
  draw(ctx, canvasWidth, canvasHeight) {

    // -------------------------------------------
    // PARTICLES
    // -------------------------------------------
    for (const particle of this.particles) {

      particle.draw(ctx);
    }

    // -------------------------------------------
    // FLASH DE TELA
    // -------------------------------------------
    if (this.flashAlpha > 0) {

      ctx.save();

      ctx.fillStyle =
        `rgba(255,255,255,${this.flashAlpha})`;

      ctx.fillRect(
        0,
        0,
        canvasWidth,
        canvasHeight
      );

      ctx.restore();
    }
  },

  // ===============================================
  // SHAKE
  // ===============================================
  triggerShake(power = 6) {

    if (power > this.screenShake) {

      this.screenShake = power;
    }
  },

  // ===============================================
  // FLASH
  // ===============================================
  triggerFlash(alpha = 0.2) {

    this.flashAlpha = alpha;
  },

  // ===============================================
  // HIT EFFECT
  // ===============================================
  createHitEffect(x, y, color = '#FFAA00') {

    for (let i = 0; i < 8; i++) {

      this.particles.push(

        new Particle({

          x,
          y,

          vx: (Math.random() - 0.5) * 5,

          vy: (Math.random() - 0.5) * 5,

          size: Math.random() * 5 + 3,

          life: 18,

          color
        })
      );
    }
  },

  // ===============================================
  // POEIRA
  // ===============================================
  createDust(x, y) {

    for (let i = 0; i < 4; i++) {

      this.particles.push(

        new Particle({

          x,
          y,

          vx: (Math.random() - 0.5) * 2,

          vy: -Math.random() * 2,

          size: Math.random() * 6 + 4,

          life: 25,

          color: '#AAAAAA',

          gravity: -0.02
        })
      );
    }
  },

  // ===============================================
  // EFEITO DE PULO
  // ===============================================
  createJumpEffect(x, y) {

    for (let i = 0; i < 6; i++) {

      this.particles.push(

        new Particle({

          x,
          y,

          vx: (Math.random() - 0.5) * 4,

          vy: -Math.random() * 3,

          size: Math.random() * 5 + 2,

          life: 20,

          color: '#DDDDDD'
        })
      );
    }
  },

  // ===============================================
  // EFEITO DE DERROTA
  // ===============================================
  createExplosion(x, y) {

    for (let i = 0; i < 25; i++) {

      this.particles.push(

        new Particle({

          x,
          y,

          vx: (Math.random() - 0.5) * 8,

          vy: (Math.random() - 0.5) * 8,

          size: Math.random() * 8 + 4,

          life: 35,

          color:
            Math.random() > 0.5
            ? '#FF6600'
            : '#FFFF00'
        })
      );
    }

    this.triggerShake(10);

    this.triggerFlash(0.25);
  }
};

// ===================================================
// CLASSE PARTICLE
// ===================================================
class Particle {

  constructor(config) {

    this.x = config.x;
    this.y = config.y;

    this.vx = config.vx || 0;
    this.vy = config.vy || 0;

    this.size = config.size || 4;

    this.life = config.life || 20;
    this.maxLife = this.life;

    this.color = config.color || '#FFFFFF';

    this.gravity = config.gravity ?? 0.08;

    this.dead = false;
  }

  // ===============================================
  // UPDATE
  // ===============================================
  update() {

    this.life--;

    if (this.life <= 0) {

      this.dead = true;

      return;
    }

    this.vy += this.gravity;

    this.x += this.vx;

    this.y += this.vy;
  }

  // ===============================================
  // DRAW
  // ===============================================
  draw(ctx) {

    const alpha =
      this.life / this.maxLife;

    ctx.save();

    ctx.globalAlpha = alpha;

    ctx.fillStyle = this.color;

    ctx.beginPath();

    ctx.arc(
      this.x,
      this.y,
      this.size,
      0,
      Math.PI * 2
    );

    ctx.fill();

    ctx.restore();
  }
}

// ===================================================
// CAMERA SHAKE
// ===================================================
function applyCameraShake(ctx) {

  if (Effects.screenShake <= 0) {
    return;
  }

  const intensity =
    Effects.screenShake * 0.5;

  const offsetX =
    (Math.random() - 0.5) * intensity;

  const offsetY =
    (Math.random() - 0.5) * intensity;

  ctx.translate(offsetX, offsetY);
}

// ===================================================
// FUTURO SISTEMA DE TRAILS
// ===================================================
class TrailEffect {

  constructor(entity) {

    this.entity = entity;

    this.points = [];
  }

  update() {

    /*
    Futuro:
    salvar posições antigas
    para criar rastro
    */
  }

  draw(ctx) {

    /*
    Futuro:
    desenhar trail
    */
  }
}

// ===================================================
// FUTURO SISTEMA DE AFTER IMAGE
// ===================================================
class AfterImageEffect {

  constructor(entity) {

    this.entity = entity;
  }

  update() {

  }

  draw(ctx) {

  }
}

// ===================================================
// FUTURO SISTEMA DE IMPACTO
// ===================================================
class ImpactRing {

  constructor(x, y) {

    this.x = x;
    this.y = y;

    this.radius = 10;

    this.life = 20;
  }

  update() {

  }

  draw(ctx) {

  }
}