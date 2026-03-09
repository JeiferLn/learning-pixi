import * as PIXI from 'pixi.js';

import type { BaseScene } from '../scenes/BaseScene';

export class SceneManager {
    private app: PIXI.Application;
    private currentScene?: BaseScene;

    constructor(app: PIXI.Application) {
        this.app = app;
    }

    async changeScene(scene: BaseScene) {
        if (this.currentScene) {
            this.app.stage.removeChild(this.currentScene);
            this.currentScene.destroyScene();
        }

        this.currentScene = scene;

        await scene.init();

        this.app.stage.addChild(scene);
    }

    update(delta: number) {
        this.currentScene?.update(delta);
    }
}