import { type Drawable } from "../../../types/surface.types";
import { Layer } from "../types/layer.types";

export function isDrawable(layer: Layer | Drawable): layer is Drawable {
    return 'draw' in layer;
}
