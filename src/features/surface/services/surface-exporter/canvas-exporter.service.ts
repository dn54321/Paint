import { injectable } from "inversify";
import { Surface } from "../../entities/surface.entity";
import { CanvasExporterFactoryService } from "./canvas-exporter-factory.service";

@injectable()
export class CanvasExporterService {
    constructor(
        private canvasExporterFactory: CanvasExporterFactoryService
    ) {

    }
}
