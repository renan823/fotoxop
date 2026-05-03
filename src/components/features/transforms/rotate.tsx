import { Button } from "@/components/ui/button";
import { useImage } from "@/context/image";
import { RefreshCcw } from "lucide-react";
import { useEffect, useMemo } from "react";
import { ValueSlider } from "../utils";
import { Item, ItemContent, ItemHeader, ItemTitle } from "@/components/ui/item";
import { useContainerSize } from "@/hooks/use-size";
import { useWorker } from "@/hooks/use-worker";
import * as Comlink from "comlink";
import { toast } from "sonner";
import { CropManager, RotateManager } from "@/lib/transforms";
import type { Point } from "@/lib/types";
import { Spinner } from "@/components/ui/spinner";
import { scaleLinear } from "d3";
import { ImageFrame } from "../image/frame";

/*
Componente para aplicar a transformação de rotação.
Permite alterar o ângulo de rotação.
Exibe uma prévia do novo frame recortado da imagem.
*/
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

/*
Componente que permite interagir com a rotação,
selecionando o valor do ângulo.
O frame exibe a prévia do novo formato da imagem.
*/
export function RotateTransformHandle() {
    const { ref, size } = useContainerSize();
    const {
        setFrame,
        rotation,
        setRotation,
        image,
        setImage,
        setTransform,
        loading,
        setLoading,
	} = useImage();
    
    const worker = useWorker();

    const width = size.width;
    const height = size.height;

    const xScale = useMemo(
        () => scaleLinear().domain([0, 100]).range([0, width]),
        [width]
    );
    const yScale = useMemo(
        () => scaleLinear().domain([0, 100]).range([height, 0]),
        [height]
    );

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
            <svg width={width} height={height}>
            	<ImageFrame xScale={xScale} yScale={yScale}/>
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
