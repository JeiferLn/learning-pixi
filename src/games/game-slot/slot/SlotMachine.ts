import * as PIXI from 'pixi.js';

import { Reel } from './Reel';

export class SlotMachine extends PIXI.Container {
    private reels: Reel[] = [];

    private rows = 3;
    private cols = 5;

    private symbolSize = 210;
    private reelSpacing = 32;

    constructor() {
        super();

        this.createReels();
    }

    private createReels() {
        for (let i = 0; i < this.cols; i++) {
            const reel = new Reel(this.rows + 2, this.symbolSize);

            reel.x = i * (this.symbolSize + this.reelSpacing);

            this.reels.push(reel);

            this.addChild(reel);
        }
    }

    spin() {
        for (const reel of this.reels) {
            reel.spin();
        }
    }

    update(delta: number) {
        for (const reel of this.reels) {
            reel.update(delta);
        }
    }
}