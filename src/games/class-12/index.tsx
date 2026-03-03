// Reel Spinning

import { useRef, useEffect } from 'react';
import * as PIXI from 'pixi.js';
import MovingBox from './components/MovingBox';

const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;

export default function Class12() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        let app: PIXI.Application;
        let resize: () => void;

        let tickerUpdate: (ticker: PIXI.Ticker) => void;

        const init = async () => {
            app = new PIXI.Application();

            await app.init({
                width: GAME_WIDTH,
                height: GAME_HEIGHT,
                backgroundColor: 0x222222,
                antialias: true
            });

            containerRef.current!.appendChild(app.canvas);

            // RESIZE 
            resize = () => {
                const scaleX = window.innerWidth / GAME_WIDTH;
                const scaleY = window.innerHeight / GAME_HEIGHT;
                const scale = Math.min(scaleX, scaleY);

                app.canvas.style.width = `${GAME_WIDTH * scale}px`;
                app.canvas.style.height = `${GAME_HEIGHT * scale}px`;
            }
            window.addEventListener('resize', resize);
            resize();

            // PARENT CONTAINER
            const parentContainer = new PIXI.Container();
            app.stage.addChild(parentContainer);

            // BOXES
            const boxes: MovingBox[] = [];
            for (let i = 0; i < 5; i++) {
                const box = new MovingBox(parentContainer, 150, i * 150);
                boxes.push(box);
            }

            // TICKER
            let reelOffset = 0;
            let speed = 1000;

            tickerUpdate = (ticker) => {
                const deltaMS = Math.min(ticker.deltaMS, 50);
                const boxHeight = 150;
                const totalHeight = boxHeight * boxes.length;

                reelOffset += speed * deltaMS / 1000;
                reelOffset %= totalHeight;

                boxes.forEach((box: MovingBox, i: number) => {
                    const y = (i * boxHeight + reelOffset) % totalHeight;
                    box.setY(y);
                });
            };
            app.ticker.add(tickerUpdate);
        }

        init();

        return (() => {
            window.removeEventListener('resize', resize);
            app.ticker.remove(tickerUpdate);
            app?.destroy();
        })
    }, [])

    return <div ref={containerRef} className="w-full h-full bg-black flex items-center justify-center" />
}