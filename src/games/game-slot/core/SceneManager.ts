import * as PIXI from 'pixi.js';

export class SceneManager {
    private app: PIXI.Application;
    private currentScene?: PIXI.Container;

    constructor(app: PIXI.Application) {
        this.app = app;
    }

    changeScene(scene: PIXI.Container){
        if (this.currentScene) {
            this.app.stage.removeChild(this.currentScene);
            this.currentScene.destroy();
        }

        this.currentScene = scene;
        this.app.stage.addChild(this.currentScene);
    }
}