import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
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
