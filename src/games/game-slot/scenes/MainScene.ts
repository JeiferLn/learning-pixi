import * as PIXI from 'pixi.js';

import { SLOT_CONFIG, type SpinResponse } from '../config/slotConfig';
import { SlotMachine } from '../slot';
import { GameUI } from '../ui/GameUI';
import { BaseScene } from './BaseScene';

import backgroundUrl from '../assets/background.png';

export class MainScene extends BaseScene {
    private gameWidth: number;
    private gameHeight: number;

    private slotMachine!: SlotMachine;
    private gameUI!: GameUI;

    constructor(gameWidth: number, gameHeight: number) {
        super();

        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
    }

    async init() {
        // Background
        const backgroundTexture = await PIXI.Assets.load(backgroundUrl);

        const background = new PIXI.Sprite(backgroundTexture);

        const backgroundScaleX = this.gameWidth / background.width;
        const backgroundScaleY = this.gameHeight / background.height;

        const backgroundScale = Math.min(backgroundScaleX, backgroundScaleY);

        background.scale.set(backgroundScale);
        background.anchor.set(0.5);
        background.position.set(this.gameWidth / 2, this.gameHeight / 2);

        this.addChild(background);

        // Slot Machine
        this.slotMachine = new SlotMachine({
          onSpinComplete: () => this.gameUI.setSpinEnabled(true),
        });
        this.slotMachine.pivot.set(
          SLOT_CONFIG.slotMachinePivot.x,
          SLOT_CONFIG.slotMachinePivot.y,
        );
        this.slotMachine.position.set(this.gameWidth / 2, this.gameHeight / 2);

        this.addChild(this.slotMachine);

        // Game UI
        this.gameUI = new GameUI(this.gameWidth, this.gameHeight, () =>
          this.handleSpinClick(),
        );
        this.addChild(this.gameUI);
    }

    private handleSpinClick(): void {
        this.gameUI.setSpinEnabled(false);
        this.slotMachine.spin();

        // TODO: Reemplazar con fetch real al backend
        this.simulateSpinResponse();
    }

    private simulateSpinResponse(): void {
        const mockResponse: SpinResponse = {
            board: [
                [0, 4, 4],
                [2, 3, 4],
                [10, 2, 4],
                [11, 10, 4],
                [4, 13, 8],
            ],
            reward: {
                streaks: [
                    [
                        [0, 0, 1],
                        [0, 0, 1],
                        [0, 0, 1],
                        [0, 0, 1],
                        [0, 0, 0],
                    ],
                ],
                total_reward: '10000 COP',
            },
        };

        setTimeout(() => {
            this.slotMachine.setResult(mockResponse.board);
            // mockResponse.reward disponible para mostrar ganancias, etc.
        }, 2000);
    }

    update(delta: number) {
        if (!this.slotMachine) return;

        this.slotMachine.update(delta);
        this.gameUI.update(delta);
    }
}