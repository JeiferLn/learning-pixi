import * as PIXI from "pixi.js";

import spritesheetUrl from "../assets/spritesheet.json?url";

export class SymbolAtlas {
  private static textures: PIXI.Texture[] = [];

  static async init() {
    const sheet = await PIXI.Assets.load(spritesheetUrl);

    const textures = Object.values(sheet.textures) as PIXI.Texture[];

    this.textures = textures;
  }

  static get(id: number): PIXI.Texture {
    return this.textures[id];
  }
}
