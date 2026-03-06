import * as PIXI from 'pixi.js';

export class ResizeManager {
    private app: PIXI.Application;
    private gameWidth: number;
    private gameHeight: number;

    constructor(app: PIXI.Application, gameWidth: number, gameHeight: number) {
        this.app = app;
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;

        this.resize = this.resize.bind(this);

        window.addEventListener('resize', this.resize)

        this.resize();
    }

    private getViewport() {
        return {
            width: window.visualViewport?.width ?? window.innerWidth,
            height: window.visualViewport?.height ?? window.innerHeight
        }
    }

    resize() {
        const { width, height } = this.getViewport();

        const scaleX = width / this.gameWidth;
        const scaleY = height / this.gameHeight;

        const scale = Math.min(scaleX, scaleY);

        const canvasWidth = this.gameWidth * scale;
        const canvasHeight = this.gameHeight * scale;

        this.app.canvas.style.width = `${canvasWidth}px`;
        this.app.canvas.style.height = `${canvasHeight}px`;
    }

    destroy() {
        window.removeEventListener('resize', this.resize);
    }
}