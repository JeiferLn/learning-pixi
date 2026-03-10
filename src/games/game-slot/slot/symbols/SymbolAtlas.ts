import * as PIXI from 'pixi.js';

import spritesheetUrl from '../../assets/spritesheet.json?url';

export class SymbolAtlas {
  private static textures: PIXI.Texture[] = [];

  static async init(): Promise<void> {
    const sheet = await PIXI.Assets.load(spritesheetUrl);
    this.textures = Object.values(sheet.textures) as PIXI.Texture[];
  }

  static getSymbolCount(): number {
    return this.textures.length;
  }

  static get(id: number): PIXI.Texture {
    if (!this.textures.length) {
      throw new Error('SymbolAtlas not initialized. Call init() first.');
    }
    const safeId = Math.floor(id);
    if (safeId < 0 || safeId >= this.textures.length) {
      console.warn(
        `[SymbolAtlas] Invalid symbol ID ${id}, using fallback (0). Valid range: 0-${this.textures.length - 1}`,
      );
      return this.textures[0];
    }
    return this.textures[safeId];
  }
}
