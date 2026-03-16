import { Button } from "@/components/ui/button";
import { Item, ItemContent, ItemHeader, ItemTitle } from "@/components/ui/item";
import { useImage } from "@/context/image-context";
import { useContainerSize } from "@/hooks/use-size";
import { movePoints, generatePoints, type Point } from "@/lib/curve";
import { Spline } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { curve } from "@/lib/transforms";

export function ToneCurveTransform() {
	const { transform, setTransform } = useImage();

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
						onClick={() => setTransform(transform !== "curve" ? "curve" : null)}
						variant={transform !== "curve" ? "default" : "outline"}
					>
						{transform === "curve" ? "Feito" : "Aplicar"}
					</Button>
				</div>
			</ItemContent>
		</Item>
	)
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
	const { image, setImage } = useImage();

	const svgRef = useRef<SVGSVGElement | null>(null);

	const maxPoints = 20;
	const [points, setPoints] = useState(generatePoints(maxPoints));

	const width = size.width;
	const height = size.height;

	const xScale = d3.scaleLinear()
		.domain([0, 255])
		.range([0, width])

	const yScale = d3.scaleLinear()
		.domain([0, 255])
		.range([height, 0])

	const line = d3.line<any>()
		.x(d => xScale(d.x))
		.y(d => yScale(d.y))
		.curve(d3.curveCatmullRom)

	useEffect(() => {
		if (!svgRef.current) {
			return;
		}

		const svg = d3.select(svgRef.current);

		function handleDrag (
			event: d3.D3DragEvent<SVGCircleElement, Point, Point>,
			d: Point
		) {
			if (!image) {
				return;
			}
			
			const [px, py] = d3.pointer(event, svgRef.current);
			const newPoints = movePoints(points, d, px, py, xScale, yScale);
			
			setPoints(newPoints);
			
			setImage(curve(image, newPoints));
		};

		const drag = d3.drag<SVGCircleElement, Point>();
		drag.on("drag", handleDrag);
		svg.selectAll<SVGCircleElement, Point>("circle").data(points).call(drag);
	}, [points])

	return (
		<div
			ref={ref}
			className="w-full h-full bg-muted/50 pointer-events-auto"
		>
			<svg ref={svgRef} width={width} height={height}>
				<path
					d={line(points) || ""}
					fill="none"
					stroke="yellow"
					strokeWidth={3}
				/>
				{points.map((p) => (
					<circle
						key={p.id}
						cx={xScale(p.x)}
						cy={yScale(p.y)}
						r={6}
						fill="yellow"
					/>
				))}
			</svg>
		</div>
	)
}
