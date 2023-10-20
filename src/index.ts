import Dimensions from "./dimensions";
import Game from "./game";

const canvas = document.getElementById("game-screen") as HTMLCanvasElement;

const ARROW_DOWN = "ArrowDown";
const ARROW_UP = "ArrowUp";
const ARROW_LEFT = "ArrowLeft";
const ARROW_RIGHT = "ArrowRight";

window.addEventListener("DOMContentLoaded", () => {
    const itemsSize = new Dimensions(10, 10);
    const game = new Game(itemsSize, canvas);

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
