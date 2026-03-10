import * as PIXI from 'pixi.js';

import { SLOT_CONFIG } from '../config/slotConfig';
import { SlotSymbol } from './SlotSymbol';

export class Reel extends PIXI.Container {
  private symbols: SlotSymbol[] = [];
  private targetSymbols: number[] = [];

  private reelPosition = 0;
  private totalHeight = 0;

  private symbolContainer = new PIXI.Container();
  private maskSprite: PIXI.Sprite | null = null;

  private readonly rows: number;
  private readonly symbolSize: number;
  private readonly visibleRows: number;

  private speed = 0;
  private spinning = false;
  private shouldStop = false;
  private injectedMask = 0; // bitmask: 1<<i si ya inyectamos targetSymbols[i]

  constructor(rows: number, symbolSize: number, maskTexture: PIXI.Texture) {
    super();

    this.rows = rows;
    this.symbolSize = symbolSize;
    this.visibleRows = SLOT_CONFIG.visibleRows;
    this.totalHeight = rows * symbolSize;

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

  spin(): void {
    this.speed = SLOT_CONFIG.spinSpeed;
    this.spinning = true;
    this.injectedMask = 0;
    this.symbols.forEach((s) => (s.visible = true));
  }

  setResult(symbols: number[]): void {
    this.targetSymbols = symbols;
  }

  stop(): void {
    this.shouldStop = true;
  }

  update(delta: number): void {
    if (!this.spinning) return;

    this.reelPosition += this.speed * delta;
    this.reelPosition %= this.totalHeight;
    if (this.reelPosition < 0) this.reelPosition += this.totalHeight;

    const offset = this.reelPosition;

    if (this.shouldStop && this.targetSymbols.length === this.visibleRows) {
      this.tryInjectSymbols(offset);
      const allInjected = this.injectedMask === (1 << this.visibleRows) - 1;
      if (allInjected && this.isAtSnapPosition(offset)) {
        this.applyStopAlignment();
        return;
      }
    }

    this.updateSymbolPositions(
      this.reelPosition,
      !this.shouldStop, // no randomize cuando estamos por parar
    );
  }

  private tryInjectSymbols(offset: number): void {
    const { visibleArea, injectionZoneTop, injectionZoneBottom } = SLOT_CONFIG;
    const halfSymbol = this.symbolSize / 2;
    const wrapBottom = visibleArea.top + visibleArea.height + halfSymbol;
    const bufferCount = this.rows - this.visibleRows;

    for (let i = 0; i < this.visibleRows; i++) {
      if (this.injectedMask & (1 << i)) continue;

      const symbolIndex = bufferCount + i;
      let centerY = symbolIndex * this.symbolSize + halfSymbol + offset;

      while (centerY >= wrapBottom) {
        centerY -= this.totalHeight;
      }

      if (
        centerY >= injectionZoneTop &&
        centerY < injectionZoneBottom &&
        this.targetSymbols[i] !== undefined
      ) {
        this.symbols[symbolIndex].setSymbol(this.targetSymbols[i]);
        this.injectedMask |= 1 << i;
      }
    }
  }

  private isAtSnapPosition(offset: number): boolean {
    const { snapOffset } = SLOT_CONFIG;
    const tolerance = 50; // px de margen
    const diff = (offset - snapOffset + this.totalHeight) % this.totalHeight;
    return diff < tolerance || diff > this.totalHeight - tolerance;
  }

  private updateSymbolPositions(offset: number, allowRandomize = false): void {
    const { visibleArea } = SLOT_CONFIG;
    const halfSymbol = this.symbolSize / 2;
    const wrapBottom = visibleArea.top + visibleArea.height + halfSymbol;
    const wrapTop = visibleArea.top - halfSymbol;

    for (let i = 0; i < this.symbols.length; i++) {
      const symbol = this.symbols[i];

      let centerY = i * this.symbolSize + halfSymbol + offset;

      while (centerY >= wrapBottom) {
        centerY -= this.totalHeight;
      }

      symbol.y = centerY;

      if (allowRandomize && centerY < wrapTop && !this.shouldStop) {
        symbol.setRandom();
      }
    }
  }

  private applyStopAlignment(): void {
    const { snapOffset } = SLOT_CONFIG;
    const bufferCount = this.rows - this.visibleRows;

    for (let i = 0; i < this.visibleRows; i++) {
      this.symbols[bufferCount + i].setSymbol(this.targetSymbols[i]);
    }

    for (let i = 0; i < bufferCount; i++) {
      this.symbols[i].visible = false;
    }

    this.reelPosition =
      Math.floor(this.reelPosition / this.totalHeight) * this.totalHeight + snapOffset;
    this.reelPosition %= this.totalHeight;
    if (this.reelPosition < 0) this.reelPosition += this.totalHeight;

    const offset = this.reelPosition;
    const halfSymbol = this.symbolSize / 2;

    for (let i = 0; i < this.symbols.length; i++) {
      let centerY = i * this.symbolSize + halfSymbol + offset;
      if (centerY >= this.totalHeight) centerY -= this.totalHeight;
      else if (centerY < 0) centerY += this.totalHeight;
      this.symbols[i].y = centerY;
    }

    this.spinning = false;
    this.shouldStop = false;
    this.speed = 0;
  }

  override destroy(options?: PIXI.DestroyOptions | boolean): void {
    // No destruir texture: es compartida por SlotAssets
    this.maskSprite = null;
    this.symbolContainer.mask = null;
    this.symbols = [];
    this.targetSymbols = [];
    super.destroy(options);
  }
}
