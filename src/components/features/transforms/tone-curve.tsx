import { Button } from "@/components/ui/button";
import { Item, ItemContent, ItemHeader, ItemTitle } from "@/components/ui/item";
import { useImage } from "@/context/image";
import { useContainerSize } from "@/hooks/use-size";
import { Spline } from "lucide-react";
import { useEffect, useRef } from "react";
import * as d3 from "d3";
import type { Point } from "@/lib/types";
import { useWorker } from "@/hooks/use-worker";
import { ToneCurveManager } from "@/lib/transforms";

export function ToneCurveTransform() {
    const { transform, setTransform, loading } = useImage();

    return (
        <Item variant="outline" className="w-full">
            <ItemHeader>
                <ItemTitle className="flex items-center gap-2">
                    <Spline className="size-4" />
                    Curva de intensidade
                </ItemTitle>
            </ItemHeader>

            <ItemContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                    Customize a função de intensidade interagindo com os pontos.
                </p>
                <div className="flex justify-end pt-2">
					<Button
						disabled={loading}
                        onClick={() =>
                            setTransform(transform !== "curve" ? "curve" : null)
                        }
                        variant={transform !== "curve" ? "default" : "outline"}
                    >
                        {transform === "curve" ? "Feito" : "Aplicar"}
                    </Button>
                </div>
            </ItemContent>
        </Item>
    );
}

/*
Componente que permite interagir com a tone curve.

Um conjunto de pontos igualmente espaçados é
renderizado, no começo de forma linear.

O usuário pode interagir com os pontos,
criando uma curva.

Os valores serão interpolados pra gerar a
curva de intensidades.

Pra lidar com drga mais fácil, usei a lib d3
que permite criar as escalas, linhas e renderizar.
https://d3js.org/d3-drag
 */
export function ToneCurveTransformHandle() {
    const { ref, size } = useContainerSize();
    const { image, setImage, curvePoints, setCurvePoints } = useImage();

    const svgRef = useRef<SVGSVGElement | null>(null);
    const worker = useWorker();

    const maxPoints = 30;

    const width = size.width;
    const height = size.height;

    const xScale = d3.scaleLinear().domain([0, 255]).range([0, width]);

    const yScale = d3.scaleLinear().domain([0, 255]).range([height, 0]);

    const line = d3
        .line<Point>()
        .x((d) => xScale(d.x))
        .y((d) => yScale(d.y))
        .curve(d3.curveCatmullRom);

    useEffect(() => {
        setCurvePoints(ToneCurveManager.init(maxPoints));
    }, [setCurvePoints]);

    useEffect(() => {
        if (!svgRef.current) {
            return;
        }

        const svg = d3.select(svgRef.current);
        const drag = d3
            .drag<SVGCircleElement, Point>()
            .subject((_, d) => ({
                x: xScale(d.x),
                y: yScale(d.y),
            }))
            .on("drag", (event, d) => {
                if (!image) {
                    return;
                }

                const points = useImage.getState().curvePoints;
                const [px, py] = d3.pointer(event, svgRef.current);
                const newPoints = ToneCurveManager.move(
                    points,
                    d,
                    px,
                    py,
                    xScale,
                    yScale
                );

                setCurvePoints(newPoints);
            })
            .on("end", async () => {
                if (!image) {
                    return;
                }

                const points = useImage.getState().curvePoints;
                const result = await worker.ApplyCurve(image, points);
                setImage(result);
            });

        svg.selectAll<SVGCircleElement, Point>("circle")
            .data(curvePoints)
            .call(drag);
    }, [width, height]);

    return (
        <div
            ref={ref}
            className="pointer-events-auto h-full w-full bg-muted/50"
        >
            <svg ref={svgRef} width={width} height={height}>
                <path
                    d={line(curvePoints) || ""}
                    fill="none"
                    stroke="yellow"
                    strokeWidth={3}
                />
                {curvePoints.map((p) => (
                    <circle
                        key={p.id}
                        cx={xScale(p.x)}
                        cy={yScale(p.y)}
                        r={4}
                        fill="yellow"
                    />
                ))}
            </svg>
        </div>
    );
}
