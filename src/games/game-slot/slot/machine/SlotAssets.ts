import * as PIXI from 'pixi.js';

import { SLOT_CONFIG } from '../../config/slotConfig';

export class SlotAssets {
  private static reelMaskTexture: PIXI.Texture | null = null;

  static getReelMaskTexture(): PIXI.Texture {
    if (!this.reelMaskTexture) {
      const { visibleArea, maskWidthPadding, symbolSize } = SLOT_CONFIG;
      const width = symbolSize + maskWidthPadding;
      const height = visibleArea.height;

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d')!;

      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, 'rgba(255,255,255,0)');
      gradient.addColorStop(0.02, 'rgba(255,255,255,1)');
      gradient.addColorStop(0.98, 'rgba(255,255,255,1)');
      gradient.addColorStop(1, 'rgba(255,255,255,0)');

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      this.reelMaskTexture = PIXI.Texture.from(canvas);
    }
    return this.reelMaskTexture;
  }

  static destroyReelMaskTexture(): void {
    if (this.reelMaskTexture) {
      this.reelMaskTexture.destroy(true);
      this.reelMaskTexture = null;
    }
  }
}
