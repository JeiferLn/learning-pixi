import * as PIXI from 'pixi.js';

const BUTTON_RADIUS = 103;
const DISABLED_OVERLAY_ALPHA = 0.5;
const TRANSITION_SPEED = 8;

export class GameUI extends PIXI.Container {
  private spinButton: PIXI.Graphics;
  private onSpinClick: () => void;
  private isEnabled = true;
  private currentOverlayAlpha = 0;
  private targetOverlayAlpha = 0;

  constructor(
    gameWidth: number,
    gameHeight: number,
    onSpinClick: () => void,
  ) {
    super();

    this.onSpinClick = onSpinClick;

    this.spinButton = this.createSpinButton();
    const diameter = BUTTON_RADIUS * 2;
    this.spinButton.x = (gameWidth - diameter - 28) / 2;
    this.spinButton.y = gameHeight - 215;

    this.addChild(this.spinButton);

    this.setupButtonInteraction();
  }

  private createSpinButton(): PIXI.Graphics {
    const graphics = new PIXI.Graphics();
    graphics.circle(BUTTON_RADIUS, BUTTON_RADIUS, BUTTON_RADIUS).fill({
      color: 0xffffff,
      alpha: 0,
    });
    graphics.eventMode = 'static';
    graphics.cursor = 'pointer';
    graphics.hitArea = new PIXI.Circle(BUTTON_RADIUS, BUTTON_RADIUS, BUTTON_RADIUS);
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
    this.spinButton.clear();
    this.spinButton.circle(BUTTON_RADIUS, BUTTON_RADIUS, BUTTON_RADIUS).fill({
      color: this.currentOverlayAlpha > 0 ? 0x000000 : 0xffffff,
      alpha: this.currentOverlayAlpha,
    });
  }

  override destroy(options?: PIXI.DestroyOptions | boolean): void {
    this.spinButton.off('pointerdown', this.handleSpinClick);
    super.destroy(options);
  }
}
