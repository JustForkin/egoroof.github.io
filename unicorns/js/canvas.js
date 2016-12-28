export default class Canvas {
    constructor(config, sound) {
        this.config = config;
        this.sound = sound;
        this.node = document.getElementById('canvas');
        this.node.width = 800;
        this.node.height = 400;
        this.context = this.node.getContext('2d');
    }

    clear() {
        this.context.clearRect(0, 0, this.node.width, this.node.height);
    }

    drawGrass() {
        for (let x = 8; x < this.node.width; x += 40) {
            for (let y = 310; y < this.node.height; y += 30) {
                this.context.drawImage(this.config.images.grass, x, y);
            }
        }
    }

    drawClouds() {
        this.config.cloudsPositions.forEach((position, i) => {
            this.context.drawImage(this.config.images[`cloud_${i}`], position, 0);
            this.config.cloudsPositions[i] += 2;
            if (this.config.cloudsPositions[i] >= this.node.width) {
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
            const isVerticalChange = (unicorn.y + this.config.images[imageRight].height >= this.node.height || unicorn.y <= 0);
            if (isVerticalChange || isFlyingFloor) {
                this.config.unicorns[i].speedY *= -1;
            }
            if (unicorn.x + this.config.images[imageRight].width >= this.node.width || unicorn.x <= 0) {
                this.config.unicorns[i].speedX *= -1;
            }
            this.config.unicorns[i].x += this.config.unicorns[i].speedX;
            this.config.unicorns[i].y += this.config.unicorns[i].speedY;
            if (this.config.unicorns[i].speedX > 0) {
                this.context.drawImage(this.config.images[imageRight], this.config.unicorns[i].x, this.config.unicorns[i].y);
            } else {
                this.context.drawImage(this.config.images[imageLeft], this.config.unicorns[i].x, this.config.unicorns[i].y);
            }
        });
    }
}
