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
    playSound: function(soundName) {
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
    stopSound: function() {
        this.source.stop(0);
    },
    playMusic: function(musicName) {
        this.activeMusicName = musicName;
        if (typeof (music[musicName]) === 'string') {
            this.loadMusic(musicName, function() {
                audio.playMusic(musicName);
            });
        } else {
            this.pauseMusic();
            //music[musicName].currentTime = 0; firefox уходит в рекурсию
            music[musicName].play();
        }
    },
    loadMusic: function(musicName, callback) {
        var path = music[musicName];
        music[musicName] = new Audio();
        music[musicName].preload = 'auto';
        music[musicName].loop = true;
        music[musicName].oncanplay = callback;
        music[musicName].onerror = function() {
            console.error('Не удалось загрузить файл: ' + this.src);
        };
        music[musicName].src = path;
    },
    pauseMusic: function() {
        for (var name in music) {
            if (typeof (music[name]) !== 'string') {
                music[name].pause();
            }
        }
    },
    resumeMusic: function() {
        music[this.activeMusicName].play();
    }
};
var canvas = {
    width: 800,
    height: 400,
    nodeStatic: null,
    nodeDynamic: null,
    contextStatic: null,
    contextDynamic: null,
    init: function() {
        this.nodeDynamic = document.getElementById('dynamicCanvas');
        this.contextDynamic = this.nodeDynamic.getContext('2d');
        this.nodeDynamic.width = this.width;
        this.nodeDynamic.height = this.height;

        this.nodeStatic = document.getElementById('staticCanvas');
        this.contextStatic = this.nodeStatic.getContext('2d');
        this.nodeStatic.width = this.width;
        this.nodeStatic.height = this.height;
    },
    clear: function() {
        this.contextDynamic.clearRect(0, 0, this.width, this.height);
    },
    drawGrass: function() {
        for (var x = 8; x < this.width; x += 40) {
            for (var y = 310; y < this.height; y += 30) {
                this.contextStatic.drawImage(images['grass'], x, y);
            }
        }
    },
    drawClouds: function() {
        for (var i = 0; i < cloudsPositions.length; i++) {
            if (cloudsPositions[i] >= this.width) {
                cloudsPositions[i] = -images['cloud_' + i].width;
            }
            this.contextDynamic.drawImage(images['cloud_' + i], cloudsPositions[i], 0);
            cloudsPositions[i] += 2;
        }
    },
    drawUnicorns: function() {
        var sound = 'hit';
        var imageLeft = 'unicorn_left';
        var imageRight = 'unicorn_right';
        if (audio.isTerrorMode) {
            sound = 'ak47';
            imageLeft = 'terrorist_left';
            imageRight = 'terrorist_right';
        }
        for (var i in unicorns) {
            if (unicorns[i]['y'] + images[imageRight].height >= this.height || unicorns[i]['y'] <= 0) {
                unicorns[i]['speedY'] *= -1;
                audio.playSound(sound);
            }
            if (unicorns[i]['x'] + images[imageRight].width >= this.width || unicorns[i]['x'] <= 0) {
                unicorns[i]['speedX'] *= -1;
                audio.playSound(sound);
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
    update: function() {
        this.current++;
        var newTime = new Date().getTime();
        if (newTime - this.updateTime > 1000) {
            this.node.innerHTML = 'FPS: ' + this.current;
            this.updateTime = newTime;
            this.current = 0;
        }
    }
};
var fullScreen = {
    request: function() {
        var element = document.getElementsByTagName('html')[0];
        if (element.requestFullScreen) {
            element.requestFullScreen();
        } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        } else if (element.webkitRequestFullScreen) {
            element.webkitRequestFullScreen();
        } else if (element.msRequestFullscreen) {
            element.msRequestFullscreen();
        }
    },
    cancel: function() {
        if (document.cancelFullScreen) {
            document.cancelFullScreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitCancelFullScreen) {
            document.webkitCancelFullScreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
    },
    init: function() {
        document.addEventListener('webkitfullscreenchange', this.onChange);
        document.addEventListener('mozfullscreenchange', this.onChange);
        document.addEventListener('MSFullscreenChange', this.onChange); // fucked event name!
        document.addEventListener('fullscreenchange', this.onChange);
    },
    onChange: function() {
        var element = document.fullscreenElement
                || document.webkitFullscreenElement
                || document.mozFullScreenElement // fuck
                || document.msFullscreenElement;
        if (element) {
            // открытие
            canvas.width = window.screen.width;
            canvas.height = window.screen.height;
        } else {
            // закрытие
            canvas.width = 800;
            canvas.height = 400;
        }
        var wrapElem = document.getElementsByClassName('wrapper')[0];
        wrapElem.classList.toggle('full');
        canvas.init();
        canvas.drawGrass();
    }
};
var isSpacePressed = false;
function init() {
    window.applicationCache.addEventListener('downloading', function() {
        updater.classList.add('loading');
        updater.title = 'Загружается обновление...';
    }, false);
    window.applicationCache.addEventListener('updateready', function() {
        window.applicationCache.swapCache();
        updater.onclick = function(e) {
            e.preventDefault();
            window.location.reload();
        };
        updater.classList.remove('rotate');
        updater.classList.add('updated');
        updater.title = 'Обновление загружено. Нажмите для перезапуска.';
    }, false);
    window.applicationCache.addEventListener('noupdate', function() {
        updater.parentNode.removeChild(updater);
    }, false);
    window.applicationCache.addEventListener('error', function() {
        updater.parentNode.removeChild(updater);
    }, false);

    canvas.init();
    fps.node = document.getElementById('fps');
    document.addEventListener('keypress', function(e) {
        if (e.charCode === 32) {
            isSpacePressed = !isSpacePressed;
        }
    });

    fullScreen.init();
    fullScreenSwitch.addEventListener('click', function(e) {
        e.preventDefault();
        if (this.classList.contains('icon-fullscreen-close')) {
            fullScreen.cancel();
        } else {
            fullScreen.request();
        }
        this.classList.toggle('icon-fullscreen-close');
    });
    musicSwitch.addEventListener('click', function(e) {
        e.preventDefault();
        if (this.classList.contains('icon-music-off')) {
            audio.isSoundsMuted = false;
            audio.resumeMusic();
        } else {
            audio.isSoundsMuted = true;
            audio.pauseMusic();
        }
        this.classList.toggle('icon-music-off');
    });
    terrorMode.addEventListener('click', function(e) {
        e.preventDefault();
        isSpacePressed = false;
        audio.isTerrorMode = true;
        if (musicSwitch.classList.contains('icon-music-off')) {
            musicSwitch.classList.remove('icon-music-off');
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
    load(function() {
        showIcons();
//        audio.playMusic('get_lucky');
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
        images[name].onload = function() {
            successLoads++;
            loaderProgress(successLoads, resourcesCount);
            if (successLoads === resourcesCount) {
                callback();
            }
        };
        images[name].onerror = function() {
            console.error('Не удалось загрузить: ' + this.src);
        };
        images[name].src = path;
    }

    if (audio.isSupported) {
        for (var name in sounds) {
            (function(name) {
                var xhr = new XMLHttpRequest();
                xhr.open('GET', sounds[name], true);
                xhr.responseType = 'arraybuffer';
                xhr.onload = function() {
                    audio.context.decodeAudioData(this.response,
                            function(decodedArrayBuffer) {
                                sounds[name] = decodedArrayBuffer;
                                successLoads++;
                                loaderProgress(successLoads, resourcesCount);
                                if (successLoads === resourcesCount) {
                                    callback();
                                }
                            }, function() {
                        console.error('Не удалось декодировать файл: ' + sounds[name]);
                    });
                };
                xhr.onerror = function() {
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
    canvas.contextDynamic.fillText(message, canvas.width / 2 - 100, canvas.height / 2);
}

function showIcons() {
    var icons = document.getElementsByClassName('icon');
    for (var i = 0; i < icons.length; i++) {
        icons[i].style.display = 'block';
    }
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
