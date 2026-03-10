import * as PIXI from 'pixi.js';

import { Symbol } from './Symbol';

export class Reel extends PIXI.Container {
    private symbols: Symbol[] = []

    private symbolContainer = new PIXI.Container();

    private rows: number;
    private symbolSize: number;

    private speed = 0;
    private spinning = false;

    constructor(rows: number, symbolSize: number) {
        super();

        this.rows = rows;
        this.symbolSize = symbolSize;

        this.createMask();

        this.addChild(this.symbolContainer);

        this.createSymbols();
    }

    private createMask() {
        const width = this.symbolSize;
        const height = this.rows * this.symbolSize - 410;

        // Crear textura con gradiente difuminado (transparente arriba y abajo)
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d')!;

        const gradient = ctx.createLinearGradient(0, 0, 0, height);
        // 20% superior e inferior para el difuminado
        gradient.addColorStop(0, 'rgba(255,255,255,0)');
        gradient.addColorStop(0.05, 'rgba(255,255,255,1)');
        gradient.addColorStop(0.95, 'rgba(255,255,255,1)');
        gradient.addColorStop(1, 'rgba(255,255,255,0)');

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);

        const texture = PIXI.Texture.from(canvas);
        const mask = new PIXI.Sprite(texture);
        mask.x = 0;
        mask.y = 390;

        this.addChild(mask);

        this.symbolContainer.mask = mask;
    }

    private createSymbols() {
        for (let i = 0; i < this.rows; i++) {
            const symbol = new Symbol();

            symbol.setRandom();

            symbol.y = i * this.symbolSize;

            symbol.scale.set(0.25);

            this.symbols.push(symbol);

            this.symbolContainer.addChild(symbol);
        }
    }

    spin() {
        // 3000 para que se vea el efecto real de la ruleta
        // 100 para testear movimiento
        this.speed = 100;
        
        this.spinning = true;
    }

    update(delta: number) {
        if (!this.spinning) return;

        for (const symbol of this.symbols) {
            symbol.y += this.speed * delta;

            if (symbol.y >= this.symbolSize * this.rows) {
                symbol.y -= this.symbolSize * this.symbols.length;
                symbol.setRandom();
            }
        }
    }
}