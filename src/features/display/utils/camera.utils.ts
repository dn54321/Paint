import { Dimension } from "../../../types/geometry.types";

export function fitBoundingBox(boundingBox: Dimension, container: Dimension) {

    const horizontalScale = boundingBox.width/container.width;
    const verticalScale = boundingBox.height/container.height;

    if (horizontalScale > verticalScale) {
        const width = container.width;
        const height = container.width * boundingBox.height/boundingBox.width;
        return {width: width, height: height};
    }

    const height = container.height;
    const width =  container.height * boundingBox.width/boundingBox.height;
    return {width: width, height: height};

}