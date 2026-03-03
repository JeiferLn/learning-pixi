import * as PIXI from 'pixi.js';

export default class MovingBox {
    public graphics: PIXI.Graphics;

    constructor(parent: PIXI.Container, x: number, y: number) {
        this.graphics = new PIXI.Graphics().rect(0, -100, 100, 100).fill(0x444444);
        this.graphics.position.set(x, y);

        parent.addChild(this.graphics);
    }

    setY(y: number) {
        this.graphics.position.y = y;
    }
}