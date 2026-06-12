// ===================================
// ANIMATION SPEEDS
// ===================================

const ANIMATION_SPEEDS = {
    idle:16,
    walk:6,
    jump:8,
    punch:5,
    kick:5,
    airKick:5,
    hurt:10,
    dead:20,

    block:8,

    dash:1

};

// ===================================
// INIT
// ===================================

function initializeAnimator(entity){

    if (
        !entity.animations ||
        !entity.animations.idle
    ){
        return;
    }

    entity.animation = {

        current:"idle",

        frameIndex:0,

        timer:0,

        currentFrame:
        entity.animations.idle[0]

    };

}

// ===================================
// DETECT STATE
// ===================================

function determineState(entity){

    if(entity.isDead){
        return "dead";
    }

    if(entity.isHurt){
        return "hurt";
    }

    if(entity.isSpecialAttacking){
        return "special";
    }

    if(entity.isAttacking){
        return "punch";
    }

   if (entity.isKicking) {

    if (
        !entity.onGround &&
        entity.animations.airKick
    ) {

        return "airKick";

    }

    return "kick";
}

    if(entity.isDashing){
        return "dash";
    }

    if(entity.isDefending){
        return "block";
    }

    console.log(
        "JUMP STATE",
        entity.isHurt,
        entity.invulnerabilityTimer
        );

    if(!entity.onGround){
        return "jump";
    }

if(entity.isMoving){

    if(entity.isBoss){

        console.log(
            "BOSS STATE: WALK"
        );

    }

    return "walk";
}

if(entity.isBoss){

    console.log(
        "BOSS STATE: IDLE"
    );

}

return "idle";
}

// ===================================
// UPDATE
// ===================================

function updateAnimator(
entity
){

if(
    !entity ||
    !entity.animation ||
    !entity.animations
){
    return;
}

    const anim =
    entity.animation;

    const nextState =
    determineState(
        entity
    );

console.log(
    "STATE:",
    nextState
);


    // mudou estado
    if(
        anim.current !==
        nextState
    ){

        anim.current =
        nextState;

        anim.frameIndex =
        0;

        anim.timer =
        0;

    }

    if(
    !entity.animations
    ){
        return;
    }
 

    const frames =

    entity.animations[
        anim.current
    ] ||

    entity.animations.idle;

      if(anim.current === "block"){
    console.log(
        "BLOCK:",
        frames.length,
        anim.frameIndex
    );
    }

   let speed =

ANIMATION_SPEEDS[
    anim.current
] ||

8;

if(
    entity.animationSpeedMultiplier
){

    speed *=
    entity.animationSpeedMultiplier;

}

    anim.timer++;

    if(
        anim.timer >=
        speed
    ){

        anim.timer = 0;

        anim.frameIndex++;

// NÃO LOOPAR PULO
if (
    anim.current === "jump" ||
    anim.current === "airKick"
) {

    if (
        anim.frameIndex >=
        frames.length
    ) {

        anim.frameIndex =
        frames.length - 1;
    }
}
else {

    if (
        anim.frameIndex >=
        frames.length
    ) {

        anim.frameIndex = 0;
    }
}

    }


    anim.currentFrame =

    frames[
        anim.frameIndex
    ];

}

// ===================================
// EXPORT
// ===================================

window.initializeAnimator =
initializeAnimator;

window.updateAnimator =
updateAnimator;

console.log(
"ANIMATOR QUE EU EDITEI CARREGOU"
);