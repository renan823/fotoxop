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

export function rotate(image: ImageData, theta: number): ImageData {
	const result = new ImageData(image.width, image.height);
	result.data.set(image.data);


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

export type Point = {
	x: number;
	y: number;
}

/*
Implementação da curva de intensidade (tone curve).
O usuário arrasta os pontos no gráfico da cor.
X é a cor original e Y é a cor final.
Usando interpolação (aqui usei Bezier), todos os valores
entre 0 e 255 são mapeados pra uma tabela (lookup)
Então é só aplicar pixel a pixel.
 */
export function curve(image: ImageData, points: Point[]): ImageData {
	const result = new ImageData(image.width, image.height);
	result.data.set(image.data);

	const lookup: Record<number, number> = {};

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
