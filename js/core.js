var audio = {
    isSupported: null,
    isMusicLoaded: false,
    context: null,
    source: null,
    destination: null,
    activeMusicName: '',
    playSound: function(soundName) {
        this.source = this.context.createBufferSource();
        this.source.buffer = sounds[soundName];
        this.destination = this.context.destination;
        this.source.connect(this.destination);
        this.source.start(0);
    },
    stopSound: function() {
        this.source.stop(0);
    },
    playMusic: function(musicName) {
        //this.source = this.context.createMediaElementSource(music[musicName]);
        //this.destination = this.context.destination;
        //this.source.connect(this.destination);
        this.activeMusicName = musicName;
        this.pauseMusic();
        music[musicName].currentTime = 0;
        music[musicName].play();
    },
    pauseMusic: function() {
        for (var name in music) {
            music[name].pause();
        }
    },
    resumeMusic: function() {
        music[this.activeMusicName].play();
    }
};
var canvasContext, canvas, isSpacePressed = false;
function init() {
    canvas = document.getElementById('canvas');
    canvasContext = canvas.getContext('2d');
    canvas.width = 800;
    canvas.height = 400;
    document.addEventListener('keypress', function(e) {
        if (e.charCode === 32) {
            if (isSpacePressed) {
                audio.resumeMusic();
            } else {
                audio.pauseMusic();
            }
            isSpacePressed = !isSpacePressed;
        }
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
        loadMusic();
        setInterval(display, 10);
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

function loadMusic() {
    var successLoads = 0;
    var musicCount = Object.keys(music).length;
    for (var name in music) {
        (function(name) {
            var path = music[name];
            music[name] = new Audio();
            music[name].preload = 'auto';
            music[name].oncanplay = function() {
                successLoads++;
                if (successLoads === musicCount) {
                    audio.isMusicLoaded = true;
                    audio.playMusic('cant_touch_this');
                }
            };
            music[name].onerror = function() {
                console.error('Не удалось загрузить файл: ' + this.src);
            };
            music[name].src = path;
        })(name);
    }
}

function loaderProgress(tick, max) {
    var message = 'Загрузка: ' + tick + ' из ' + max;
    canvasContext.font = 'italic 30px Arial';
    canvasContext.clearRect(0, 0, canvas.width, canvas.height);
    canvasContext.fillText(message, canvas.width / 2 - 100, canvas.height / 2);
}

function display() {
    if (!isSpacePressed) {
        canvasContext.clearRect(0, 0, canvas.width, canvas.height);
        drawGrass();
        drawClouds();
        drawUnicorns();
    }
}

function drawGrass() {
    for (var x = 8; x < canvas.width; x += 40) {
        for (var y = 310; y < canvas.height; y += 30) {
            canvasContext.drawImage(images['grass'], x, y);
        }
    }
}

function drawClouds() {
    for (var i = 0; i < cloudsPositions.length; i++) {
        if (cloudsPositions[i] >= canvas.width) {
            cloudsPositions[i] = -images['cloud_' + i].width;
        }
        canvasContext.drawImage(images['cloud_' + i], cloudsPositions[i], 0);
        cloudsPositions[i] += 1.5;
    }
}

function drawUnicorns() {
    for (var i in unicorns) {
        if (unicorns[i]['y'] + images['unicorn_right'].height >= canvas.height || unicorns[i]['y'] <= 0) {
            unicorns[i]['speedY'] *= -1;
            if (audio.isSupported) {
                audio.playSound('hit');
            }
        }
        if (unicorns[i]['x'] + images['unicorn_right'].width >= canvas.width || unicorns[i]['x'] <= 0) {
            unicorns[i]['speedX'] *= -1;
            if (audio.isSupported) {
                audio.playSound('hit');
            }
        }
        unicorns[i]['x'] += unicorns[i]['speedX'];
        unicorns[i]['y'] += unicorns[i]['speedY'];
        if (unicorns[i]['speedX'] > 0) {
            canvasContext.drawImage(images['unicorn_right'], unicorns[i]['x'], unicorns[i]['y']);
        } else {
            canvasContext.drawImage(images['unicorn_left'], unicorns[i]['x'], unicorns[i]['y']);
        }
    }
}
