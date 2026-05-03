import { useContainerSize } from "@/hooks/use-size";
import { useEffect, useMemo, useRef } from "react";
import * as d3 from "d3";
import { useImage } from "@/context/image";
import { Item, ItemContent, ItemHeader, ItemTitle } from "@/components/ui/item";
import { Move } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Point } from "@/lib/types";
import { CropManager } from "@/lib/transforms";
import { Spinner } from "@/components/ui/spinner";
import { ImageFrame } from "../image/frame";
import { useWorker } from "@/hooks/use-worker";
import { toast } from "sonner";

/*
Componente para aplicar a transformação de translação.
Permite alterar frame da imagem e movê-la dentro dele.
Ao mover a imagem e aplicar a translação, a area será
cortada e uma nova imagem será criada.
*/
export function TranslationTransform() {
    const { transform, setTransform, loading } = useImage();

    return (
        <Item variant="outline" className="w-full">
            <ItemHeader>
                <ItemTitle className="flex items-center gap-2">
                    <Move className="size-4" />
                    Mover
                </ItemTitle>
            </ItemHeader>

            <ItemContent className="space-y-4">
                <p className="text-sm text-muted-foreground">Mover a imagem</p>
                <div className="flex justify-end pt-2">
                    <Button
                        disabled={loading}
                        onClick={() =>
                            setTransform(
                                transform !== "translate" ? "translate" : null
                            )
                        }
                        variant={
                            transform !== "translate" ? "default" : "outline"
                        }
                    >
                        {transform === "translate" ? "Feito" : "Aplicar"}
                    </Button>
                </div>
            </ItemContent>
        </Item>
    );
}

/*
Componente que permite interagir com o frame e
mover a imagem usando as setas do teclado.
*/
export function TranslateHandle() {
    const { ref, size } = useContainerSize();
    const {
        frame,
		setFrame,
		setLoading,
		loading,
		image,
		setImage,
		setTransform,
		translation,
		setTranslation
	} = useImage();
    
    const worker = useWorker();
    const svgRef = useRef<SVGSVGElement | null>(null);

    const width = size.width;
    const height = size.height;

    const xScale = useMemo(
        () => d3.scaleLinear().domain([0, 100]).range([0, width]),
        [width]
	);
    
    const yScale = useMemo(
        () => d3.scaleLinear().domain([0, 100]).range([height, 0]),
        [height]
	);

    /*
    Principal função da translação, que ajusta tudo antes de aplicar.
    Foi preciso ajustar o tamanho (escala para pixels) senão a imagem
    ultrapassa a borda do frame.
    Feita com auxílio de IA.
    */
    async function handleApply() {
        if (!image || !frame || frame.length === 0) {
            setTransform(null);
            return;
        }
    
        try {
            setLoading(true);
    
            // Pontas do frame
            const framePctLeft = Math.min(...frame.map(p => p.x));
            const framePctRight = Math.max(...frame.map(p => p.x));
            const framePctTop = Math.min(...frame.map(p => p.y));
            const framePctBottom = Math.max(...frame.map(p => p.y));
    
            // Conversão para pixels
            const frameImgLeft = (framePctLeft / 100) * image.width;
            const frameImgRight = (framePctRight / 100) * image.width;
            
            const frameImgTop = ((100 - framePctBottom) / 100) * image.height; 
            const frameImgBottom = ((100 - framePctTop) / 100) * image.height;
    
            // Pontos subtraindo translação
			const p1 = {
				id: 0,
                x: frameImgLeft - translation.x,
                y: frameImgTop - translation.y
            };
    
			const p2 = {
				id: 1,
                x: frameImgRight - translation.x,
                y: frameImgBottom - translation.y
            };
    
            const result = await worker.ApplyCrop(image, [p1, p2]);
    
            setImage(result);
            setTranslation({ x: 0, y: 0 });
            setTransform(null);
            
            // Resetar o frame
            setFrame(CropManager.init()); 
            
        } catch (error) {
            toast.error(`Falha ao aplicar: ${error}`);
        } finally {
            setLoading(false);
        }
    }

	useEffect(() => {
		if (!frame || frame.length === 0 || !image) {
			return;
        }

        // Conversão e ajuste para alinha frame com a imagem
        const framePixelsX = frame.map(p => (p.x / 100) * image.width);
        const framePixelsY = frame.map(p => ((100 - p.y) / 100) * image.height);

        // Bordas do frame (no canvas)
        const frameImgLeft = Math.min(...framePixelsX);
        const frameImgRight = Math.max(...framePixelsX);
        const frameImgTop = Math.min(...framePixelsY);
        const frameImgBottom = Math.max(...framePixelsY);

        // Limites de movimento
        const maxX = frameImgLeft;
        const maxY = frameImgTop;
        const minX = frameImgRight - image.width;
        const minY = frameImgBottom - image.height;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
                return;
            }

            const step = 5; 
            
            setTranslation(prev => {
                let nextX = prev.x;
                let nextY = prev.y;

                switch (e.key) {
                    case "ArrowUp":
                        nextY -= step;
                        e.preventDefault();
                        break;
                    case "ArrowDown":
                        nextY += step;
                        e.preventDefault();
                        break;
                    case "ArrowLeft":
                        nextX -= step;
                        e.preventDefault();
                        break;
                    case "ArrowRight":
                        nextX += step;
                        e.preventDefault();
                        break;
                    default:
                        return prev;
                }

                nextX = Math.max(minX, Math.min(maxX, nextX));
                nextY = Math.max(minY, Math.min(maxY, nextY));

                if (nextX === prev.x && nextY === prev.y) {
                    return prev;
                }

                return { ...prev, x: nextX, y: nextY };
            });
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [setTranslation, frame, image]);

	useEffect(() => {
        if (!svgRef.current) {
            return;
        }

        const svg = d3.select(svgRef.current);
        const drag = d3
            .drag<SVGRectElement, Point>()
            .subject((_, d) => ({
                x: xScale(d.x),
                y: yScale(d.y),
            }))
            .on("drag", (event, d) => {
                const [mx, my] = d3.pointer(event, svgRef.current);
                const fm = useImage.getState().frame;

                setFrame(CropManager.move(fm, d, mx, my, xScale, yScale));
            });

        svg.selectAll<SVGRectElement, Point>("rect").data(frame).call(drag);
    }, [width, height, setFrame]);

    useEffect(() => setFrame(CropManager.init()), [setFrame]);

    return (
        <div
            ref={ref}
            className="pointer-events-auto relative z-10 flex h-full w-full items-center justify-center bg-muted/50"
        >
            <svg ref={svgRef} width={width} height={height}>
                <ImageFrame xScale={xScale} yScale={yScale} />
            </svg>
            <div className="pointer-events-auto absolute z-20 space-y-2 bg-muted/50 px-8 py-4">
                <p className="text-center">
                    Use as setas do teclado para mover a imagem
                    <br />
                    Ajuste a área desejada com crop
                </p>
                <div className="flex justify-center">
                    {loading ? (
                        <Button disabled>
                            <Spinner />
                            Aplicando...
                        </Button>
                    ) : (
                        <Button onClick={handleApply}>
                            <Move />
                            Aplicar
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}
