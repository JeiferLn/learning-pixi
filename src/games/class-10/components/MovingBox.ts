import * as PIXI from 'pixi.js'

export default class MovingBox {
    public graphics: PIXI.Graphics;

    constructor(parent: PIXI.Container, x: number, y: number) {
        this.graphics = new PIXI.Graphics().rect(0, 0, 100, 100).fill(0x444444);
        this.graphics.position.set(x, y + 10);
        parent.addChild(this.graphics);
    }

    releaseToPool() {
        this.graphics.visible = false;
    }

    activate(x: number, y: number) {

        this.graphics.visible = true;

        this.graphics.position.set(x, y);

    }
}