// ===================================================
// UNICEFIGHT - Sistema de Save
// Arquivo: js/saveSystem.js
// ===================================================
// Responsável por persistir e recuperar o progresso
// do jogador usando localStorage.
// ===================================================

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

window.SaveSystem = SaveSystem;