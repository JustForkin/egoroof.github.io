var maxSpeedX = 4;
var maxSpeedY = 2;
var iterationsBeforeNewSpeed = 30;
var chanceGoLeft = 0.1;
var abroadArea = 0.3;

var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');
var unicorns = [];
var unicornRight = document.createElement('img');
var unicornLeft = document.createElement('img');

unicornRight.src = 'unicorns/img/unicorn_right.png';
unicornLeft.src = 'unicorns/img/unicorn_left.png';

window.onresize = function () {
    canvas.width = document.body.clientWidth;
    canvas.height = document.body.clientHeight;
};

function render() {
    requestAnimationFrame(render);

    context.clearRect(0, 0, canvas.width, canvas.height);

    unicorns.forEach(function (unicorn) {
        var img = (unicorn.directionX > 0) ? unicornRight : unicornLeft;
        var leftBorderOut = unicorn.x + (img.width * (1 - abroadArea)) < 0 && unicorn.directionX < 0;
        var rightBorderOut = unicorn.x + (img.width * abroadArea) > canvas.width && unicorn.directionX > 0;
        var bottomBorderOut = unicorn.y + (img.height * abroadArea) > canvas.height;

        if (leftBorderOut) {
            unicorn.x = canvas.width - (img.width * abroadArea);
        } else if (rightBorderOut) {
            unicorn.x = 0 - (img.width * (1 - abroadArea));
        }
        if (bottomBorderOut) {
            unicorn.y = 0 - (img.height * (1 - abroadArea));
        }

        if (unicorn.speedIterations > iterationsBeforeNewSpeed) {
            unicorn.speedX = Math.random() * maxSpeedX;
            unicorn.speedY = Math.random() * maxSpeedY;
            unicorn.speedIterations = 0;
            unicorn.directionX = (Math.random() < chanceGoLeft) ? -1 : 1;
        } else {
            unicorn.speedIterations++;
        }

        unicorn.x += unicorn.directionX * unicorn.speedX;
        unicorn.y += unicorn.speedY;

        context.drawImage(img, Math.round(unicorn.x), Math.round(unicorn.y));
    });
}

document.getElementById('summon').addEventListener('click', function () {
    unicorns.push({
        x: 0,
        y: 0,
        speedX: Math.random() * maxSpeedX,
        speedY: Math.random() * maxSpeedY,
        speedIterations: 0,
        directionX: 1
    });
});

window.onresize();
render();
