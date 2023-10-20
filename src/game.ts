import type { Direction, Path, Subscriber } from "./types";

import GameState from "./game-state";
import Dimensions from "./dimensions";
import Food from "./food";
import Snake from "./snake";
import GameScreen from "./canvas";
import Point from "./point";
import { areBoxesInCollision } from "./utils";
import Observer from "./observer";

class Game {
    private __path: Path;
    private __direction: Direction;
    private __snake: Snake;
    private __pixelSize: Dimensions;
    private __food: Food;
    private __gameObserver: Observer<GameState>;
    private __animationId: number | undefined;
    private __gameScreen: GameScreen;

    constructor(pixelSize: Dimensions, canvas: HTMLCanvasElement) {
        const baseSnakeLength = 4;
        const gameState = new GameState(baseSnakeLength);

        this.__path = "horizontal";
        this.__direction = 1;
        this.__snake = new Snake(baseSnakeLength);
        this.__pixelSize = pixelSize;
        this.__food = new Food();
        this.__gameScreen = new GameScreen(canvas, "black");
        this.__gameObserver = new Observer(gameState);

        this.initialize();
    }

    private initialize(): void {
        const gameScreen = this.__gameScreen;
        const gameCtx = gameScreen.getContext();
        const gameScreenDimensions = gameScreen.getSize();
        const food = this.__food;
        const pixelSize = this.__pixelSize;
        const snake = this.__snake;

        const positionX = Math.floor(gameScreenDimensions.width / 2);
        const positionY = Math.floor(gameScreenDimensions.height / 2);
        const snakePosition = new Point(positionX, positionY);

        snake.setPosition(snakePosition, "horizontal");
        snake.setColor("green");
        snake.setSize(pixelSize.width, pixelSize.height);

        food.move(gameScreen);
        food.setColor("blue");
        food.setSize(pixelSize.width, pixelSize.height);

        gameScreen.animate(gameCtx);
        snake.animate(gameCtx);
        food.animate(gameCtx);
    }

    // We use () => functions because they do not create their own instance of "this",
    // which means that we will retain their references to "this", which is
    // the class where they are declared.
    private animate = (): void => {
        const gameState = this.__gameObserver.getData();

        if (gameState.getIsGameOver()) {
            return;
        }

        const gameScreen = this.__gameScreen;
        const gameCtx = gameScreen.getContext();
        const snake = this.__snake;
        const food = this.__food;

        const pixelSize = this.__pixelSize;
        const path = this.__path;
        const direction = this.__direction;

        const dimensions = Math.floor((pixelSize.width + pixelSize.height) / 2);

        snake.move(dimensions, path, direction, gameScreen);

        gameScreen.animate(gameCtx);
        food.animate(gameCtx);
        snake.animate(gameCtx);

        this.checkForCollisions();

        setTimeout(() => {
            this.__animationId = window.requestAnimationFrame(this.animate);
        }, 50);
    };

    private checkForCollisions(): void {
        const gameScreen = this.__gameScreen;
        const snake = this.__snake;
        const food = this.__food;
        const path = this.__path;
        const direction = this.__direction;
        const gameObserver = this.__gameObserver;
        const gameState = gameObserver.getData();

        const isGameOver = snake.isSnakeHeadCollidingWithBody(direction, path);

        if (isGameOver) {
            gameState.updateIsGameOver(true);
            gameObserver.notify();
        }

        const didSnakeEatFood = this.isSnakeHeadCollidingWithFood();

        if (didSnakeEatFood) {
            // can vary in the future
            gameState.addPoints(1);
            gameObserver.notify();
            food.move(gameScreen);
            snake.addBody();
        }
    }

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

    listenToGameStateChanges(subscriber: Subscriber<GameState>): void {
        const gameObserver = this.__gameObserver;

        gameObserver.subscribe(subscriber);
    }

    stopGame(): void {
        const animationId = this.__animationId;

        if (animationId) {
            window.cancelAnimationFrame(animationId);
        }
    }

    startGame(): void {
        this.animate();
    }

    resetGame(): void {
        const gameObserver = this.__gameObserver;
        const gameState = gameObserver.getData();
        const snake = this.__snake;

        gameState.reset();
        gameObserver.notify();
        snake.reset();
        this.initialize();
    }

    setPath(path: Path): void {
        this.__path = path;
    }

    setDirection(direction: Direction): void {
        this.__direction = direction;
    }
}

export default Game;
