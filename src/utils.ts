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
export function areBoxesInCollision(firstBox: Dimensions & Point, secondBox: Dimensions & Point): boolean {
    const isNotIntersectingHorizontally = firstBox.x > secondBox.width + secondBox.x || secondBox.x > firstBox.width + firstBox.x;
    const isNotIntersectingVertically = firstBox.y > secondBox.height + secondBox.y || secondBox.y > firstBox.height + firstBox.y;

    return !isNotIntersectingHorizontally && !isNotIntersectingVertically;
};
