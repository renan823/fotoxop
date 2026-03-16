import { useImage } from "@/context/image-context"
import { useEffect, useRef } from "react";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { ImageSelector } from "@/components/features/image/selector";
import { Image } from "lucide-react";
import { RotateTransformHandle } from "../transforms/rotate";
import { ToneCurveTransformHandle } from "../transforms/tone-curve";

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
	const { image, transform } = useImage();
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

	if (image === null) {
		return (
			<Empty>
				<EmptyHeader>
					<EmptyMedia variant="icon">
						<Image/>
					</EmptyMedia>
					<EmptyTitle>Nenhuma imagem carregada</EmptyTitle>
					<EmptyDescription>
						Selecione uma imagem para começar a editar
					</EmptyDescription>
				</EmptyHeader>
				<EmptyContent>
					<ImageSelector />
				</EmptyContent>
			</Empty>
		)
	}

	return (
		<div className="w-full h-full border-2 relative">
			<canvas ref={canvasRef} className="w-full h-full" />
			<div className="absolute inset-0 pointer-events-none">
				{transform === "rotate" && (<RotateTransformHandle />)}
				{transform === "curve" && (<ToneCurveTransformHandle/>)}
			</div>
		</div>
	);
}

