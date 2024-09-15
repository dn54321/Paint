import { Color } from "../../../types/color.types";

export function blendBitmap(src: Uint8ClampedArray , buffer: Uint8ClampedArray ) {
    if (src.length !== buffer.length) {
        throw new Error("Source and buffer arrays must have the same length.");
    }

    for (let i = 0; i < src.length; i += 4) {
        const srcR = src[i];
        const srcG = src[i + 1];
        const srcB = src[i + 2];
        const srcA = src[i + 3] / 255;

        const bufR = buffer[i];
        const bufG = buffer[i + 1];
        const bufB = buffer[i + 2];
        const bufA = buffer[i + 3] / 255;

        const outA = srcA + bufA * (1 - srcA);

        src[i] = Math.round((bufR * bufA + srcR * srcA * (1 - bufA)) / outA);
        src[i + 1] = Math.round((bufG * bufA + srcG * srcA * (1 - bufA)) / outA);
        src[i + 2] = Math.round((bufB * bufA + srcB * srcA * (1 - bufA)) / outA);
        src[i + 3] = Math.round(outA * 255);
    }

    return src;
}

export function blendColor(color1: Color, color2: Color) {
    const c1R = color1.r;
    const c1G = color1.g;
    const c1B = color1.b;
    const c1A = (color1.a ?? 255) / 255;

    const c2R = color2.r;
    const c2G = color2.g;
    const c2B = color2.b;
    const c2A = (color2.a ?? 255) / 255;

    const outA = c1A + c2A * (1 - c1A);

    return {
        r: Math.round((c2R * c2A + c1R * c1A * (1 - c2A)) / outA),
        g: Math.round((c2G * c2A + c1G * c1A * (1 - c2A)) / outA),
        b: Math.round((c2B * c2A + c1B * c1A * (1 - c2A)) / outA),
        a: Math.round(outA * 255),
    }

}