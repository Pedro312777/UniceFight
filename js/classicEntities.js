const ghostGif = new Image();


ghostGif.src =
    "assets/ghosts/classicGhost.gif";

class ClassicPortal {

    constructor(x, y, type = "ghost") {

        this.x = x;
        this.y = y;

        this.width = 96;
        this.height = 128;

        this.timer = type === "pacman" ? 1800 : type === "ship" ? 500 : 280;

        this.isDead = false;

        this.animTimer = 0;

        this.waitForShip = false;

        this.linkedEntity = null;
    }

 update() {

        this.animTimer += 0.08;

        if (this.linkedEntity) {

            if (this.linkedEntity.isDead) {

                this.timer--;

                if (this.timer <= 0) {
                    this.isDead = true;
                }

            } else {

                this.timer = 60;
            }

            return;
        }

        this.timer--;

        if (this.timer <= 0) {
            this.isDead = true;
        }
    }

    draw(ctx) {

        ctx.save();

        const x = this.x;
        const y = this.y - 150;
        const w = 96;
        const h = 128;
        const blockSize = 16;

        // ==========================================
        // INTERIOR — névoa roxa pulsando
        // ==========================================
        const pulse =
            0.55 + 0.20 * Math.sin(this.animTimer * 1.2);

        const innerX = x + blockSize;
        const innerY = y + blockSize;
        const innerW = w - blockSize * 2;
        const innerH = h - blockSize * 2;

        // Camada base roxa
        ctx.fillStyle =
            `rgba(80, 0, 130, ${pulse})`;
        ctx.fillRect(innerX, innerY, innerW, innerH);

        // Ondulação magenta
        const wave1 =
            0.3 + 0.2 * Math.sin(this.animTimer * 2.0);
        ctx.fillStyle =
            `rgba(180, 0, 255, ${wave1})`;
        ctx.fillRect(
            innerX + 4,
            innerY + 4,
            innerW - 8,
            innerH - 8
        );

        // Brilho central
        const wave2 =
            0.15 + 0.15 * Math.sin(this.animTimer * 3.0 + 1);
        ctx.fillStyle =
            `rgba(220, 100, 255, ${wave2})`;
        ctx.fillRect(
            innerX + 10,
            innerY + 10,
            innerW - 20,
            innerH - 20
        );

        // ==========================================
        // PARTÍCULAS roxas flutuando
        // ==========================================
        for (let i = 0; i < 6; i++) {

            const px =
                innerX + 4 +
                (Math.sin(this.animTimer * 1.5 + i * 1.2) * 0.5 + 0.5) *
                (innerW - 8);

            const py =
                innerY + innerH -
                ((this.animTimer * 30 + i * 14) % (innerH - 4));

            const alpha =
                0.4 + 0.4 * Math.sin(this.animTimer + i);

            ctx.fillStyle =
                `rgba(200, 50, 255, ${alpha})`;

            ctx.beginPath();
            ctx.arc(px, py, 2, 0, Math.PI * 2);
            ctx.fill();
        }

        // ==========================================
        // MOLDURA — blocos de obsidiana pixel art
        // ==========================================
// ==========================================
        // MOLDURA — blocos de obsidiana pixel art
        // ==========================================
        const cols = w / blockSize;
        const rows = h / blockSize;

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {

                const isBorder =
                    row === 0 ||
                    row === rows - 1 ||
                    col === 0 ||
                    col === cols - 1;

                if (!isBorder) continue;

                const bx = x + col * blockSize;
                const by = y + row * blockSize;

                // Base da obsidiana
                ctx.fillStyle = "#1a0a2e";
                ctx.fillRect(bx, by, blockSize, blockSize);

                // Manchas de textura
                ctx.fillStyle = "rgba(40, 10, 60, 0.8)";
                ctx.fillRect(bx + 2, by + 2, 6, 6);
                ctx.fillRect(bx + 9, by + 9, 5, 5);

                // Reflexo roxo
                ctx.fillStyle = "rgba(100, 20, 160, 0.4)";
                ctx.fillRect(bx + 1, by + 1, blockSize - 2, 3);

                // Borda escura
                ctx.strokeStyle = "rgba(10, 0, 20, 0.9)";
                ctx.lineWidth = 1;
                ctx.strokeRect(bx, by, blockSize, blockSize);
            }
        }

        ctx.restore();
    }
}

