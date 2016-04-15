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

    unicorns.forEach(function (unicorn, i) {
        var img = (unicorn.speedX > 0) ? unicornRight : unicornLeft;
        var outOfWidth = unicorn.x + img.width > canvas.width + Math.abs(unicorn.speedX);
        var outOfHeight = unicorn.y + img.height > canvas.height + Math.abs(unicorn.speedY);
        var wallWidthTouch = unicorn.x < 0 || unicorn.x + img.width > canvas.width;
        var wallHeightTouch = unicorn.y < 0 || unicorn.y + img.height > canvas.height;

        if (outOfWidth || outOfHeight) {
            delete unicorns[i];
            return;
        }

        if (wallWidthTouch) {
            unicorn.speedX *= -1;
        }

        if (wallHeightTouch) {
            unicorn.speedY *= -1;
        }

        unicorn.x += unicorn.speedX;
        unicorn.y += unicorn.speedY;

        context.drawImage(img, unicorn.x, unicorn.y);
    });
}

document.getElementById('summon').addEventListener('click', function () {
    var unicorn = {
        x: 0,
        y: 0,
        speedX: (Math.random() * maxUnicornsSpeed | 0) + 1,
        speedY: (Math.random() * maxUnicornsSpeed | 0) + 1
    };
    unicorns.push(unicorn);
});

window.onresize();
render();
