// ===================================================
// UNICEFIGHT - Controles do Teclado
// Arquivo: js/controls.js
// ===================================================
// Este arquivo é responsável por capturar todas as
// entradas do teclado e disponibilizá-las para o jogo.
// Para adicionar novos controles, basta incluir novas
// propriedades no objeto 'keys' e mapear as teclas.
// ===================================================

// Objeto global que armazena o estado atual de cada tecla
// true = tecla pressionada, false = tecla solta
const keys = {
  // Movimento
  left: false,     // Seta Esquerda ou A
  right: false,    // Seta Direita ou D
  up: false,       // Seta Cima, W ou Espaço (pulo)
  down: false,     // Seta Baixo ou S (agachar)

  // Ações de combate
  attack: false,   // J = Soco
  kick: false,     // K = Chute
  defend: false,   // L = Defesa

  // Sistema
  pause: false,    // P ou Escape = Pausar
  confirm: false,  // Enter = Confirmar / Avançar diálogo
  back: false,     // Backspace = Voltar menu

  // ===== COMO ADICIONAR NOVOS CONTROLES =====
  // 1. Adicione a propriedade aqui: novaAcao: false
  // 2. Mapeie a tecla no switch-case abaixo em keydown
  // 3. Use a tecla no arquivo player.js ou onde precisar
  // Ex: specialAttack: false (ataque especial)
};

// -----------------------------------------------
// EVENTO: Tecla Pressionada (keydown)
// -----------------------------------------------
document.addEventListener('keydown', (e) => {
  switch (e.code) {
    // --- Movimento ---
    case 'ArrowLeft':
    case 'KeyA':
      keys.left = true;
      break;

    case 'ArrowRight':
    case 'KeyD':
      keys.right = true;
      break;

    case 'ArrowUp':
    case 'KeyW':
    case 'Space':
      keys.up = true;
      e.preventDefault(); // Evita scroll da página com espaço
      break;

    case 'ArrowDown':
    case 'KeyS':
      keys.down = true;
      break;

    // --- Combate ---
    case 'KeyJ':
      keys.attack = true;  // Soco
      break;

    case 'KeyK':
      keys.kick = true;    // Chute
      break;

    case 'KeyL':
      keys.defend = true;  // Defesa
      break;

    // --- Sistema ---
    case 'KeyP':
    case 'Escape':
      keys.pause = true;
      break;

    case 'Enter':
      keys.confirm = true;
      break;

    case 'Backspace':
      keys.back = true;
      break;
  }
});

// -----------------------------------------------
// EVENTO: Tecla Solta (keyup)
// -----------------------------------------------
document.addEventListener('keyup', (e) => {
  switch (e.code) {
    case 'ArrowLeft':
    case 'KeyA':
      keys.left = false;
      break;

    case 'ArrowRight':
    case 'KeyD':
      keys.right = false;
      break;

    case 'ArrowUp':
    case 'KeyW':
    case 'Space':
      keys.up = false;
      break;

    case 'ArrowDown':
    case 'KeyS':
      keys.down = false;
      break;

    case 'KeyJ':
      keys.attack = false;
      break;

    case 'KeyK':
      keys.kick = false;
      break;

    case 'KeyL':
      keys.defend = false;
      break;

    case 'KeyP':
    case 'Escape':
      keys.pause = false;
      break;

    case 'Enter':
      keys.confirm = false;
      break;

    case 'Backspace':
      keys.back = false;
      break;
  }
});

// -----------------------------------------------
// FUNÇÃO AUXILIAR: Verifica se uma tecla acabou de
// ser pressionada (útil para ações únicas como pulo)
// -----------------------------------------------
// Para uso futuro: pode registrar teclas "just pressed"
// que só disparam uma vez por pressionamento
const justPressed = {};

document.addEventListener('keydown', (e) => {
  if (!justPressed[e.code]) {
    justPressed[e.code] = true;
  }
});

document.addEventListener('keyup', (e) => {
  justPressed[e.code] = false;
});

// Verifica se a tecla foi pressionada agora (uma vez)
function isJustPressed(keyCode) {
  return justPressed[keyCode] === true;
}
