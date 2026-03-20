import { interpolatePoints } from "./curve";
import type { Point } from "./types";

/*
Transformação inversa.
 */
export function inverse(image: ImageData): ImageData {
	const result = new ImageData(image.width, image.height);
	result.data.set(image.data);

	for (let i = 0; i < result.data.length; i += 4) {
		result.data[i] = 255 - result.data[i];
		result.data[i + 1] = 255 - result.data[i + 1];
		result.data[i + 2] = 255 - result.data[i + 2];
	}

	return result;
}

export function translate(image: ImageData, tx: number, ty: number): ImageData {
	const result = new ImageData(image.width, image.height);

	for (let i = 0; i < image.height; i++) {
		for (let j = 0; j < image.width; j++) {
			const x = Math.floor(j - tx);
			const y = Math.floor(i - ty);

			if (x < 0 || y < 0 || x >= image.width || y >= image.height) {
				continue;
			}

			const idx = (y * image.width + x) * 4;
			const tidx = (i * image.width + j) * 4;

			result.data[tidx] = image.data[idx];
			result.data[tidx + 1] = image.data[idx + 1];
			result.data[tidx + 2] = image.data[idx + 2];
			result.data[tidx + 3] = image.data[idx + 3];
		}
	}

	return result;
}

export function rotate(image: ImageData, theta: number, frame: Point[]): ImageData {
	const { width, height, data } = image;
	const result = new ImageData(width, height);

	const cosT = Math.cos(theta);
	const sinT = Math.sin(theta);

	const cx = width / 2;
	const cy = height / 2;
	
	// Ajuste do crop do frame

	for (let y = 0; y < height; y++) {
		for (let x = 0; x < width; x++) {

			// Translação ida
			const tx = x - cx;
			const ty = y - cy;

			// Rotação
			const rx = tx * cosT - ty * sinT;
			const ry = tx * sinT + ty * cosT;

			// Translação volta
			const srcX = Math.floor(rx + cx);
			const srcY = Math.floor(ry + cy);

			if (srcX < 0 || srcX >= width || srcY < 0 || srcY >= height) {
				continue;
			}

			const srcIdx = (srcY * width + srcX) * 4;
			const dstIdx = (y * width + x) * 4;

			result.data[dstIdx] = data[srcIdx];
			result.data[dstIdx + 1] = data[srcIdx + 1];
			result.data[dstIdx + 2] = data[srcIdx + 2];
			result.data[dstIdx + 3] = data[srcIdx + 3];
		}
	}

	return result;
}

export function gamma(image: ImageData, G: number, C: number): ImageData {
	const result = new ImageData(image.width, image.height);
	result.data.set(image.data);

	const _gamma = (z: number): number => {
		return C * (z ** G);
	}

	for (let i = 0; i < result.data.length; i += 4) {
		result.data[i] = _gamma(result.data[i]);
		result.data[i + 1] = _gamma(result.data[i + 1]);
		result.data[i + 2] = _gamma(result.data[i + 2]);
	}

	return result;
}

export function log(image: ImageData): ImageData {
	const result = new ImageData(image.width, image.height);
	result.data.set(image.data);

	const C = 255 / Math.log(256);
	const _log = (z: number): number => {
		return C * Math.log(1 + z);
	}

	for (let i = 0; i < result.data.length; i += 4) {
		result.data[i] = _log(result.data[i]);
		result.data[i + 1] = _log(result.data[i + 1]);
		result.data[i + 2] = _log(result.data[i + 2]);
	}

	return result;
}

export function contrast(image: ImageData, rangeA: number[], rangeB: number[]): ImageData {
	const result = new ImageData(image.width, image.height);
	result.data.set(image.data);

	const a = rangeA[0];
	const b = rangeB[1];
	const c = rangeB[0];
	const d = rangeB[1];

	const _contrast = (z: number): number => {
		return (z - a) * ((d - c) / (b - a)) + c
	}

	for (let i = 0; i < result.data.length; i += 4) {
		result.data[i] = _contrast(result.data[i]);
		result.data[i + 1] = _contrast(result.data[i + 1]);
		result.data[i + 2] = _contrast(result.data[i + 2]);
	}

	return result;
}

/*
Função que aplica a interpolação entre pontos
pra gerar uma "curva de intesidades".

Os pontos são manipulados diretamente pelo usuário,
que arrasta na tela e cria uma curva.
Os pontos são interpolados e a tabela de valores
tabela[x] = y é gerada.
 */
export function curve(image: ImageData, points: Point[]): ImageData {
	const result = new ImageData(image.width, image.height);
	result.data.set(image.data);

	const lookup = interpolatePoints(points);

	for (let i = 0; i < result.data.length; i += 4) {
		result.data[i] = lookup[result.data[i]]
		result.data[i + 1] = lookup[result.data[i + 1]]
		result.data[i + 2] = lookup[result.data[i + 2]]
	}

	return result;
}

export function brightness(image: ImageData, value: number): ImageData {
	const result = new ImageData(image.width, image.height);
	result.data.set(image.data);

	for (let i = 3; i < result.data.length; i += 4) {
		result.data[i] = value;
	}

	return result;
}
