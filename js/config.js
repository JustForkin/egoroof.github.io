(() => {
    'use strict';

    window.config = {
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
        sounds: {
            // hit: 'audio/hit.wav',
            ak47: 'audio/ak47.wav'
        },
        music: {
            get_lucky: 'audio/daft_punk_get_lucky.mp3',
            cant_touch_this: 'audio/mc_hammer_-_u_can_t_touch_this.mp3'
        },
        cloudsPositions: [0, 185, 370, 555, 740],
        unicorns: [
            {
                speedX: 1,
                speedY: 2,
                x: 1,
                y: 1
            },
            {
                speedX: 2,
                speedY: 3,
                x: 100,
                y: 20
            },
            {
                speedX: 2,
                speedY: 2,
                x: 400,
                y: 100
            },
            {
                speedX: 1.5,
                speedY: 0,
                x: 500,
                y: 245
            },
            {
                speedX: 1.5,
                speedY: 0,
                x: 400,
                y: 265
            },
            {
                speedX: 1.5,
                speedY: 0,
                x: 300,
                y: 285
            }
        ]
    };

})();
