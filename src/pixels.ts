import Dimensions from "./dimensions";
import Point from "./point";

abstract class Pixels {
    abstract animate(ctx: CanvasRenderingContext2D): void;

    private __position: Point;
    private __size: Dimensions;
    private __color: string;

    constructor() {
        this.__color = "black";
        this.__position = new Point(0, 0);
        this.__size = new Dimensions(0, 0);
    }

    setPosition(x: number, y: number): void {
        this.__position = new Point(x, y);
    }

    setSize(width: number, height: number): void {
        this.__size = new Dimensions(width, height);
    }

    setColor(color: string): void {
        this.__color = color;
    }

    getPosition(): Point {
        return this.__position;
    }

    getSize(): Dimensions {
        return this.__size;
    }

    getColor(): string {
        return this.__color;
    }
}

export default Pixels;
