// ===================================================
// UNICEFIGHT - Inimigos Comuns
// Arquivo: js/enemies.js
// ===================================================
// Este arquivo controla os inimigos que aparecem
// durante o corredor de cada fase (antes do boss).
//
// Para adicionar novos tipos de inimigos, crie novas
// classes que estendem a classe Enemy.
// ===================================================

// -----------------------------------------------
// CLASSE ENEMY - Inimigo Base
// -----------------------------------------------
class Enemy {
  constructor(x, y, type = 'padrao') {
    this.x = x;
    this.y = y;
    this.width = 40;
    this.height = 60;

    // ===== TIPOS DE INIMIGOS =====
    // Para adicionar novos tipos, basta criar novos
    // casos no switch abaixo e definir comportamento.
    this.type = type;

    // Atributos variam por tipo
    switch (type) {
      case 'mesa':
        // Mesas: obstáculo estático, causa dano ao tocar
        this.width = 80;
        this.height = 40;
        this.hp = 1;
        this.damage = 10;
        this.speed = 0;
        this.color = '#8B5E3C'; // Marrom
        this.points = 50;
        break;

      case 'computador':
        // Computadores: se movem e causam choque
        this.width = 50;
        this.height = 50;
        this.hp = 3;
        this.damage = 15;
        this.speed = 1.5;
        this.color = '#555';
        this.points = 100;
        // Movimento lateral do computador
        this.direction = 1; // 1 = direita, -1 = esquerda
        this.moveRange = 100;
        this.startX = x;
        break;

      case 'materia':
        // Matérias difíceis: inimigos que atacam à distância
        this.width = 40;
        this.height = 60;
        this.hp = 5;
        this.damage = 20;
        this.speed = 2;
        this.color = '#8B0000'; // Vermelho escuro
        this.points = 150;
        this.attackCooldown = 0;
        break;

      default:
        // Inimigo padrão (calouro problemático)
        this.hp = 3;
        this.damage = 10;
        this.speed = 1;
        this.color = '#666';
        this.points = 75;
    }

    this.maxHp = this.hp;
    this.isActive = true;   // false quando derrotado
    this.isHurt = false;
    this.hurtTimer = 0;
    this.facingRight = false; // Inimigo começa olhando para esquerda

    // ===== COMO SUBSTITUIR POR IMAGEM =====
    // const enemyImg = new Image();
    // enemyImg.src = `assets/characters/enemy_${type}.png`;
    // this.sprite = enemyImg;
  }

  // -----------------------------------------------
  // ATUALIZA o inimigo a cada frame
  // -----------------------------------------------
  update(player, canvasWidth, canvasHeight) {
    if (!this.isActive) return;

    // Timer de dano
    if (this.hurtTimer > 0) {
      this.hurtTimer--;
    } else {
      this.isHurt = false;
    }

    switch (this.type) {
      case 'computador':
        this.updateComputador(canvasWidth);
        break;
      case 'materia':
        this.updateMateria(player);
        break;
      case 'mesa':
        // Mesa não se move
        break;
      default:
        this.updatePadrao(player);
    }

    // Colisão com o chão
    if (this.y + this.height >= canvasHeight) {
      this.y = canvasHeight - this.height;
    }
  }

  // -----------------------------------------------
  // Comportamento: Computador (vai e volta)
  // -----------------------------------------------
  updateComputador(canvasWidth) {
    this.x += this.speed * this.direction;

    // Inverte direção quando sai do range ou da tela
    if (this.x > this.startX + this.moveRange || this.x < this.startX - this.moveRange) {
      this.direction *= -1;
    }
    if (this.x < 0 || this.x + this.width > canvasWidth) {
      this.direction *= -1;
    }
  }

  // -----------------------------------------------
  // Comportamento: Matéria (persegue jogador)
  // -----------------------------------------------
  updateMateria(player) {
    const dx = player.x - this.x;
    if (dx > 0) {
      this.x += this.speed;
      this.facingRight = true;
    } else {
      this.x -= this.speed;
      this.facingRight = false;
    }

    // Ataque periódico (todo 120 frames)
    if (this.attackCooldown <= 0) {
      const dist = Math.abs(player.x - this.x);
      if (dist < 60) {
        // Causa dano se suficientemente próximo
        this.attackCooldown = 120;
      }
    } else {
      this.attackCooldown--;
    }
  }

  // -----------------------------------------------
  // Comportamento: Inimigo Padrão (caminha em direção ao player)
  // -----------------------------------------------
  updatePadrao(player) {
    const dx = player.x - this.x;
    if (dx > 5) {
      this.x += this.speed;
      this.facingRight = true;
    } else if (dx < -5) {
      this.x -= this.speed;
      this.facingRight = false;
    }
  }

