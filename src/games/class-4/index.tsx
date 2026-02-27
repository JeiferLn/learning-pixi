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

            // Container Parent
            const parentContainer = new PIXI.Graphics().rect(-200, -200, 400, 400).fill(0x444444);

            parentContainer.position.set(GAME_WIDTH / 2, GAME_HEIGHT / 2);

            app.stage.addChild(parentContainer);

            // Children
            const childrenContainer = new PIXI.Graphics().rect(-50, -50, 100, 100).fill(0xFFFFFF);

            parentContainer.addChild(childrenContainer);

            app.stage.eventMode = 'static';
            parentContainer.eventMode = 'static';
            childrenContainer.eventMode = 'static';

            app.stage.on('pointerdown', () => {
                console.log('Stage clicked');
            });

            parentContainer.on('pointerdown', () => {
                console.log('Parent container clicked');
            });

            childrenContainer.on('pointerdown', () => {
                console.log('Children container clicked');
            });

            // Respuesta a los logs
            // Children container clicked
            // Parent container clicked
            // Stage clicked

            app.stage.on('pointerdown', () => {
                console.log('Stage clicked');
            });

            parentContainer.on('pointerdown', () => {
                console.log('Parent container clicked');
            });

            childrenContainer.on('pointerdown', (e) => {
                e.stopPropagation();
                console.log('Children container clicked');
            });

            // Respuesta a los logs
            // Children container clicked
        }

        init();

        return (() => {
            window.removeEventListener('resize', resize);
            app?.destroy();
        })
    }, []);

    return <div ref={containerRef} className="w-full h-full bg-black flex items-center justify-center" />
}