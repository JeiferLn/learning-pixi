import { SLOT_CONFIG } from '../../config/slotConfig';
import { ReelView } from './ReelView';
import { ReelState } from './ReelState';

/** Ease-out-back: va al target con un ligero overshoot y rebote */
function easeOutBack(t: number): number {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * (t - 1) ** 3 + c1 * (t - 1) ** 2;
}

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

  private startKickTimer = 0;
  private overshootRemaining = 0;
  private bounceProgress = 0;
  private bounceStartOffset = 0;
  private snapTarget = 0;

  constructor(view: ReelView) {
    this.view = view;
    this.rows = view.getSymbolCount();
    this.symbolSize = SLOT_CONFIG.symbolSize;
    this.visibleRows = SLOT_CONFIG.visibleRows;
    this.totalHeight = this.rows * this.symbolSize;
  }

  spin(): void {
    const { spinStartKick, spinStartKickDuration } = SLOT_CONFIG;
    this.speed = spinStartKick;
    this.state = ReelState.SPINNING;
    this.injectedMask = 0;
    this.startKickTimer = spinStartKickDuration;
    this.view.showAllSymbols();
  }

  stop(): void {
    this.state = ReelState.STOPPING;
  }

  isStopped(): boolean {
    return this.state === ReelState.STOPPED;
  }

  setResult(symbols: number[]): void {
    this.targetSymbols = symbols;
  }

  /** Anima el reel bajando para mostrar el resultado (forceStopAll) */
  animateToResult(symbols: number[]): void {
    this.targetSymbols = symbols;
    this.state = ReelState.STOPPING;
    this.speed = 0;
    this.startKickTimer = 0;
    this.overshootRemaining = 0;
    this.injectedMask = (1 << this.visibleRows) - 1;

    const bufferCount = this.rows - this.visibleRows;
    for (let i = 0; i < this.visibleRows; i++) {
      this.view.setSymbol(bufferCount + i, this.targetSymbols[i]);
    }
    this.view.hideBufferSymbols(bufferCount);

    const { snapOffset } = SLOT_CONFIG;
    this.bounceStartOffset = snapOffset - this.symbolSize;
    this.snapTarget = snapOffset;
    this.bounceProgress = 0.001;
  }

  update(delta: number): void {
    if (this.state === ReelState.SPINNING) {
      this.updateSpin(delta);
      return;
    }

    if (this.state === ReelState.STOPPING) {
      this.updateStop(delta);
      return;
    }
  }

  private updateSpin(delta: number): void {
    const { spinSpeed, spinStartKick, spinStartKickDuration } = SLOT_CONFIG;

    if (this.startKickTimer > 0) {
      this.startKickTimer -= delta;
      const progress = 1 - this.startKickTimer / spinStartKickDuration;
      this.speed = spinStartKick + (spinSpeed - spinStartKick) * progress;
      if (this.startKickTimer <= 0) {
        this.speed = spinSpeed;
      }
    }

    this.reelPosition += this.speed * delta;
    this.reelPosition %= this.totalHeight;
    if (this.reelPosition < 0) this.reelPosition += this.totalHeight;

    this.view.updatePositions(this.reelPosition, true);
  }

  private updateStop(delta: number): void {
    const { spinStopOvershoot, spinStopBounceDuration } = SLOT_CONFIG;

    if (this.bounceProgress > 0 && this.bounceProgress < 1) {
      this.bounceProgress += delta / spinStopBounceDuration;
      if (this.bounceProgress >= 1) {
        this.bounceProgress = 1;
        this.finishStop(this.snapTarget);
        return;
      }
      const eased = easeOutBack(this.bounceProgress);
      const displayOffset =
        this.bounceStartOffset + (this.snapTarget - this.bounceStartOffset) * eased;
      this.view.updatePositions(this.normalizeOffset(displayOffset), false);
      return;
    }

    if (this.overshootRemaining > 0) {
      const travel = this.speed * delta;
      this.overshootRemaining -= travel;
      this.reelPosition += this.speed * delta;
      this.reelPosition %= this.totalHeight;
      if (this.reelPosition < 0) this.reelPosition += this.totalHeight;

      if (this.overshootRemaining <= 0) {
        this.speed = 0;
        this.bounceStartOffset = this.normalizeOffset(this.reelPosition);
        this.bounceProgress = 0.001;
      }
      this.view.updatePositions(this.reelPosition, false);
      return;
    }

    this.reelPosition += this.speed * delta;
    this.reelPosition %= this.totalHeight;
    if (this.reelPosition < 0) this.reelPosition += this.totalHeight;

    const offset = this.reelPosition;

    if (this.targetSymbols.length === this.visibleRows) {
      this.tryInjectSymbols(offset);
      const allInjected = this.injectedMask === (1 << this.visibleRows) - 1;

      if (allInjected && this.isAtSnapPosition(offset)) {
        this.snapTarget = this.getSnappedPosition();
        this.overshootRemaining = spinStopOvershoot;
        this.view.updatePositions(offset, false);
        return;
      }
    }

    this.view.updatePositions(offset, false);
  }

  private finishStop(finalOffset?: number): void {
    const bufferCount = this.rows - this.visibleRows;

    for (let i = 0; i < this.visibleRows; i++) {
      this.view.setSymbol(bufferCount + i, this.targetSymbols[i]);
    }

    this.view.hideBufferSymbols(bufferCount);

    this.reelPosition = finalOffset ?? this.getSnappedPosition();
    this.view.updatePositions(this.reelPosition, false);

    this.state = ReelState.STOPPED;
    this.speed = 0;
    this.bounceProgress = 0;
    this.overshootRemaining = 0;
  }

  private getSnappedPosition(): number {
    const { snapOffset } = SLOT_CONFIG;
    let pos =
      Math.floor(this.reelPosition / this.totalHeight) * this.totalHeight +
      snapOffset;
    pos %= this.totalHeight;
    if (pos < 0) pos += this.totalHeight;
    return pos;
  }

  private normalizeOffset(offset: number): number {
    let o = offset % this.totalHeight;
    if (o < 0) o += this.totalHeight;
    return o;
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
}