import { useImage } from "@/context/image"
import { useEffect, useRef } from "react";


/*
Componente que renderiza a imagem.

A imagem é lida do contexto, uma tela
é criada (usando o canvas) e os dados
são carregados.
As atualizações são automáticas, já que
o canvas é atualizado sempre que o estado
global da imagem muda.

Esse compoennte também renderiza um "overlay" que
fica sobre o canvas.
É nesse "overlay" que certas interações ocorrem.
 */
export function ImageCanvas() {
	const { image } = useImage();
	const canvasRef = useRef<HTMLCanvasElement | null>(null);

	useEffect(() => {
		if (image === null || !canvasRef.current) {
			return;
		}

		// Criar canvas
		const screen = canvasRef.current;
		const ctx = screen.getContext("2d");
		if (ctx === null) {
			return;
		}

		screen.width = image.width;
		screen.height = image.height;

		ctx.putImageData(image, 0, 0);
	}, [image])

	return (
		<canvas ref={canvasRef} className="w-full h-full" />
	);
}