  // -----------------------------------------------
  // APLICA DANO ao inimigo
  // -----------------------------------------------
  takeDamage(amount) {
    if (this.isHurt) return; // Invencibilidade breve
    this.hp -= amount;
    this.isHurt = true;
    this.hurtTimer = 15;

    if (this.hp <= 0) {
      this.isActive = false;
    }
  }

  // -----------------------------------------------
  // DESENHA o inimigo na tela
  // -----------------------------------------------
  draw(ctx) {
    if (!this.isActive) return;

    // Pisca ao tomar dano
    if (this.isHurt && Math.floor(this.hurtTimer / 3) % 2 === 0) return;

    ctx.save();

    // ===== COMO SUBSTITUIR POR IMAGEM =====
    // ctx.drawImage(this.sprite, this.x, this.y, this.width, this.height);
    // ===== FIM IMAGEM =====

    // Desenho placeholder por tipo
    if (this.type === 'mesa') {
      // Mesa: retângulo marrom com pernas
      ctx.fillStyle = '#8B5E3C';
      ctx.fillRect(this.x, this.y, this.width, this.height / 2);
      // Pernas da mesa
      ctx.fillStyle = '#6B4020';
      ctx.fillRect(this.x + 5, this.y + this.height / 2, 8, this.height / 2);
      ctx.fillRect(this.x + this.width - 13, this.y + this.height / 2, 8, this.height / 2);

    } else if (this.type === 'computador') {
      // Monitor
      ctx.fillStyle = '#333';
      ctx.fillRect(this.x, this.y, this.width, this.height * 0.7);
      // Tela (chocando - cor elétrica)
      ctx.fillStyle = this.hurtTimer > 0 ? '#FF0' : '#00BFFF';
      ctx.fillRect(this.x + 5, this.y + 5, this.width - 10, this.height * 0.6);
      // Base
      ctx.fillStyle = '#555';
      ctx.fillRect(this.x + 10, this.y + this.height * 0.7, this.width - 20, this.height * 0.3);

    } else {
      // Inimigo genérico
      ctx.fillStyle = this.isHurt ? '#F55' : this.color;
      ctx.fillRect(this.x, this.y + 15, this.width, this.height - 15);
      // Cabeça
      ctx.fillStyle = '#F5C5A0';
      ctx.fillRect(this.x + 5, this.y, this.width - 10, 18);
      // Olhos raivosos
      ctx.fillStyle = '#F00';
      ctx.fillRect(this.x + 8, this.y + 6, 5, 4);
      ctx.fillRect(this.x + this.width - 13, this.y + 6, 5, 4);
    }

    // Barra de vida acima do inimigo
    this.drawHealthBar(ctx);

    ctx.restore();
  }

  // -----------------------------------------------
  // BARRA DE VIDA do inimigo
  // -----------------------------------------------
  drawHealthBar(ctx) {
    if (this.hp >= this.maxHp) return; // Só mostra se tomou dano

    const barWidth = this.width;
    const barHeight = 5;
    const barX = this.x;
    const barY = this.y - 10;
    const hpRatio = this.hp / this.maxHp;

    // Fundo (vazio)
    ctx.fillStyle = '#500';
    ctx.fillRect(barX, barY, barWidth, barHeight);

    // Vida atual
    ctx.fillStyle = hpRatio > 0.5 ? '#0F0' : hpRatio > 0.25 ? '#FF0' : '#F00';
    ctx.fillRect(barX, barY, barWidth * hpRatio, barHeight);
  }
}

