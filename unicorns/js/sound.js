class Sound {
    constructor(config) {
        this.config = config;
        this.isSoundsMuted = false;
        this.isTerrorMode = false;
        this.activeMusicName = '';
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
        this.config.music[musicName] = document.createElement('audio'); // todo assign to local
        this.config.music[musicName].preload = 'auto';
        this.config.music[musicName].loop = true;
        this.config.music[musicName].oncanplay = callback;
        this.config.music[musicName].onerror = (e) => {
            console.error(`Unable to load file: ${path}`, e.message);
        };
        this.config.music[musicName].src = path;
    }

    pauseMusic() {
        const musicKeys = Object.keys(this.config.music);
        musicKeys.forEach((musicName) => {
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
