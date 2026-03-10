import * as PIXI from 'pixi.js';

import { SLOT_CONFIG } from '../../config/slotConfig';
import { SlotSymbol } from '../symbols/SlotSymbol';

export class ReelView extends PIXI.Container {
  private readonly symbols: SlotSymbol[] = [];
  private readonly symbolContainer = new PIXI.Container();
  private maskSprite: PIXI.Sprite | null = null;

  private readonly rows: number;
  private readonly symbolSize: number;

  constructor(rows: number, symbolSize: number, maskTexture: PIXI.Texture) {
    super();

    this.rows = rows;
    this.symbolSize = symbolSize;

    this.createMask(maskTexture);
    this.addChild(this.symbolContainer);
    this.createSymbols();
  }

  private createMask(maskTexture: PIXI.Texture): void {
    const { visibleArea } = SLOT_CONFIG;

    this.maskSprite = new PIXI.Sprite(maskTexture);
    this.maskSprite.x = 0;
    this.maskSprite.y = visibleArea.top;

    this.addChild(this.maskSprite);
    this.symbolContainer.mask = this.maskSprite;
  }

  private createSymbols(): void {
    const { symbolPaddingX } = SLOT_CONFIG;
    const halfSymbol = this.symbolSize / 2;

    for (let i = 0; i < this.rows; i++) {
      const symbol = new SlotSymbol();
      symbol.setRandom();
      symbol.anchor.set(0.5);
      symbol.scale.set(this.symbolSize / symbol.texture.height);
      symbol.x = halfSymbol + symbolPaddingX;
      symbol.y = i * this.symbolSize + halfSymbol;

      this.symbols.push(symbol);
      this.symbolContainer.addChild(symbol);
    }
  }

  setSymbol(index: number, symbolId: number): void {
    const symbol = this.symbols[index];
    if (symbol) symbol.setSymbol(symbolId);
  }

  setSymbolRandom(index: number): void {
    const symbol = this.symbols[index];
    if (symbol) symbol.setRandom();
  }

  setSymbolVisible(index: number, visible: boolean): void {
    const symbol = this.symbols[index];
    if (symbol) symbol.visible = visible;
  }

  showAllSymbols(): void {
    this.symbols.forEach((s) => (s.visible = true));
  }

  hideBufferSymbols(bufferCount: number): void {
    for (let i = 0; i < bufferCount; i++) {
      this.symbols[i].visible = false;
    }
  }

  updatePositions(offset: number, allowRandomize: boolean): void {
    const { visibleArea } = SLOT_CONFIG;
    const halfSymbol = this.symbolSize / 2;
    const totalHeight = this.rows * this.symbolSize;
    const wrapBottom = visibleArea.top + visibleArea.height + halfSymbol;
    const wrapTop = visibleArea.top - halfSymbol;

    for (let i = 0; i < this.symbols.length; i++) {
      const symbol = this.symbols[i];

      let centerY = i * this.symbolSize + halfSymbol + offset;

      while (centerY >= wrapBottom) {
        centerY -= totalHeight;
      }

      symbol.y = centerY;

      if (allowRandomize && centerY < wrapTop) {
        symbol.setRandom();
      }
    }
  }

  updatePositionsFromSnap(offset: number): void {
    const halfSymbol = this.symbolSize / 2;
    const totalHeight = this.rows * this.symbolSize;

    for (let i = 0; i < this.symbols.length; i++) {
      let centerY = i * this.symbolSize + halfSymbol + offset;
      if (centerY >= totalHeight) centerY -= totalHeight;
      else if (centerY < 0) centerY += totalHeight;
      this.symbols[i].y = centerY;
    }
  }

  getSymbolCount(): number {
    return this.symbols.length;
  }

  override destroy(options?: PIXI.DestroyOptions | boolean): void {
    this.maskSprite = null;
    this.symbolContainer.mask = null;
    this.symbols.length = 0;
    super.destroy(options);
  }
}