// -----------------------------------------------
// FUNÇÃO: Cria lista de inimigos para uma fase
// Chamada em phases.js ao iniciar cada fase
// -----------------------------------------------
function createEnemiesForPhase(phaseNumber, canvasWidth, canvasHeight) {
  const enemies = [];
  const groundY = canvasHeight - 80; // Y do chão

  // ===== COMO ADICIONAR INIMIGOS POR FASE =====
  // Para adicionar inimigos numa fase, basta colocar
  // novos objetos Enemy na lista, com posição e tipo.

  switch (phaseNumber) {
    case 0: // Tutorial (fase da casa)
      enemies.push(new Enemy(canvasWidth * 0.5, groundY - 40, 'mesa'));
      break;

    case 1: // 1º Semestre - Lógica
      enemies.push(new Enemy(canvasWidth * 0.4, groundY - 60, 'materia'));
      enemies.push(new Enemy(canvasWidth * 0.6, groundY - 40, 'mesa'));
      enemies.push(new Enemy(canvasWidth * 0.75, groundY - 50, 'computador'));
      break;

    case 2: // 2º Semestre - Arquitetura
      enemies.push(new Enemy(canvasWidth * 0.35, groundY - 50, 'computador'));
      enemies.push(new Enemy(canvasWidth * 0.5, groundY - 40, 'mesa'));
      enemies.push(new Enemy(canvasWidth * 0.65, groundY - 60, 'materia'));
      enemies.push(new Enemy(canvasWidth * 0.8, groundY - 50, 'computador'));
      break;

    case 3: // 3º Semestre - Banco de Dados
      enemies.push(new Enemy(canvasWidth * 0.3, groundY - 60, 'materia'));
      enemies.push(new Enemy(canvasWidth * 0.45, groundY - 60, 'materia'));
      enemies.push(new Enemy(canvasWidth * 0.6, groundY - 40, 'mesa'));
      enemies.push(new Enemy(canvasWidth * 0.75, groundY - 50, 'computador'));
      break;

    case 4: // 4º Semestre - Nuvem
      enemies.push(new Enemy(canvasWidth * 0.25, groundY - 60, 'materia'));
      enemies.push(new Enemy(canvasWidth * 0.4, groundY - 50, 'computador'));
      enemies.push(new Enemy(canvasWidth * 0.55, groundY - 40, 'mesa'));
      enemies.push(new Enemy(canvasWidth * 0.7, groundY - 60, 'materia'));
      enemies.push(new Enemy(canvasWidth * 0.85, groundY - 50, 'computador'));
      break;

    case 5: // 5º Semestre - Games (fase mais difícil)
      enemies.push(new Enemy(canvasWidth * 0.2, groundY - 60, 'materia'));
      enemies.push(new Enemy(canvasWidth * 0.35, groundY - 50, 'computador'));
      enemies.push(new Enemy(canvasWidth * 0.5, groundY - 60, 'materia'));
      enemies.push(new Enemy(canvasWidth * 0.65, groundY - 40, 'mesa'));
      enemies.push(new Enemy(canvasWidth * 0.8, groundY - 50, 'computador'));
      break;
  }

  return enemies;
}

// -----------------------------------------------
// FUNÇÃO: Cria itens coletáveis para uma fase
// -----------------------------------------------
function createItemsForPhase(phaseNumber, canvasWidth, canvasHeight) {
  const items = [];
  const groundY = canvasHeight - 80;

  // Café e Energético distribuídos pelo cenário
  // ===== COMO ADICIONAR MAIS ITENS =====
  // Adicione novos objetos com tipo 'cafe' ou 'energetico'
  // e posicione conforme o layout da fase.

  items.push({
    x: canvasWidth * 0.3,
    y: groundY - 30,
    width: 24,
    height: 24,
    type: 'cafe',
    healAmount: 20
  });

  items.push({
    x: canvasWidth * 0.7,
    y: groundY - 30,
    width: 24,
    height: 24,
    type: 'energetico',
    boostAmount: 30
  });

  if (phaseNumber >= 3) {
    // Fases avançadas têm mais itens
    items.push({
      x: canvasWidth * 0.5,
      y: groundY - 30,
      width: 24,
      height: 24,
      type: 'cafe',
      healAmount: 15
    });
  }

  return items;
}

// -----------------------------------------------
// FUNÇÃO: Desenha os itens coletáveis
// -----------------------------------------------
function drawItems(ctx, items) {
  for (const item of items) {
    if (item.type === 'cafe') {
      // ===== COMO SUBSTITUIR CAFÉ POR IMAGEM =====
      // const cafeImg = new Image();
      // cafeImg.src = 'assets/ui/cafe.png';
      // ctx.drawImage(cafeImg, item.x, item.y, item.width, item.height);

      // Placeholder: xícara de café
      ctx.fillStyle = '#6B3A1F';
      ctx.fillRect(item.x, item.y + 8, item.width, item.height - 8);
      ctx.fillStyle = '#C47A3A';
      ctx.fillRect(item.x + 3, item.y + 3, item.width - 6, 10);
      // Vapor
      ctx.strokeStyle = 'rgba(255,255,255,0.7)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(item.x + 8, item.y + 3);
      ctx.quadraticCurveTo(item.x + 5, item.y - 3, item.x + 8, item.y - 8);
      ctx.stroke();

    } else if (item.type === 'energetico') {
      // ===== COMO SUBSTITUIR ENERGÉTICO POR IMAGEM =====
      // ctx.drawImage(energeticoImg, item.x, item.y, item.width, item.height);

      // Placeholder: lata de energético
      ctx.fillStyle = '#0099FF';
      ctx.fillRect(item.x + 5, item.y, item.width - 10, item.height);
      // Texto na lata
      ctx.fillStyle = '#FFF';
      ctx.font = 'bold 8px monospace';
      ctx.fillText('E+', item.x + 7, item.y + 15);
      // Raio de energia
      ctx.fillStyle = '#FFD700';
      ctx.font = 'bold 12px monospace';
      ctx.fillText('⚡', item.x + 4, item.y + item.height - 4);
    }
  }
}
