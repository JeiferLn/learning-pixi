import * as PIXI from 'pixi.js';

import { SLOT_CONFIG, type BoardResult } from '../../config/slotConfig';
import { Reel } from './Reel';
import { SlotAssets } from './SlotAssets';

export interface SetResultOptions {
  /** Si true, todos los reels animan bajando a la vez para mostrar el resultado */
  forceStopAll?: boolean;
}

export class SlotMachine extends PIXI.Container {
  private reels: Reel[] = [];

  private startIndex = 0;
  private startTimer = 0;
  private starting = false;
  private stopIndex = 0;
  private stopTimer = 0;
  private stopping = false;
  private forceStopAll = false;
  private onSpinComplete?: () => void;

  constructor(options?: { onSpinComplete?: () => void }) {
    super();
    this.onSpinComplete = options?.onSpinComplete;
    this.createReels();
  }

  private createReels(): void {
    const { visibleRows, totalReels, symbolSize, reelSpacing } = SLOT_CONFIG;
    const bufferRows = 2;
    const maskTexture = SlotAssets.getReelMaskTexture();

    for (let i = 0; i < totalReels; i++) {
      const reel = new Reel(visibleRows + bufferRows, symbolSize, maskTexture);
      reel.x = i * (symbolSize + reelSpacing);
      this.reels.push(reel);
      this.addChild(reel);
    }
  }

  spin(): void {
    this.stopping = false;
    this.stopIndex = 0;
    this.stopTimer = 0;
    this.startIndex = 1;
    this.startTimer = 0;
    this.starting = true;

    this.reels[0].spin();
  }

  setResult(board: BoardResult | number[][], options?: SetResultOptions): void {
    const { totalReels, visibleRows } = SLOT_CONFIG;

    if (!board || board.length !== totalReels) {
      console.warn(
        `[SlotMachine] Invalid board: expected ${totalReels} columns, got ${board?.length ?? 0}`,
      );
      return;
    }

    const forceStopAll = options?.forceStopAll ?? false;

    for (let i = 0; i < this.reels.length; i++) {
      const column = board[i];
      if (!column || column.length !== visibleRows) {
        console.warn(
          `[SlotMachine] Invalid column ${i}: expected ${visibleRows} rows, got ${column?.length ?? 0}`,
        );
        continue;
      }
      if (forceStopAll) {
        this.reels[i].animateToResult([...column]);
      } else {
        this.reels[i].setResult([...column]);
      }
    }

    if (forceStopAll) {
      this.forceStopAll = true;
      this.starting = false;
      this.stopping = false;
      this.startIndex = this.reels.length;
      return;
    }

    this.stopIndex = 0;
    this.stopTimer = 0;
    this.stopping = true;
  }

  update(delta: number): void {
    for (const reel of this.reels) {
      reel.update(delta);
    }

    if (this.forceStopAll) {
      if (this.reels.every((r) => r.isStopped())) {
        this.forceStopAll = false;
        this.onSpinComplete?.();
      }
      return;
    }

    if (this.starting) {
      this.startTimer += delta;

      if (this.startIndex < this.reels.length && this.startTimer >= SLOT_CONFIG.startDelay) {
        this.startTimer = 0;
        this.reels[this.startIndex].spin();
        this.startIndex++;
      }

      if (this.startIndex >= this.reels.length) {
        this.starting = false;
      }
      return;
    }

    if (!this.stopping) return;

    this.stopTimer += delta;

    if (this.stopTimer >= SLOT_CONFIG.stopDelay) {
      this.stopTimer = 0;

      if (this.stopIndex < this.reels.length) {
        this.reels[this.stopIndex].stop();
        this.stopIndex++;
      } else {
        this.stopping = false;
        this.onSpinComplete?.();
      }
    }
  }

  override destroy(options?: PIXI.DestroyOptions | boolean): void {
    for (const reel of this.reels) {
      reel.destroy(options);
    }
    this.reels = [];
    SlotAssets.destroyReelMaskTexture();
    super.destroy(options);
  }
}
