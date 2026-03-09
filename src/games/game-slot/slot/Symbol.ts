import * as PIXI from 'pixi.js';

export class Symbol extends PIXI.Sprite {
    constructor() {
        super(PIXI.Texture.WHITE);

        this.width = 150;
        this.height = 150;

        this.tint = 0xff0000;
    }

    setRandom() {
        this.tint = Math.random() * 0xFFFFFF;
    }
}