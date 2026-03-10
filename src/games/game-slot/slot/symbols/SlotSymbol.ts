import * as PIXI from 'pixi.js';

import { SymbolAtlas } from './SymbolAtlas';

export class SlotSymbol extends PIXI.Sprite {
    constructor() {
        super();
    }

    setSymbol(symbolID: number): void {
        this.texture = SymbolAtlas.get(symbolID);
    }

    setRandom(): void {
        const count = SymbolAtlas.getSymbolCount();
        const id = count > 0 ? Math.floor(Math.random() * count) : 0;
        this.setSymbol(id);
    }
}
