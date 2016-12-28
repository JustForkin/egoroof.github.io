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
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.l = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };

/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};

/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};

/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 4);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
class Canvas{constructor(a,b){this.config=a,this.sound=b,this.node=document.getElementById('canvas'),this.node.width=800,this.node.height=400,this.context=this.node.getContext('2d')}clear(){this.context.clearRect(0,0,this.node.width,this.node.height)}drawGrass(){for(let a=8;a<this.node.width;a+=40)for(let b=310;b<this.node.height;b+=30)this.context.drawImage(this.config.images.grass,a,b)}drawClouds(){this.config.cloudsPositions.forEach((a,b)=>{this.context.drawImage(this.config.images[`cloud_${b}`],a,0),this.config.cloudsPositions[b]+=2,this.config.cloudsPositions[b]>=this.node.width&&(this.config.cloudsPositions[b]=-this.config.images[`cloud_${b}`].width)})}drawUnicorns(){let a='unicorn_left',b='unicorn_right';this.sound.isTerrorMode&&(a='terrorist_left',b='terrorist_right'),this.config.unicorns.forEach((c,d)=>{const e=0!==c.speedY&&210<=c.y,f=c.y+this.config.images[b].height>=this.node.height||0>=c.y;(f||e)&&(this.config.unicorns[d].speedY*=-1),(c.x+this.config.images[b].width>=this.node.width||0>=c.x)&&(this.config.unicorns[d].speedX*=-1),this.config.unicorns[d].x+=this.config.unicorns[d].speedX,this.config.unicorns[d].y+=this.config.unicorns[d].speedY,0<this.config.unicorns[d].speedX?this.context.drawImage(this.config.images[b],this.config.unicorns[d].x,this.config.unicorns[d].y):this.context.drawImage(this.config.images[a],this.config.unicorns[d].x,this.config.unicorns[d].y)})}}
/* harmony export (immutable) */ exports["a"] = Canvas;


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony default export */ exports["a"] = {images:{unicorn_right:'img/unicorn_right.png',unicorn_left:'img/unicorn_left.png',grass:'img/grass.png',cloud_0:'img/cloud_blue.png',cloud_1:'img/cloud_brown.png',cloud_2:'img/cloud_green.png',cloud_3:'img/cloud_pink.png',cloud_4:'img/cloud_red.png',terrorist_right:'img/terrorist_right.png',terrorist_left:'img/terrorist_left.png'},music:{get_lucky:'audio/daft_punk_get_lucky.mp3',cant_touch_this:'audio/mc_hammer_-_u_can_t_touch_this.mp3'},cloudsPositions:[0,185,370,555,740],unicorns:[{speedX:1,speedY:2,x:1,y:1},{speedX:2,speedY:3,x:100,y:20},{speedX:2,speedY:2,x:400,y:100},{speedX:1.5,speedY:0,x:500,y:245},{speedX:1.5,speedY:0,x:400,y:265},{speedX:1.5,speedY:0,x:300,y:285}]};

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
class FPS{constructor(){this.current=0,this.updateTime=+new Date,this.node=document.getElementById('fps')}update(){this.current++;const a=+new Date;1e3<a-this.updateTime&&(this.node.innerText=`FPS: ${this.current}`,this.updateTime=a,this.current=0)}}
/* harmony export (immutable) */ exports["a"] = FPS;


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
class Sound{constructor(a){this.config=a,this.isSoundsMuted=!1,this.isTerrorMode=!1,this.activeMusicName=''}playMusic(a){this.activeMusicName=a,'string'==typeof this.config.music[a]?this.loadMusic(a,()=>this.playMusic(a)):(this.pauseMusic(),this.config.music[a].play())}loadMusic(a,b){const c=this.config.music[a];this.config.music[a]=document.createElement('audio'),this.config.music[a].preload='auto',this.config.music[a].loop=!0,this.config.music[a].oncanplay=b,this.config.music[a].onerror=d=>{console.error(`Unable to load file: ${d.currentTarget.src}`,d.currentTarget.error)},this.config.music[a].src=c}pauseMusic(){const a=Object.keys(this.config.music);a.forEach(b=>{'string'!=typeof this.config.music[b]&&this.config.music[b].pause()})}resumeMusic(){this.config.music[this.activeMusicName].play()}}
/* harmony export (immutable) */ exports["a"] = Sound;


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__sound__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__fps__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__canvas__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__config__ = __webpack_require__(1);
const sound=new __WEBPACK_IMPORTED_MODULE_0__sound__["a" /* default */](__WEBPACK_IMPORTED_MODULE_3__config__["a" /* default */]),canvas=new __WEBPACK_IMPORTED_MODULE_2__canvas__["a" /* default */](__WEBPACK_IMPORTED_MODULE_3__config__["a" /* default */],sound),fps=new __WEBPACK_IMPORTED_MODULE_1__fps__["a" /* default */],$=document.getElementById.bind(document);function loaderProgress(a,b){const c=`Loading: ${a} / ${b}`;canvas.context.font='italic 30px Arial',canvas.clear(),canvas.context.fillText(c,canvas.node.width/2-100,canvas.node.height/2)}function load(a){const b=Object.keys(__WEBPACK_IMPORTED_MODULE_3__config__["a" /* default */].images),c=b.length;let d=0;loaderProgress(d,c),b.forEach(f=>{const g=__WEBPACK_IMPORTED_MODULE_3__config__["a" /* default */].images[f];__WEBPACK_IMPORTED_MODULE_3__config__["a" /* default */].images[f]=new Image,__WEBPACK_IMPORTED_MODULE_3__config__["a" /* default */].images[f].onload=()=>{d++,loaderProgress(d,c),d===c&&a()},__WEBPACK_IMPORTED_MODULE_3__config__["a" /* default */].images[f].onerror=()=>console.error(`Unable to load: ${g}`),__WEBPACK_IMPORTED_MODULE_3__config__["a" /* default */].images[f].src=g})}function render(){requestAnimationFrame(render),fps.update(),canvas.clear(),canvas.drawGrass(),canvas.drawClouds(),canvas.drawUnicorns()}$('musicSwitch').addEventListener('click',a=>{a.preventDefault(),a.target.classList.contains('on')?(a.target.classList.remove('on'),a.target.classList.add('off'),sound.isSoundsMuted=!0,sound.pauseMusic()):(a.target.classList.remove('off'),a.target.classList.add('on'),sound.isSoundsMuted=!1,sound.resumeMusic())}),$('terrorMode').addEventListener('click',a=>{a.preventDefault(),sound.isTerrorMode=!0,$('musicSwitch').classList.contains('off')&&($('musicSwitch').classList.remove('off'),$('musicSwitch').classList.add('on'),sound.isSoundsMuted=!1),sound.playMusic('cant_touch_this'),a.target.parentNode.removeChild(a.target)}),load(()=>{$('musicSwitch').style.display='block',$('terrorMode').style.display='block',sound.playMusic('get_lucky'),render()});

/***/ }
/******/ ]);