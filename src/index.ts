import type { Direction, Path } from "./types";

import GameScreen from "./canvas";
import Dimensions from "./dimensions";
import Food from "./food";
import Point from "./point";
import Snake from "./snake";
import { areBoxesInCollision } from "./utils";

const canvas = document.getElementById("game-screen") as HTMLCanvasElement;
const ctx = canvas.getContext("2d")!;

class Game {
    private __path: Path;
    private __direction: Direction;
    private __snake: Snake;
    private __snakeSize: Dimensions;
    private __food: Food;

    constructor(snakeSize: Dimensions) {
        this.__path = "horizontal";
        this.__direction = 1;

        this.__snake = new Snake();
        this.__snakeSize = snakeSize;

        this.__food = new Food();

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

        this.__food.setColor("blue");
        this.__food.setSize(this.__snakeSize.width, this.__snakeSize.height);
    }

    private animate = (): void => {
        const gameScreen = GameScreen.getInstance();
        const snake = this.__snake;
        const food = this.__food;

        snake.move(10, this.__path, this.__direction);
        
        gameScreen.animate(ctx);
        food.animate(ctx);
        snake.animate(ctx);
        
        const isGameOver = snake.isSnakeHeadCollidingWithBody(this.__direction, this.__path);

        if (isGameOver) {
            alert("GAME OVER");

            return;
        }

        const snakeShouldGrow = this.isSnakeHeadCollidingWithFood();

        if (snakeShouldGrow) {
            snake.addBody();
            this.moveFood();
        }
        
        setTimeout(() => {
            window.requestAnimationFrame(this.animate);
        }, 50);
    };

    private isSnakeHeadCollidingWithFood(): boolean {
        const snake = this.__snake;
        const food = this.__food;

        const snakeHeadPosition = snake.getHeadPosition();
        const snakeHeadDimensions = snake.getHeadDimensions();

        const foodPosition = food.getPosition();
        const foodDimensions = food.getSize();

        return areBoxesInCollision(
            snakeHeadDimensions,
            snakeHeadPosition,
            foodDimensions,
            foodPosition,
        );
    }

    private moveFood(): void {
        const gameScreen = GameScreen.getInstance();
        const gameScreenDimensions = gameScreen.getSize();

        const foodDimensions = this.__food.getSize();

        const randomPositionX = Math.floor(Math.random() * (gameScreenDimensions.width - foodDimensions.width));
        const randomPositionY = Math.floor(Math.random() * (gameScreenDimensions.height - foodDimensions.height));

        this.__food.setPosition(randomPositionX, randomPositionY);
    }

    startGame(): void {
        this.moveFood();
        this.animate();
    }

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

    game.startGame();

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
