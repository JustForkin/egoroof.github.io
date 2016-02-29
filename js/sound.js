/* global AudioContext */

class Sound {
    constructor(config) {
        this.config = config;
        this.isSoundsMuted = false;
        this.isTerrorMode = false;
        this.context = new AudioContext();
        this.source = null;
        this.gainNode = null;
        this.gainValue = 0.2;
        this.destination = null;
        this.activeMusicName = '';
    }

    playSound(soundName) {
        if (this.isSoundsMuted) {
            return;
        }
        this.source = this.context.createBufferSource();
        this.source.buffer = this.config.sounds[soundName];
        this.destination = this.context.destination;
        this.gainNode = this.context.createGain();
        this.gainNode.gain.value = this.gainValue;

        this.source.connect(this.gainNode);
        this.gainNode.connect(this.destination);
        this.source.start(0);
    }

    playMusic(musicName) {
        this.activeMusicName = musicName;
        if (typeof this.config.music[musicName] === 'string') {
            this.loadMusic(musicName, () => this.playMusic(musicName));
        } else {
            this.pauseMusic();
            //music[musicName].currentTime = 0; firefox goes into recursion
            this.config.music[musicName].play();
        }
    }

    loadMusic(musicName, callback) {
        const path = this.config.music[musicName];
        this.config.music[musicName] = new Audio(); // todo assign to local
        this.config.music[musicName].preload = 'auto';
        this.config.music[musicName].loop = true;
        this.config.music[musicName].oncanplay = callback;
        this.config.music[musicName].onerror = function () {
            console.error(`Unable to load file: ${this.src}`);
        };
        this.config.music[musicName].src = path;
    }

    pauseMusic() {
        const musicKeys = Object.keys(this.config.music);
        musicKeys.forEach(musicName => {
            if (typeof this.config.music[musicName] !== 'string') {
                this.config.music[musicName].pause();
            }
        });
    }

    resumeMusic() {
        this.config.music[this.activeMusicName].play();
    }
}

module.exports = Sound;
