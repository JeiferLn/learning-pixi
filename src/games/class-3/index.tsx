// Hit Area

import { useRef, useEffect } from "react";
import * as PIXI from 'pixi.js'

const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;

export default function Class3() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        let app: PIXI.Application;
        let resize: () => void;

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

            // Children
            const childrenSprite = new PIXI.Graphics()
                .rect(-50, -50, 100, 100)
                .fill(0x444444);

            childrenSprite.position.set(GAME_WIDTH / 2, GAME_HEIGHT / 2);

            containerParent.addChild(childrenSprite);

            // Hit Area
            childrenSprite.eventMode = 'static';

            const size = 100;

            childrenSprite.hitArea = new PIXI.Rectangle(
                -size / 1.5,
                -size / 1.5,
                size * 3,
                size * 3
            );

            childrenSprite.on('pointerdown', () => {
                console.log('pointerdown');
            });

            // Ejercicio: Una mesa con 4 zonas clickeables
            const table = new PIXI.Graphics()
                .rect(-200, -200, 400, 400)
                .fill(0x444444);

            table.position.set(GAME_WIDTH / 2, GAME_HEIGHT / 2);

            containerParent.addChild(table);

            table.eventMode = 'static';

            table.on('pointerdown', (event) => {
                const globalPos = event.global;
                const localPos = table.toLocal(globalPos);

                if (localPos.x < 0 && localPos.y < 0) {
                    console.log('zone 1');
                } else if (localPos.x > 0 && localPos.y < 0) {
                    console.log('zone 2');
                } else if (localPos.x < 0 && localPos.y > 0) {
                    console.log('zone 3');
                } else if (localPos.x > 0 && localPos.y > 0) {
                    console.log('zone 4');
                }
            });
        }

        init();

        return (() => {
            window.removeEventListener('resize', resize);
            app?.destroy();
        })
    }, []);

    return <div ref={containerRef} className="w-full h-full bg-black flex items-center justify-center" />
}