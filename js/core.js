var context, canvas, isSpacePressed = false;
function init() {
    canvas = document.getElementById('canvas');
    context = canvas.getContext('2d');
    canvas.width = 800;
    canvas.height = 400;
    document.addEventListener('keypress', function(e) {
        if (e.charCode === 32) {
            isSpacePressed = !isSpacePressed;
        }
    });
    load(function() {
        setInterval(display, 10);
    });
}

function load(callback) {
    var imagesCount = Object.keys(images).length;
    context.font = 'italic 30px Arial';
    context.fillText('Загрузка: 0 из ' + imagesCount,
            canvas.width / 2 - 100, canvas.height / 2);
    var successLoads = 0;
    for (var name in images) {
        var path = images[name];
        images[name] = new Image();
        images[name].onload = function() {
            successLoads++;
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.fillText('Загрузка: ' + successLoads + ' из ' + imagesCount,
                    canvas.width / 2 - 100, canvas.height / 2);
            if (successLoads === imagesCount) {
                callback();
            }
        };
        images[name].onerror = function() {
            console.error('Не удалось загрузить: ' + this.src);
        };
        images[name].src = path;
    }
}

function display() {
    if (!isSpacePressed) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        drawGrass();
        drawClouds();
        drawUnicorns();
    }
}

function drawGrass() {
    for (var x = 8; x < canvas.width; x += 40) {
        for (var y = 310; y < canvas.height; y += 30) {
            context.drawImage(images['grass'], x, y);
        }
    }
}

function drawClouds() {
    for (var i = 0; i < cloudsPositions.length; i++) {
        if (cloudsPositions[i] >= canvas.width) {
            cloudsPositions[i] = -images['cloud_' + i].width;
        }
        context.drawImage(images['cloud_' + i], cloudsPositions[i], 0);
        cloudsPositions[i] += 1.5;
    }
}

function drawUnicorns() {
    for (var i in unicorns) {
        if (unicorns[i]['y'] + images['unicorn_right'].height >= canvas.height
                || unicorns[i]['y'] <= 0) {
            unicorns[i]['speedY'] *= -1;
        }
        if (unicorns[i]['x'] + images['unicorn_right'].width >= canvas.width
                || unicorns[i]['x'] <= 0) {
            unicorns[i]['speedX'] *= -1;
        }
        unicorns[i]['x'] += unicorns[i]['speedX'];
        unicorns[i]['y'] += unicorns[i]['speedY'];
        if (unicorns[i]['speedX'] > 0) {
            context.drawImage(images['unicorn_right'], unicorns[i]['x'], unicorns[i]['y']);
        } else {
            context.drawImage(images['unicorn_left'], unicorns[i]['x'], unicorns[i]['y']);
        }
    }
}
