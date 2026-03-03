// Pool Management

import { useRef, useEffect } from "react";
import * as PIXI from 'pixi.js';
import MovingBoxPool from "./components/MovingBoxPool";
import type MovingBox from "./components/MovingBox";

const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;

export default function Class11() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return

        let app: PIXI.Application;
        let resize: () => void;

        let intervalId: number;

        const init = async () => {
            app = new PIXI.Application();

            await app.init({
                width: GAME_WIDTH,
                height: GAME_HEIGHT,
                backgroundColor: 0x222222,
                antialias: true
            })

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

            // CONTAINER
            const parentContainer = new PIXI.Container();
            app.stage.addChild(parentContainer);

            // POOL
            const pool = new MovingBoxPool(parentContainer);
            const activeBoxes: MovingBox[] = [];

            for (let i = 0; i < 5; i++) {
                const box = pool.get();
                box.activate(100, i * 100);
                activeBoxes.push(box);
            }

            intervalId = setInterval(() => {
                if (activeBoxes.length > 0) {
                    const box = activeBoxes.shift()
                    box && pool.release(box)
                }
            }, 3000);

            //
            // Ejercicio
            // - Obtener, desactivar y liberar un box

            const box = activeBoxes.shift()!;
            box.release();

            const newBox = pool.get();
            newBox.activate(100, 0);

            activeBoxes.push(newBox);
        }

        init();

        return (() => {
            window.addEventListener('resize', resize);
            clearInterval(intervalId);
            app?.destroy();
        })
    }, [])

    return <div ref={containerRef} className="w-full h-full bg-black flex justify-center items-center" />
}