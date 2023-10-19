import Pixels from "./pixels";

class Food extends Pixels {
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

export default Food;
