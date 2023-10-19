import GameScreen from "./canvas";
import Dimensions from "./dimensions";
import Point from "./point";
import Snake from "./snake";
import { Direction, Path } from "./types";

const canvas = document.getElementById("game-screen") as HTMLCanvasElement;
const ctx = canvas.getContext("2d")!;

let frame = 0;

class Game {
    private __path: Path;
    private __direction: Direction;
    private __snake: Snake;
    private __snakeSize: Dimensions;

    constructor(snakeSize: Dimensions) {
        this.__path = "horizontal";
        this.__direction = 1;

        this.__snake = new Snake();
        this.__snakeSize = snakeSize;

        this.initialize();
    }

    private initialize(): void {
        const gameScreen = GameScreen.getInstance();
        const snakeSize = this.__snakeSize;

        GameScreen.setElement(canvas);

        this.__snake.setSize(snakeSize.width, snakeSize.height);
        
        const gameScreenSize = gameScreen.getSize();
        
        const positionX = Math.floor(gameScreenSize.width / 2);
        const positionY = Math.floor(gameScreenSize.height / 2);
        const position = new Point(positionX, positionY);

        this.__snake.setPosition(position, "horizontal");
        this.__snake.setColor("green");

        this.animate();
    }

    private animate = (): void => {
        const gameScreen = GameScreen.getInstance();
        const snake = this.__snake;

        snake.move(10, this.__path, this.__direction);        

        gameScreen.animate(ctx);
        snake.animate(ctx);

        setTimeout(() => {
            window.requestAnimationFrame(this.animate);

            frame += 40;
        }, 40);

        
        if (frame % 4000 == 0) {
            snake.addBody();
        }
    };

    setPath(path: Path): void {
        this.__path = path;
    }

    setDirection(direction: Direction): void {
        this.__direction = direction;
    }
}

const ARROW_DOWN = "ArrowDown";
const ARROW_UP = "ArrowUp";
const ARROW_LEFT = "ArrowLeft";
const ARROW_RIGHT = "ArrowRight";

// Representation of a snake:

/**
 *  HEAD
 * 
 *  BODY
 * 
 *  TAIL
 */

window.addEventListener("DOMContentLoaded", () => {
    const itemsSize = new Dimensions(10, 10);
    const game = new Game(itemsSize);

    window.addEventListener("keydown", (e) => {
        const key = e.key;

        switch (key) {
            case ARROW_DOWN:
                game.setPath("vertical");
                game.setDirection(1);
                break;

            case ARROW_UP:
                game.setPath("vertical");
                game.setDirection(-1);
                break;

            case ARROW_LEFT:
                game.setPath("horizontal");
                game.setDirection(-1);
                break;

            case ARROW_RIGHT:
                game.setPath("horizontal");
                game.setDirection(1);
                break;
        }
    });
});
