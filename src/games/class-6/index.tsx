// Animation

import { useRef, useEffect } from "react";
import * as PIXI from 'pixi.js'
import spritesheetUrl from "./assets/spritesheet.json?url"

const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;

export default function Class6() {
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

            // Load SpriteSheet
            const sheet = await PIXI.Assets.load(spritesheetUrl);

            const anim = new PIXI.AnimatedSprite([
                sheet.textures['RunRight01.png'],
                sheet.textures['RunRight02.png'],
                sheet.textures['RunRight03.png'],
                sheet.textures['RunRight04.png'],
            ]);

            anim.position.set(GAME_WIDTH / 2, GAME_HEIGHT / 2);
            anim.anchor.set(0.5);

            anim.animationSpeed = 0.1;
            anim.play();

            containerParent.addChild(anim);
        }

        init();

        return () => {
            window.removeEventListener('resize', resize);
            app?.destroy();
        }
    }, []);

    return <div ref={containerRef} className="w-full h-full bg-black flex items-center justify-center" />;
}