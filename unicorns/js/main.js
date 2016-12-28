import Sound from './sound';
import FPS from './fps';
import Canvas from './canvas';
import config from './config';

const sound = new Sound(config);
const canvas = new Canvas(config, sound);
const fps = new FPS();
const $ = document.getElementById.bind(document);

function loaderProgress(tick, max) {
    const message = `Loading: ${tick} / ${max}`;
    canvas.contextDynamic.font = 'italic 30px Arial';
    canvas.clear();
    canvas.contextDynamic.fillText(message, canvas.nodeDynamic.width / 2 - 100, canvas.nodeDynamic.height / 2);
}

function load(onSuccess) {
    const imagesKeys = Object.keys(config.images);
    const resourcesCount = imagesKeys.length;
    let successLoads = 0;
    loaderProgress(successLoads, resourcesCount);

    imagesKeys.forEach((imageName) => {
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
}

function render() {
    requestAnimationFrame(render);
    fps.update();
    canvas.clear();
    canvas.drawClouds();
    canvas.drawUnicorns();
}

$('musicSwitch').addEventListener('click', (e) => {
    e.preventDefault();
    if (e.target.classList.contains('on')) {
        e.target.classList.remove('on');
        e.target.classList.add('off');
        sound.isSoundsMuted = true;
        sound.pauseMusic();
    } else {
        e.target.classList.remove('off');
        e.target.classList.add('on');
        sound.isSoundsMuted = false;
        sound.resumeMusic();
    }
});

$('terrorMode').addEventListener('click', (e) => {
    e.preventDefault();
    sound.isTerrorMode = true;
    if ($('musicSwitch').classList.contains('off')) {
        $('musicSwitch').classList.remove('off');
        $('musicSwitch').classList.add('on');
        sound.isSoundsMuted = false;
    }
    sound.playMusic('cant_touch_this');
    e.target.parentNode.removeChild(e.target);
});

load(() => {
    $('musicSwitch').style.display = 'block';
    $('terrorMode').style.display = 'block';
    sound.playMusic('get_lucky');
    canvas.drawGrass();
    render();
});
