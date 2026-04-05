import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/*
Função que converte um pixel RGB
para luminância.
*/
export function luminance(r: number, g: number, b: number): number {
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/*
Função que converte um arquivo em um ImageData.
A API do canvas faz o trabalho pesado: Lê o arquivo,
tranforma pra bitmap e depois em ImageData.
*/
export async function parseImage(file: File): Promise<ImageData> {
    const bitmap = await createImageBitmap(file);

    const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
    const ctx = canvas.getContext("2d");
    if (ctx === null) {
        throw new Error("No context provided");
    }

    ctx.drawImage(bitmap, 0, 0);

    return ctx.getImageData(0, 0, canvas.width, canvas.height);
}

/*
Função responsável pela interpolação de pontos.
Permite criar uma curva relativamente suave.

https://en.wikipedia.org/wiki/Catmull%E2%80%93Rom_spline
*/
export function curveCatmullRom(
    p0: number,
    p1: number,
    p2: number,
    p3: number,
    t: number
): number {
    const m0 = 2 * p1;
    const m1 = (-p0 + p2) * t;
    const m2 = (2 * p0 - 5 * p1 + 4 * p2 - p3) * Math.pow(t, 2);
    const m3 = (-p0 + 3 * p1 - 3 * p2 + p3) * Math.pow(t, 3);

    return 0.5 * (m0 + m1 + m2 + m3);
}

/*
Interpolação bilinear para cada canal de cor
*/
function channelBilinear(
    c00: number,
    c10: number,
    c01: number,
    c11: number,
    fx: number,
    fy: number
) {
    return Math.round(
        c00 * (1 - fx) * (1 - fy) +
            c10 * fx * (1 - fy) +
            c01 * (1 - fx) * fy +
            c11 * fx * fy
    );
}

/* 
Interpolação bilinear de um pixel.
*/
export function bilinearInterpolation(image: ImageData, x: number, y: number) {
    // Clmap pra valor válido
    const x0 = Math.floor(x);
    const y0 = Math.floor(y);
    const x1 = x0 + 1;
    const y1 = y0 + 1;

    const fx = x - x0;
    const fy = y - y0;

    // Pixels 
    const c00 = getPixel(image, x0, y0);
    const c10 = getPixel(image, x1, y0);
    const c01 = getPixel(image, x0, y1);
    const c11 = getPixel(image, x1, y1);

    return [
        channelBilinear(c00[0], c10[0], c01[0], c11[0], fx, fy),
        channelBilinear(c00[1], c10[1], c01[1], c11[1], fx, fy),
        channelBilinear(c00[2], c10[2], c01[2], c11[2], fx, fy),
        channelBilinear(c00[3], c10[3], c01[3], c11[3], fx, fy),
    ];
}

/*
Retorna um pixel (4 canais - RGBA)
*/
function getPixel(image: ImageData, x: number, y: number) {
    const { data, width, height } = image;

    const cx = Math.max(0, Math.min(width - 1, x));
    const cy = Math.max(0, Math.min(height - 1, y));
    const i = (cy * width + cx) * 4;
    return [data[i], data[i + 1], data[i + 2], data[i + 3]];
}
