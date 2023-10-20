import Dimensions from "./dimensions";
import Game from "./game";

const canvas = document.getElementById("game-screen") as HTMLCanvasElement;
const gameOverlay = document.getElementById("game-overlay") as HTMLDivElement;
const scoreBoard = document.getElementById("score-board") as HTMLDivElement;

const ARROW_DOWN = "ArrowDown";
const ARROW_UP = "ArrowUp";
const ARROW_LEFT = "ArrowLeft";
const ARROW_RIGHT = "ArrowRight";

let aborter: AbortController;

window.addEventListener("DOMContentLoaded", () => {
    const itemsSize = new Dimensions(10, 10);
    const game = new Game(itemsSize, canvas);

    game.listenToGameStateChanges((gameState) => {
        const points = gameState.getPoints();

        scoreBoard.innerText = points + "";

        const isGameOver = gameState.getIsGameOver();

        if (isGameOver) {
            game.stopGame();

            gameOverlay.style.pointerEvents = "all";
            gameOverlay.style.touchAction = "auto";
            gameOverlay.style.opacity = "1";

            alert("GAME OVER!");

            if (aborter) {
                aborter.abort();
            }
            listenToStartGame(game);
        }
    });

    listenToStartGame(game);
});

function listenToStartGame(game: Game): void {
    window.addEventListener(
        "keydown",
        () => {
            startGame(game);
        },
        {
            once: true,
        },
    );
}

function startGame(game: Game): void {
    scoreBoard.removeAttribute("hidden");
    gameOverlay.setAttribute("hidden", "true");
    gameOverlay.style.pointerEvents = "none";
    gameOverlay.style.touchAction = "none";
    gameOverlay.style.opacity = "0";
    scoreBoard.innerText = "0";

    game.resetGame();
    game.startGame();

    aborter = new AbortController();

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
    }, {
        signal: aborter.signal,
    });
}
