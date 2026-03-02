// Lifecycle de objetos

import { useEffect, useRef } from "react";
import * as PIXI from 'pixi.js'
import MovingBox from "./components/MovingBox";

const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;

export default function Class9() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        let app: PIXI.Application;
        let resize: () => void;
        // let tickerUpdate: (ticker: PIXI.Ticker) => void;

        let removalIntervalId: number;

        const init = async () => {
            app = new PIXI.Application();
            await app.init({
                width: GAME_WIDTH,
                height: GAME_HEIGHT,
                backgroundColor: 0x222222,
                antialias: true,
            })

            containerRef.current!.appendChild(app.canvas);

            // Resize
            resize = () => {
                const scaleX = window.innerWidth / GAME_WIDTH;
                const scaleY = window.innerHeight / GAME_HEIGHT;
                const scale = Math.min(scaleX, scaleY);

                app.canvas.style.width = `${GAME_WIDTH * scale}px`;
                app.canvas.style.height = `${GAME_HEIGHT * scale}px`;
            }

            window.addEventListener('resize', resize);
            resize();

            // Container
            const containerParent = new PIXI.Container();
            app.stage.addChild(containerParent);

            // // Moving Box
            // const movingBox = new MovingBox();
            // containerParent.addChild(movingBox.graphics);

            // // Ticker
            // update = (deltaMS: number) => {
            //     movingBox.update(deltaMS);
            // }

            // app.ticker.add((delta) => {
            //     update(delta.deltaMS);
            // });

            // 
            // Ejercicio 1
            //

            // // Moving Box
            // const boxes: MovingBox[] = [];

            // for (let i = 0; i < 5; i++) {
            //     const box = new MovingBox(100, i * 120);
            //     boxes.push(box);
            //     containerParent.addChild(box.graphics);
            // }

            // tickerUpdate = (ticker: PIXI.Ticker) => {
            //     const deltaMS = Math.min(ticker.deltaMS, 50);

            //     boxes.forEach(box => box.update(deltaMS));
            // }

            // app.ticker.add(tickerUpdate);

            //
            // Ejercicio 2
            //

            // Moving Box
            const boxes: MovingBox[] = [];

            for (let i = 0; i < 5; i++) {
                const box = new MovingBox(100, i * 120);
                boxes.push(box);
                containerParent.addChild(box.graphics);
            }

            // tickerUpdate = (ticker: PIXI.Ticker) => {
            //     const deltaMS = Math.min(ticker.deltaMS, 50);
            //     boxes.forEach(box => box.update(deltaMS));
            // }

            removalIntervalId = setInterval(() => {
                if (boxes.length > 0) {
                    const box = boxes[0];

                    box.destroy(containerParent);
                    boxes.shift();
                }
            }, 3000);

            // app.ticker.add(tickerUpdate);
        }

        init();

        return (() => {
            window.removeEventListener('resize', resize);

            // app.ticker.remove(tickerUpdate);
            clearInterval(removalIntervalId);

            app?.destroy();
        })
    }, []);

    return <div ref={containerRef} className="w-full h-full bg-black flex items-center justify-center" />
}