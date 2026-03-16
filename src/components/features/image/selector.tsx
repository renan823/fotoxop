import { type ChangeEvent } from "react";
import { Input } from "@/components/ui/input";
import { useImage } from "@/context/image-context";
import { toast } from "sonner";

/*
Componente seletor da imagem.

A imagem escolhida é carregada em um canvas pra
utilizar a API nativa (facilita MUITO o processo).
Os dados da imagem são salvos no contexto global.
 */
export function ImageSelector() {
	const { setImage } = useImage();

	async function handleLoad(evt: ChangeEvent<HTMLInputElement>) {
		if (!evt.target.files || evt.target.files.length === 0) {
			return;
		}

		try {
			const file = evt.target.files[0];
			const bitmap = await createImageBitmap(file);

			const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
			const ctx = canvas.getContext("2d");
			if (ctx === null) {
				return;
			}

			ctx.drawImage(bitmap, 0, 0);

			const image = ctx.getImageData(0, 0, canvas.width, canvas.height);
			setImage(image);
			
		} catch {
			toast.error("Erro ao carregar imagem");
		}
	}

	return (
		<div>
			<Input
				type="file"
				accept="image/*"
				onChange={handleLoad}
			/>
		</div>
	)
}
