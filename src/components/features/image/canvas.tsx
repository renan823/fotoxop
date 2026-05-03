import { useImage } from "@/context/image";
import { useEffect, useRef } from "react";

/*
Componente que renderiza a imagem.

A imagem é lida do contexto, uma tela
é criada (usando o canvas) e os dados
são carregados.
As atualizações são automáticas, já que
o canvas é atualizado sempre que o estado
global da imagem muda.

O valor da translação é usado como um "preview"
do que será feito pela transalção real.
Aplicar esse preview aqui é mais barato que
recalcular tudo a cada movimento do tx e ty.
Provavelmente por causa do webgl (fonte: ?)
*/
export function ImageCanvas() {
    const { image, translation } = useImage();
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
		
        ctx.putImageData(image, translation.x, translation.y);
    }, [image, translation]);

    return <canvas ref={canvasRef} className="h-full w-full" />;
}
