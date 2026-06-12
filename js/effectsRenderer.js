// ===================================================
// UNICEFIGHT - EFFECT RENDERER
// ===================================================

function renderEffects(ctx) {

  for (
    const effect of
    EffectsSystem.effects
  ) {

    ctx.save();

    ctx.globalAlpha =
      effect.life /
      effect.maxLife;

    ctx.fillStyle =
      effect.color;

    ctx.fillRect(

      effect.x,

      effect.y,

      effect.size,

      effect.size
    );

    ctx.restore();
  }
}