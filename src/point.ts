import type { Point as PointInterface } from "./types";

class Point implements PointInterface {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}

export default Point;
