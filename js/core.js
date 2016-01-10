/* global config, AudioContext */

(() => {
    'use strict';

    const $ = document.getElementById.bind(document);
    let isSpacePressed = false;

    const audio = {
        isSoundsMuted: false,
        isTerrorMode: false,
        context: new AudioContext(),
        source: null,
        gainNode: null,
        gainValue: 0.2,
        destination: null,
        activeMusicName: '',
        playSound: function (soundName) {
            if (this.isSoundsMuted) {
                return false;
            }
            this.source = this.context.createBufferSource();
            this.source.buffer = config.sounds[soundName];
            this.destination = this.context.destination;
            this.gainNode = this.context.createGain();
            this.gainNode.gain.value = this.gainValue;

            this.source.connect(this.gainNode);
            this.gainNode.connect(this.destination);
            this.source.start(0);
        },
        playMusic: function (musicName) {
            this.activeMusicName = musicName;
            if (typeof config.music[musicName] === 'string') {
                this.loadMusic(musicName, function () {
                    audio.playMusic(musicName);
                });
            } else {
                this.pauseMusic();
                //music[musicName].currentTime = 0; firefox goes into recursion
                config.music[musicName].play();
            }
        },
        loadMusic: function (musicName, callback) {
            const path = config.music[musicName];
            config.music[musicName] = new Audio(); // todo assign to local
            config.music[musicName].preload = 'auto';
            config.music[musicName].loop = true;
            config.music[musicName].oncanplay = callback;
            config.music[musicName].onerror = function () {
                console.error('Unable to load file: ' + this.src);
            };
            config.music[musicName].src = path;
        },
        pauseMusic: function () {
            const musicKeys = Object.keys(config.music);
            musicKeys.forEach(musicName => {
                if (typeof config.music[musicName] !== 'string') {
                    config.music[musicName].pause();
                }
            });
        },
        resumeMusic: function () {
            config.music[this.activeMusicName].play();
        }
    };
    const canvas = {
        nodeStatic: $('staticCanvas'),
        nodeDynamic: $('dynamicCanvas'),
        contextStatic: null,
        contextDynamic: null,
        clear: function () {
            this.contextDynamic.clearRect(0, 0, this.nodeDynamic.width, this.nodeDynamic.height);
        },
        drawGrass: function () {
            for (let x = 8; x < this.nodeStatic.width; x += 40) {
                for (let y = 310; y < this.nodeStatic.height; y += 30) {
                    this.contextStatic.drawImage(config.images.grass, x, y);
                }
            }
        },
        drawClouds: function () {
            config.cloudsPositions.forEach((position, i) => {
                this.contextDynamic.drawImage(config.images['cloud_' + i], position, 0);
                config.cloudsPositions[i] += 2;
                if (config.cloudsPositions[i] >= this.nodeDynamic.width) {
                    config.cloudsPositions[i] = -config.images['cloud_' + i].width;
                }
            });
        },
        drawUnicorns: function () {
            let imageLeft = 'unicorn_left';
            let imageRight = 'unicorn_right';
            if (audio.isTerrorMode) {
                imageLeft = 'terrorist_left';
                imageRight = 'terrorist_right';
            }
            config.unicorns.forEach((unicorn, i) => {
                const isFlyingFloor = (unicorn.speedY !== 0 && unicorn.y >= 210);
                const isVerticalChange = (unicorn.y + config.images[imageRight].height >= this.nodeDynamic.height || unicorn.y <= 0);
                if (isVerticalChange || isFlyingFloor) {
                    config.unicorns[i].speedY *= -1;
                    if (audio.isTerrorMode) {
                        audio.playSound('ak47');
                    }
                }
                if (unicorn.x + config.images[imageRight].width >= this.nodeDynamic.width || unicorn.x <= 0) {
                    config.unicorns[i].speedX *= -1;
                    if (audio.isTerrorMode) {
                        audio.playSound('ak47');
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
    };
    const fps = {
        current: 0,
        updateTime: new Date().getTime(),
        node: $('fps'),
        update: function () {
            this.current++;
            const newTime = new Date().getTime();
            if (newTime - this.updateTime > 1000) {
                this.node.innerHTML = 'FPS: ' + this.current;
                this.updateTime = newTime;
                this.current = 0;
            }
        }
    };

    function init() {
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
                audio.isSoundsMuted = true;
                audio.pauseMusic();
            } else {
                this.classList.remove('off');
                this.classList.add('on');
                audio.isSoundsMuted = false;
                audio.resumeMusic();
            }
        });
        $('terrorMode').addEventListener('click', function (e) {
            e.preventDefault();
            isSpacePressed = false;
            audio.isTerrorMode = true;
            if ($('musicSwitch').classList.contains('off')) {
                $('musicSwitch').classList.remove('off');
                $('musicSwitch').classList.add('on');
                audio.isSoundsMuted = false;
            }
            audio.playMusic('cant_touch_this');
            this.parentNode.removeChild(this);
        });
        load(function () {
            $('musicSwitch').style.display = 'block';
            $('terrorMode').style.display = 'block';
            audio.playMusic('get_lucky');
            canvas.drawGrass();
            render();
        });
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
            config.images[imageName].onload = function () {
                successLoads++;
                loaderProgress(successLoads, resourcesCount);
                if (successLoads === resourcesCount) {
                    onSuccess();
                }
            };
            config.images[imageName].onerror = () => console.error(`Unable to load: ${path}`);
            config.images[imageName].src = path;
        });

        soundsKeys.forEach(soundName => {
            fetch(config.sounds[soundName])
                .then(response => response.arrayBuffer())
                .then(arrayBuffer => audio.context.decodeAudioData(arrayBuffer, decodedData => {
                        config.sounds[soundName] = decodedData;
                        successLoads++;
                        loaderProgress(successLoads, resourcesCount);
                        if (successLoads === resourcesCount) {
                            onSuccess();
                        }
                    })
                ).catch(e => console.error(e));
        });
    }

    function loaderProgress(tick, max) {
        const message = 'Загрузка: ' + tick + ' из ' + max;
        canvas.contextDynamic.font = 'italic 30px Arial';
        canvas.clear();
        canvas.contextDynamic.fillText(message, canvas.nodeDynamic.width / 2 - 100, canvas.nodeDynamic.height / 2);
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

    init();

})();