class ClassicGhost {


constructor(x, y, spawnSide) {

    this.x = x;
    this.y = y;
    this.spawnSide = spawnSide;

    this.width = 40;
    this.height = 40;


        this.speed = 3.5;


        this.lifeTime = 600;


        this.isDead = false;

          this.escaped = false;

        this.floatTimer = 0;

        this.attackFailed = false;

          this.escapeAllowed = false;
            this.escapeDelay = 120;
  
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
    this.height / 2 -
    100;

        this.y +=
            (targetY - this.y) * 0.08;


        const touching =
    this.x < player.x + player.width &&
    this.x + this.width > player.x &&
    this.y + 100 < player.y + player.height &&
    this.y + this.height + 100 > player.y;

    console.log(
    "GHOST:", Math.round(this.x), Math.round(this.y),
    "PLAYER:", Math.round(player.x), Math.round(player.y),
    "TOUCHING:", touching
);

if (touching) {
    player.slowTimer = 180;

    showCombatQuote(
        "Você não tem escapatória!",
        Game.phase.boss.x + Game.phase.boss.width / 2,
        Game.phase.boss.y + 100,
        Game.phase.boss
    );
    if (Game.phase && Game.phase.boss) {
        Game.phase.boss.classicAttackSuccess = true;
    }

    this.isDead = true;

    console.log("FANTASMA ACERTOU");
}

 if (!this.escapeAllowed) {
        this.escapeDelay--;
        if (this.escapeDelay <= 0) {
            this.escapeAllowed = true;
        }
    }

const movingRight = player.x > this.x;

console.log(
    "movingRight:", movingRight,
    "player.x:", Math.round(player.x),
    "ghost.x:", Math.round(this.x)
);


if (!this.escaped && this.escapeAllowed) {

    

   const playerEscaped =
    movingRight
        ? player.x + player.width >= 800  // quase na parede direita
        : player.x <= 5;       

    if (playerEscaped) {

        this.escaped = true;

        if (Game.phase && Game.phase.boss) {
            Game.phase.boss.classicPlayerEscaped = true;
        }

        this.isDead = true;

        console.log("PLAYER ESCAPOU");
    }
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

    const floatOffset =
        Math.sin(this.floatTimer) * 4;

    ctx.globalAlpha = 0.9;

    // Sombra vermelha
    ctx.shadowColor = "#FF0000";
    ctx.shadowBlur = 12;

    ctx.fillStyle = "#FF0000";

    ctx.beginPath();

    // Topo arredondado
    ctx.arc(
        x + 20,
        y + 18 + floatOffset,
        18,
        Math.PI,
        0
    );

    // Lado direito
    ctx.lineTo(x + 38, y + 44 + floatOffset);

    // Dentinhos da base
    ctx.lineTo(x + 32, y + 38 + floatOffset);
    ctx.lineTo(x + 26, y + 44 + floatOffset);
    ctx.lineTo(x + 20, y + 38 + floatOffset);
    ctx.lineTo(x + 14, y + 44 + floatOffset);
    ctx.lineTo(x + 8,  y + 38 + floatOffset);
    ctx.lineTo(x + 2,  y + 44 + floatOffset);

    // Lado esquerdo
    ctx.lineTo(x + 2, y + 18 + floatOffset);

    ctx.closePath();
    ctx.fill();

    // Olho esquerdo - branco
    ctx.shadowBlur = 0;
    ctx.fillStyle = "#FFFFFF";
    ctx.beginPath();
    ctx.ellipse(
        x + 13,
        y + 18 + floatOffset,
        5, 6,
        0, 0, Math.PI * 2
    );
    ctx.fill();

    // Olho direito - branco
    ctx.beginPath();
    ctx.ellipse(
        x + 27,
        y + 18 + floatOffset,
        5, 6,
        0, 0, Math.PI * 2
    );
    ctx.fill();

   // Pupilas seguem o player
    const player = Game.player;
    const ghostCenterX = x + 20;
    const pupilOffset = player.x > ghostCenterX ? 1 : -4;

    // Pupila esquerda - azul
    ctx.fillStyle = "#0000CC";
    ctx.beginPath();
    ctx.ellipse(
        x + 15 + pupilOffset,
        y + 19 + floatOffset,
        3, 4,
        0, 0, Math.PI * 2
    );
    ctx.fill();

    // Pupila direita - azul
    ctx.beginPath();
    ctx.ellipse(
        x + 29 + pupilOffset,
        y + 19 + floatOffset,
        3, 4,
        0, 0, Math.PI * 2
    );
    ctx.fill();
    ctx.restore();
}
}

  class ClassicShipProjectile {
 
    constructor(x, y, directionX) {
 
        this.x = x;
        this.y = y;
 
        // Tamanho do projétil
        this.width  = 18;
        this.height = 10;
 
        // Velocidade — generosa para dar tempo de defender
        this.speedX = directionX * 4.5;

        this.speedY = 0;
 
        this.isDead = false;
 
        // Timer visual de aviso (piscada antes de sair)
        this.warningTimer = 0;
    }
 
