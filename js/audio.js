// ===================================================
// UNICEFIGHT - Sistema de Áudio
// Arquivo: js/audio.js
// ===================================================
// RESPONSABILIDADES:
// ✔ Carregar sons
// ✔ Tocar efeitos
// ✔ Música de fundo
// ✔ Controle de volume
// ✔ Mute global
// ✔ Loop automático
// ✔ Preparado para múltiplas fases
// ✔ Preparado para múltiplas músicas
// ✔ Preparado para sons posicionais
// ===================================================

class AudioManagerClass {

  constructor() {

    // =========================================
    // SONS
    // =========================================
    this.sounds = {};

    // =========================================
    // MÚSICA ATUAL
    // =========================================
    this.currentMusic = null;

    // =========================================
    // CONFIGURAÇÕES
    // =========================================
    this.masterVolume = 1;

    this.soundVolume = 1;

    this.musicVolume = 0.6;

    this.isMuted = false;

    // =========================================
    // CONTROLE
    // =========================================
    this.initialized = false;
  }

  // ===================================================
  // INICIALIZAR
  // ===================================================
  init() {

    if (this.initialized) return;

    this.initialized = true;

    console.log('[AudioManager] inicializado');
  }

  // ===================================================
  // CARREGAR SOM
  // ===================================================
  loadSound(name, path, options = {}) {

    const audio = new Audio(path);

    audio.preload = 'auto';

    audio.volume =
      (options.volume ?? 1)
      * this.soundVolume
      * this.masterVolume;

    audio.loop = options.loop || false;

    this.sounds[name] = {

      audio,

      path,

      baseVolume: options.volume ?? 1,

      loop: options.loop || false
    };

    console.log(
      `[Audio] carregado: ${name}`
    );
  }

  // ===================================================
  // TOCAR SOM
  // ===================================================
  play(name) {

    if (this.isMuted) return;

    const soundData = this.sounds[name];

    if (!soundData) {

      console.warn(
        `[Audio] som não encontrado: ${name}`
      );

      return;
    }

    // =========================================
    // CLONA PARA EVITAR CORTAR SOM
    // =========================================
    const sound =
      soundData.audio.cloneNode();

    sound.volume =
      soundData.baseVolume
      * this.soundVolume
      * this.masterVolume;

    sound.play();
  }

  // ===================================================
  // TOCAR SOM EM LOOP
  // ===================================================
  playLoop(name) {

    if (this.isMuted) return;

    const soundData = this.sounds[name];

    if (!soundData) return;

    soundData.audio.loop = true;

    soundData.audio.currentTime = 0;

    soundData.audio.volume =
      soundData.baseVolume
      * this.soundVolume
      * this.masterVolume;

    soundData.audio.play();
  }

  // ===================================================
  // PARAR SOM
  // ===================================================
  stop(name) {

    const soundData = this.sounds[name];

    if (!soundData) return;

    soundData.audio.pause();

    soundData.audio.currentTime = 0;
  }

  // ===================================================
  // TOCAR MÚSICA
  // ===================================================
  playMusic(name) {

    if (this.isMuted) return;

    const soundData = this.sounds[name];

    if (!soundData) {

      console.warn(
        `[Audio] música não encontrada: ${name}`
      );

      return;
    }

    // =========================================
    // PARA MÚSICA ATUAL
    // =========================================
    if (this.currentMusic) {

      this.currentMusic.pause();

      this.currentMusic.currentTime = 0;
    }

    this.currentMusic = soundData.audio;

    this.currentMusic.loop = true;

    this.currentMusic.volume =
      soundData.baseVolume
      * this.musicVolume
      * this.masterVolume;

    this.currentMusic.currentTime = 0;

    this.currentMusic.play();
  }

  // ===================================================
  // PARAR MÚSICA
  // ===================================================
  stopMusic() {

    if (!this.currentMusic) return;

    this.currentMusic.pause();

    this.currentMusic.currentTime = 0;

    this.currentMusic = null;
  }

  // ===================================================
  // PAUSAR MÚSICA
  // ===================================================
  pauseMusic() {

    if (!this.currentMusic) return;

    this.currentMusic.pause();
  }

  // ===================================================
  // RETOMAR MÚSICA
  // ===================================================
  resumeMusic() {

    if (!this.currentMusic) return;

    this.currentMusic.play();
  }

  // ===================================================
  // MUTE GLOBAL
  // ===================================================
  mute() {

    this.isMuted = true;

    if (this.currentMusic) {

      this.currentMusic.pause();
    }
  }

  // ===================================================
  // DESMUTE
  // ===================================================
  unmute() {

    this.isMuted = false;

    if (this.currentMusic) {

      this.currentMusic.play();
    }
  }

  // ===================================================
  // TOGGLE MUTE
  // ===================================================
  toggleMute() {

    if (this.isMuted) {

      this.unmute();

    } else {

      this.mute();
    }
  }

  // ===================================================
  // VOLUME MASTER
  // ===================================================
  setMasterVolume(volume) {

    this.masterVolume =
      Math.max(0, Math.min(1, volume));

    this.updateVolumes();
  }

  // ===================================================
  // VOLUME FX
  // ===================================================
  setSoundVolume(volume) {

    this.soundVolume =
      Math.max(0, Math.min(1, volume));

    this.updateVolumes();
  }

  // ===================================================
  // VOLUME MUSIC
  // ===================================================
  setMusicVolume(volume) {

    this.musicVolume =
      Math.max(0, Math.min(1, volume));

    this.updateVolumes();
  }

  // ===================================================
  // ATUALIZAR VOLUMES
  // ===================================================
  updateVolumes() {

    for (const key in this.sounds) {

      const soundData = this.sounds[key];

      const isMusic =
        soundData.audio === this.currentMusic;

      const volumeType =
        isMusic
          ? this.musicVolume
          : this.soundVolume;

      soundData.audio.volume =
        soundData.baseVolume
        * volumeType
        * this.masterVolume;
    }
  }
}

// ===================================================
// INSTÂNCIA GLOBAL
// ===================================================
const AudioManager =
  new AudioManagerClass(

    
  );

// ===================================================
// AUTO INIT
// ===================================================
window.addEventListener(
  'click',
  () => {

    AudioManager.init();

    // Destrava o áudio em todos os sons carregados
    for (const key in AudioManager.sounds) {
      const audio = AudioManager.sounds[key].audio;
      audio.play().then(() => {
        audio.pause();
        audio.currentTime = 0;
      }).catch(() => {});
    }

  },
  { once: true }
);

// ===================================================
// EXEMPLOS FUTUROS
// ===================================================


// -----------------------------------------------
// CARREGAR
// -----------------------------------------------
// ===================================================
// CARREGAR SONS DO JOGO
// ===================================================
AudioManager.loadSound('punch', 'assets/audio/punch.wav');
AudioManager.loadSound('kick', 'assets/audio/kick.wav');
AudioManager.loadSound('start', 'assets/audio/start.wav');
AudioManager.loadSound('victory', 'assets/audio/victory.wav');
AudioManager.loadSound('defeat', 'assets/audio/defeat.wav');
// -----------------------------------------------
// TOCAR
// -----------------------------------------------


// -----------------------------------------------
// PARAR
// -----------------------------------------------
AudioManager.stopMusic();

// -----------------------------------------------
// MUTE
// -----------------------------------------------
AudioManager.toggleMute();

