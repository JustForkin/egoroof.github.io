/* global config, AudioContext */

(() => {
    'use strict';

    const $ = document.getElementById.bind(document);
    let isSpacePressed = false;

    class Sound {
        constructor() {
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
            this.source.buffer = config.sounds[soundName];
            this.destination = this.context.destination;
            this.gainNode = this.context.createGain();
            this.gainNode.gain.value = this.gainValue;

            this.source.connect(this.gainNode);
            this.gainNode.connect(this.destination);
            this.source.start(0);
        }

        playMusic(musicName) {
            this.activeMusicName = musicName;
            if (typeof config.music[musicName] === 'string') {
                this.loadMusic(musicName, () => this.playMusic(musicName));
            } else {
                this.pauseMusic();
                //music[musicName].currentTime = 0; firefox goes into recursion
                config.music[musicName].play();
            }
        }

        loadMusic(musicName, callback) {
            const path = config.music[musicName];
            config.music[musicName] = new Audio(); // todo assign to local
            config.music[musicName].preload = 'auto';
            config.music[musicName].loop = true;
            config.music[musicName].oncanplay = callback;
            config.music[musicName].onerror = function () {
                console.error('Unable to load file: ' + this.src);
            };
            config.music[musicName].src = path;
        }

        pauseMusic() {
            const musicKeys = Object.keys(config.music);
            musicKeys.forEach(musicName => {
                if (typeof config.music[musicName] !== 'string') {
                    config.music[musicName].pause();
                }
            });
        }

        resumeMusic() {
            config.music[this.activeMusicName].play();
        }
    }
    const sound = new Sound();

    class Canvas {
        constructor() {
            this.nodeStatic = $('staticCanvas');
            this.nodeDynamic = $('dynamicCanvas');
            this.contextStatic = null;
            this.contextDynamic = null;
        }

        clear() {
            this.contextDynamic.clearRect(0, 0, this.nodeDynamic.width, this.nodeDynamic.height);
        }

        drawGrass() {
            for (let x = 8; x < this.nodeStatic.width; x += 40) {
                for (let y = 310; y < this.nodeStatic.height; y += 30) {
                    this.contextStatic.drawImage(config.images.grass, x, y);
                }
            }
        }

        drawClouds() {
            config.cloudsPositions.forEach((position, i) => {
                this.contextDynamic.drawImage(config.images['cloud_' + i], position, 0);
                config.cloudsPositions[i] += 2;
                if (config.cloudsPositions[i] >= this.nodeDynamic.width) {
                    config.cloudsPositions[i] = -config.images['cloud_' + i].width;
                }
            });
        }

        drawUnicorns() {
            let imageLeft = 'unicorn_left';
            let imageRight = 'unicorn_right';
            if (sound.isTerrorMode) {
                imageLeft = 'terrorist_left';
                imageRight = 'terrorist_right';
            }
            config.unicorns.forEach((unicorn, i) => {
                const isFlyingFloor = (unicorn.speedY !== 0 && unicorn.y >= 210);
                const isVerticalChange = (unicorn.y + config.images[imageRight].height >= this.nodeDynamic.height || unicorn.y <= 0);
                if (isVerticalChange || isFlyingFloor) {
                    config.unicorns[i].speedY *= -1;
                    if (sound.isTerrorMode) {
                        sound.playSound('ak47');
                    }
                }
                if (unicorn.x + config.images[imageRight].width >= this.nodeDynamic.width || unicorn.x <= 0) {
                    config.unicorns[i].speedX *= -1;
                    if (sound.isTerrorMode) {
                        sound.playSound('ak47');
                    }
                }
                config.unicorns[i].x += config.unicorns[i].speedX;
                config.unicorns[i].y += config.unicorns[i].speedY;
                if (config.unicorns[i].speedX > 0) {
                    this.contextDynamic.drawImage(config.images[imageRight], config.unicorns[i].x, config.unicorns[i].y);
                } else {
                    this.contextDynamic.drawImage(config.images[imageLeft], config.unicorns[i].x, config.unicorns[i].y);
                }
            });
        }
    }
    const canvas = new Canvas();

    class FPS {

        constructor() {
            this.current = 0;
            this.updateTime = +new Date();
            this.node = $('fps');
        }

        update() {
            this.current++;
            const newTime = +new Date();
            if (newTime - this.updateTime > 1000) {
                this.node.innerHTML = 'FPS: ' + this.current;
                this.updateTime = newTime;
                this.current = 0;
            }
        }
    }
    const fps = new FPS();

    function loaderProgress(tick, max) {
        const message = `Загрузка: ${tick} из ${max}`;
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

    canvas.contextDynamic = canvas.nodeDynamic.getContext('2d');
    canvas.nodeDynamic.width = 800;
    canvas.nodeDynamic.height = 400;
    canvas.contextStatic = canvas.nodeStatic.getContext('2d');
    canvas.nodeStatic.width = 800;
    canvas.nodeStatic.height = 400;
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

})();
