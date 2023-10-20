class GameState {
    private __points: number;
    private __snakeLength: number;
    private __isGameOver: boolean;

    constructor(baseSnakeLength: number) {
        this.__points = 0;
        this.__snakeLength = baseSnakeLength;
        this.__isGameOver = false;
    }

    addPoints(bonusPoints: number): void {
        this.__points += bonusPoints;
    }

    updateSnakeLength(snakeLength: number): void {
        this.__snakeLength = snakeLength;
    }

    updateIsGameOver(isGameOver: boolean): void {
        this.__isGameOver = isGameOver;
    }

    getIsGameOver(): boolean {
        return this.__isGameOver;
    }

    getSnakeLength(): number {
        return this.__snakeLength;
    }

    getPoints(): number {
        return this.__points;
    }
}

export default GameState;
