var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');
var unicorns = [];
var maxUnicornsSpeed = 5;
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
        context.drawImage(unicorn.img, unicorn.x, unicorn.y);

        if (unicorn.x < 0 || unicorn.x + unicorn.img.width > canvas.width) {
            unicorn.speedX *= -1;
        }

        if (unicorn.speedX > 0) {
            unicorn.img = unicornRight;
        } else {
            unicorn.img = unicornLeft;
        }

        if (unicorn.y < 0 || unicorn.y + unicorn.img.height > canvas.height) {
            unicorn.speedY *= -1;
        }

        unicorn.x += unicorn.speedX;
        unicorn.y += unicorn.speedY;
    });
}

document.getElementById('summon').addEventListener('click', function () {
    var unicorn = {
        x: 0,
        y: 0,
        speedX: (Math.random() * maxUnicornsSpeed | 0) + 1,
        speedY: (Math.random() * maxUnicornsSpeed | 0) + 1,
        img: unicornRight
    };
    unicorns.push(unicorn);
});

window.onresize();
render();
