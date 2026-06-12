// ===================================================
// UNICEFIGHT - Interface do Usuário (HUD e Menus)
// Arquivo: js/ui.js
// ===================================================
// Este arquivo cuida de tudo que o usuário vê:
// - Menu principal
// - HUD (barra de vida, energia, tempo)
// - Diálogos do Mestre Misterioso
// - Tela de game over
// - Tela de vitória / diploma
// ===================================================

// -----------------------------------------------
// SISTEMA DE SAVE (localStorage)
// -----------------------------------------------
const SaveSystem = {
  // Salva o progresso do jogador
  save(data) {
    localStorage.setItem('unicefight_save', JSON.stringify(data));
    console.log('[SAVE] Progresso salvo!');
  },

  // Carrega o progresso salvo
  load() {
    const raw = localStorage.getItem('unicefight_save');
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  // Verifica se existe save
  hasSave() {
    return localStorage.getItem('unicefight_save') !== null;
  },

  // Apaga o save (novo jogo)
  clear() {
    localStorage.removeItem('unicefight_save');
  }
};

// -----------------------------------------------
// MENU PRINCIPAL
// -----------------------------------------------
const Menu = {
  // Opções do menu
  options: ['Iniciar Jogo', 'Continuar', 'Configurações', 'Créditos'],
  selectedIndex: 0,   // Opção atualmente selecionada
  visible: true,      // O menu está sendo exibido?
  confirmPressed: false, // Evita dupla leitura do Enter

  // Cor de destaque da opção selecionada
  // ===== COMO ADICIONAR OPÇÕES AO MENU =====
  // Basta adicionar uma string ao array 'options' acima
  // e tratar a ação em handleConfirm()

  // Navega para cima
  moveUp() {
    this.selectedIndex = (this.selectedIndex - 1 + this.options.length) % this.options.length;
  },

  // Navega para baixo
  moveDown() {
    this.selectedIndex = (this.selectedIndex + 1) % this.options.length;
  },

  // Retorna a opção selecionada atualmente
  getSelected() {
    return this.options[this.selectedIndex];
  },

  // -----------------------------------------------
  // DESENHA o menu na tela
  // -----------------------------------------------
  draw(ctx, canvas) {
    // ===== COMO ADICIONAR BACKGROUND DO MENU =====
    // Substitua o fundo abaixo por uma imagem:
    // const bgMenu = new Image();
    // bgMenu.src = 'assets/backgrounds/menu_bg.png';
    // ctx.drawImage(bgMenu, 0, 0, canvas.width, canvas.height);

    // Fundo degradê (placeholder para a imagem da faculdade)
const background = sprites.get("menu");

if (background) {

    ctx.drawImage(
        background,
        0,
        0,
        canvas.width,
        canvas.height
    );

}

ctx.fillStyle = "rgba(0,0,0,0.55)";
ctx.fillRect(
    0,
    0,
    canvas.width,
    canvas.height
);

ctx.shadowColor = "black";
ctx.shadowBlur = 8;
ctx.shadowOffsetX = 2;
ctx.shadowOffsetY = 2;

    // Título do jogo: UNICEFIGHT
    // ===== COMO MUDAR O TÍTULO =====
    // Troque a fonte e cor abaixo, ou use uma imagem:
    // ctx.drawImage(logoImg, x, y, width, height);
    ctx.font = 'bold 64px "Courier New", monospace';
    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'center';

    // Sombra do título
    ctx.fillStyle = 'rgba(0, 100, 200, 0.5)';
    ctx.fillText('UNICEFIGHT', canvas.width / 2 + 4, 120 + 4);

    // Texto principal
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText('UNICEFIGHT', canvas.width / 2, 120);

    // Subtítulo
    ctx.font = 'bold 15px "Courier New", monospace';
    ctx.fillStyle = 'rgba(255,255,255,0.75)';
    ctx.fillText('Centro Universitário · Semestre Final', canvas.width / 2, 148);

    // Opções do menu
    const startY = canvas.height / 2 - 40;
    const spacing = 52;

    ctx.fillStyle = "rgba(0,0,0,0.45)";

ctx.fillRect(
    canvas.width / 2 - 180,
    startY - 45,
    360,
    220
);

ctx.strokeStyle = "#00BFFF";
ctx.lineWidth = 2;

ctx.strokeRect(
    canvas.width / 2 - 180,
    startY - 45,
    360,
    220
);

    this.options.forEach((option, index) => {
      const y = startY + index * spacing;
      const isSelected = index === this.selectedIndex;

      // Caixa de destaque na opção selecionada
      if (isSelected) {
      ctx.fillStyle = 'rgba(0,180,255,0.35)';
        ctx.fillRect(canvas.width / 2 - 130, y - 26, 260, 38);
        ctx.strokeStyle = '#00BFFF';
        ctx.lineWidth = 3;
        ctx.strokeRect(canvas.width / 2 - 130, y - 26, 260, 38);
      }

      // Seta indicadora
      if (isSelected) {
        ctx.fillStyle = '#FFD700';
        ctx.font = 'bold 28px monospace';
        ctx.fillText('▶', canvas.width / 2 - 115, y + 2);
      }

      // Texto da opção
      ctx.font = isSelected
    ? 'bold 30px "Courier New", monospace'
    : 'bold 24px "Courier New", monospace';
      ctx.fillStyle = isSelected ? '#FFD700' : '#AACCEE';
      ctx.fillText(option, canvas.width / 2, y + 2);

      // Opção "Continuar" fica cinza se não há save
      if (option === 'Continuar' && !SaveSystem.hasSave()) {

      ctx.fillStyle = 'rgba(0,0,0,0.5)';

      ctx.fillRect(
        canvas.width / 2 - 130,
        y - 26,
        260,
        60
      );

      ctx.fillStyle = 'rgba(255,255,255,0.55)';

      ctx.font = 'bold 15px "Courier New", monospace';

      ctx.fillText(
        '(sem save)',
        canvas.width / 2,
        y + 28
      );
    }
    });

    // Instrução de navegação
ctx.font = 'bold 15px "Courier New", monospace';
ctx.fillStyle = 'rgba(255,255,255,0.75)';

ctx.fillText(
    '▲▼ Navegar    •    ENTER Confirmar',
    canvas.width / 2,
    canvas.height - 28
);

    ctx.textAlign = 'left';
  },

  // -----------------------------------------------
  // Tela de Créditos
  // -----------------------------------------------
  drawCredits(ctx, canvas) {
    ctx.fillStyle = '#0D1B2A';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.textAlign = 'center';
    ctx.fillStyle = '#FFD700';
    ctx.font = 'bold 32px monospace';
    ctx.fillText('CRÉDITOS', canvas.width / 2, 80);

    const lines = [
      '━━━━━━━━━━━━━━━━━━━━━',
      'Desenvolvido por:',
      'Equipe UNICEFIGHT',
      'Adryan · Artur · Eduardo · José Pedro · Pedro · Luan',
      '',
      'Professores:',
      'Pedro · Rômulo · Romes · Geovanne · Weverson',
      '',
      'Curso: Análise e Desenvolvimento de Sistemas',
      'UNICEPLAC - Centro Universitário',
      '',
      '━━━━━━━━━━━━━━━━━━━━━',
      'BACKSPACE para voltar'
    ];

    ctx.font = '16px monospace';
    ctx.fillStyle = '#AAD';
    lines.forEach((line, i) => {
      ctx.fillText(line, canvas.width / 2, 130 + i * 28);
    });

    ctx.textAlign = 'left';
  },

  // -----------------------------------------------
  // Tela de Configurações
  // -----------------------------------------------
  drawSettings(ctx, canvas) {
    ctx.fillStyle = '#0D1B2A';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.textAlign = 'center';
    ctx.fillStyle = '#FFD700';
    ctx.font = 'bold 32px monospace';
    ctx.fillText('CONFIGURAÇÕES', canvas.width / 2, 80);

    ctx.font = '16px monospace';
    ctx.fillStyle = '#AAD';
    ctx.fillText('Volume: ████████░░ 80%', canvas.width / 2, 160);
    ctx.fillText('Dificuldade: Normal', canvas.width / 2, 200);
    ctx.fillText('(Em desenvolvimento)', canvas.width / 2, 260);
    ctx.fillText('BACKSPACE para voltar', canvas.width / 2, 340);

    ctx.textAlign = 'left';
  }
};

// -----------------------------------------------
// HUD (Heads-Up Display) - Interface durante o jogo
// -----------------------------------------------
const HUD = {
  // -----------------------------------------------
  // DESENHA todo o HUD durante a fase
  // -----------------------------------------------
  draw(ctx, canvas, player, boss, timeLeft, currentPhase) {
    this.drawPlayerHP(ctx, canvas, player);
    this.drawTimer(ctx, canvas, timeLeft);
    if (boss && boss.isActive && !boss.isDefeated) {
      this.drawBossHP(ctx, canvas, boss, currentPhase);
    }
    this.drawPhaseInfo(ctx, currentPhase);
    this.drawControls(ctx, canvas);
  },

  // Barra de vida do jogador (esquerda)
  drawPlayerHP(ctx, canvas, player) {
    const x = 20;
    const y = 20;
    const barW = 180;
    const barH = 20;

    // ===== COMO ADICIONAR RETRATO DO PERSONAGEM =====
    // ctx.drawImage(playerPortrait, x - 5, y - 5, 40, 40);
    // Placeholder: quadrado colorido
    ctx.fillStyle = '#335';
    ctx.fillRect(x - 5, y - 5, 40, 40);
    ctx.fillStyle = player.gender === 'masculino' ? '#3A6BAC' : '#AC3A6B';
    ctx.fillRect(x - 3, y - 3, 36, 36);
    ctx.font = 'bold 16px monospace';
    ctx.fillStyle = '#FFF';
    ctx.fillText('P', x + 12, y + 18);

    // Rótulo
    ctx.fillStyle = '#FFF';
    ctx.font = 'bold 12px monospace';
    ctx.fillText('ALUNO(A)', x + 42, y + 5);

    // Fundo da barra de HP
    ctx.fillStyle = '#500';
    ctx.fillRect(x + 40, y + 8, barW, barH);

    // HP atual
    const hpRatio = player.hp / player.maxHp;
    const hpColor = hpRatio > 0.5 ? '#00E676' : hpRatio > 0.25 ? '#FFD600' : '#FF1744';
    ctx.fillStyle = hpColor;
    ctx.fillRect(x + 40, y + 8, barW * hpRatio, barH);

    // Borda
    ctx.strokeStyle = '#AAA';
    ctx.lineWidth = 1;
    ctx.strokeRect(x + 40, y + 8, barW, barH);

    // Texto de HP
    ctx.fillStyle = '#FFF';
    ctx.font = '11px monospace';
    ctx.fillText(`${player.hp}/${player.maxHp}`, x + 42, y + 22);

    // ===========================================
    // BARRA DE ESPECIAL
    // ===========================================
    const specialRatio =
    player.energy / player.maxEnergy;

    // Fundo
    ctx.fillStyle = '#1E1E1E';

    ctx.fillRect(
      x + 40,
      y + 32,
      barW,
      12
    );

    // Barra preenchida
    ctx.fillStyle =
      player.specialReady
        ? '#00E5FF'
        : '#2979FF';

    ctx.fillRect(
      x + 40,
      y + 32,
      barW * specialRatio,
      12
    );

    // Borda
    ctx.strokeStyle = '#CCCCCC';

    ctx.lineWidth = 1;

    ctx.strokeRect(
      x + 40,
      y + 32,
      barW,
      12
    );

    // Texto
    ctx.fillStyle = '#FFFFFF';

    ctx.font = 'bold 10px monospace';

    ctx.fillText(
    player.specialReady
      ? '100%'
      : `${Math.floor(player.energy)}%`,
      x + 44,
      y + 42
    );
  },

  // Timer central
  drawTimer(ctx, canvas, timeLeft) {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const timeStr = `${minutes}:${seconds.toString().padStart(2, '0')}`;

    ctx.textAlign = 'center';

    // Fundo do timer
    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.fillRect(canvas.width / 2 - 45, 10, 90, 32);

    // Cor muda para vermelho quando tempo está acabando
    ctx.fillStyle = timeLeft <= 30 ? '#FF1744' : '#FFD600';
    ctx.font = 'bold 28px "Courier New", monospace';
    ctx.fillText(timeStr, canvas.width / 2, 36);

    ctx.textAlign = 'left';
  },

  // Barra de vida do boss (direita)
  drawBossHP(ctx, canvas, boss, currentPhase) {

    const x = canvas.width - 240;
    const y = 20;

    const barW = 180;
    const barH = 20;

    // =========================================
    // RETRATO
    // =========================================
    ctx.fillStyle = '#533';

    ctx.fillRect(
      x + 185,
      y - 5,
      40,
      40
    );

    ctx.fillStyle = boss.color;

    ctx.fillRect(
      x + 187,
      y - 3,
      36,
      36
    );

    ctx.font = 'bold 16px monospace';

    ctx.fillStyle = '#FFF';

    ctx.fillText(
      'B',
      x + 198,
      y + 18
    );

    // =========================================
    // NOME
    // MESMO ESPAÇAMENTO DO PLAYER
    // =========================================
    ctx.fillStyle = '#FFF';

    ctx.font = 'bold 12px monospace';

    ctx.fillText(
      boss.name,
      x + 105,
      y + 5
    );

    // =========================================
    // FUNDO HP
    // =========================================
    ctx.fillStyle = '#500';

    ctx.fillRect(
      x,
      y + 8,
      barW,
      barH
    );

    // =========================================
    // VIDA
    // =========================================
    const hpRatio =
      boss.hp / boss.maxHp;

    const hpColor =
      hpRatio > 0.5
        ? '#00E676'
        : hpRatio > 0.25
          ? '#FFD600'
          : '#FF1744';

    ctx.fillStyle = hpColor;

    ctx.fillRect(
      x,
      y + 8,
      barW * hpRatio,
      barH
    );

    // =========================================
    // BORDA
    // =========================================
    ctx.strokeStyle = '#AAA';

    ctx.lineWidth = 1;

    ctx.strokeRect(
      x,
      y + 8,
      barW,
      barH
    );

    // =========================================
    // TEXTO VIDA
    // =========================================
    ctx.fillStyle = '#FFF';

    ctx.font = '11px monospace';

    ctx.fillText(
      `${boss.hp}/${boss.maxHp}`,
      x + 2,
      y + 22
    );
  },

  // Nome da fase atual (canto inferior esquerdo)
  drawPhaseInfo(ctx, currentPhase) {
    const phaseNames = [
      'Tutorial: Casa → Faculdade',
      '1º Semestre: ALGORITMOS E PROGRAMAÇÃO',
      '2º Semestre: Metodologia Ágil Scrum',
      '3º Semestre: Programação Estruturada',
      '4º Semestre: Engenharia de Requisitos',
      '5º Semestre: Programação em Games'
    ];

    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(
      canvas.width / 2 - 145,
      58,
      290,
      20
    );

    ctx.fillStyle = '#7AC';

    ctx.font = '12px monospace';

    ctx.textAlign = 'center';

    ctx.fillText(
      phaseNames[currentPhase] || '',
      canvas.width / 2,
      72
    );

    ctx.textAlign = 'left';
  },

  // Dica de controles (canto inferior)
  drawControls(ctx, canvas) {
    ctx.fillStyle = 'rgba(0,0,0,0.4)';
    ctx.fillRect(0, canvas.height - 22, canvas.width, 22);
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.font = '11px monospace';
    ctx.fillText(
      'A/D:Mover  W/Espaço:Pular  J:Soco  K:Chute  L:Defesa  P:Pausa',
      10, canvas.height - 7
    );

  if (CombatQuote.visible) {

  CombatQuote.timer--;

  if (CombatQuote.timer <= 0) {

    CombatQuote.visible = false;

  } else {

ctx.font =
  "14px Arial";

const maxWidth = 220;

const words =
  CombatQuote.text.split(" ");

const lines = [];

let currentLine = "";

for (const word of words) {

  const testLine =
    currentLine +
    word +
    " ";

  const width =
    ctx.measureText(
      testLine
    ).width;

  if (
    width > maxWidth &&
    currentLine !== ""
  ) {

    lines.push(
      currentLine
    );

    currentLine =
      word + " ";

  } else {

    currentLine =
      testLine;
  }
}

lines.push(
  currentLine
);

const lineHeight = 18;

const boxWidth =
  maxWidth + 20;

const boxHeight =
  lines.length *
  lineHeight +
  20;

let boxX =

  CombatQuote.x -

  boxWidth / 2;

if (boxX < 10) {

  boxX = 10;
}

if (

  boxX + boxWidth >

  canvas.width - 10

) {

  boxX =

    canvas.width -

    boxWidth -

    10;
}

const boxY =
  CombatQuote.y -
  80;

ctx.fillStyle =
  "rgba(0,0,0,0.8)";

ctx.fillRect(

  boxX,

  boxY,

  boxWidth,

  boxHeight
);

ctx.strokeStyle =
  "#ffffff";

ctx.strokeRect(

  boxX,

  boxY,

  boxWidth,

  boxHeight
);

ctx.fillStyle =
  "#ffffff";

for (
  let i = 0;
  i < lines.length;
  i++
) {

  ctx.fillText(

    lines[i],

    boxX + 10,

    boxY + 20 +
    i * lineHeight
  );
}
  }
}
  }
};

// ===================================================
// COMBO UI
// ===================================================
function drawComboCounter() {

  const player =
    Game.player;

  if (
    player.comboDisplayTimer <= 0
  ) {

    return;
  }

  ctx.save();

  const heavyCombo =
    player.comboHits >= 5;

  ctx.fillStyle =
    heavyCombo
      ? '#FFAA00'
      : '#FFD700';

  ctx.font =
    heavyCombo
      ? 'bold 24px monospace'
      : 'bold 20px monospace';

  ctx.textAlign =
    'center';

  // ===================================
  // POP EFFECT SUAVE
  // ===================================
  const scale =
    1 +
    Math.sin(
      performance.now() *
      0.01
    ) * 0.02;

  ctx.translate(
    GAME_WIDTH / 2,
    60
  );

  ctx.scale(scale, scale);

if (player.comboComplete) {

  ctx.fillText(

    "COMBO COMPLETO",

    0,

    0
  );
}

  ctx.restore();
}

const CombatQuote = {

  visible: false,

  text: "",

  timer: 0,

  x: 0,

  y: 0
};

function showCombatQuote(
  text,
  x,
  y
) {

  CombatQuote.visible = true;

  CombatQuote.text = text;

  CombatQuote.timer = 180;

  CombatQuote.x = x;

  CombatQuote.y = y;
}

function clearCombatQuote() {

  CombatQuote.visible = false;

  CombatQuote.text = "";

  CombatQuote.timer = 0;
}

// -----------------------------------------------
// CAIXA DE DIÁLOGO (Mestre Misterioso / Boss)
// -----------------------------------------------
const DialogBox = {
  visible: false,
  lines: [],          // Array de strings com o diálogo
  currentLine: 0,     // Linha sendo exibida
  charIndex: 0,       // Posição do efeito typewriter
  typewriterSpeed: 2, // A cada quantos frames aparece um caractere
  frameCount: 0,
  speakerName: '',    // Nome de quem está falando

  // -----------------------------------------------
  // Inicia um diálogo
  // lines: array de strings (cada string = uma fala)
  // speaker: nome do personagem que fala
  // -----------------------------------------------
  start(lines, speaker = 'Mestre Misterioso') {
    this.visible = true;
    this.lines = lines;
    this.currentLine = 0;
    this.charIndex = 0;
    this.frameCount = 0;
    this.speakerName = speaker;
  },

  // Avança para a próxima fala (chamado ao apertar Enter)
  advance() {
    // Se o typewriter não terminou, mostra tudo de uma vez
    if (this.charIndex < this.lines[this.currentLine].length) {
      this.charIndex = this.lines[this.currentLine].length;
      return;
    }

    this.currentLine++;
    this.charIndex = 0;

    if (this.currentLine >= this.lines.length) {
      this.visible = false; // Diálogo acabou
    }
  },

  // Verifica se o diálogo terminou
  isFinished() {
    return !this.visible;
  },

  // Atualiza o efeito typewriter
  update() {
    if (!this.visible) return;

    this.frameCount++;
    if (this.frameCount % this.typewriterSpeed === 0) {
      if (this.charIndex < this.lines[this.currentLine].length) {
        this.charIndex++;
      }
    }
  },

  // -----------------------------------------------
  // Desenha a caixa de diálogo
  // -----------------------------------------------
  draw(ctx, canvas) {
    if (!this.visible) return;

    const boxH = 130;
    const boxY = canvas.height - boxH - 20;
    const boxX = 20;
    const boxW = canvas.width - 40;

    // ===== COMO SUBSTITUIR A CAIXA POR UMA IMAGEM =====
    // const dialogBg = new Image();
    // dialogBg.src = 'assets/ui/dialog_box.png';
    // ctx.drawImage(dialogBg, boxX, boxY, boxW, boxH);

    // Fundo da caixa (estilo terminal)
    ctx.fillStyle = 'rgba(0, 10, 20, 0.92)';
    ctx.fillRect(boxX, boxY, boxW, boxH);
    ctx.strokeStyle = '#00BFFF';
    ctx.lineWidth = 2;
    ctx.strokeRect(boxX, boxY, boxW, boxH);

    // Canto decorativo (estilo pixel)
    ctx.fillStyle = '#00BFFF';
    ctx.fillRect(boxX, boxY, 8, 8);
    ctx.fillRect(boxX + boxW - 8, boxY, 8, 8);
    ctx.fillRect(boxX, boxY + boxH - 8, 8, 8);
    ctx.fillRect(boxX + boxW - 8, boxY + boxH - 8, 8, 8);

    // Nome do falante
    ctx.fillStyle = '#FFD700';
    ctx.font = 'bold 15px "Courier New", monospace';
    ctx.fillText(`▌ ${this.speakerName}`, boxX + 15, boxY + 22);

    // Linha separadora
    ctx.fillStyle = '#00BFFF';
    ctx.fillRect(boxX + 15, boxY + 28, boxW - 30, 1);

    // Texto com efeito typewriter
    const currentText = this.lines[this.currentLine]
      ? this.lines[this.currentLine].substring(0, this.charIndex)
      : '';

    ctx.fillStyle = '#E0E8F0';
    ctx.font = '16px "Courier New", monospace';

    // Quebra texto em linhas de ~55 caracteres
    const words = currentText.split(' ');
    let line = '';
    let lineY = boxY + 52;

    words.forEach(word => {
      const testLine = line + word + ' ';
      if (ctx.measureText(testLine).width > boxW - 40) {
        ctx.fillText(line, boxX + 20, lineY);
        line = word + ' ';
        lineY += 22;
      } else {
        line = testLine;
      }
    });
    ctx.fillText(line, boxX + 20, lineY);

    // Indicador "pressione Enter" (pisca)
    const showIndicator = Math.floor(Date.now() / 500) % 2 === 0;
    const textDone = this.charIndex >= (this.lines[this.currentLine] || '').length;

    if (showIndicator && textDone) {
      ctx.fillStyle = '#FFD700';
      ctx.font = 'bold 14px monospace';
      ctx.fillText('▼ ENTER', boxX + boxW - 90, boxY + boxH - 12);
    }

    // Contador de falas
    ctx.fillStyle = '#556';
    ctx.font = '11px monospace';
    ctx.fillText(`${this.currentLine + 1}/${this.lines.length}`, boxX + 15, boxY + boxH - 10);
  }
};

// ===================================================
// PAUSE
// ===================================================
function drawPauseScreen() {

  ctx.save();

  ctx.fillStyle =
    'rgba(0,0,0,0.6)';

  ctx.fillRect(

    0,
    0,

    GAME_WIDTH,
    GAME_HEIGHT
  );

  ctx.fillStyle = '#FFF';

  ctx.textAlign =
    'center';

  ctx.font =
    'bold 42px monospace';

  ctx.fillText(

    'PAUSADO',

    GAME_WIDTH / 2,

    GAME_HEIGHT / 2 - 20
  );

  ctx.font =
    '20px monospace';

  ctx.fillText(

    'Pressione P para continuar',

    GAME_WIDTH / 2,

    GAME_HEIGHT / 2 + 30
  );

  ctx.restore();
}



// -----------------------------------------------
// TELA DERROTA
// -----------------------------------------------
function drawGameOver(ctx, canvas) {
  // Overlay escuro
  ctx.fillStyle = 'rgba(0,0,0,0.7)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.textAlign = 'center';

  // Texto DERROTA
  ctx.fillStyle = '#FF2222';
  ctx.font = 'bold 52px monospace';
  ctx.fillText('DERROTA', canvas.width / 2, 180);

  // Subtexto
  ctx.fillStyle = '#FFF';
  ctx.font = '20px monospace';
  ctx.fillText('Você foi reprovado... por enquanto.', canvas.width / 2, canvas.height / 2 + 10);

  ctx.fillStyle = '#7AC';
  ctx.font = '16px monospace';
  ctx.fillText('ENTER = Reiniciar fase   BACKSPACE = Menu', canvas.width / 2, canvas.height / 2 + 50);

  ctx.textAlign = 'left';
}

function drawPhaseCompleteScreen() {

  ctx.save();

  ctx.fillStyle =
    'rgba(0,0,0,0.75)';

  ctx.fillRect(
    0,
    0,
    GAME_WIDTH,
    GAME_HEIGHT
  );

  ctx.fillStyle = '#FFFFFF';

  ctx.textAlign = 'center';

  ctx.font =
    'bold 36px Arial';

  ctx.fillText(

    `Parabéns!`,

    GAME_WIDTH / 2,

    180
  );

  ctx.font =
    'bold 24px Arial';

  ctx.fillText(

    `Você concluiu o ${Game.currentPhaseIndex + 1}º semestre`,

    GAME_WIDTH / 2,

    240
  );

  ctx.font =
    '20px Arial';

  ctx.fillText(

    'Pressione ENTER para continuar',

    GAME_WIDTH / 2,

    320
  );

  ctx.restore();
}

// -----------------------------------------------
// TELA DE VITÓRIA DA FASE
// -----------------------------------------------
function drawPhaseVictory(ctx, canvas, phaseNumber, score) {
  ctx.fillStyle = 'rgba(0,0,30,0.8)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.textAlign = 'center';

  ctx.fillStyle = '#00E676';
  ctx.font = 'bold 48px "Courier New", monospace';
  ctx.fillText('APROVADO!', canvas.width / 2, 150);

  ctx.fillStyle = '#FFF';
  ctx.font = '24px monospace';
  ctx.fillText(`${phaseNumber} semestre concluído`, canvas.width / 2, 220);

  ctx.fillStyle = '#00E676';
  ctx.font = 'bold 64px monospace';
  ctx.fillText(`Nota: ${nota}`, canvas.width / 2, 310);

  ctx.fillStyle = '#7AC';
  ctx.font = '18px monospace';
  ctx.fillText(`Pontuação: ${score}`, canvas.width / 2, 375);

  ctx.fillStyle = '#FFD700';
  ctx.font = '16px monospace';
  ctx.fillText('ENTER para continuar', canvas.width / 2, 430);

  ctx.textAlign = 'left';
}

// -----------------------------------------------
// TELA FINAL - Diploma e Revelação
// -----------------------------------------------
function drawFinalScreen(ctx, canvas, frameCount) {
  // Fundo solene
  const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
  grad.addColorStop(0, '#1A0A00');
  grad.addColorStop(1, '#0A1A0A');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.textAlign = 'center';

  // Título com brilho animado
  const alpha = 0.7 + 0.3 * Math.sin(frameCount * 0.05);
  ctx.fillStyle = `rgba(255, 215, 0, ${alpha})`;
  ctx.font = 'bold 36px "Courier New", monospace';
  ctx.fillText('PARABÉNS, DESENVOLVEDOR(A)!', canvas.width / 2, 100);

  // Moldura do diploma
  ctx.strokeStyle = '#C8A000';
  ctx.lineWidth = 4;
  ctx.strokeRect(canvas.width / 2 - 200, 130, 400, 200);
  ctx.fillStyle = 'rgba(200, 160, 0, 0.1)';
  ctx.fillRect(canvas.width / 2 - 200, 130, 400, 200);

  // Diploma
  ctx.fillStyle = '#FFD700';
  ctx.font = 'bold 22px "Courier New", monospace';
  ctx.fillText('DIPLOMA', canvas.width / 2, 175);

  ctx.fillStyle = '#EEE';
  ctx.font = '15px "Courier New", monospace';
  ctx.fillText('Análise e Desenvolvimento de Sistemas', canvas.width / 2, 210);
  ctx.fillText('UNICEPLAC - Centro Universitário', canvas.width / 2, 235);

  ctx.fillStyle = '#FFD700';
  ctx.font = 'bold 18px monospace';
  ctx.fillText('★ DESENVOLVEDOR(A) FORMADO(A) ★', canvas.width / 2, 275);

  ctx.fillStyle = '#888';
  ctx.font = '13px monospace';
  ctx.fillText(new Date().getFullYear(), canvas.width / 2, 310);

  // Revelação do Mestre
  ctx.fillStyle = '#00BFFF';
  ctx.font = '16px "Courier New", monospace';
  ctx.fillText('O Mestre Misterioso se revela...', canvas.width / 2, 380);
  ctx.fillText('"Eu sou você — do futuro."', canvas.width / 2, 410);
  ctx.fillText('"Continue codificando. O jogo real está começando."', canvas.width / 2, 440);

  // Professores assistindo (silhuetas)
  const professorColors = ['#2E4A1E', '#1A3A6A', '#6A3A1A', '#1A5A6A', '#4A1A6A'];
  for (let i = 0; i < 5; i++) {
    const px = canvas.width / 2 - 200 + i * 100;
    const py = canvas.height - 100;
    ctx.fillStyle = professorColors[i];
    ctx.fillRect(px + 10, py, 40, 60);
    ctx.fillStyle = '#F5C5A0';
    ctx.fillRect(px + 15, py - 22, 30, 24);
  }

  ctx.fillStyle = '#555';
  ctx.font = '12px monospace';
  ctx.fillText('Professores derrotados assistindo à formatura', canvas.width / 2, canvas.height - 105);

  ctx.fillStyle = '#FFD700';
  ctx.font = '16px monospace';
  ctx.fillText('ENTER = Jogar Novamente   BACKSPACE = Menu', canvas.width / 2, canvas.height - 30);

  ctx.textAlign = 'left';
}

// -----------------------------------------------
// TELA DE SELEÇÃO DE PERSONAGEM
// -----------------------------------------------
const CharacterSelect = {
  selectedGender: 'masculino',
  visible: false,

  draw(ctx, canvas) {
    ctx.fillStyle = '#0D1B2A';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.textAlign = 'center';
    ctx.fillStyle = '#FFD700';
    ctx.font = 'bold 28px "Courier New", monospace';
    ctx.fillText('ESCOLHA SEU PERSONAGEM', canvas.width / 2, 80);

    // ===== COMO SUBSTITUIR OS PERSONAGENS POR IMAGEM =====
    // const maleImg = new Image();
    // maleImg.src = 'assets/characters/player_masc_select.png';
    // ctx.drawImage(maleImg, x, y, width, height);
    //
    // const femImg = new Image();
    // femImg.src = 'assets/characters/player_fem_select.png';
    // ctx.drawImage(femImg, x, y, width, height);

    const isMale = this.selectedGender === 'masculino';

    // Personagem Masculino
    ctx.fillStyle = isMale ? '#00BFFF' : '#333';
    ctx.strokeStyle = isMale ? '#FFD700' : '#555';
    ctx.lineWidth = 3;
    ctx.fillRect(canvas.width / 2 - 220, 120, 140, 200);
    ctx.strokeRect(canvas.width / 2 - 220, 120, 140, 200);

    // Sprite placeholder masculino
    ctx.fillStyle = '#3A6BAC';
    ctx.fillRect(canvas.width / 2 - 200, 160, 100, 130);
    ctx.fillStyle = '#F5C5A0';
    ctx.fillRect(canvas.width / 2 - 185, 120, 70, 45);
    ctx.fillStyle = '#222';
    ctx.fillRect(canvas.width / 2 - 190, 120, 80, 18);

    ctx.fillStyle = '#FFF';
    ctx.font = '16px monospace';
    ctx.fillText('Masculino', canvas.width / 2 - 150, 345);

    // Personagem Feminino
    ctx.fillStyle = !isMale ? '#FF69B4' : '#333';
    ctx.strokeStyle = !isMale ? '#FFD700' : '#555';
    ctx.fillRect(canvas.width / 2 + 80, 120, 140, 200);
    ctx.strokeRect(canvas.width / 2 + 80, 120, 140, 200);

    // Sprite placeholder feminino
    ctx.fillStyle = '#AC3A6B';
    ctx.fillRect(canvas.width / 2 + 100, 160, 100, 130);
    ctx.fillStyle = '#F5C5A0';
    ctx.fillRect(canvas.width / 2 + 115, 120, 70, 45);
    ctx.fillStyle = '#4A2';
    ctx.fillRect(canvas.width / 2 + 110, 120, 80, 18);

    ctx.fillStyle = '#FFF';
    ctx.font = '16px monospace';
    ctx.fillText('Feminino', canvas.width / 2 + 150, 345);

    // Instrução
    ctx.fillStyle = '#7AC';
    ctx.font = '14px monospace';
    ctx.fillText('A/D ou ← → para escolher   ENTER para confirmar', canvas.width / 2, 400);

    ctx.textAlign = 'left';
  },

  toggle() {
    this.selectedGender = this.selectedGender === 'masculino' ? 'feminino' : 'masculino';
  }
};

window.showCombatQuote =
  showCombatQuote;