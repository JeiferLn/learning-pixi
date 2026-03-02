// Pooling

import { useRef, useEffect } from "react"
import * as PIXI from 'pixi.js'
import MovingBox from "./components/MovingBox";

const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;

export default function Class10() {
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!containerRef.current) return;

        let app: PIXI.Application;
        let resize: () => void;

        let poolIntervalID: number;
        let activeIntervalID: number;

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
                const scale = Math.min(scaleX, scaleY)

                app.canvas.style.width = `${GAME_WIDTH * scale}px`;
                app.canvas.style.height = `${GAME_HEIGHT * scale}px`;
            }
            window.addEventListener('resize', resize);
            resize();

            // Container
            const containerParent = new PIXI.Container();
            app.stage.addChild(containerParent);

            // Boxes
            const activeBoxes: MovingBox[] = [];
            for (let i = 0; i < 5; i++) {
                const box = new MovingBox(containerParent, 100, i * 110);
                activeBoxes.push(box);
            }

            // pool
            const poolBoxes: MovingBox[] = [];

            poolIntervalID = setInterval(() => {
                if (activeBoxes.length > 0) {
                    const box = activeBoxes.shift()!;
                    box.releaseToPool();
                    poolBoxes.push(box);
                }

            }, 3000);

            activeIntervalID = setInterval(() => {
                if (poolBoxes.length > 0) {
                    const box = poolBoxes.shift()!;
                    box.activate(100, Math.random() * 400);
                    activeBoxes.push(box);
                }
            }, 1000);

        }

        init();

        return (() => {
            window.removeEventListener('resize', resize);
            clearInterval(poolIntervalID);
            clearInterval(activeIntervalID);
            app?.destroy();
        })
    }, [])

    return <div ref={containerRef} className="w-full h-full bg-black flex items-center justify-center" />
}