    update(player) {
 
        const hurtbox = getHurtboxForEntity(player);
        const targetY = hurtbox.y + hurtbox.height / 2;
        const dy = targetY - (this.y + this.height / 2);

        this.speedY += dy * 0.05;
        this.speedY *= 0.85;

        this.x += this.speedX;
        this.y += this.speedY;

        console.log(
    "PROJ:", Math.round(this.x), Math.round(this.y),
    "PLAYER:", Math.round(player.x), Math.round(player.y),
    "HIT:", 
    this.x < player.x + player.width + 20 &&
    this.x + this.width > player.x - 20 &&
    this.y < player.y + player.height &&
    this.y + this.height > player.y - 40
);

const hit =
            this.x < player.x + player.width + 35  &&
            this.x + this.width > player.x - 35    &&
            this.y < player.y + player.height       &&
            this.y + this.height > player.y - 100;
 
        if (hit) {
 
             if (player.isDefending) {

                // ✅ Player defendeu — ataque bloqueado
                console.log("PROJ BLOQUEADO");

                if (Game.phase && Game.phase.boss) {
                    Game.phase.boss.classicPlayerEscaped = true;
                }

                // Efeito visual de impacto na defesa
                showCombatQuote(
                    "Bloqueado!",
                    player.x + player.width / 2,
                    player.y - 80
                );

            } else {
 
                // ❌ Player não defendeu — toma dano
                console.log("PROJ ACERTOU");
 
                player.takeDamage(14);
 
                showCombatQuote(
                    "Direto no alvo!",
                    Game.phase.boss.x + Game.phase.boss.width / 2,
                    Game.phase.boss.y + 100,
                    Game.phase.boss
                );
 
                if (Game.phase && Game.phase.boss) {
                    Game.phase.boss.classicAttackSuccess = true;
                }
            }
 
            this.isDead = true;
            return;
        }
 
        // Sai da tela sem acertar — player escapou
        if (this.x > 860 || this.x < -50) {
 
            console.log("PROJ PASSOU SEM ACERTAR");
 
            if (Game.phase && Game.phase.boss) {
                Game.phase.boss.classicPlayerEscaped = true;
            }
 
            this.isDead = true;
        }
    }
 
  
   draw(ctx) {

        ctx.save();

        const cx = this.x + this.width / 2;
        const cy = this.y + this.height / 2;

        // ==========================================
        // BRILHO EXTERNO — laranja/amarelo
        // ==========================================
        ctx.shadowColor = "#FFAA00";
        ctx.shadowBlur  = 8;

        ctx.fillStyle = "#FF8800";
        ctx.beginPath();
        ctx.ellipse(
            cx, cy,
            this.width / 2,
            this.height / 2,
            0, 0, Math.PI * 2
        );
        ctx.fill();

        // ==========================================
        // CAMADA MÉDIA — amarelo
        // ==========================================
        ctx.shadowBlur = 0;
        ctx.fillStyle = "#FFDD00";
        ctx.beginPath();
        ctx.ellipse(
            cx, cy,
            this.width / 2 - 2,
            this.height / 2 - 1,
            0, 0, Math.PI * 2
        );
        ctx.fill();

        // ==========================================
        // NÚCLEO — branco brilhante
        // ==========================================
        ctx.fillStyle = "#FFFFFF";
        ctx.beginPath();
        ctx.ellipse(
            cx, cy,
            this.width / 4,
            this.height / 4,
            0, 0, Math.PI * 2
        );
        ctx.fill();

        // ==========================================
        // RASTRO — cauda do projétil
        // ==========================================
        const trailDir = this.speedX > 0 ? -1 : 1;

        const gradient = ctx.createLinearGradient(
            cx, cy,
            cx + trailDir * this.width * 1.5, cy
        );

        gradient.addColorStop(0, "rgba(255, 180, 0, 0.6)");
        gradient.addColorStop(1, "rgba(255, 100, 0, 0)");

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.ellipse(
            cx + trailDir * this.width * 0.8,
            cy,
            this.width * 1.2,
            this.height / 3,
            0, 0, Math.PI * 2
        );
        ctx.fill();

        ctx.restore();
    }
}
 
 
// ===================================================
// CLASSIC SHIP
// ===================================================
 
class ClassicShip {
 
    constructor(x, y, targetPlayer, portalX, portalY) {

         // Posição do portal para retorno
        this.portalX = portalX +48;
        this.portalY = portalY - 100;
 
        this.x = x;
        this.y = y;
 
        this.width  = 80;
        this.height = 40;
 
        this.isDead = false;
 
        // Referência ao player para mirar
        this.targetPlayer = targetPlayer;
 
        // Estados internos
        // "entering"  → nave deslizando até posição de ataque
        // "aiming"    → nave parada, aviso visual piscando
        // "fired"     → projétil lançado, nave aguarda e sai
        // "leaving"   → nave deslizando para fora da tela
        this.state = "entering";
 
        // Posição final onde a nave vai parar para atirar
        // Fica no centro-alto da arena
        this.targetX = 360;
        this.targetY = Game.player.y - this.height - 90;
 
        // Timer de aviso antes de disparar (~1.5s = 90 frames)
        this.aimTimer = 90;
 
        // Timer para a nave sair após disparar
        this.leaveTimer = 120;
 
        // Projétil disparado
        this.projectile = null;
 
        // Pisca para indicar que vai atirar
        this.blinkTimer = 0;
 
        // Velocidade de entrada/saída
        this.moveSpeed = 5;
    }
 
