import * as PIXI from "pixi.js";

import { MainScene } from "../scenes/MainScene";
import { ResizeManager } from "./ResizeManager";
import { SceneManager } from "./SceneManager";

import { SymbolAtlas } from "../slot";

const GAME_WIDTH = 1920;
const GAME_HEIGHT = 1080;

const ERROR_HTML = `
  <div class="flex flex-col items-center justify-center h-full gap-4 p-8 text-center">
    <p class="text-white text-lg font-medium">Error al cargar el juego</p>
    <p class="text-gray-400 text-sm">Por favor, recarga la página.</p>
  </div>
`;

export class Game {
  private app: PIXI.Application;
  private resizeManager?: ResizeManager;
  private sceneManager?: SceneManager;

  constructor() {
    this.app = new PIXI.Application();
  }

  async init(container: HTMLElement): Promise<void> {
    container.innerHTML = '<p class="text-white text-center p-8">Cargando...</p>';

    try {
      await this.app.init({
        width: GAME_WIDTH,
        height: GAME_HEIGHT,
        backgroundColor: 0x222222,
        antialias: true,
        resolution: window.devicePixelRatio || 1,
        autoDensity: true,
      });

      container.innerHTML = "";
      container.appendChild(this.app.canvas);

      this.resizeManager = new ResizeManager(this.app, GAME_WIDTH, GAME_HEIGHT);
      this.sceneManager = new SceneManager(this.app);

      await SymbolAtlas.init();

      await this.sceneManager.changeScene(
        new MainScene(GAME_WIDTH, GAME_HEIGHT),
      );

      this.app.ticker.add((delta) => {
        const deltaMS = Math.min(delta.deltaMS, 50);
        this.sceneManager?.update(deltaMS / 1000);
      });
    } catch (err) {
      console.error("[Game] Init failed:", err);
      container.innerHTML = ERROR_HTML;
    }
  }

  destroy(): void {
    this.resizeManager?.destroy();
    this.app.destroy(true);
  }
}
