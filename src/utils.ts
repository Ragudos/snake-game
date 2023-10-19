import { Dimensions, Point } from "./types";

/**
 * Formula to check for collision with a square
 * Two boxes are considered not colliding if:
 * 
 * - second box's position horizontally > first box's width combined with its position horizontally.
 * - first box's position horizontally > second box's width combined with its position horizontally.
 * - second box's position veritcally > first box's height combined with its position vertically.
 * - first box's position veritcally > second box's height combined with its position.
 */
export function areBoxesInCollision(firstBoxDimensions: Dimensions, firstBoxPosition: Point, secondBoxDimensions: Dimensions, secondBoxPosition: Point): boolean {
    const isNotIntersectingHorizontally = firstBoxPosition.x > secondBoxDimensions.width + secondBoxPosition.x || secondBoxPosition.x > firstBoxDimensions.width + firstBoxPosition.x;
    const isNotIntersectingVertically = firstBoxPosition.y > secondBoxDimensions.height + secondBoxPosition.y || secondBoxPosition.y > firstBoxDimensions.height + firstBoxPosition.y;

    return !isNotIntersectingHorizontally && !isNotIntersectingVertically;
};
