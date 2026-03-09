import * as PIXI from 'pixi.js';

export abstract class BaseScene extends PIXI.Container {
    constructor() {
        super();
    }

    abstract init(): Promise<void> | void;
    update(_delta: number): void { };
    destroyScene(): void {
        this.destroy({ children: true });
    };
}