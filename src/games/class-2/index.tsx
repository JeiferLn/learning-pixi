// Drag and Drop

import { useEffect, useRef } from "react";
import * as PIXI from 'pixi.js'

const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;

export default function Class2() {
    const containerRef = useRef<HTMLDivElement>(null);

    let app: PIXI.Application;
    let resize: () => void;

    let dragTarget: PIXI.Sprite | null = null;
    let dragOffset: PIXI.Point;


    useEffect(() => {
        if (!containerRef.current) return;

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

            // Container Parent
            const containerParent = new PIXI.Container();
            app.stage.addChild(containerParent);

            // Children
            const children = new PIXI.Graphics().rect(0, 0, GAME_WIDTH / 4, GAME_HEIGHT / 4).fill(0x444444);
            const childrenTex = app.renderer.generateTexture(children);
            const childrenSprite = new PIXI.Sprite(childrenTex);

            childrenSprite.anchor.set(0.5);
            childrenSprite.position.set(GAME_WIDTH / 3, GAME_HEIGHT / 3);

            containerParent.addChild(childrenSprite);

            // Mouse Events
            childrenSprite.eventMode = 'static';

            childrenSprite.on('pointerdown', (event) => {
                dragTarget = childrenSprite;

                const globalPos = event.global;

                dragOffset = new PIXI.Point(globalPos.x - childrenSprite.position.x, globalPos.y - childrenSprite.position.y);
            })

            childrenSprite.on('pointerup', () => {
                dragTarget = null;
            })

            childrenSprite.on('pointerupoutside', () => {
                dragTarget = null;
            })

            app.stage.eventMode = 'static';
            app.stage.hitArea = app.screen;

            app.stage.on('pointermove', (event) => {
                if (dragTarget) {
                    const globalPos = event.global;

                    dragTarget.position.set(globalPos.x - dragOffset.x, globalPos.y - dragOffset.y);
                }
            })
        }

        init();

        return (() => {
            window.removeEventListener('resize', resize);
            app?.destroy();
        })
    }, []);
    return <div ref={containerRef} className="w-screen h-screen bg-black flex items-center justify-center" />
}