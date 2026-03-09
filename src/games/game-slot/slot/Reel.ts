import * as PIXI from 'pixi.js';

import { Symbol } from './Symbol';

export class Reel extends PIXI.Container {
    private symbols: Symbol[] = []

    private rows: number;
    private symbolSize: number;

    private speed = 0;
    private spinning = false;

    constructor(rows: number, symbolSize: number) {
        super();

        this.rows = rows;
        this.symbolSize = symbolSize;

        this.createSymbols();
    }

    private createSymbols() {
        for (let i = 0; i < this.rows; i++) {
            const symbol = new Symbol();

            symbol.y = i * this.symbolSize;

            this.symbols.push(symbol);

            this.addChild(symbol);
        }
    }

    spin() {
        this.speed = 100;
        // 3000;
        this.spinning = true;
    }

    update(delta: number) {
        if (!this.spinning) return;

        for (const symbol of this.symbols) {
            symbol.y += this.speed * delta;

            if (symbol.y >= this.symbolSize * this.rows) {
                symbol.y -= this.symbolSize * (this.rows);

                symbol.setRandom();
            }
        }
    }
}