    update() {
 
        if (this.state === "entering") {
 
            // Desliza até a posição de ataque
            const dx = this.targetX - this.x;
            const dy = this.targetY - this.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
 
            if (dist < this.moveSpeed) {
 
                this.x = this.targetX;
                this.y = this.targetY;
                this.state = "aiming";
 
            } else {
 
                this.x += (dx / dist) * this.moveSpeed;
                this.y += (dy / dist) * this.moveSpeed;
            }
 
            return;
        }
 
        if (this.state === "aiming") {
 
            this.blinkTimer++;
            this.aimTimer--;
 
            if (this.aimTimer <= 0) {
 
                this.fireProjectile();
                this.state = "fired";
            }
 
            return;
        }
 
        if (this.state === "fired") {
 
            // Atualiza o projétil
            if (this.projectile && !this.projectile.isDead) {
 
                this.projectile.update(this.targetPlayer);
 
            } else {
 
                // Projétil sumiu (acertou ou saiu da tela)
                this.state = "leaving";
            }
 
            this.leaveTimer--;
 
            if (this.leaveTimer <= 0) {
 
                this.state = "leaving";
            }
 
            return;
        }
 
if (this.state === "leaving") {

            if (!this.returnPhase) {
                this.returnPhase = "dip";
                this.dipTimer = 30;
            }

            // Fase 1 — leve abaixada
            if (this.returnPhase === "dip") {

                this.y += 2.5;
                this.dipTimer--;

                if (this.dipTimer <= 0) {
                    this.returnPhase = "return";
                }

                return;
            }

            // Fase 2 — voa de volta para o portal
            if (this.returnPhase === "return") {

                const dx = this.portalX - this.x;
                const dy = this.portalY - this.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < this.moveSpeed + 2) {

                    this.isDead = true;

                } else {

                    this.x += (dx / dist) * (this.moveSpeed + 2);
                    this.y += (dy / dist) * (this.moveSpeed + 2);
                }
            }
        }
    }
 
    fireProjectile() {
 
        const player = this.targetPlayer;
 
const facingRight =
            player.x > this.x + this.width / 2;

        const directionX = facingRight ? 1 : -1;

        // Tiro sai da ponta dos canhões
        const projStartX = facingRight
            ? this.x + this.width + 10
            : this.x - 10;

        const projStartY = this.y + this.height / 2;

        this.projectile = new ClassicShipProjectile(
            projStartX,
            projStartY,
            directionX
        );
 
        // Adiciona o projétil à lista de enemies para ser desenhado
        if (Game.phase) {
            Game.phase.enemies.push(this.projectile);
        }
 
        console.log("NAVE ATIROU", directionX > 0 ? "→" : "←");
 
    }
 
