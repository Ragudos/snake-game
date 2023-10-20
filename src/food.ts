import type GameScreen from "./canvas";
import { SquarePixels } from "./pixels";

class Food extends SquarePixels {
    constructor() {
        super();
    }

    move(gameScreen: GameScreen): void {
        const gameScreenDimensions = gameScreen.getSize();
        const foodDimensions = this.getSize();

        const randomPositionX = Math.floor(
            Math.random() * (gameScreenDimensions.width - foodDimensions.width),
        );
        const randomPositionY = Math.floor(
            Math.random() *
                (gameScreenDimensions.height - foodDimensions.height),
        );

        this.setPosition(randomPositionX, randomPositionY);
    }
}

export default Food;
