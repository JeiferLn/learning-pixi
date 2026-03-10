import * as PIXI from 'pixi.js';

import { SLOT_CONFIG } from '../config/slotConfig';

const DISABLED_OVERLAY_ALPHA = 0.5;
const TRANSITION_SPEED = 8;

export class GameUI extends PIXI.Container {
  private spinButton: PIXI.Graphics;
  private onSpinClick: () => void;
  private isEnabled = true;
  private currentOverlayAlpha = 0;
  private targetOverlayAlpha = 0;
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
    if (!this.isEnabled) return;
    this.onSpinClick();
  };

  setSpinEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
    this.spinButton.eventMode = enabled ? 'static' : 'none';
    this.spinButton.cursor = enabled ? 'pointer' : 'default';
    this.targetOverlayAlpha = enabled ? 0 : DISABLED_OVERLAY_ALPHA;
  }

  update(delta: number): void {
    const diff = this.targetOverlayAlpha - this.currentOverlayAlpha;
    if (Math.abs(diff) < 0.001) return;

    this.currentOverlayAlpha += diff * Math.min(1, delta * TRANSITION_SPEED);
    this.updateOverlay();
  }

  private updateOverlay(): void {
    const r = this.buttonRadius;
    this.spinButton.clear();
    this.spinButton.circle(r, r, r).fill({
      color: this.currentOverlayAlpha > 0 ? 0x000000 : 0xffffff,
      alpha: this.currentOverlayAlpha,
    });
  }

  override destroy(options?: PIXI.DestroyOptions | boolean): void {
    this.spinButton.off('pointerdown', this.handleSpinClick);
    super.destroy(options);
  }
}