   draw(ctx) {

        ctx.save();

        if (
            this.state === "aiming" &&
            Math.floor(this.blinkTimer / 6) % 2 === 0
        ) {
            ctx.globalAlpha = 0.4;
        }

        const cx = this.x + this.width / 2;
        const cy = this.y + this.height / 2;

        const facingRight = this.state === "leaving"
            ? this.portalX > cx
            : this.targetPlayer.x > cx;
        ctx.save();
        ctx.translate(cx, cy);

        if (!facingRight) {
            ctx.scale(-1, 1);
        }

        const s = 1.4;

        // ==========================================
        // MOTOR — chama azul pulsando
        // ==========================================
        const enginePulse =
            0.6 + 0.4 * Math.sin(Date.now() * 0.01);

        ctx.shadowColor = "#4488FF";
        ctx.shadowBlur  = 10 * enginePulse;

        // Chama externa
        ctx.fillStyle =
            `rgba(50, 100, 255, ${0.5 + 0.3 * enginePulse})`;
        ctx.beginPath();
        ctx.moveTo(-28 * s,  3 * s);
        ctx.lineTo(-38 * s,  0);
        ctx.lineTo(-28 * s, -3 * s);
        ctx.closePath();
        ctx.fill();

        // Chama interna branca
        ctx.fillStyle =
            `rgba(200, 220, 255, ${0.6 + 0.3 * enginePulse})`;
        ctx.beginPath();
        ctx.moveTo(-28 * s,  1.5 * s);
        ctx.lineTo(-33 * s,  0);
        ctx.lineTo(-28 * s, -1.5 * s);
        ctx.closePath();
        ctx.fill();

        ctx.shadowBlur = 0;

        // ==========================================
        // CORPO TRASEIRO — cinza azulado
        // ==========================================
        ctx.fillStyle = "#8899BB";
        ctx.beginPath();
        ctx.moveTo(-28 * s,  5 * s);
        ctx.lineTo( -8 * s,  5 * s);
        ctx.lineTo( -8 * s, -5 * s);
        ctx.lineTo(-28 * s, -5 * s);
        ctx.closePath();
        ctx.fill();

        // ==========================================
        // FUSELAGEM PRINCIPAL — branco
        // ==========================================
        ctx.fillStyle = "#EEEEFF";
        ctx.beginPath();
        ctx.moveTo(-10 * s,  5 * s);
        ctx.lineTo( 22 * s,  5 * s);
        ctx.lineTo( 32 * s,  0);
        ctx.lineTo( 22 * s, -5 * s);
        ctx.lineTo(-10 * s, -5 * s);
        ctx.closePath();
        ctx.fill();

        // Linha central decorativa — azul escuro
        ctx.fillStyle = "#2244AA";
        ctx.fillRect(-10 * s, -1 * s, 32 * s, 2 * s);

        // ==========================================
        // NARIZ — branco brilhante
        // ==========================================
        ctx.fillStyle = "#FFFFFF";
        ctx.beginPath();
        ctx.moveTo(28 * s,  3 * s);
        ctx.lineTo(40 * s,  0);
        ctx.lineTo(28 * s, -3 * s);
        ctx.closePath();
        ctx.fill();

        // ==========================================
        // ASA SUPERIOR — azul royal
        // ==========================================
        // Base da asa
        ctx.fillStyle = "#2244CC";
        ctx.beginPath();
        ctx.moveTo(-10 * s, -5 * s);
        ctx.lineTo(  6 * s, -5 * s);
        ctx.lineTo(  2 * s, -16 * s);
        ctx.lineTo(-14 * s, -16 * s);
        ctx.closePath();
        ctx.fill();

        // Detalhe claro da asa
        ctx.fillStyle = "#4466EE";
        ctx.beginPath();
        ctx.moveTo( -8 * s, -6 * s);
        ctx.lineTo(  4 * s, -6 * s);
        ctx.lineTo(  1 * s, -14 * s);
        ctx.lineTo(-11 * s, -14 * s);
        ctx.closePath();
        ctx.fill();

        // Ponta da asa — branca
        ctx.fillStyle = "#CCDDFF";
        ctx.beginPath();
        ctx.moveTo( -1 * s, -13 * s);
        ctx.lineTo(  2 * s, -16 * s);
        ctx.lineTo(-14 * s, -16 * s);
        ctx.lineTo(-12 * s, -13 * s);
        ctx.closePath();
        ctx.fill();

        // ==========================================
        // ASA INFERIOR — azul royal (espelho)
        // ==========================================
        ctx.fillStyle = "#2244CC";
        ctx.beginPath();
        ctx.moveTo(-10 * s,  5 * s);
        ctx.lineTo(  6 * s,  5 * s);
        ctx.lineTo(  2 * s,  16 * s);
        ctx.lineTo(-14 * s,  16 * s);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = "#4466EE";
        ctx.beginPath();
        ctx.moveTo( -8 * s,  6 * s);
        ctx.lineTo(  4 * s,  6 * s);
        ctx.lineTo(  1 * s,  14 * s);
        ctx.lineTo(-11 * s,  14 * s);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = "#CCDDFF";
        ctx.beginPath();
        ctx.moveTo( -1 * s,  13 * s);
        ctx.lineTo(  2 * s,  16 * s);
        ctx.lineTo(-14 * s,  16 * s);
        ctx.lineTo(-12 * s,  13 * s);
        ctx.closePath();
        ctx.fill();

        // ==========================================
        // NACELAS DOURADAS — asa superior e inferior
        // ==========================================

        // Nacela superior
        ctx.fillStyle = "#AA8800";
        ctx.beginPath();
        ctx.ellipse(
            -4 * s, -10 * s,
            5 * s, 2.5 * s,
            0, 0, Math.PI * 2
        );
        ctx.fill();

        // Brilho nacela superior
        ctx.fillStyle = "rgba(255, 220, 50, 0.6)";
        ctx.beginPath();
        ctx.ellipse(
            -5 * s, -11 * s,
            3 * s, 1.2 * s,
            0, 0, Math.PI * 2
        );
        ctx.fill();

        // Nacela inferior
        ctx.fillStyle = "#AA8800";
        ctx.beginPath();
        ctx.ellipse(
            -4 * s, 10 * s,
            5 * s, 2.5 * s,
            0, 0, Math.PI * 2
        );
        ctx.fill();

        // Brilho nacela inferior
        ctx.fillStyle = "rgba(255, 220, 50, 0.6)";
        ctx.beginPath();
        ctx.ellipse(
            -5 * s, 9 * s,
            3 * s, 1.2 * s,
            0, 0, Math.PI * 2
        );
        ctx.fill();


        // ==========================================
        // COCKPIT — dourado/âmbar como no original
        // ==========================================
        ctx.fillStyle = "#AA8800";
        ctx.beginPath();
        ctx.ellipse(
            6 * s, 0,
            9 * s, 4 * s,
            0, 0, Math.PI * 2
        );
        ctx.fill();

        // Brilho dourado
        ctx.fillStyle = "rgba(255, 220, 50, 0.7)";
        ctx.beginPath();
        ctx.ellipse(
            5 * s, -1.5 * s,
            5 * s, 2 * s,
            0, 0, Math.PI * 2
        );
        ctx.fill();

        // Reflexo claro
        ctx.fillStyle = "rgba(255, 255, 180, 0.4)";
        ctx.beginPath();
        ctx.ellipse(
            4 * s, -2 * s,
            2.5 * s, 1 * s,
            0, 0, Math.PI * 2
        );
        ctx.fill();

        // Brilho superior do cockpit
        ctx.fillStyle = "rgba(100, 160, 255, 0.8)";
        ctx.beginPath();
        ctx.ellipse(
            5 * s, -1.5 * s,
            5 * s, 2 * s,
            0, 0, Math.PI * 2
        );
        ctx.fill();

        // Reflexo branco
        ctx.fillStyle = "rgba(255,255,255,0.4)";
        ctx.beginPath();
        ctx.ellipse(
            4 * s, -2 * s,
            2.5 * s, 1 * s,
            0, 0, Math.PI * 2
        );
        ctx.fill();

        // ==========================================
        // CANHÃO DUPLO — cinza claro
        // ==========================================

        // Canhão superior
        ctx.fillStyle = "#AABBCC";
        ctx.beginPath();
        ctx.moveTo(14 * s, -4 * s);
        ctx.lineTo(38 * s, -3 * s);
        ctx.lineTo(38 * s, -5.5 * s);
        ctx.lineTo(14 * s, -6 * s);
        ctx.closePath();
        ctx.fill();

        // Canhão inferior
        ctx.beginPath();
        ctx.moveTo(14 * s,  4 * s);
        ctx.lineTo(38 * s,  3 * s);
        ctx.lineTo(38 * s,  5.5 * s);
        ctx.lineTo(14 * s,  6 * s);
        ctx.closePath();
        ctx.fill();

        // Ponta dos canhões — branca
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(36 * s, -6 * s, 4 * s, 3 * s);
        ctx.fillRect(36 * s,  3 * s, 4 * s, 3 * s);

        // ==========================================
        // INDICADOR DE MIRA — vermelho piscando
        // ==========================================
        if (this.state === "aiming") {

            const pulse =
                0.5 + 0.5 * Math.sin(this.blinkTimer * 0.25);

            ctx.shadowColor = "#FF2200";
            ctx.shadowBlur  = 14 * pulse;
            ctx.fillStyle   =
                `rgba(255, 50, 50, ${0.7 + 0.3 * pulse})`;

            ctx.beginPath();
            ctx.arc(38 * s, -4.5 * s, 2.5, 0, Math.PI * 2);
            ctx.fill();

            ctx.beginPath();
            ctx.arc(38 * s,  4.5 * s, 2.5, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.restore();
        ctx.restore();
    }
}

class ClassicPacMan {
 
    constructor(x, y, portalX, portalY) {
 
        this.x = x;
        this.y = y;
 
        this.width  = 48;
        this.height = 48;
 
        this.isDead = false;
 
        // Portal de origem para retorno
        this.portalX = portalX + 48;
        this.portalY = portalY - 86;
 
        // Velocidade de travessia
        this.speed = 5;
 
        // Direção inicial — sai do portal para o lado oposto
        // Se portal está à direita, vai para esquerda e vice-versa
        this.direction = portalX > 400 ? -1 : 1;
 
        // Contagem de travessias (vai = 1, volta = 2)
        this.passCount = 0;
 
        // Limite das paredes
        this.leftLimit  = 10;
        this.rightLimit = 790;
 
        // Estado
        // "running"  → atravessando a arena
        // "returning" → voltando para o portal
        this.state = "running";
 
        // Animação da boca
        this.mouthAngle = 0;
        this.mouthDir   = 1;
 
        // Dano por toque
        this.damage = 18;
 
        // Controle de multihit — evita dano em todos os frames
        this.hitCooldown = 0;

        // Descida inicial antes de correr
        this.dropPhase = true;
        this.dropTarget = Game.player.y - this.height -20;
    }
 
    update(player) {
 
        // Animação da boca
        this.mouthAngle += 0.15 * this.mouthDir;
        if (this.mouthAngle > 0.4) this.mouthDir = -1;
        if (this.mouthAngle < 0.0) this.mouthDir =  1;
 
        // Cooldown de dano
        if (this.hitCooldown > 0) {
            this.hitCooldown--;
        }

        // Fase de descida inicial
        if (this.dropPhase) {

            const dy = this.dropTarget - this.y;

            if (Math.abs(dy) < 3) {

                this.y = this.dropTarget;
                this.dropPhase = false;

            } else {

                this.y += dy * 0.08;
            }

            return;
        }
 
        if (this.state === "running") {
 
            this.x += this.speed * this.direction;
 
            // Chegou na parede oposta ou no portal
            const reachedRight = this.direction > 0 && this.x >= this.rightLimit;
            const reachedLeft  = this.direction < 0 && this.x <= this.leftLimit;

            // Chegou perto do portal (na volta)
            const nearPortal =
                this.passCount % 2 === 1 &&
                Math.abs(this.x - this.portalX) < 20;
 
            if (reachedRight || reachedLeft || nearPortal) {
 
                this.passCount++;
 
                if (this.passCount >= 4) {
 
                    // Segunda travessia completa — volta para o portal
                    this.state = "returning";
 
                } else {
 
                    // Primeira travessia — inverte direção
                    this.direction *= -1;
                }
            }
 
            // Colisão com o player
            this.checkHit(player);
 
            return;
        }
 
        if (this.state === "returning") {
 
            // Voa de volta para o portal
            const dx = this.portalX - this.x;
            const dy = this.portalY - this.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
 
            if (dist < this.speed + 2) {
 
                this.isDead = true;
 
                if (Game.phase && Game.phase.boss) {
                    Game.phase.boss.classicPlayerEscaped = true;
                }
 
            } else {
 
                this.x += (dx / dist) * (this.speed + 2);
                this.y += (dy / dist) * (this.speed + 2);
            }
        }
    }
 
    checkHit(player) {
 
        if (this.hitCooldown > 0) return;
 
        // Colisão simples
        const hit =
            this.x < player.x + player.width  &&
            this.x + this.width > player.x    &&
            this.y < player.y + player.height  &&
            this.y + this.height > player.y - 100;
 
        if (hit) {
 
            // Player está no ar (pulando) — escapou!
            if (!player.onGround) {
 
                console.log("PLAYER PULOU O PAC-MAN");
 
                // Feedback visual
                showCombatQuote(
                    "Boa esquiva!",
                    player.x + player.width / 2,
                    player.y - 80
                );
 
                this.hitCooldown = 60;
 
                return;
            }
 
            // Player no chão — toma dano
            console.log("PAC-MAN ACERTOU");
 
            player.takeDamage(this.damage);
 
            showCombatQuote(
                "Wakka wakka!",
                Game.phase.boss.x + Game.phase.boss.width / 2,
                Game.phase.boss.y,
                Game.phase.boss
            );
 
            if (Game.phase && Game.phase.boss) {
                Game.phase.boss.classicAttackSuccess = true;
            }
 
            // Cooldown para não aplicar dano em todos os frames
            this.hitCooldown = 90;
        }
    }
 
   draw(ctx) {

        ctx.save();

        const cx = this.x + this.width / 2;
        const cy = this.y + this.height / 2;
        const r  = this.width / 2;

        const facingRight = this.direction > 0 ||
            (this.state === "returning" && this.portalX > cx);

        const mouthOpen = this.mouthAngle;

        const startAngle = facingRight
            ? mouthOpen
            : Math.PI + mouthOpen;

        const endAngle = facingRight
            ? Math.PI * 2 - mouthOpen
            : Math.PI - mouthOpen;

        // ==========================================
        // SOMBRA PROJETADA NO CHÃO
        // ==========================================
        ctx.fillStyle = "rgba(0, 0, 0, 0.18)";
        ctx.beginPath();
        ctx.ellipse(cx, cy + r + 6, r * 0.7, r * 0.18, 0, 0, Math.PI * 2);
        ctx.fill();

        // ==========================================
        // BRILHO EXTERNO — aura amarela
        // ==========================================
        ctx.shadowColor = "#FFD700";
        ctx.shadowBlur  = 18;

        // ==========================================
        // CORPO BASE — amarelo dourado
        // ==========================================
        ctx.fillStyle = "#FFD700";
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, r, startAngle, endAngle);
        ctx.closePath();
        ctx.fill();

        ctx.shadowBlur = 0;

        // ==========================================
        // GRADIENTE RADIAL — volume 3D
        // ==========================================
        const grad = ctx.createRadialGradient(
            cx - r * 0.3, cy - r * 0.3, r * 0.05,
            cx, cy, r
        );
        grad.addColorStop(0,   "rgba(255, 255, 180, 0.85)");
        grad.addColorStop(0.5, "rgba(255, 210, 0,   0.3)");
        grad.addColorStop(1,   "rgba(180, 120, 0,   0.5)");

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, r, startAngle, endAngle);
        ctx.closePath();
        ctx.fill();

        // ==========================================
        // CONTORNO — laranja escuro
        // ==========================================
        ctx.strokeStyle = "#CC8800";
        ctx.lineWidth   = 2.5;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, r, startAngle, endAngle);
        ctx.closePath();
        ctx.stroke();

