import type { Direction, Path } from "./types";
import type GameScreen from "./canvas";

import Dimensions from "./dimensions";
import Point from "./point";
import { SquarePixels } from "./pixels";
import { areBoxesInCollision } from "./utils";

/** Representation of a snake:
 *
 *  HEAD
 *
 *  BODY
 *
 *  TAIL
 */
class Snake {
    private __head: SquarePixels;
    private __body: SquarePixels[];
    private __isPositionSet: boolean;
    private __baseSnakeLength: number;

    constructor(baseSnakeLength: number) {
        if (baseSnakeLength < 4) {
            const error = new Error("A snake must be at least 3 blocks long.");

            console.error(error);
            throw error;
        }

        this.__baseSnakeLength = baseSnakeLength;

        const head = new SquarePixels();
        this.__head = head;
        this.__body = [];
        this.__isPositionSet = false;

        for (let idx = 0; idx < baseSnakeLength; ++idx) {
            const body = new SquarePixels();

            this.__body.push(body);
        }
    }

    /** To set the size of the
     *  snake. This will be the dimensions
     *  of each snake pixel.
     */
    setSize(width: number, height: number): void {
        const head = this.__head;

        head.setSize(width, height);

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

    reset(): void {
        const body = this.__body;
        const baseSnakeLength = this.__baseSnakeLength;

        this.__isPositionSet = false;

        for (let idx = body.length - 1; idx >= baseSnakeLength; --idx) {
            body.pop();
        }
    }

    /** To set the initial position of the snake. This can only be called once. */
    setPosition(position: Point, path: Path): void {
        if (this.__isPositionSet) {
            console.error(
                "The snake's initial position has already been set. Did you mean to call move()?",
            );

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
                positionX += currentPartSize.width;
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

        const bodyPart = new SquarePixels();
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
    move(
        pos: number,
        path: Path,
        direction: Direction,
        gameScreen: GameScreen,
    ): void {
        const head = this.__head;
        const body = this.__body;

        const gameScreenDimensions = gameScreen.getSize();

        const headDimensions = head.getSize();
        const currentHeadPosition = head.getPosition();

        let positionOfPartInFront = currentHeadPosition;

        if (path == "horizontal") {
            let newPosition = (currentHeadPosition.x += pos * direction);

            if (newPosition >= gameScreenDimensions.width) {
                newPosition = 0;
            } else if (newPosition <= 0) {
                newPosition = gameScreenDimensions.width - headDimensions.width;
            }

            head.setPosition(newPosition, currentHeadPosition.y);
        }

        if (path == "vertical") {
            let newPosition = (currentHeadPosition.y += pos * direction);

            if (newPosition >= gameScreenDimensions.height) {
                newPosition = 0;
            } else if (newPosition <= 0) {
                newPosition =
                    gameScreenDimensions.height - headDimensions.height;
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

    isSnakeHeadCollidingWithBody(
        currentDirection: Direction,
        currentPath: Path,
    ): boolean {
        const head = this.__head;
        const body = this.__body;

        const currentHeadPosition = head.getPosition();
        const headDimensions = head.getSize();

        const isSnakeGoingRight =
            currentDirection == 1 && currentPath == "horizontal";
        const isSnakeGoingLeft =
            currentDirection == -1 && currentPath == "horizontal";
        const isSnakeGoingDown =
            currentDirection == 1 && currentPath == "vertical";
        const isSnakeGoingUp =
            currentDirection == -1 && currentPath == "vertical";

        let headPosition: Point;

        if (isSnakeGoingRight) {
            const positionX = this.getPositionOfHeadCombinedWithItsRightEdge(
                currentHeadPosition,
                headDimensions,
            );

            headPosition = new Point(positionX, currentHeadPosition.y);
        } else if (isSnakeGoingLeft) {
            const positionX = this.getPositionOfHeadCombinedWithItsLeftEdge(
                currentHeadPosition,
                headDimensions,
            );

            headPosition = new Point(positionX, currentHeadPosition.y);
        } else if (isSnakeGoingUp) {
            const positionY = this.getPositionOfHeadCombinedWithItsUpperEdge(
                currentHeadPosition,
                headDimensions,
            );

            headPosition = new Point(currentHeadPosition.x, positionY);
        } else if (isSnakeGoingDown) {
            const positionY = this.getPositionOfHeadCombinedWithItsLowerEdge(
                currentHeadPosition,
                headDimensions,
            );

            headPosition = new Point(currentHeadPosition.x, positionY);
        } else {
            headPosition = currentHeadPosition;
        }

        for (let idx = body.length - 1; idx >= 0; --idx) {
            const part = body[idx]!;

            const partDimensions = part.getSize();
            const partPosition = part.getPosition();

            const isColliding = areBoxesInCollision(
                headDimensions,
                headPosition,
                partDimensions,
                partPosition,
            );

            if (isColliding) {
                return true;
            }
        }

        return false;
    }

    private getPositionOfHeadCombinedWithItsLowerEdge(
        headPosition: Point,
        headDimensions: Dimensions,
    ): number {
        return headPosition.y + headDimensions.height;
    }

    private getPositionOfHeadCombinedWithItsUpperEdge(
        headPosition: Point,
        headDimensions: Dimensions,
    ): number {
        return headPosition.y - headDimensions.height;
    }

    private getPositionOfHeadCombinedWithItsRightEdge(
        headPosition: Point,
        headDimensions: Dimensions,
    ): number {
        return headPosition.x + headDimensions.width;
    }

    private getPositionOfHeadCombinedWithItsLeftEdge(
        headPosition: Point,
        headDimensions: Dimensions,
    ): number {
        return headPosition.x - headDimensions.width;
    }
}

export default Snake;
