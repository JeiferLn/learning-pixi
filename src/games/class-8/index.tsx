// Ticker Update

import { useEffect, useRef } from "react";
import * as PIXI from 'pixi.js'

const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;

export default function Class8() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        let app: PIXI.Application;
        let resize: () => void;
        let update: (ticker: PIXI.Ticker) => void;

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

            // Object
            const object = new PIXI.Graphics().rect(0, 0, 100, 100).fill(0x444444);
            object.position.set(100, 100);
            containerParent.addChild(object);

            // Ticker
            const speed = 100;

            update = (ticker: PIXI.Ticker) => {
                const deltaMS = Math.min(ticker.deltaMS, 50);
                object.x += speed * deltaMS / 1000;
            }

            app.ticker.add(update);
        }

        init();

        return (() => {
            window.removeEventListener('resize', resize);
            app.ticker.remove(update);
            app?.destroy();
        })
    }, []);

    return <div ref={containerRef} className="w-full h-full bg-black flex items-center justify-center" />
}