        // ==========================================
        // LINHAS DA BOCA — detalhe interno
        // ==========================================
        if (mouthOpen > 0.05) {

            ctx.strokeStyle = "rgba(180, 100, 0, 0.5)";
            ctx.lineWidth   = 1.5;

            // Linha superior da boca
            ctx.beginPath();
            ctx.moveTo(cx, cy);
            const upperX = cx + Math.cos(startAngle) * r * 0.9;
            const upperY = cy + Math.sin(startAngle) * r * 0.9;
            ctx.lineTo(upperX, upperY);
            ctx.stroke();

            // Linha inferior da boca
            ctx.beginPath();
            ctx.moveTo(cx, cy);
            const lowerX = cx + Math.cos(endAngle) * r * 0.9;
            const lowerY = cy + Math.sin(endAngle) * r * 0.9;
            ctx.lineTo(lowerX, lowerY);
            ctx.stroke();
        }

        // ==========================================
        // OLHO — detalhado
        // ==========================================
        const eyeOffsetX = facingRight ?  r * 0.15 : -r * 0.15;
        const eyeOffsetY = -r * 0.38;

        // Esclera branca
        ctx.fillStyle = "#FFFFFF";
        ctx.beginPath();
        ctx.ellipse(
            cx + eyeOffsetX,
            cy + eyeOffsetY,
            r * 0.22, r * 0.26,
            0, 0, Math.PI * 2
        );
        ctx.fill();

