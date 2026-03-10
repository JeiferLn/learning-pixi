import { SLOT_CONFIG } from '../../config/slotConfig';
import { ReelView } from './ReelView';
import { ReelState } from './ReelState';

export class ReelController {
  private readonly view: ReelView;
  private readonly rows: number;
  private readonly symbolSize: number;
  private readonly visibleRows: number;
  private readonly totalHeight: number;

  private reelPosition = 0;
  private speed = 0;
  private state: ReelState = ReelState.IDLE;
  private targetSymbols: number[] = [];
  private injectedMask = 0;

  constructor(view: ReelView) {
    this.view = view;
    this.rows = view.getSymbolCount();
    this.symbolSize = SLOT_CONFIG.symbolSize;
    this.visibleRows = SLOT_CONFIG.visibleRows;
    this.totalHeight = this.rows * this.symbolSize;
  }

  spin(): void {
    this.speed = SLOT_CONFIG.spinSpeed;
    this.state = ReelState.SPINNING;
    this.injectedMask = 0;
    this.view.showAllSymbols();
  }

  stop(): void {
    this.state = ReelState.STOPPING;
  }

  setResult(symbols: number[]): void {
    this.targetSymbols = symbols;
  }

  update(delta: number): void {
    if (this.state !== ReelState.SPINNING && this.state !== ReelState.STOPPING) {
      return;
    }

    this.reelPosition += this.speed * delta;
    this.reelPosition %= this.totalHeight;
    if (this.reelPosition < 0) this.reelPosition += this.totalHeight;

    const offset = this.reelPosition;

    if (this.state === ReelState.STOPPING && this.targetSymbols.length === this.visibleRows) {
      this.tryInjectSymbols(offset);
      const allInjected = this.injectedMask === (1 << this.visibleRows) - 1;
      if (allInjected && this.isAtSnapPosition(offset)) {
        this.applyStopAlignment();
        return;
      }
    }

    this.view.updatePositions(
      this.reelPosition,
      this.state === ReelState.SPINNING,
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
        this.view.setSymbol(symbolIndex, this.targetSymbols[i]);
        this.injectedMask |= 1 << i;
      }
    }
  }

  private isAtSnapPosition(offset: number): boolean {
    const { snapOffset } = SLOT_CONFIG;
    const tolerance = 50;
    const diff = (offset - snapOffset + this.totalHeight) % this.totalHeight;
    return diff < tolerance || diff > this.totalHeight - tolerance;
  }

  private applyStopAlignment(): void {
    const { snapOffset } = SLOT_CONFIG;
    const bufferCount = this.rows - this.visibleRows;

    for (let i = 0; i < this.visibleRows; i++) {
      this.view.setSymbol(bufferCount + i, this.targetSymbols[i]);
    }

    this.view.hideBufferSymbols(bufferCount);

    this.reelPosition =
      Math.floor(this.reelPosition / this.totalHeight) * this.totalHeight + snapOffset;
    this.reelPosition %= this.totalHeight;
    if (this.reelPosition < 0) this.reelPosition += this.totalHeight;

    this.view.updatePositionsFromSnap(this.reelPosition);

    this.state = ReelState.STOPPED;
    this.speed = 0;
  }
}
