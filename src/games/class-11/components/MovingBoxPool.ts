import MovingBox from './MovingBox';
import * as PIXI from 'pixi.js';

export default class MovingBoxPool {
    private pool: MovingBox[] = [];
    private parent: PIXI.Container;

    constructor(parent: PIXI.Container) {
        this.parent = parent;
    }

    get(): MovingBox {
        if (this.pool.length > 0) {
            return this.pool.pop()!;
        }
        return new MovingBox(this.parent);
    }

    release(box: MovingBox) {
        box.release();
        this.pool.push(box);
    }
}