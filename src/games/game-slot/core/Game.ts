import * as PIXI from "pixi.js";

import { MainScene } from "../scenes/MainScene";
import { ResizeManager } from "./ResizeManager";
import { SceneManager } from "./SceneManager";

import { SymbolAtlas } from "../slot/SymbolAtlas";

const GAME_WIDTH = 1920;
const GAME_HEIGHT = 1080;

export class Game {
  private app: PIXI.Application;
  private resizeManager?: ResizeManager;
  private sceneManager?: SceneManager;

  constructor(container: HTMLElement) {
    this.app = new PIXI.Application();

    this.init(container);
  }

  async init(container: HTMLElement) {
    await this.app.init({
      width: GAME_WIDTH,
      height: GAME_HEIGHT,
      backgroundColor: 0x222222,
      antialias: true,
      resolution: window.devicePixelRatio || 1,
      autoDensity: true,
    });

    container.appendChild(this.app.canvas);

    // Resize Manager
    this.resizeManager = new ResizeManager(this.app, GAME_WIDTH, GAME_HEIGHT);

    // Scene Manager
    this.sceneManager = new SceneManager(this.app);

    // Load SpriteSheet
    await SymbolAtlas.init();

    // Main Scene
    this.sceneManager.changeScene(new MainScene(GAME_WIDTH, GAME_HEIGHT));

    // Loop
    this.app.ticker.add((delta) => {
      const deltaMS = Math.min(delta.deltaMS, 50);
      this.sceneManager?.update(deltaMS / 1000);
    });
  }

  destroy() {
    this.resizeManager?.destroy();
    this.app.destroy(true);
  }
}
