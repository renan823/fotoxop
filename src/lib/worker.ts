import * as Comlink from "comlink";
import type { Point } from "./types";
import {
    BrightnessTransform,
    ContrastTransform,
    CropTransform,
    GammaTransform,
    InverseTransform,
    LogTransform,
    RotateTransform,
    ToneCurveTransform,
    TranslateTransform,
} from "./transforms";

/*
Web Worker para execução das rotinas em
uma thread separada.
Sem usar workers, a thread principal congela
durante operações mais pesadas (aqui, todas são
relativamente pesadas).
*/
export const TransformWorker = {
    ApplyBrightness(image: ImageData, value: number): ImageData {
        return BrightnessTransform.execute(image, value);
    },

    ApplyContrast(
        image: ImageData,
        rangeA: number[],
        rangeB: number[]
    ): ImageData {
        return ContrastTransform.execute(image, rangeA, rangeB);
    },

    ApplyCurve(image: ImageData, points: Point[]): ImageData {
        return ToneCurveTransform.execute(image, points);
    },

    ApplyCrop(image: ImageData, frame: Point[]): ImageData {
        return CropTransform.execute(image, frame);
    },

    ApplyInverse(image: ImageData): ImageData {
        return InverseTransform.execute(image);
    },

    ApplyTranslate(image: ImageData, tx: number, ty: number): ImageData {
        return TranslateTransform.execute(image, tx, ty);
    },

    ApplyRotate(
        image: ImageData,
        theta: number,
    ): ImageData {
        return RotateTransform.execute(
            image,
            theta,
        );
    },

    ApplyGamma(image: ImageData, G: number, C: number): ImageData {
        return GammaTransform.execute(image, G, C);
    },

    ApplyLog(image: ImageData): ImageData {
        return LogTransform.execute(image);
    },
};

export type TransformWorkerAPI = typeof TransformWorker;

Comlink.expose(TransformWorker);