        // Íris escura
        ctx.fillStyle = "#1A1A1A";
        ctx.beginPath();
        ctx.ellipse(
            cx + eyeOffsetX + (facingRight ? 1.5 : -1.5),
            cy + eyeOffsetY + 1,
            r * 0.13, r * 0.16,
            0, 0, Math.PI * 2
        );
        ctx.fill();

        // Reflexo branco no olho
        ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
        ctx.beginPath();
        ctx.ellipse(
            cx + eyeOffsetX + (facingRight ? 2 : -2),
            cy + eyeOffsetY - 1.5,
            r * 0.055, r * 0.07,
            0, 0, Math.PI * 2
        );
        ctx.fill();

        // ==========================================
        // BRILHO SUPERIOR — realce 3D
        // ==========================================
        const shineGrad = ctx.createRadialGradient(
            cx - r * 0.25, cy - r * 0.3, 0,
            cx - r * 0.25, cy - r * 0.3, r * 0.55
        );
        shineGrad.addColorStop(0,   "rgba(255, 255, 220, 0.55)");
        shineGrad.addColorStop(0.6, "rgba(255, 255, 180, 0.15)");
        shineGrad.addColorStop(1,   "rgba(255, 255, 150, 0)");

        ctx.fillStyle = shineGrad;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, r, startAngle, endAngle);
        ctx.closePath();
        ctx.fill();

        // ==========================================
        // REFLEXO PEQUENO — brilhinho extra
        // ==========================================
        ctx.fillStyle = "rgba(255, 255, 255, 0.35)";
        ctx.beginPath();
        ctx.ellipse(
            cx - r * 0.38,
            cy - r * 0.42,
            r * 0.18, r * 0.10,
            -0.5, 0, Math.PI * 2
        );
        ctx.fill();

        ctx.restore();
    }
}

