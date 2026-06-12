// ===================================================
// UNICEFIGHT - CAMERA SYSTEM BALANCED
// LF2 STYLE (MENOS EXAGERADO)
// ===================================================

const Camera = {

  // ===================================
  // POSIÇÃO
  // ===================================
  x: 0,

  y: 0,

  targetX: 0,

  targetY: 0,

  // ===================================
  // SHAKE
  // ===================================
  shakeIntensity: 0,

  // MAIS SUAVE
  shakeDecay: 0.88,

  // ===================================
  // SMOOTH
  // ===================================
  smoothness: 0.08,

  // ===================================
  // UPDATE
  // ===================================
  update(target) {

    if (target) {

      this.targetX = 0;
      this.targetY = 0;
    }

    // =================================
    // SUAVIDADE
    // =================================
    this.x +=

      (this.targetX - this.x) *

      this.smoothness;

    this.y +=

      (this.targetY - this.y) *

      this.smoothness;

    // =================================
    // SHAKE DECAY
    // =================================
    if (this.shakeIntensity > 0) {

      this.shakeIntensity *=
        this.shakeDecay;

      // =================================
      // ANTI TREMER
      // =================================
      if (
        this.shakeIntensity < 0.08
      ) {

        this.shakeIntensity = 0;
      }
    }
  },

  // ===================================
  // SHAKE
  // ===================================
  shake(power = 2) {

    // =================================
    // LIMITADOR
    // =================================
    power =
      Math.min(power, 4);

    if (
      power >
      this.shakeIntensity
    ) {

      this.shakeIntensity =
        power;
    }
  },

  // ===================================
  // COMPATIBILIDADE
  // ===================================
  addShake(power = 2) {

    this.shake(power);
  },

  // ===================================
  // BEGIN
  // ===================================
  begin(ctx) {

    ctx.save();

    let shakeX = 0;
    let shakeY = 0;

    // =================================
    // SHAKE MAIS SUAVE
    // =================================
    if (
      this.shakeIntensity > 0
    ) {

      shakeX =

        (Math.random() - 0.5) *

        this.shakeIntensity *

        0.55;

      shakeY =

        (Math.random() - 0.5) *

        this.shakeIntensity *

        0.55;
    }

    // =================================
    // APPLY
    // =================================
    ctx.translate(

      Math.round(-this.x + shakeX),

      Math.round(-this.y + shakeY)
    );
  },

  // ===================================
  // END
  // ===================================
  end(ctx) {

    ctx.restore();
  }
};

// ===================================================
// LOG
// ===================================================
console.log(`

====================================
CAMERA SYSTEM BALANCED LOADED
====================================

✔ shake reduzido
✔ impacto mais natural
✔ menos tremedeira
✔ LF2 equilibrado
✔ boss ainda pesado
✔ gameplay mais limpo

`);

