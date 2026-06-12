// ===================================================
// UNICEFIGHT - EFFECTS SYSTEM BALANCED V6
// VISUAL FX BALANCE PATCH
// ===================================================
// BALANCEAMENTO:
// ✔ Menos poluição visual
// ✔ Hit effects mais limpos
// ✔ Dash trail reduzido
// ✔ Knockdown menos exagerado
// ✔ Shockwaves menores
// ✔ Melhor performance
// ✔ Visual mais consistente
// ✔ Combate mais legível
// ✔ Impactos ainda satisfatórios
// ===================================================

const EffectsSystem = {

  effects: [],

  // ===================================
  // SPAWN BASE
  // ===================================
  spawn(effect) {

    this.effects.push(effect);
  },

  // ===================================
  // UPDATE
  // ===================================
  update() {

    for (
      let i = this.effects.length - 1;
      i >= 0;
      i--
    ) {

      const effect =
        this.effects[i];

      effect.life--;

      effect.x += effect.vx || 0;
      effect.y += effect.vy || 0;

      if (effect.gravity) {

        effect.vy += effect.gravity;
      }

      if (
        effect.friction !== undefined
      ) {

        effect.vx *= effect.friction;
        effect.vy *= effect.friction;
      }

      if (effect.scaleDecay) {

        effect.size *=
          effect.scaleDecay;
      }

      if (
        effect.life <= 0 ||
        effect.size <= 0.04
      ) {

        this.effects.splice(i, 1);
      }
    }
  },

  // ===================================
  // RENDER
  // ===================================
  render(ctx) {

    for (const effect of this.effects) {

      ctx.save();

      const alpha =
        effect.life /
        effect.maxLife;

      ctx.globalAlpha = alpha;

      // ===============================
      // SHOCKWAVE
      // ===============================
      if (
        effect.type === 'shockwave'
      ) {

        ctx.strokeStyle =
          effect.color;

        ctx.lineWidth = 2;

        ctx.beginPath();

        ctx.arc(
          effect.x,
          effect.y,
          effect.size,
          0,
          Math.PI * 2
        );

        ctx.stroke();
      }

      // ===============================
      // CIRCLE
      // ===============================
      else if (
        effect.shape === 'circle'
      ) {

        ctx.fillStyle =
          effect.color;

        ctx.beginPath();

        ctx.arc(
          effect.x,
          effect.y,
          effect.size,
          0,
          Math.PI * 2
        );

        ctx.fill();
      }

      // ===============================
      // DEFAULT RECT
      // ===============================
      else {

        ctx.fillStyle =
          effect.color;

        ctx.fillRect(
          effect.x,
          effect.y,
          effect.size,
          effect.size
        );
      }

      ctx.restore();
    }
  }
};

// ===================================================
// HIT EFFECT
// ===================================================
function spawnHitEffect(
  x,
  y,
  heavy = false
) {

  // ===================================
  // MENOS PARTÍCULAS
  // ===================================
  const particles =
    heavy ? 10 : 5;

  for (
    let i = 0;
    i < particles;
    i++
  ) {

    const speed =
      heavy ? 5 : 3;

    EffectsSystem.spawn({

      type: 'hit',

      x,
      y,

      vx:
        (Math.random() - 0.5) *
        speed,

      vy:
        (Math.random() - 0.5) *
        speed,

      size:
        heavy
          ? 2 + Math.random() * 3
          : 1 + Math.random() * 2,

      color:
        heavy
          ? '#FFAA33'
          : '#FFD966',

      friction: 0.90,

      life:
        heavy ? 16 : 10,

      maxLife:
        heavy ? 16 : 10
    });
  }

  // ===================================
  // IMPACT RING
  // ===================================
  if (heavy) {

    spawnShockwave(
      x,
      y,
      '#FFCC66',
      5
    );
  }
}

// ===================================================
// LAND EFFECT
// ===================================================
function spawnLandEffect(
  x,
  y,
  heavy = false
) {

  const particles =
    heavy ? 8 : 4;

  for (
    let i = 0;
    i < particles;
    i++
  ) {

    EffectsSystem.spawn({

      type: 'dust',

      x,
      y,

      vx:
        (Math.random() - 0.5) *
        (heavy ? 3 : 2),

      vy:
        -Math.random() *
        (heavy ? 1.8 : 1),

      size:
        1 + Math.random() * 3,

      color: '#BBBBBB',

      friction: 0.88,

      gravity: 0.04,

      life:
        heavy ? 14 : 8,

      maxLife:
        heavy ? 14 : 8
    });
  }
}

// ===================================================
// DASH EFFECT
// ===================================================
function spawnDashEffect(
  entity
) {

  // ===================================
  // TRAIL MAIS SUAVE
  // ===================================
  EffectsSystem.spawn({

    type: 'dash',

    x:
      entity.x +
      entity.width / 2,

    y:
      entity.y +
      entity.height * 0.72,

    vx:
      entity.facingRight
        ? -0.2
        : 0.2,

    vy: 0,

    size: 6,

    color: '#FFFFFF',

    friction: 0.95,

    scaleDecay: 0.88,

    life: 6,

    maxLife: 6,

    shape: 'circle'
  });
}

// ===================================================
// LAUNCH EFFECT
// ===================================================
function spawnLaunchEffect(
  x,
  y
) {

  for (let i = 0; i < 7; i++) {

    EffectsSystem.spawn({

      type: 'launch',

      x,
      y,

      vx:
        (Math.random() - 0.5) * 3,

      vy:
        -Math.random() * 3,

      size:
        1 + Math.random() * 2,

      color: '#FFF0AA',

      friction: 0.92,

      gravity: 0.06,

      life: 12,

      maxLife: 12
    });
  }

  spawnShockwave(
    x,
    y,
    '#FFFFFF',
    4
  );
}

// ===================================================
// SHOCKWAVE
// ===================================================
function spawnShockwave(
  x,
  y,
  color = '#FFFFFF',
  size = 5
) {

  EffectsSystem.spawn({

    type: 'shockwave',

    x,
    y,

    vx: 0,
    vy: 0,

    size,

    color,

    scaleDecay: 1.08,

    life: 8,

    maxLife: 8
  });
}

// ===================================================
// KNOCKDOWN EFFECT
// ===================================================
function spawnKnockdownEffect(
  x,
  y
) {

  spawnLandEffect(
    x,
    y,
    true
  );

  spawnShockwave(
    x,
    y,
    '#DDDDDD',
    7
  );
}

// ===================================================
// LEGACY COMPAT
// ===================================================
function updateEffects() {

  EffectsSystem.update();
}

function renderEffects(ctx) {

  EffectsSystem.render(ctx);
}

// ===================================================
// EXPORT
// ===================================================
window.EffectsSystem =
  EffectsSystem;

console.log(
  '[effects] balanced visual effects carregado'
);