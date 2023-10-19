import type { Dimensions as DimensionsInterface } from "./types";

class Dimensions implements DimensionsInterface {
    width: number;
    height: number;

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
    }
}

export default Dimensions;
