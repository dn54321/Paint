
import { createId } from "@paralleldrive/cuid2";
import { Color } from "../../../types/color.types";
import { Dimension, Position } from "../../../types/geometry.types";
import { blendBitmap, blendColor } from "../../color/utils/blend.utils";
import { LayerDirectory } from "../../layer/entity/layer-directory.entity";
import { Layer } from "../../layer/types/layer.types";
import { isDrawable } from "../../layer/utils/layer-interface-checker.utils";
import { SurfaceCreation } from "../types/surface.types";
import { LayerLeafNode } from "../../layer/entity/path-nodes/layer-node.entity";

export class Surface {
    private layerFs: LayerDirectory;
    private id: string;
    private width: number;
    private height: number;
    private name: string;
    private activeLayer?: Layer;
    private bitmap?: Uint8ClampedArray;
    
    constructor(surface: SurfaceCreation) {
        this.id = surface.id ?? createId();
        this.name = surface.name;
        this.width = surface.dimension.width;
        this.height = surface.dimension.height;
        this.layerFs = surface.layerDirectory ?? new LayerDirectory();

        
        this.activeLayer = surface.activeLayerId 
            ? this.layerFs.getLayers().find(layer => layer.getId() === surface.activeLayerId) 
            : undefined;
    }

    populateBitmap() {
        this.bitmap = new Uint8ClampedArray(this.width*this.height*4);
        const layers = this.getLayers();
        for (const layer of layers) {
            const layerBitmap = layer.getBitmap();
            blendBitmap(this.bitmap, layerBitmap);
        }
    }

    getBitmap(): Uint8ClampedArray {
        if (!this.bitmap) {
            this.populateBitmap();
        }
        return this.bitmap!;
    }

    setName(name: string) {
        this.name = name;
    }

    setId(id: string) {
        this.id = id;
    }

    setDimensions(dimension: Dimension) {
        this.width = dimension.width;
        this.height = dimension.height;
    }

    getLayers() {
        return this.layerFs.getLayers();
    }

    getLayerFileSystem() {
        return this.layerFs;
    }

    getName() {
        return this.name;
    }

    getId() {
        return this.id;
    }

    getActiveLayer() {
        return this.activeLayer;
    }

    draw(position: Position, color: Color, layerId?: string) {
        const layer = layerId ? this.layerFs.getLayerById(layerId) : this.activeLayer;
        if (!this.bitmap) {
            this.populateBitmap();
        }

        if (layer && isDrawable(layer)) {
            const currentColor = layer.peek(position);
            const blendedColor = blendColor(currentColor, color);
            layer.draw(position, blendedColor);
        }

        let resultColor = {r:0,g:0,b:0,a:0};
        const layers = this.getLayers();
        for (const layer of layers) {
            const layerColor = layer.peek(position);
            resultColor = blendColor(resultColor, layerColor);
        }
        const pos = 4*(this.width*position.y + position.x);
        
        this.bitmap[pos] = resultColor.r;
        this.bitmap[pos + 1] = resultColor.g;
        this.bitmap[pos + 2] = resultColor.b;
        this.bitmap[pos + 3] = resultColor.a ?? 255;
    }

    setActiveLayer(layerId: string) {
        const layers = this.getLayers();
        const activeLayer = layers.find(layer => layer.getId() === layerId);
        if (!activeLayer) {
            throw new Error("Layer does not exist inside surface.");
        }

        this.activeLayer = activeLayer;
    }

    addLayer(layer: LayerLeafNode) {
        if (!this.bitmap) {
            this.populateBitmap();
        }

        this.layerFs.addLayer([], layer);
        const layers = this.getLayers();
        for (const layer of layers) {
            const layerBitmap = layer.getBitmap();
            blendBitmap(this.bitmap!, layerBitmap);
        }
    }

    // createLayer<T extends Layers>(name: string, layerType: T): LayersMap<T> {
    //     const layer = this.layerFactory.createLayer(layerType, this.height, this.width);
    //     const leafNode = this.layerDirectoryService.createLayerNode(name, layer);
    //     this.layerFs.addLayer([], leafNode);
    //     return layer;
    // }

    // erase(pos: Position) {

    // }

    getDimensions() {
        return {width: this.width, height: this.height};
    }
}