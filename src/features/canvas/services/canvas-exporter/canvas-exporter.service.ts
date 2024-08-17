import { injectable } from "inversify";
import { Canvas } from "../../entities/canvas.entity";
import { CanvasExporterFactoryService } from "./canvas-exporter-factory.service";

@injectable()
export class CanvasExporterService {
    constructor(
        private canvasExporterFactory: CanvasExporterFactoryService
    ) {

    }
}
