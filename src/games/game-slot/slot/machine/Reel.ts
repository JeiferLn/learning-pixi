import * as PIXI from 'pixi.js';

import { ReelController } from './ReelController';
import { ReelView } from './ReelView';

export class Reel extends PIXI.Container {
  private readonly view: ReelView;
  private readonly controller: ReelController;

  constructor(rows: number, symbolSize: number, maskTexture: PIXI.Texture) {
    super();

    this.view = new ReelView(rows, symbolSize, maskTexture);
    this.controller = new ReelController(this.view);

    this.addChild(this.view);
  }

  spin(): void {
    this.controller.spin();
  }

  stop(): void {
    this.controller.stop();
  }

  isStopped(): boolean {
    return this.controller.isStopped();
  }

  setResult(symbols: number[]): void {
    this.controller.setResult(symbols);
  }

  animateToResult(symbols: number[]): void {
    this.controller.animateToResult(symbols);
  }

  update(delta: number): void {
    this.controller.update(delta);
  }

  override destroy(options?: PIXI.DestroyOptions | boolean): void {
    this.view.destroy(options);
    super.destroy(options);
  }
}
