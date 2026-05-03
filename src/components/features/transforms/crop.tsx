import { useContainerSize } from "@/hooks/use-size";
import { useEffect, useMemo, useRef } from "react";
import * as d3 from "d3";
import { useImage } from "@/context/image";
import { Item, ItemContent, ItemHeader, ItemTitle } from "@/components/ui/item";
import { Crop } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Point } from "@/lib/types";
import { useWorker } from "@/hooks/use-worker";
import { toast } from "sonner";
import * as Comlink from "comlink";
import { CropManager } from "@/lib/transforms";
import { Spinner } from "@/components/ui/spinner";
import { ImageFrame } from "../image/frame";

/*
Componente para aplicar a transformação de corte.
Permite escolher um novo frame para imagem, cortando e
aplicando um escala na imagem original.
*/
export function CropTransform() {
    const { transform, setTransform, loading } = useImage();

    return (
        <Item variant="outline" className="w-full">
            <ItemHeader>
                <ItemTitle className="flex items-center gap-2">
                    <Crop className="size-4" />
                    Cortar
                </ItemTitle>
            </ItemHeader>

            <ItemContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                    Recortar a imagem
                </p>
                <div className="flex justify-end pt-2">
                    <Button
                        disabled={loading}
                        onClick={() =>
                            setTransform(transform !== "crop" ? "crop" : null)
                        }
                        variant={transform !== "crop" ? "default" : "outline"}
                    >
                        {transform === "crop" ? "Feito" : "Aplicar"}
                    </Button>
                </div>
            </ItemContent>
        </Item>
    );
}

/*
Componente que permite mover o frame e ajustar
a área que sera "cortada".
A escala é aplicada para preencher o tamanho total
do canvas, já que a imagem pode ficar bem pequena.
*/
export function CropHandle() {
    const { ref, size } = useContainerSize();
    const {
        frame,
        setFrame,
        image,
        setImage,
        setTransform,
        loading,
        setLoading,
    } = useImage();

    const svgRef = useRef<SVGSVGElement | null>(null);
    const worker = useWorker();

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

    async function handleApply() {
        if (!image) {
            return;
        }

        try {
            setLoading(true);
            setTransform("crop");

            const scaleX = image.width / 100;
            const scaleY = image.height / 100;

            // Pontos convertidos na escala
            const converted = frame.map((p) => ({
                ...p,
                x: Math.round(p.x * scaleX),
                y: Math.round((100 - p.y) * scaleY),
            }));

            const result = await worker.ApplyCrop(
                Comlink.transfer(image, [image.data.buffer]),
                converted
            );

            setImage(result);
            setFrame(CropManager.init());
        } catch {
            toast.error("Algo deu errado");
        } finally {
            setLoading(false);
        }
    }

    // Movimento dos pontos
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
    }, [width, height]);

    useEffect(() => setFrame(CropManager.init()), [setFrame]);

    return (
        <div
            ref={ref}
            className="pointer-events-auto relative z-10 flex h-full w-full items-center justify-center bg-muted/50"
        >
            <svg ref={svgRef} width={width} height={height}>
            	<ImageFrame xScale={xScale} yScale={yScale}/>
            </svg>
            <div className="pointer-events-auto absolute z-20 space-y-2 bg-muted/50 px-8 py-4">
                <div className="flex justify-center">
                    {loading ? (
                        <Button disabled>
                            <Spinner />
                            Aplicando...
                        </Button>
                    ) : (
                        <Button onClick={handleApply}>
                            <Crop />
                            Aplicar
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}
