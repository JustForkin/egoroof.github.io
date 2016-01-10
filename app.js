(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

module.exports = class Canvas {
    constructor(config, sound) {
        this.config = config;
        this.sound = sound;
        this.nodeStatic = document.getElementById('staticCanvas');
        this.contextStatic = this.nodeStatic.getContext('2d');
        this.nodeStatic.width = 800;
        this.nodeStatic.height = 400;
        this.nodeDynamic = document.getElementById('dynamicCanvas');
        this.contextDynamic = this.nodeDynamic.getContext('2d');
        this.nodeDynamic.width = 800;
        this.nodeDynamic.height = 400;
    }

    clear() {
        this.contextDynamic.clearRect(0, 0, this.nodeDynamic.width, this.nodeDynamic.height);
    }

    drawGrass() {
        for (let x = 8; x < this.nodeStatic.width; x += 40) {
            for (let y = 310; y < this.nodeStatic.height; y += 30) {
                this.contextStatic.drawImage(this.config.images.grass, x, y);
            }
        }
    }

    drawClouds() {
        this.config.cloudsPositions.forEach((position, i) => {
            this.contextDynamic.drawImage(this.config.images['cloud_' + i], position, 0);
            this.config.cloudsPositions[i] += 2;
            if (this.config.cloudsPositions[i] >= this.nodeDynamic.width) {
                this.config.cloudsPositions[i] = -this.config.images['cloud_' + i].width;
            }
        });
    }

    drawUnicorns() {
        let imageLeft = 'unicorn_left';
        let imageRight = 'unicorn_right';
        if (this.sound.isTerrorMode) {
            imageLeft = 'terrorist_left';
            imageRight = 'terrorist_right';
        }
        this.config.unicorns.forEach((unicorn, i) => {
            const isFlyingFloor = (unicorn.speedY !== 0 && unicorn.y >= 210);
            const isVerticalChange = (unicorn.y + this.config.images[imageRight].height >= this.nodeDynamic.height || unicorn.y <= 0);
            if (isVerticalChange || isFlyingFloor) {
                this.config.unicorns[i].speedY *= -1;
                if (this.sound.isTerrorMode) {
                    this.sound.playSound('ak47');
                }
            }
            if (unicorn.x + this.config.images[imageRight].width >= this.nodeDynamic.width || unicorn.x <= 0) {
                this.config.unicorns[i].speedX *= -1;
                if (this.sound.isTerrorMode) {
                    this.sound.playSound('ak47');
                }
            }
            this.config.unicorns[i].x += this.config.unicorns[i].speedX;
            this.config.unicorns[i].y += this.config.unicorns[i].speedY;
            if (this.config.unicorns[i].speedX > 0) {
                this.contextDynamic.drawImage(this.config.images[imageRight], this.config.unicorns[i].x, this.config.unicorns[i].y);
            } else {
                this.contextDynamic.drawImage(this.config.images[imageLeft], this.config.unicorns[i].x, this.config.unicorns[i].y);
            }
        });
    }
};

},{}],2:[function(require,module,exports){
'use strict';

module.exports = {
    images: {
        unicorn_right: 'img/unicorn_right.png',
        unicorn_left: 'img/unicorn_left.png',
        grass: 'img/grass.png',
        cloud_0: 'img/cloud_blue.png',
        cloud_1: 'img/cloud_brown.png',
        cloud_2: 'img/cloud_green.png',
        cloud_3: 'img/cloud_pink.png',
        cloud_4: 'img/cloud_red.png',
        terrorist_right: 'img/terrorist_right.png',
        terrorist_left: 'img/terrorist_left.png'
    },
    sounds: {
        // hit: 'audio/hit.wav',
        ak47: 'audio/ak47.wav'
    },
    music: {
        get_lucky: 'audio/daft_punk_get_lucky.mp3',
        cant_touch_this: 'audio/mc_hammer_-_u_can_t_touch_this.mp3'
    },
    cloudsPositions: [0, 185, 370, 555, 740],
    unicorns: [
        {
            speedX: 1,
            speedY: 2,
            x: 1,
            y: 1
        },
        {
            speedX: 2,
            speedY: 3,
            x: 100,
            y: 20
        },
        {
            speedX: 2,
            speedY: 2,
            x: 400,
            y: 100
        },
        {
            speedX: 1.5,
            speedY: 0,
            x: 500,
            y: 245
        },
        {
            speedX: 1.5,
            speedY: 0,
            x: 400,
            y: 265
        },
        {
            speedX: 1.5,
            speedY: 0,
            x: 300,
            y: 285
        }
    ]
};

},{}],3:[function(require,module,exports){
'use strict';

module.exports = class FPS {

    constructor() {
        this.current = 0;
        this.updateTime = +new Date();
        this.node = document.getElementById('fps');
    }

    update() {
        this.current++;
        const newTime = +new Date();
        if (newTime - this.updateTime > 1000) {
            this.node.innerText = 'FPS: ' + this.current;
            this.updateTime = newTime;
            this.current = 0;
        }
    }
};

},{}],4:[function(require,module,exports){
'use strict';

const Sound = require('./sound');
const Canvas = require('./canvas');
const FPS = require('./fps');
const config = require('./config');

const sound = new Sound(config);
const canvas = new Canvas(config, sound);
const fps = new FPS();
const $ = document.getElementById.bind(document);
let isSpacePressed = false;

function loaderProgress(tick, max) {
    const message = `Loading: ${tick} / ${max}`;
    canvas.contextDynamic.font = 'italic 30px Arial';
    canvas.clear();
    canvas.contextDynamic.fillText(message, canvas.nodeDynamic.width / 2 - 100, canvas.nodeDynamic.height / 2);
}

function load(onSuccess) {
    const imagesKeys = Object.keys(config.images);
    const soundsKeys = Object.keys(config.sounds);
    let successLoads = 0;
    let resourcesCount = imagesKeys.length + soundsKeys.length;
    loaderProgress(successLoads, resourcesCount);

    imagesKeys.forEach(imageName => {
        const path = config.images[imageName];
        config.images[imageName] = new Image();
        config.images[imageName].onload = () => {
            successLoads++;
            loaderProgress(successLoads, resourcesCount);
            if (successLoads === resourcesCount) {
                onSuccess();
            }
        };
        config.images[imageName].onerror = () => console.error(`Unable to load: ${path}`);
        config.images[imageName].src = path;
    });

    soundsKeys.forEach(soundName => fetch(config.sounds[soundName])
        .then(response => response.arrayBuffer())
        .then(arrayBuffer => sound.context.decodeAudioData(arrayBuffer, decodedData => {
                config.sounds[soundName] = decodedData;
                successLoads++;
                loaderProgress(successLoads, resourcesCount);
                if (successLoads === resourcesCount) {
                    onSuccess();
                }
            })
        ).catch(e => console.error(e))
    );
}

function render() {
    requestAnimationFrame(render);
    fps.update();
    if (!isSpacePressed) {
        canvas.clear();
        canvas.drawClouds();
        canvas.drawUnicorns();
    }
}

document.addEventListener('keypress', function (e) {
    if (e.charCode === 32) {
        isSpacePressed = !isSpacePressed;
    }
});

$('musicSwitch').addEventListener('click', function (e) {
    e.preventDefault();
    if (this.classList.contains('on')) {
        this.classList.remove('on');
        this.classList.add('off');
        sound.isSoundsMuted = true;
        sound.pauseMusic();
    } else {
        this.classList.remove('off');
        this.classList.add('on');
        sound.isSoundsMuted = false;
        sound.resumeMusic();
    }
});

$('terrorMode').addEventListener('click', function (e) {
    e.preventDefault();
    isSpacePressed = false;
    sound.isTerrorMode = true;
    if ($('musicSwitch').classList.contains('off')) {
        $('musicSwitch').classList.remove('off');
        $('musicSwitch').classList.add('on');
        sound.isSoundsMuted = false;
    }
    sound.playMusic('cant_touch_this');
    this.parentNode.removeChild(this);
});

load(function () {
    $('musicSwitch').style.display = 'block';
    $('terrorMode').style.display = 'block';
    sound.playMusic('get_lucky');
    canvas.drawGrass();
    render();
});

},{"./canvas":1,"./config":2,"./fps":3,"./sound":5}],5:[function(require,module,exports){
/* global AudioContext */

'use strict';

module.exports = class Sound{
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
            console.error('Unable to load file: ' + this.src);
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
};

},{}]},{},[4]);
