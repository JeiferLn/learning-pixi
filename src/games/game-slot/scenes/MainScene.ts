import * as PIXI from 'pixi.js';

import { BaseScene } from './BaseScene';
import { SlotMachine } from '../slot/SlotMachine';

import backgroundUrl from '../assets/background.png';

export class MainScene extends BaseScene {
    private gameWidth: number;
    private gameHeight: number;

    private slotMachine!: SlotMachine;

    constructor(gameWidth: number, gameHeight: number) {
        super();

        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
    }

    async init() {
        // Background
        const backgroundTexture = await PIXI.Assets.load(backgroundUrl);

        const background = new PIXI.Sprite(backgroundTexture);

        const backgroundScaleX = this.gameWidth / background.width;
        const backgroundScaleY = this.gameHeight / background.height;

        const backgroundScale = Math.min(backgroundScaleX, backgroundScaleY);

        background.scale.set(backgroundScale);
        background.anchor.set(0.5);
        background.position.set(this.gameWidth / 2, this.gameHeight / 2);

        this.addChild(background);

        // Slot Machine
        this.slotMachine = new SlotMachine();

        this.slotMachine.pivot.set(605, 750);
        this.slotMachine.position.set(this.gameWidth / 2, this.gameHeight / 2);

        this.addChild(this.slotMachine);

        this.slotMachine.spin();

        setTimeout(() => {

            const result = [
                [0, 4, 4],
                [2, 3, 4],
                [10, 2, 4],
                [11, 10, 4],
                [4, 13, 8]
            ];

            this.slotMachine.setResult(result);

        }, 3000);
    }

    update(delta: number) {
        if (!this.slotMachine) return;

        this.slotMachine.update(delta);
    }
}