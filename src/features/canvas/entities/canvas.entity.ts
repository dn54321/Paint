
import { LayerFileSystem } from "../../layer/entity/layer-file-system.entity";
import { LayerDirectoryService } from "../../layer/services/layer-directory.service";
import { LayerFactory } from "../../layer/services/layer.factory";
import { Layers } from "../../layer/types/layer.types";

export class Canvas {
    private layerFs: LayerFileSystem;
    private id: string;
    constructor(
        private layerFactory: LayerFactory,
        private layerDirectoryService: LayerDirectoryService,
        private height: number, 
        private width: number,
        private name: string,
    ) {
        this.id = crypto.randomUUID();
        const bgLayer = this.layerFactory.createLayer(Layers.SINGLE_COLOR, height, width);
        bgLayer.fill({r: 255, g: 255, b: 255})
        this.layerFs = this.layerDirectoryService.createLayerSystem();
        const layerNode = this.layerDirectoryService.createLayerNode('background', bgLayer);
        this.layerFs.addLayer([], layerNode);
    }

    // peek(pos: Position, layerId?: string): Color {}

    // draw(pos: Position, color: Color, layerId: string) {
    //     if (layerId) ;
    // }

    setName(name: string) {
        this.name = name;
    }

    setId(id: string) {
        this.id = id;
    }

    setLayerFs(layerFileSystem: LayerFileSystem) {
        this.layerFs = layerFileSystem
    }

    getLayers() {
        return this.layerFs.getLayers();
    }

    getName() {
        return this.name;
    }

    getId() {
        return this.id;
    }

    // setLayer(layerId: number) {

    // }

    // createNewLayer(): string {
    //     const layerId = crypto.randomUUID();
    //     new Layers();
    // }

    // erase(pos: Position) {

    // }

    getDimensions() {
        return {width: this.width, height: this.height}
    }
}