import { Surface } from "../entities/surface.entity";

export function getSurfaceJSON(surface: Surface) {
    const surfaceDimensions = surface.getDimensions();
    return {
        id: surface.getId(),
        name: surface.getName(),
        width: surfaceDimensions.width,
        height: surfaceDimensions.height,
        layers: surface.getLayers
    }
}