import { Color } from "./color.types";
import { Position } from "./geometry.types";

export interface Drawable {
    draw(pos: Position, color: Color): void
}

export interface Erasable {
    erase(pos: Position): void
}