window.spawnClassicGhost = function(boss) {

    if (!window.Game) return;

    if (!Game.phase) return;

    const portalOffset = 90;

const portalX = boss.facingRight
        ? boss.x + boss.width + 40
        : boss.x - portalOffset - 40;

    const portalY =
        boss.y + 5;

const portal = new ClassicPortal(
        portalX,
        portalY,
        "ghost"
    );

    Game.phase.enemies.push(
        portal
    );

setTimeout(() => {

        if (!Game.phase || !Game.phase.boss) return;
        if (Game.phase.boss.classicType !== "ghost") return;

        const arenaCenter = boss.canvasWidth / 2;

        const spawnSide =
            portalX < arenaCenter
                ? "left"
                : "right";

        const ghost = new ClassicGhost(
            portalX,
            portalY - 100,
            spawnSide
        );

        Game.phase.enemies.push(ghost);
        Game.phase.boss.classicGhost = ghost;

    }, 1000);


};

window.spawnClassicShip = function(boss) {
 
    if (!window.Game) return;
    if (!Game.phase)  return;
 
    const player = Game.player;
 
    const portalOffset = 90;
 
const portalX = boss.facingRight
        ? boss.x + boss.width + 40
        : boss.x - portalOffset - 40;
 
    const portalY = boss.y + 5;
 
    // Portal visual (reutiliza ClassicPortal já existente)
    const portal = new ClassicPortal(portalX, portalY, "ship");
    Game.phase.enemies.push(portal);
 
    // Nave aparece 1s depois do portal
setTimeout(() => {

        if (!Game.phase || !Game.phase.boss) return;
        if (Game.phase.boss.classicType !== "ship") return;

        const ship = new ClassicShip(
            portalX,
            portalY - 100,
            player,
            portalX,
            portalY
        );

        Game.phase.enemies.push(ship);
        portal.linkedEntity = ship;
        Game.phase.boss.classicShip = ship;

    }, 1000);
};

window.spawnClassicPacMan = function(boss) {
 
    if (!window.Game) return;
    if (!Game.phase)  return;
 
    const portalOffset = 90;
 
const portalX = boss.facingRight
        ? boss.x + boss.width + 40
        : boss.x - portalOffset - 40;
 
    const portalY = boss.y + 5;
 
    // Portal visual
    const portal = new ClassicPortal(portalX, portalY, "pacman");
    Game.phase.enemies.push(portal);
 
    // Pac-Man aparece 1s depois
setTimeout(() => {

        if (!Game.phase || !Game.phase.boss) return;
        if (Game.phase.boss.classicType !== "pacman") return;

        const pacman = new ClassicPacMan(
            portalX,
            portalY - 100,
            portalX,
            portalY
        );

        Game.phase.enemies.push(pacman);
        portal.linkedEntity = pacman;
        Game.phase.boss.classicPacMan = pacman;

    }, 1000);
};

