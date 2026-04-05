import { Button } from "@/components/ui/button";
import { useImage } from "@/context/image";
import { RefreshCcw } from "lucide-react";
import { useEffect, useMemo, useRef } from "react";
import { ValueSlider } from "../utils";
import { Item, ItemContent, ItemHeader, ItemTitle } from "@/components/ui/item";
import { useContainerSize } from "@/hooks/use-size";
import * as d3 from "d3";
import { useWorker } from "@/hooks/use-worker";
import * as Comlink from "comlink";
import { toast } from "sonner";
import { CropManager, RotateManager } from "@/lib/transforms";
import type { Point } from "@/lib/types";
import { Spinner } from "@/components/ui/spinner";

export function RotateTransform() {
    const { transform, setTransform, loading } = useImage();

    return (
        <Item variant="outline" className="w-full">
            <ItemHeader>
                <ItemTitle className="flex items-center gap-2">
                    <RefreshCcw className="size-4" />
                    Girar
                </ItemTitle>
            </ItemHeader>

            <ItemContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                    Rotacionar imagem em torno do centro. <br />
                    Uma escala será aplicada para preencher todo o espaço.
                </p>
                <div className="flex justify-end pt-2">
					<Button
						disabled={loading}
                        onClick={() =>
                            setTransform(
                                transform !== "rotate" ? "rotate" : null
                            )
                        }
                        variant={transform !== "rotate" ? "default" : "outline"}
                    >
                        {transform === "rotate" ? "Feito" : "Aplicar"}
                    </Button>
                </div>
            </ItemContent>
        </Item>
    );
}

export function RotateTransformHandle() {
    const { ref, size } = useContainerSize();
    const {
        frame,
        setFrame,
        rotation,
        setRotation,
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

    const lines = useMemo(() => {
        return [
            {
                x1: xScale(frame[0].x),
                y1: yScale(frame[0].y),
                x2: xScale(frame[1].x),
                y2: yScale(frame[0].y),
            },
            {
                x1: xScale(frame[1].x),
                y1: yScale(frame[0].y),
                x2: xScale(frame[1].x),
                y2: yScale(frame[1].y),
            },
            {
                x1: xScale(frame[1].x),
                y1: yScale(frame[1].y),
                x2: xScale(frame[0].x),
                y2: yScale(frame[1].y),
            },
            {
                x1: xScale(frame[0].x),
                y1: yScale(frame[1].y),
                x2: xScale(frame[0].x),
                y2: yScale(frame[0].y),
            },
        ];
    }, [frame, xScale, yScale]);

    useEffect(() => setFrame(CropManager.init()), [setFrame]);

    function normalizeFrame(frame: Point[], imgW: number, imgH: number) {
        return frame.map((p) => ({
            ...p,
            x: (p.x / imgW) * 100,
            y: (p.y / imgH) * 100,
        }));
    }

    async function handleApply() {
        if (!image) {
            return;
        }

        try {
            setTransform("rotate");
            setLoading(true);

            const points = RotateManager.calcFramePoints(
                image.width,
                image.height,
                rotation
            );

            const frameNorm = normalizeFrame(points, image.width, image.height);

            setFrame(frameNorm);

            const rotated = await worker.ApplyRotate(
                Comlink.transfer(image, [image.data.buffer]),
                rotation
            );

            const result = await worker.ApplyCrop(
                Comlink.transfer(rotated, [rotated.data.buffer]),
                points
            );

            setImage(result);
            setFrame(CropManager.init());

            setImage(result);
        } catch {
            toast.error("Algo deu errado");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div
            ref={ref}
            className="relative z-10 flex h-full w-full items-center justify-center"
        >
            <svg ref={svgRef} width={width} height={height}>
                {frame.map((p) => (
                    <circle
                        key={p.id}
                        cx={xScale(p.x)}
                        cy={yScale(p.y)}
                        style={{ cursor: "pointer" }}
                        r={8}
                        fill="yellow"
                    />
                ))}
                {lines.map((l, idx) => (
                    <line
                        key={idx}
                        x1={l.x1}
                        y1={l.y1}
                        x2={l.x2}
                        y2={l.y2}
                        stroke="yellow"
                        strokeWidth={4}
                    />
                ))}
            </svg>
            <div className="pointer-events-auto absolute z-20 w-1/3 space-y-2 rounded-sm bg-muted/50 p-4">
                <div className="flex items-center justify-between text-sm font-medium">
                    <span>Angulo</span>
                    <span className="text-muted-foreground">{rotation}</span>
                </div>
                <ValueSlider
                    min={-45}
                    max={45}
                    step={1}
                    value={rotation}
                    setValue={setRotation}
                />
                <div className="flex justify-center">
                    {loading ? (
						<Button disabled>
							<Spinner/>
							Aplicando...
						</Button>
                    ) : (
                        <Button onClick={handleApply}>Rotacionar</Button>
                    )}
                </div>
            </div>
        </div>
    );
}
