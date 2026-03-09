import * as PIXI from 'pixi.js';

import { SymbolAtlas } from './SymbolAtlas';

export class Symbol extends PIXI.Sprite {
    constructor() {
        super();
    }

    setSymbol(symbolID: number) {
        this.texture = SymbolAtlas.get(symbolID);
    }

    setRandom() {
        const id = Math.floor(Math.random() * 12);

        this.setSymbol(id);
    }
}