import * as PIXI from 'pixi.js';

export default class MovingBox {
    public graphics: PIXI.Graphics;

    constructor(parent: PIXI.Container) {
        this.graphics = new PIXI.Graphics().rect(0, 0, 100, 100).fill(0x444444);
        this.graphics.visible = false;
        parent.addChild(this.graphics);
    }

    activate(x: number, y: number) {
        this.graphics.visible = true;
        this.graphics.position.set(x, y);
    }

    release() {
        this.graphics.visible = false;
    }
}