import GameScreen from "./canvas";
import Pixels from "./pixels";
import Point from "./point";
import { Direction, Path } from "./types";

class SnakePart extends Pixels {
    constructor() {
        super();
    }
    
    override animate(ctx: CanvasRenderingContext2D): void {
        const position = this.getPosition();
        const dimensions = this.getSize();

        ctx.fillStyle = this.getColor();
        ctx.fillRect(position.x, position.y, dimensions.width, dimensions.height);
    }
}

class Snake {
    private __head: SnakePart;
    private __body: SnakePart[];
    private __isPositionSet: boolean;

    constructor() {
        const head = new SnakePart();
        const firstBody = new SnakePart();
        const secondBody = new SnakePart();
        const thirdBody = new SnakePart();

        this.__head = head;
        this.__body = [firstBody, secondBody, thirdBody];
        this.__isPositionSet = false;
    }

    /** To set the size of the
     *  snake. This will be the dimensions
     *  of each snake pixel.
     */
    setSize(width: number, height: number): void {
        this.__head.setSize(width, height);
        
        for (const part of this.__body) {
            part.setSize(width, height);
        }
    }

    /** To set the initial position of the snake */
    setPosition(position: Point, path: Path): void {
        if (this.__isPositionSet) {
            console.error("The snake's initial position has already been set. Did you mean to call move()?");

            return;
        }

        const head = this.__head;

        let positionX = position.x;
        let positionY = position.y;
        
        for (let idx = this.__body.length - 1; idx >= 0; --idx) {
            const part = this.__body[idx]!;
            const currentPartSize = part.getSize();

            part.setPosition(positionX, positionY);

            if (path == "horizontal") {
                positionX += currentPartSize.width
            }

            if (path == "vertical") {
                positionY += currentPartSize.height;
            }
        }

        head.setPosition(positionX, positionY);
        this.__isPositionSet = true;
    }

    addBody(): void {
        const bodyPart = new SnakePart();
        const snakeColor = this.__head.getColor();

        const lastBodyPart = this.__body[this.__body.length - 1]!;
        const lastBodyPartPosition = lastBodyPart.getPosition();
        const lastBodyPartSize = lastBodyPart.getSize();

        bodyPart.setColor(snakeColor);
        bodyPart.setPosition(lastBodyPartPosition.x, lastBodyPartPosition.y);
        bodyPart.setSize(lastBodyPartSize.width, lastBodyPartSize.height);

        this.__body.push(bodyPart);
    }

    /** Set the position of the snake.
     *  This will move the snake's head and its body will
     *  follow by changing their positions based on the part
     *  that is in front of them.
     */
    move(pos: number, path: Path, direction: Direction): void {
        const gameScreen = GameScreen.getInstance();
        const gameScreenDimensions = gameScreen.getSize();
        
        const head = this.__head;
        const currentHeadPosition = head.getPosition();

        let positionOfPartInFront = currentHeadPosition;

        if (path == "horizontal") {
            let newPosition = currentHeadPosition.x += pos * direction;

            if (newPosition >= gameScreenDimensions.width) {
                newPosition = 0;
            } else if (newPosition <= 0) {
                newPosition = gameScreenDimensions.width;
            }

            head.setPosition(newPosition, currentHeadPosition.y);
        }

        if (path == "vertical") {
            let newPosition = currentHeadPosition.y += pos * direction;

            if (newPosition >= gameScreenDimensions.height) {
                newPosition = 0;
            } else if (newPosition <= 0) {
                newPosition = gameScreenDimensions.height;
            }

            head.setPosition(currentHeadPosition.x, newPosition);
        }

        for (const part of this.__body) {
            const currentPartPosition = part.getPosition();

            part.setPosition(positionOfPartInFront.x, positionOfPartInFront.y);

            positionOfPartInFront = currentPartPosition;
        }
    }

    setColor(color: string): void {
        this.__head.setColor(color);

        for (const part of this.__body) {
            part.setColor(color);
        }
    }

    animate(ctx: CanvasRenderingContext2D): void {
        this.__head.animate(ctx);

        for (const part of this.__body) {
            part.animate(ctx);
        }
    }
}

export default Snake;
