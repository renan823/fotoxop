import { InverseTransform } from "./intensity/inverse";
import type { ImageTransform } from "./types";

export const ImageTransforms: Record<string, ImageTransform> = {
	[InverseTransform.id]: InverseTransform,
};

export function applyTranform(tId: string, image: ImageData, params?: Record<string, unknown>): ImageData {
	if (!ImageTransforms[tId]) {
		console.log("aqui");
		return image;
	}
	
	// Aplicar trasnformação
	const transform = ImageTransforms[tId];
	return transform.apply(image, params);
}