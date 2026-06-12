const ghostGif = new Image();


ghostGif.src =
    "assets/ghosts/classicGhost.gif";

class ClassicPortal {

    constructor(x, y) {

        this.x = x;
        this.y = y;

        this.width = 60;
        this.height = 80;

        this.timer = 60;

        this.isDead = false;
        
    }

    update() {

        this.timer--;

        if (this.timer <= 0) {

            this.isDead = true;
        }
    }

    draw(ctx) {

        ctx.save();

        ctx.fillStyle =
            "rgba(100,0,255,0.7)";

        ctx.beginPath();

        ctx.ellipse(

            this.x + 30,
            this.y + 40,

            30,
            40,

            0,
            0,
            Math.PI * 2

        );

        ctx.fill();

        ctx.restore();
    }
}

class ClassicGhost {


    constructor(x, y) {


        this.x = x;
        this.y = y;


        this.width = 40;
        this.height = 40;


        this.speed = 3.5;


        this.lifeTime = 600;


        this.isDead = false;


        this.floatTimer = 0;

        this.attackFailed = false;
  
    }


    update(player) {


        this.floatTimer += 0.08;


            if (player.x > this.x) {

                this.x += this.speed;

            } else {

                this.x -= this.speed;
            }
            const targetY =

            player.y +
            player.height / 2 -

            this.height / 2;

            this.y +=

            (targetY - this.y) * 0.08;


        const touching =


    this.x < player.x + player.width &&
    this.x + this.width > player.x &&
    this.y < player.y + player.height &&
    this.y + this.height > player.y;


if (touching) {

if (touching) {

    player.slowTimer = 180;

    if (
        Game.phase &&
        Game.phase.boss
    ) {

        Game.phase.boss.classicAttackSuccess =
            true;
    }

    this.isDead = true;
}

    if (
        window.Game &&
        Game.boss
    ) {

        Game.boss.classicAttackSuccess =
            true;
    }

    console.log(
        "FANTASMA ACERTOU"
    );
}

const leftWall = 30;
const rightWall = 800 - player.width - 30; // ou o canvasWidth do seu jogo

const ghostReachedWall =
    this.x <= leftWall ||
    this.x >= rightWall;

if (ghostReachedWall) {
    if (Game.phase && Game.phase.boss) {
        Game.phase.boss.classicPlayerEscaped = true;
    }
    this.isDead = true;
    console.log("FANTASMA CHEGOU NA PAREDE");
}

        this.lifeTime--;


        if (this.lifeTime <= 0) {


            this.isDead = true;


        }


    }


draw(ctx) {


    ctx.save();


    const x = this.x;
    const y = this.y;


    // Flutuação
    const floatOffset =
        Math.sin(this.floatTimer) * 4;


    // Transparência fantasmagórica
    ctx.globalAlpha = 0.75;


    // Brilho externo
    ctx.shadowColor = "#8FDFFF";
    ctx.shadowBlur = 15;


    // Corpo principal
    const gradient =
        ctx.createLinearGradient(
            x,
            y,
            x,
            y + 50
        );


    gradient.addColorStop(
        0,
        "#FFFFFF"
    );


    gradient.addColorStop(
        1,
        "#BFDFFF"
    );


    ctx.fillStyle = gradient;


    // Cabeça
    ctx.beginPath();


    ctx.arc(
        x + 20,
        y + 15 + floatOffset,
        18,
        Math.PI,
        0
    );


    ctx.lineTo(
        x + 38,
        y + 40 + floatOffset
    );


    // Ondas inferiores
    ctx.quadraticCurveTo(
        x + 34,
        y + 45 + floatOffset,
        x + 30,
        y + 40 + floatOffset
    );


    ctx.quadraticCurveTo(
        x + 25,
        y + 45 + floatOffset,
        x + 20,
        y + 40 + floatOffset
    );


    ctx.quadraticCurveTo(
        x + 15,
        y + 45 + floatOffset,
        x + 10,
        y + 40 + floatOffset
    );


    ctx.quadraticCurveTo(
        x + 5,
        y + 45 + floatOffset,
        x + 2,
        y + 40 + floatOffset
    );


    ctx.closePath();
    ctx.fill();


    // Olho esquerdo
    ctx.shadowBlur = 0;


    ctx.fillStyle = "#111";


    ctx.beginPath();


    ctx.arc(
        x + 14,
        y + 18 + floatOffset,
        3,
        0,
        Math.PI * 2
    );


    ctx.fill();


    // Olho direito
    ctx.beginPath();


    ctx.arc(
        x + 26,
        y + 18 + floatOffset,
        3,
        0,
        Math.PI * 2
    );


    ctx.fill();


    // Pupilas brilhantes
    ctx.fillStyle = "#00FFFF";


    ctx.beginPath();


    ctx.arc(
        x + 14,
        y + 18 + floatOffset,
        1,
        0,
        Math.PI * 2
    );


    ctx.fill();


    ctx.beginPath();


    ctx.arc(
        x + 26,
        y + 18 + floatOffset,
        1,
        0,
        Math.PI * 2
    );


    ctx.fill();


    // Boca
    ctx.strokeStyle = "#222";
    ctx.lineWidth = 2;


    ctx.beginPath();


    ctx.arc(
        x + 20,
        y + 28 + floatOffset,
        5,
        0,
        Math.PI
    );


    ctx.stroke();


    // Aura fantasma
    ctx.strokeStyle =
        "rgba(180,220,255,0.4)";


    ctx.lineWidth = 2;


    ctx.beginPath();


    ctx.arc(
        x + 20,
        y + 22 + floatOffset,
        24 +
        Math.sin(
            this.floatTimer * 2
        ) * 2,
        0,
        Math.PI * 2
    );


    ctx.stroke();


    ctx.restore();
}
}

    /*class ClassicShip {

    constructor(x, y) {

        this.x = x;
        this.y = y;

        this.width = 80;
        this.height = 40;

        this.timer = 9999;

        this.isDead = false;
    }

    update() {

        this.timer--;

        if (this.timer <= 0) {

            this.isDead = true;
        }
    }

    draw(ctx) {

         console.log("DESENHANDO NAVE");

        ctx.save();

        ctx.fillStyle = "#888";

        ctx.fillRect(
            this.x,
            this.y,
            this.width,
            this.height
        );

        ctx.fillStyle = "#00FFFF";

        ctx.fillRect(
            this.x + 15,
            this.y + 10,
            50,
            15
        );

        ctx.restore();
    }
}
*/


window.spawnClassicGhost = function(boss) {

    if (!window.Game) return;

    if (!Game.phase) return;

    const portalOffset = 90;

    const portalX = boss.facingRight

        ? boss.x + boss.width + portalOffset
        : boss.x - 60;

    const portalY =
        boss.y + 5;

    const portal = new ClassicPortal(

        portalX,
        portalY

    );

    Game.phase.enemies.push(
        portal
    );

     setTimeout(() => {

        console.log("NAVE CRIADA");

        const ghost =
            new ClassicGhost(

                portalX,
                portalY

            );

        Game.phase.enemies.push(
            ghost
        );

        return ghost;

    }, 1000);


};

/*window.spawnClassicShip = function(boss) {

    if (!window.Game) return;

    if (!Game.phase) return;

    const portalOffset = 90;

    const portalX = boss.facingRight

        ? boss.x + boss.width + portalOffset
        : boss.x - 60;

    const portalY =
        boss.y + 5;

    const portal =
        new ClassicPortal(
            portalX,
            portalY
        );

    Game.phase.enemies.push(
        portal
    );

    setTimeout(() => {

        const ship =
            new ClassicShip(
                portalX,
                portalY
            );

        Game.phase.enemies.push(
            ship
        );

    }, 1000);
};

*/
