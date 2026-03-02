import * as PIXI from 'pixi.js'

export default class MovingBox {
    public graphics: PIXI.Graphics;

    private speed: number = 100;

    constructor(x: number, y: number) {
        this.graphics = new PIXI.Graphics()
            .rect(0, 0, 100, 100)
            .fill(0x444444);

        this.graphics.position.set(x, y);
    }

    update(deltaMS: number) {
        const delta = Math.min(deltaMS, 50);
        this.graphics.x += this.speed * delta / 1000;
    }

    destroy(parent: PIXI.Container) {
        parent.removeChild(this.graphics);
        this.graphics.destroy();
    }
}