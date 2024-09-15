import BitSet from "mnemonist/bit-set";
import { Color } from "../../../types/color.types";
import { Dimension, Position } from "../../../types/geometry.types";
import { ToolBrushSettings } from "../slices/tools.slice";
import { midPointCircleAreaGenerator, zinglNoDiagLineGenerator } from "../utils/math2d.utils";
import { Brush } from "./brush.entity";

export class CircleBrush extends Brush {
    private lastPosition?: Position;
    private r: Array<Position>;
    private brushBitmap: Array<Position>;
    private visitedBitArray: BitSet;
    private drawableWidth: number;
    private drawableHeight: number;
    constructor(brushSettings?: Partial<ToolBrushSettings>) {
        super(brushSettings);
        this.r = [];
        this.brushBitmap = [];
        this.visitedBitArray = new BitSet(10000*10000);
        this.drawableWidth = 0;
        this.drawableHeight = 0
        this.getBrushDirectionBitmap();
    }

    private drawBuffer(position: Position, drawPixel: (position: Position, color: Color) => void) {
        if (
            position.x < 0 
            || position.y < 0 
            || position.x > this.drawableWidth
            || position.y > this.drawableHeight
        ) {
            return;
        }

        const idx = position.y*this.drawableWidth + position.x;
        const color = this.getColor();

        if (this.visitedBitArray.get(idx)) {
            return;
        }

        drawPixel({x: position.x, y: position.y}, color);
        this.visitedBitArray.set(idx, 1);
    }
    
    draw(position: Position, drawPixel: (position: Position, color: Color) => void) {
        
        if (this.lastPosition === undefined) {
            this.lastPosition = position;
            for (const pt of this.brushBitmap) {
                this.drawBuffer({x: pt.x+position.x, y: pt.y+position.y}, drawPixel);
            }
        }

        for (const pos of zinglNoDiagLineGenerator(this.lastPosition, position)) {
            const sx = Math.sign(pos.x - this.lastPosition.x);
            const sy = Math.sign(pos.y - this.lastPosition.y);

            if (sx == 1) for (const pt of this.r) this.drawBuffer({x: pos.x + pt.x, y: pos.y + pt.y}, drawPixel);
            if (sx == -1) for (const pt of this.r) this.drawBuffer({x: pos.x - pt.x, y: pos.y + pt.y}, drawPixel);
            if (sy == -1) for (const pt of this.r) this.drawBuffer({x: pos.x + pt.y, y: pos.y - pt.x}, drawPixel);
            if (sy == 1) for (const pt of this.r) this.drawBuffer({x: pos.x + pt.y, y: pos.y + pt.x}, drawPixel);

            this.lastPosition = pos;
        }
    }

    brushUp() {
        this.lastPosition = undefined;
        this.visitedBitArray.clear();
    }

    setSize(size: number) {
        if (size != this.getSize()) {
            super.setSize(size);
            this.getBrushDirectionBitmap();
        }
    }

    // should be equal to the size of the canvas being drawn.
    setBufferDimension(dimension: Dimension) {
        const size = dimension.width*dimension.height;
        if (size != this.visitedBitArray.length) {
            this.visitedBitArray = new BitSet(dimension.width*dimension.height);
        }

        this.drawableWidth = dimension.width;
        this.drawableHeight = dimension.height;
    }

    private getBrushDirectionBitmap() {
        const r = new Map<number, number>();
        const bitmap = [];
        for (const pt of midPointCircleAreaGenerator({x:0, y:0}, this.getSize()>>1)) {
            r.set(pt.x, Math.max(pt.y, r.get(pt.x) ?? 0));
            bitmap.push(pt);
        }

        this.r = Array.from(r.entries()).map(([k, v]) => ({x: v, y: k}));
        this.brushBitmap = bitmap;
        
    }

}