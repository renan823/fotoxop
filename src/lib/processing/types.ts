import type z from "zod";

export type TransformType = "geometric" | "intensity";

export interface ImageTransform {
	id: string;
	name: string;
	type: TransformType;
	
	shema?: z.ZodType;
	params?: TransformParam[];
	
	apply: (image: ImageData, params?: Record<string, unknown>) => ImageData;
}

/*
Mapeia os parametros que uma transformação
recebe de um jeito que seja fácil de renderizar.
Cada Param é renderizado como um campo que o
usuário pode interagir (tipo via input).
 */
export type TransformParam = {
	name: string;
	min: number;
	max: number;
	default: number;
}