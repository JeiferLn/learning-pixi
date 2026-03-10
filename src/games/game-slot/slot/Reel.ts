import * as PIXI from 'pixi.js';

import { Symbol } from './Symbol';

const VISIBLE_TOP = 410;
const VISIBLE_HEIGHT = 630;
const SNAP_OFFSET = 20;

/** El símbolo debe estar completamente fuera del mask antes de reposicionarse */

export class Reel extends PIXI.Container {
    private symbols: Symbol[] = []
    private targetSymbols: number[] = [];

    private reelPosition = 0;
    private totalHeight: number;

    private symbolContainer = new PIXI.Container();

    private rows: number;
    private symbolSize: number;

    private speed = 0;
    private spinning = false;
    private shouldStop = false;

    constructor(rows: number, symbolSize: number) {
        super();

        this.rows = rows;
        this.symbolSize = symbolSize;

        this.totalHeight = this.rows * this.symbolSize;

        this.createMask();

        this.addChild(this.symbolContainer);

        this.createSymbols();
    }

    private createMask() {
        const width = this.symbolSize + 40;

        // Crear textura con gradiente difuminado (transparente arriba y abajo)
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = VISIBLE_HEIGHT;
        const ctx = canvas.getContext('2d')!;

        const gradient = ctx.createLinearGradient(0, 0, 0, VISIBLE_HEIGHT);
        gradient.addColorStop(0, 'rgba(255,255,255,0)');
        gradient.addColorStop(0.02, 'rgba(255,255,255,1)');
        gradient.addColorStop(0.98, 'rgba(255,255,255,1)');
        gradient.addColorStop(1, 'rgba(255,255,255,0)');

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, VISIBLE_HEIGHT);

        const texture = PIXI.Texture.from(canvas);
        const mask = new PIXI.Sprite(texture);
        mask.x = 0;
        mask.y = VISIBLE_TOP;

        this.addChild(mask);

        this.symbolContainer.mask = mask;
    }

    private createSymbols() {
        for (let i = 0; i < this.rows; i++) {

            const symbol = new Symbol();

            symbol.setRandom();

            symbol.anchor.set(0.5);

            const scale = this.symbolSize / symbol.texture.height;
            symbol.scale.set(scale);

            symbol.x = this.symbolSize / 2 + 20;
            symbol.y = i * this.symbolSize + this.symbolSize / 2;

            this.symbols.push(symbol);

            this.symbolContainer.addChild(symbol);
        }
    }

    spin() {
        // 3000 para que se vea el efecto real de la ruleta
        // 100 para testear movimiento
        this.speed = 3000;
        this.spinning = true;
    }

    setResult(symbols: number[]) {
        this.targetSymbols = symbols;
    }

    stop() {
        this.shouldStop = true;
    }

    update(delta: number) {
        if (!this.spinning) return;

        // Detener y alinear cuando se solicita
        if (this.shouldStop && this.targetSymbols.length === 3) {
            this.applyStopAlignment();
            return;
        }

        this.reelPosition += this.speed * delta;
        this.reelPosition %= this.totalHeight;
        if (this.reelPosition < 0) this.reelPosition += this.totalHeight;

        const offset = this.reelPosition;
        const halfSymbol = this.symbolSize / 2;

        // Símbolo debe estar completamente fuera del mask antes de reposicionarse
        const wrapBottom = VISIBLE_TOP + VISIBLE_HEIGHT + halfSymbol; // Sale por abajo
        const wrapTop = VISIBLE_TOP - halfSymbol; // Sale por arriba

        for (let i = 0; i < this.symbols.length; i++) {
            const symbol = this.symbols[i];

            // Posición del centro (anchor 0.5)
            let centerY = i * this.symbolSize + halfSymbol + offset;

            // Solo wrap cuando sale por abajo del mask (reaparece arriba)
            while (centerY >= wrapBottom) {
                centerY -= this.totalHeight;
            }

            symbol.y = centerY;

            // setRandom solo cuando el símbolo ya salió del mask (por arriba)
            if (centerY < wrapTop) {
                if (!this.shouldStop) {
                    symbol.setRandom();
                }
            }
        }
    }

    private applyStopAlignment() {
        // Asignar los símbolos objetivo a las 3 posiciones visibles (índices 2, 3, 4)
        this.symbols[2].setSymbol(this.targetSymbols[0]);
        this.symbols[3].setSymbol(this.targetSymbols[1]);
        this.symbols[4].setSymbol(this.targetSymbols[2]);

        // Snap a la posición que centra los símbolos en el área visible
        this.reelPosition =
            Math.floor(this.reelPosition / this.totalHeight) * this.totalHeight + SNAP_OFFSET;
        this.reelPosition %= this.totalHeight;
        if (this.reelPosition < 0) this.reelPosition += this.totalHeight;

        const offset = this.reelPosition;
        const halfSymbol = this.symbolSize / 2;

        for (let i = 0; i < this.symbols.length; i++) {
            let centerY = i * this.symbolSize + halfSymbol + offset;
            if (centerY >= this.totalHeight) centerY -= this.totalHeight;
            else if (centerY < 0) centerY += this.totalHeight;
            this.symbols[i].y = centerY;
        }

        this.spinning = false;
        this.shouldStop = false;
        this.speed = 0;
    }
}