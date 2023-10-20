import { SquarePixels } from "./pixels";

class GameScreen extends SquarePixels {
    private element: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;

    constructor(canvas: HTMLCanvasElement, backgroundColor: string) {
        super();

        this.element = canvas;
        this.ctx = canvas.getContext("2d")!;

        const width = canvas.width;
        const height = canvas.height;

        this.setPosition(0, 0);
        this.setSize(width, height);
        this.setColor(backgroundColor);
    }

    getElement(): HTMLCanvasElement {
        return this.element!;
    }

    getContext(): CanvasRenderingContext2D {
        return this.ctx;
    }
}

export default GameScreen;
