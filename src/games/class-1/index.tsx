import { useEffect, useRef } from "react"
import * as PIXI from 'pixi.js'

const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;

export default function Class1() {
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
            const children = new PIXI.Graphics().rect(0, 0, GAME_WIDTH / 2, GAME_HEIGHT / 2).fill(0x444444);
            const childrenTex = app.renderer.generateTexture(children);
            const childrenSprite = new PIXI.Sprite(childrenTex);

            childrenSprite.anchor.set(0.5);
            childrenSprite.position.set(GAME_WIDTH / 2, GAME_HEIGHT / 2);

            containerParent.addChild(childrenSprite);

            childrenSprite.eventMode = 'static';

            childrenSprite.on('pointermove', (event) => {
                const globalPos = event.global;
                const localPos = childrenSprite.toLocal(globalPos);

                console.log("GlobalPos:", globalPos);
                console.log("LocalPos:", localPos);
            });
        }

        init();

        return (() => {
            window.removeEventListener('resize', resize);
            app?.destroy();
        })
    }, [])

    return <div ref={containerRef} className="w-screen h-screen bg-black flex items-center justify-center" />
}