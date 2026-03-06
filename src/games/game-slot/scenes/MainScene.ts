import * as PIXI from 'pixi.js';

import backgroundUrl from '../assets/background.png';

export class MainScene extends PIXI.Container {
    private gameWidth: number;
    private gameHeight: number;

    constructor(gameWidth: number, gameHeight: number) {
        super();

        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;

        this.init();
    }

    async init() {
        const backgroundTexture = await PIXI.Assets.load(backgroundUrl);
        const background = new PIXI.Sprite(backgroundTexture);

        const backgroundScaleX = this.gameWidth / background.width;
        const backgroundScaleY = this.gameHeight / background.height;

        const backgroundScale = Math.min(backgroundScaleX, backgroundScaleY);

        background.scale.set(backgroundScale);
        background.anchor.set(0.5);
        background.position.set(this.gameWidth / 2, this.gameHeight / 2);

        this.addChild(background);
    }
}