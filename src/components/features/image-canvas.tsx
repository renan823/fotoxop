import { useImage } from "@/context/image-context"
import { useEffect, useRef } from "react";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "../ui/empty";
import { ImageSelector } from "./image-selector";
import { Image } from "lucide-react";

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

	return (<canvas ref={canvasRef} className="w-full h-full border-2" />);
}
