/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	const Sound = __webpack_require__(1);
	const Canvas = __webpack_require__(2);
	const FPS = __webpack_require__(3);
	const config = __webpack_require__(4);

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
	    if (!isSpacePressed) {
	        canvas.clear();
	        canvas.drawClouds();
	        canvas.drawUnicorns();
	    }
	}

	document.addEventListener('keypress', (e) => {
	    if (e.charCode === 32) {
	        isSpacePressed = !isSpacePressed;
	    }
	});

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
	    isSpacePressed = false;
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


/***/ },
/* 1 */
/***/ function(module, exports) {

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


/***/ },
/* 2 */
/***/ function(module, exports) {

	class Canvas {
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
	            this.contextDynamic.drawImage(this.config.images[`cloud_${i}`], position, 0);
	            this.config.cloudsPositions[i] += 2;
	            if (this.config.cloudsPositions[i] >= this.nodeDynamic.width) {
	                this.config.cloudsPositions[i] = -this.config.images[`cloud_${i}`].width;
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
	            }
	            if (unicorn.x + this.config.images[imageRight].width >= this.nodeDynamic.width || unicorn.x <= 0) {
	                this.config.unicorns[i].speedX *= -1;
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
	}

	module.exports = Canvas;


/***/ },
/* 3 */
/***/ function(module, exports) {

	class FPS {

	    constructor() {
	        this.current = 0;
	        this.updateTime = +new Date();
	        this.node = document.getElementById('fps');
	    }

	    update() {
	        this.current++;
	        const newTime = +new Date();
	        if (newTime - this.updateTime > 1000) {
	            this.node.innerText = `FPS: ${this.current}`;
	            this.updateTime = newTime;
	            this.current = 0;
	        }
	    }
	}

	module.exports = FPS;


/***/ },
/* 4 */
/***/ function(module, exports) {

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
	    music: {
	        get_lucky: 'audio/daft_punk_get_lucky.mp3',
	        cant_touch_this: 'audio/mc_hammer_-_u_can_t_touch_this.mp3'
	    },
	    cloudsPositions: [0, 185, 370, 555, 740],
	    unicorns: [{
	        speedX: 1,
	        speedY: 2,
	        x: 1,
	        y: 1
	    }, {
	        speedX: 2,
	        speedY: 3,
	        x: 100,
	        y: 20
	    }, {
	        speedX: 2,
	        speedY: 2,
	        x: 400,
	        y: 100
	    }, {
	        speedX: 1.5,
	        speedY: 0,
	        x: 500,
	        y: 245
	    }, {
	        speedX: 1.5,
	        speedY: 0,
	        x: 400,
	        y: 265
	    }, {
	        speedX: 1.5,
	        speedY: 0,
	        x: 300,
	        y: 285
	    }]
	};


/***/ }
/******/ ]);