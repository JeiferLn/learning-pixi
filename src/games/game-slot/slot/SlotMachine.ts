import * as PIXI from 'pixi.js';

import { Reel } from './Reel';

export class SlotMachine extends PIXI.Container {
    private reels: Reel[] = [];

    private rows = 3;
    private cols = 5;

    private symbolSize = 210;
    private reelSpacing = 32;

    private stopIndex = 0;
    private stopTimer = 0;
    private stopping = false;
    private stopDelay = 0.5;

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
        this.stopping = false;
        this.stopIndex = 0;
        this.stopTimer = 0;

        for (const reel of this.reels) {
            reel.spin();
        }
    }

    setResult(board: number[][]) {
        for (let i = 0; i < this.reels.length; i++) {
            this.reels[i].setResult(board[i]);
        }

        this.stopIndex = 0;
        this.stopTimer = 0;
        this.stopping = true;
    }

    update(delta: number) {
        for (const reel of this.reels) {
            reel.update(delta);
        }

        if (!this.stopping) return;

        this.stopTimer += delta;

        if (this.stopTimer >= this.stopDelay) {
            this.stopTimer = 0;

            if (this.stopIndex < this.reels.length) {
                this.reels[this.stopIndex].stop();

                this.stopIndex++;
            } else {
                this.stopping = false;
            }
        }
    }
}