import Pixels from "./pixels";

class GameScreen extends Pixels {
    private static instance: GameScreen;
    private static element: HTMLCanvasElement;

    private constructor() {
        super();
    }

    public static getInstance(): GameScreen {
        if (GameScreen.instance == null) {
            GameScreen.instance = new GameScreen();
        }

        return GameScreen.instance;
    }

    public static setElement(element: HTMLCanvasElement): void {
        const width = element.width;
        const height = element.height;

        GameScreen.instance.setSize(width, height);
        GameScreen.instance.setPosition(0, 0);
        GameScreen.instance.setColor("black");

        GameScreen.element = element;
    }

    public static getElement(): HTMLCanvasElement {
        return GameScreen.element;
    }

    override animate(ctx: CanvasRenderingContext2D): void {
        const element = GameScreen.element;   
    
        if (element == null) {
            const error = new Error("Please provide the canvas element.");
            
            console.error(error);

            return;
        }

        const position = GameScreen.instance.getPosition();
        const dimensions = GameScreen.instance.getSize();

        ctx.fillStyle = GameScreen.instance.getColor();
        ctx.fillRect(position.x, position.y, dimensions.width, dimensions.height);
    }
};

export default GameScreen;
