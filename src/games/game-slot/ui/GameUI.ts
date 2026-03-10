import * as PIXI from 'pixi.js';

import { SLOT_CONFIG } from '../config/slotConfig';

export class GameUI extends PIXI.Container {
  private spinButton: PIXI.Graphics;
  private onSpinClick: () => void;
  private readonly buttonRadius: number;

  constructor(
    gameWidth: number,
    gameHeight: number,
    onSpinClick: () => void,
  ) {
    super();

    this.onSpinClick = onSpinClick;
    this.buttonRadius = SLOT_CONFIG.spinButton.radius;

    this.spinButton = this.createSpinButton();
    const { offsetX, offsetYFromBottom } = SLOT_CONFIG.spinButton;
    const diameter = this.buttonRadius * 2;
    this.spinButton.x = (gameWidth - diameter - offsetX) / 2;
    this.spinButton.y = gameHeight - offsetYFromBottom;

    this.addChild(this.spinButton);

    this.setupButtonInteraction();
  }

  private createSpinButton(): PIXI.Graphics {
    const r = this.buttonRadius;
    const graphics = new PIXI.Graphics();
    graphics.circle(r, r, r).fill({
      color: 0xffffff,
      alpha: 0,
    });
    graphics.eventMode = 'static';
    graphics.cursor = 'pointer';
    graphics.hitArea = new PIXI.Circle(r, r, r);
    return graphics;
  }

  private setupButtonInteraction(): void {
    this.spinButton.on('pointerdown', this.handleSpinClick);
  }

  private readonly handleSpinClick = (): void => {
    this.onSpinClick();
  };

  override destroy(options?: PIXI.DestroyOptions | boolean): void {
    this.spinButton.off('pointerdown', this.handleSpinClick);
    super.destroy(options);
  }
}
