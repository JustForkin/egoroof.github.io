var audio = {
    isSupported: null,
    isSoundsMuted: false,
    isTerrorMode: false,
    context: null,
    source: null,
    gainNode: null,
    gainValue: 0.2,
    destination: null,
    activeMusicName: '',
    playSound: function (soundName) {
        if (this.isSoundsMuted || !this.isSupported) {
            return false;
        }
        this.source = this.context.createBufferSource();
        this.source.buffer = sounds[soundName];
        this.destination = this.context.destination;
        this.gainNode = this.context.createGain();
        this.gainNode.gain.value = this.gainValue;

        this.source.connect(this.gainNode);
        this.gainNode.connect(this.destination);
        this.source.start(0);
    },
    stopSound: function () {
        this.source.stop(0);
    },
    playMusic: function (musicName) {
        this.activeMusicName = musicName;
        if (typeof (music[musicName]) === 'string') {
            this.loadMusic(musicName, function () {
                audio.playMusic(musicName);
            });
        } else {
            this.pauseMusic();
            //music[musicName].currentTime = 0; firefox уходит в рекурсию
            music[musicName].play();
        }
    },
    loadMusic: function (musicName, callback) {
        var path = music[musicName];
        music[musicName] = new Audio();
        music[musicName].preload = 'auto';
        music[musicName].loop = true;
        music[musicName].oncanplay = callback;
        music[musicName].onerror = function () {
            console.error('Не удалось загрузить файл: ' + this.src);
        };
        music[musicName].src = path;
    },
    pauseMusic: function () {
        for (var name in music) {
            if (typeof (music[name]) !== 'string') {
                music[name].pause();
            }
        }
    },
    resumeMusic: function () {
        music[this.activeMusicName].play();
    }
};
var canvas = {
    nodeStatic: null,
    nodeDynamic: null,
    contextStatic: null,
    contextDynamic: null,
    clear: function () {
        this.contextDynamic.clearRect(0, 0, this.nodeDynamic.width, this.nodeDynamic.height);
    },
    drawGrass: function () {
        for (var x = 8; x < this.nodeStatic.width; x += 40) {
            for (var y = 310; y < this.nodeStatic.height; y += 30) {
                this.contextStatic.drawImage(images['grass'], x, y);
            }
        }
    },
    drawClouds: function () {
        for (var i = 0; i < cloudsPositions.length; i++) {
            if (cloudsPositions[i] >= this.nodeDynamic.width) {
                cloudsPositions[i] = -images['cloud_' + i].width;
            }
            this.contextDynamic.drawImage(images['cloud_' + i], cloudsPositions[i], 0);
            cloudsPositions[i] += 2;
        }
    },
    drawUnicorns: function () {
        var imageLeft = 'unicorn_left';
        var imageRight = 'unicorn_right';
        if (audio.isTerrorMode) {
            imageLeft = 'terrorist_left';
            imageRight = 'terrorist_right';
        }
        for (var i in unicorns) {
            var isFlyingFloor = (unicorns[i]['speedY'] !== 0 && unicorns[i]['y'] >= 210);
            var isVerticalChange = (unicorns[i]['y'] + images[imageRight].height >= this.nodeDynamic.height || unicorns[i]['y'] <= 0);
            if (isVerticalChange || isFlyingFloor) {
                unicorns[i]['speedY'] *= -1;
                if (audio.isTerrorMode) {
                    audio.playSound('ak47');
                }
            }
            if (unicorns[i]['x'] + images[imageRight].width >= this.nodeDynamic.width || unicorns[i]['x'] <= 0) {
                unicorns[i]['speedX'] *= -1;
                if (audio.isTerrorMode) {
                    audio.playSound('ak47');
                }
            }
            unicorns[i]['x'] += unicorns[i]['speedX'];
            unicorns[i]['y'] += unicorns[i]['speedY'];
            if (unicorns[i]['speedX'] > 0) {
                this.contextDynamic.drawImage(images[imageRight], unicorns[i]['x'], unicorns[i]['y']);
            } else {
                this.contextDynamic.drawImage(images[imageLeft], unicorns[i]['x'], unicorns[i]['y']);
            }
        }
    }
};
var fps = {
    current: 0,
    updateTime: new Date().getTime(),
    node: null,
    update: function () {
        this.current++;
        var newTime = new Date().getTime();
        if (newTime - this.updateTime > 1000) {
            this.node.innerHTML = 'FPS: ' + this.current;
            this.updateTime = newTime;
            this.current = 0;
        }
    }
};
var isSpacePressed = false;
function init() {
    canvas.nodeDynamic = document.getElementById('dynamicCanvas');
    canvas.contextDynamic = canvas.nodeDynamic.getContext('2d');
    canvas.nodeDynamic.width = 800;
    canvas.nodeDynamic.height = 400;
    canvas.nodeStatic = document.getElementById('staticCanvas');
    canvas.contextStatic = canvas.nodeStatic.getContext('2d');
    canvas.nodeStatic.width = 800;
    canvas.nodeStatic.height = 400;
    fps.node = document.getElementById('fps');
    document.addEventListener('keypress', function (e) {
        if (e.charCode === 32) {
            isSpacePressed = !isSpacePressed;
        }
    });
    musicSwitch.addEventListener('click', function (e) {
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
    terrorMode.addEventListener('click', function (e) {
        e.preventDefault();
        isSpacePressed = false;
        audio.isTerrorMode = true;
        if (musicSwitch.classList.contains('off')) {
            musicSwitch.classList.remove('off');
            musicSwitch.classList.add('on');
            audio.isSoundsMuted = false;
        }
        audio.playMusic('cant_touch_this');
        this.parentNode.removeChild(this);
    });
    try {
        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        audio.context = new AudioContext();
        audio.isSupported = true;
    } catch (e) {
        audio.isSupported = false;
        console.error('Для работы звука необходима поддержка Audio API');
    }
    load(function () {
        musicSwitch.style.display = 'block';
        terrorMode.style.display = 'block';
        audio.playMusic('get_lucky');
        canvas.drawGrass();
        display();
    });
}

function load(callback) {
    var successLoads = 0;
    var resourcesCount = Object.keys(images).length;
    if (audio.isSupported) {
        resourcesCount += Object.keys(sounds).length;
    }
    loaderProgress(successLoads, resourcesCount);

    for (var name in images) {
        var path = images[name];
        images[name] = new Image();
        images[name].onload = function () {
            successLoads++;
            loaderProgress(successLoads, resourcesCount);
            if (successLoads === resourcesCount) {
                callback();
            }
        };
        images[name].onerror = function () {
            console.error('Не удалось загрузить: ' + this.src);
        };
        images[name].src = path;
    }

    if (audio.isSupported) {
        for (var name in sounds) {
            (function (name) {
                var xhr = new XMLHttpRequest();
                xhr.open('GET', sounds[name], true);
                xhr.responseType = 'arraybuffer';
                xhr.onload = function () {
                    audio.context.decodeAudioData(this.response,
                            function (decodedArrayBuffer) {
                                sounds[name] = decodedArrayBuffer;
                                successLoads++;
                                loaderProgress(successLoads, resourcesCount);
                                if (successLoads === resourcesCount) {
                                    callback();
                                }
                            }, function () {
                        console.error('Не удалось декодировать файл: ' + sounds[name]);
                    });
                };
                xhr.onerror = function () {
                    console.error('Не удалось загрузить файл: ' + sounds[name]);
                };
                xhr.send();
            })(name);
        }
    }
}

function loaderProgress(tick, max) {
    var message = 'Загрузка: ' + tick + ' из ' + max;
    canvas.contextDynamic.font = 'italic 30px Arial';
    canvas.clear();
    canvas.contextDynamic.fillText(message, canvas.nodeDynamic.width / 2 - 100, canvas.nodeDynamic.height / 2);
}

function display() {
    requestAnimationFrame(display);
    fps.update();
    if (!isSpacePressed) {
        canvas.clear();
        canvas.drawClouds();
        canvas.drawUnicorns();
    }
}
