function drawEntitySprite(
ctx,
entity
){


if(
!entity.spriteSheet ||
!entity.animation ||
!entity.animation.currentFrame
){
return;
}


const frame =
entity.animation.currentFrame;


// ==========================
// CONFIG
// ==========================


const spriteScale =

entity.spriteScale ||

1.0;


const BASE_HEIGHT =
155;


// quanto compensar animações menores
// 0.45 costuma ficar natural
const SIZE_COMPENSATION =
0.60;


// ==========================
// SCALE COMPENSATION
// ==========================


const compensation =


(BASE_HEIGHT - frame.h)


/


BASE_HEIGHT;


const sizeMultiplier =


1 +


(
compensation *
SIZE_COMPENSATION

);

let animationScale = 1;

if(
entity.animation.current ===
"kick"
){

animationScale = 1.03;

}


// ==========================
// SIZE
// ==========================


const drawWidth =

frame.w *

spriteScale *

sizeMultiplier *

animationScale;

const drawHeight =

frame.h *

spriteScale *

sizeMultiplier *

animationScale;


// ==========================
// POSITION
// ==========================

// centro do corpo físico

const bodyCenterX =

entity.x +

(entity.width / 2);


// X baseado no corpo

const drawX =

bodyCenterX -

(drawWidth / 2) +

(entity.spriteOffsetX || 0);


// offsets finos por animação

let animationOffset = 0;

switch(
entity.animation.current
){

case "walk":

animationOffset = 4;
break;

case "kick":

animationOffset = 2;
break;

case "block":

animationOffset = 1;
break;

}


// alinhar pés ao corpo físico

const drawY =

entity.y +

entity.height -

drawHeight +

animationOffset +

(entity.spriteOffsetY || 0);


// ==========================
// DRAW
// ==========================


ctx.save();

ctx.save();

if (
    entity.easyAttackProtection > 0
){
    ctx.globalAlpha =
        0.45 +
        Math.sin(
            performance.now() * 0.015
        ) * 0.15;
}


if(
!entity.facingRight
){


ctx.scale(
-1,
1
);


ctx.drawImage(


entity.spriteSheet,


frame.x,
frame.y,


frame.w,
frame.h,


-(drawX + drawWidth),


drawY,


drawWidth,


drawHeight


);


}else{


ctx.drawImage(


entity.spriteSheet,


frame.x,
frame.y,


frame.w,
frame.h,


drawX,


drawY,


drawWidth,


drawHeight


);


}


ctx.restore();


}


window.drawEntitySprite =
drawEntitySprite;
