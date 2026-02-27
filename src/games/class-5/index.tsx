// Sprite and SpriteSheet

import { useEffect, useRef } from "react";
import * as PIXI from 'pixi.js'
import dogImage from './assets/dog.png'
import spritesheetUrl from "./assets/spritesheet.json?url"

const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;

export default function Class5() {
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

            // Load Sprite
            const texture = await PIXI.Assets.load(dogImage);
            const sprite = new PIXI.Sprite(texture);

            sprite.scale.set(0.25);

            sprite.anchor.set(0.5);
            sprite.position.set(GAME_WIDTH / 2, GAME_HEIGHT / 2);

            // containerParent.addChild(sprite);

            // Load SpriteSheet
            const sheet = await PIXI.Assets.load(spritesheetUrl);

            const sprites: PIXI.Sprite[] = [];
            sprites.push(new PIXI.Sprite(sheet.textures['RunRight01.png']));
            sprites.push(new PIXI.Sprite(sheet.textures['RunRight02.png']));
            sprites.push(new PIXI.Sprite(sheet.textures['RunRight03.png']));
            sprites.push(new PIXI.Sprite(sheet.textures['RunRight04.png']));

            sprites.forEach((sprite, index) => {
                sprite.position.set(150 + (index * 150), 200);
                containerParent.addChild(sprite);
            });

        }

        init();

        return (() => {
            window.removeEventListener('resize', resize);
            app?.destroy();
        })
    }, []);

    return (
        <div ref={containerRef} className="w-full h-full bg-black flex items-center justify-center" />
    )
}