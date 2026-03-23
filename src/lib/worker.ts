import { brightness, contrast, crop, curve, gamma, inverse, log, rotate, translate } from "./transforms";
import * as Comlink from "comlink";
import type { Point, Scale } from "./types";
import { moveCurvePoints } from "./curve";

export const TransformWorker = {
    ApplyInverse(image: ImageData): ImageData {
        return inverse(image);
    },

    ApplyTranslate(image: ImageData, tx: number, ty: number): ImageData {
        return translate(image, tx, ty);
    },

    ApplyRotate(image: ImageData, theta: number, frame: Point[]): ImageData {
        return rotate(image, theta, frame);
    },

    ApplyGamma(image: ImageData, G: number, C: number): ImageData {
        return gamma(image, G, C);
    },

    ApplyLog(image: ImageData): ImageData {
        return log(image);
    },

    ApplyContrast(image: ImageData, rangeA: number[], rangeB: number[]): ImageData {
        return contrast(image, rangeA, rangeB);
    },

    ApplyCurve(image: ImageData, points: Point[]): ImageData {
        return curve(image, points);
    },

    ApplyBrightness(image: ImageData, value: number): ImageData {
        return brightness(image, value);
    },

    ApplyCrop(image: ImageData, frame: Point[]): ImageData {
        return crop(image, frame);
    },

    MoveCurvePoints(
        points: Point[],
        d: Point,
        px: number,
        py: number,
        xScale: Scale,
        yScale: Scale,
    ): Point[] {
        return moveCurvePoints(points, d, px, py, xScale, yScale);
    }
};

export type TransformWorkerAPI = typeof TransformWorker;

Comlink.expose(TransformWorker);