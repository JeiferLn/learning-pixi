import { useEffect, useRef } from "react";
import { Game } from "./core/Game";

export default function GameSlot() {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!ref.current) return;

        const game = new Game();
        game.init(ref.current);

        return () => game.destroy();
    }, []);

    return (
        <div
            ref={ref}
            className="w-full h-full lg:h-screen flex items-center justify-center bg-black"
        />
    );
}