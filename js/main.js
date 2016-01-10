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
