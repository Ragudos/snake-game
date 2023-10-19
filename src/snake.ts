import GameScreen from "./canvas";
import Dimensions from "./dimensions";
import Pixels from "./pixels";
import Point from "./point";
import { Direction, Path } from "./types";
import { areBoxesInCollision } from "./utils";

class SnakePart extends Pixels {
    constructor() {
        super();
    }
    
    override animate(ctx: CanvasRenderingContext2D): void {
        const color = this.getColor();
        const position = this.getPosition();
        const dimensions = this.getSize();

        ctx.fillStyle = color;
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

    getHeadPosition(): Point {
        return this.__head.getPosition();
    }

    getHeadDimensions(): Dimensions {
        return this.__head.getSize();
    }

    /** To set the initial position of the snake. This can only be called once. */
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
        const head = this.__head;
        const body = this.__body;

        const bodyPart = new SnakePart();
        const snakeColor = head.getColor();

        const lastBodyPart = body[body.length - 1]!;
        const lastBodyPartPosition = lastBodyPart.getPosition();
        const lastBodyPartSize = lastBodyPart.getSize();

        bodyPart.setColor(snakeColor);
        bodyPart.setPosition(lastBodyPartPosition.x, lastBodyPartPosition.y);
        bodyPart.setSize(lastBodyPartSize.width, lastBodyPartSize.height);

        this.__body.push(bodyPart);
    }

    /** Move the position of the snake.
     *  This will move the snake's head and its body will
     *  follow by changing their positions based on the part
     *  that is in front of them.
     */
    move(pos: number, path: Path, direction: Direction): void {
        const head = this.__head;
        const body = this.__body;

        const gameScreen = GameScreen.getInstance();
        const gameScreenDimensions = gameScreen.getSize();
        
        const headDimensions = head.getSize();
        const currentHeadPosition = head.getPosition();

        let positionOfPartInFront = currentHeadPosition;

        if (path == "horizontal") {
            let newPosition = currentHeadPosition.x += pos * direction;

            if (newPosition >= gameScreenDimensions.width) {
                newPosition = 0;
            } else if (newPosition <= 0) {
                newPosition = gameScreenDimensions.width - headDimensions.width;
            }

            head.setPosition(newPosition, currentHeadPosition.y);
        }

        if (path == "vertical") {
            let newPosition = currentHeadPosition.y += pos * direction;

            if (newPosition >= gameScreenDimensions.height) {
                newPosition = 0;
            } else if (newPosition <= 0) {
                newPosition = gameScreenDimensions.height - headDimensions.height;
            }

            head.setPosition(currentHeadPosition.x, newPosition);
        }

        for (const part of body) {
            const currentPartPosition = part.getPosition();

            part.setPosition(positionOfPartInFront.x, positionOfPartInFront.y);

            positionOfPartInFront = currentPartPosition;
        }
    }

    setColor(color: string): void {
        const head = this.__head;
        const body = this.__body;

        head.setColor(color);

        for (const part of body) {
            part.setColor(color);
        }
    }

    animate(ctx: CanvasRenderingContext2D): void {
        const head = this.__head;
        const body = this.__body;

        head.animate(ctx);

        for (const part of body) {
            part.animate(ctx);
        }
    }

    isSnakeHeadCollidingWithBody(currentDirection: Direction, currentPath: Path): boolean {
        const isSnakeGoingRight = currentDirection == 1 && currentPath == "horizontal";
        const isSnakeGoingLeft = currentDirection == -1 && currentPath == "horizontal";
        const isSnakeGoingDown = currentDirection == 1 && currentPath == "vertical";
        const isSnakeGoingUp = currentDirection == -1 && currentPath == "vertical";

        if (isSnakeGoingRight) {
            return this.isSnakeCollidingWithBodyWhenGoingRight();
        } else if (isSnakeGoingLeft) {
            return this.isSnakeCollidingWithBodyWhenGoingLeft();
        } else if (isSnakeGoingUp) {
            return this.isSnakeCollidingWithBodyWhenGoingUp();
        } else if (isSnakeGoingDown) {
            return this.isSnakeCollidingWhenGoingDown();
        }

        return false;
    }

    private isSnakeCollidingWhenGoingDown(): boolean {
        const head = this.__head;
        const body = this.__body;

        const headPosition = head.getPosition();
        const headDimensions = head.getSize();

        const floorOfHead = headPosition.y + headDimensions.height;

        const headPositionWithRoofOfHead = {
            x: headPosition.x,
            y: floorOfHead,
        } satisfies Point;

        for (let idx = body.length - 1; idx >= 1; --idx) {
            const part = body[idx]!;

            const partDimensions = part.getSize();
            const partPosition = part.getPosition();

            const isColliding = areBoxesInCollision(
                headDimensions,
                headPositionWithRoofOfHead,
                partDimensions,
                partPosition,
            );

            if (isColliding) {
                return true;
            }
        }

        return false;
    }

    private isSnakeCollidingWithBodyWhenGoingUp(): boolean {
        const head = this.__head;
        const body = this.__body;

        const headPosition = head.getPosition();
        const headDimensions = head.getSize();

        const roofOfHead = headPosition.y - headDimensions.height;

        const headPositionWithRoofOfHead = {
            x: headPosition.x,
            y: roofOfHead,
        } satisfies Point;

        for (let idx = body.length - 1; idx >= 1; --idx) {
            const part = body[idx]!;

            const partDimensions = part.getSize();
            const partPosition = part.getPosition();

            const isColliding = areBoxesInCollision(
                headDimensions,
                headPositionWithRoofOfHead,
                partDimensions,
                partPosition,
            );

            if (isColliding) {
                return true;
            }
        }

        return false;
    }

    private isSnakeCollidingWithBodyWhenGoingLeft(): boolean {
        const head = this.__head;
        const body = this.__body;

        const headPosition = head.getPosition();
        const headDimensions = head.getSize();

        const backOfHead = headPosition.x - headDimensions.width;

        const headPositionWithBackOfHead = {
            x: backOfHead,
            y: headPosition.y
        } satisfies Point;

        for (let idx = body.length - 1; idx >= 1; --idx) {
            const part = body[idx]!;

            const partDimensions = part.getSize();
            const partPosition = part.getPosition();

            const isColliding = areBoxesInCollision(
                headDimensions,
                headPositionWithBackOfHead,
                partDimensions,
                partPosition,
            );

            if (isColliding) {
                return true;
            }
        }

        return false;
    }

    private isSnakeCollidingWithBodyWhenGoingRight(): boolean {
        const head = this.__head;
        const body = this.__body;

        const headPosition = head.getPosition();
        const headDimensions = head.getSize();

        const frontOfHead = headPosition.x + headDimensions.width;

        const headPositionWithFrontOfHead = {
            x: frontOfHead,
            y: headPosition.y
        } satisfies Point;

        for (let idx = body.length - 1; idx >= 1; --idx) {
            const part = body[idx]!;

            const partDimensions = part.getSize();
            const partPosition = part.getPosition();

            const isColliding = areBoxesInCollision(
                headDimensions,
                headPositionWithFrontOfHead,
                partDimensions,
                partPosition,
            );

            if (isColliding) {
                return true;
            }
        }

        return false;
    }
}

export default Snake;
