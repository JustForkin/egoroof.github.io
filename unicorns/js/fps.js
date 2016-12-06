export default class FPS {

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
