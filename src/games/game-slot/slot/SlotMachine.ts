import * as PIXI from 'pixi.js';

import { SLOT_CONFIG, type BoardResult } from '../config/slotConfig';
import { Reel } from './Reel';
import { SlotAssets } from './SlotAssets';

export class SlotMachine extends PIXI.Container {
  private reels: Reel[] = [];

  private stopIndex = 0;
  private stopTimer = 0;
  private stopping = false;

  constructor() {
    super();
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

    for (const reel of this.reels) {
      reel.spin();
    }
  }

  setResult(board: BoardResult | number[][]): void {
    const { totalReels, visibleRows } = SLOT_CONFIG;

    if (!board || board.length !== totalReels) {
      console.warn(
        `[SlotMachine] Invalid board: expected ${totalReels} columns, got ${board?.length ?? 0}`,
      );
      return;
    }

    for (let i = 0; i < this.reels.length; i++) {
      const column = board[i];
      if (!column || column.length !== visibleRows) {
        console.warn(
          `[SlotMachine] Invalid column ${i}: expected ${visibleRows} rows, got ${column?.length ?? 0}`,
        );
        continue;
      }
      this.reels[i].setResult([...column]);
    }

    this.stopIndex = 0;
    this.stopTimer = 0;
    this.stopping = true;
  }

  update(delta: number): void {
    for (const reel of this.reels) {
      reel.update(delta);
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
